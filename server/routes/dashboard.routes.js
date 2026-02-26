const express = require('express');
const router = express.Router();

const {
  computeMachineUtilization,
  computeDowntimeReasons,
  computeQuality
} = require('../services/kpi.service');

router.get('/overview', (req, res) => {
  const orders = global.orders;
  const machineLog = global.machineLog;
  const atRiskOrders = global.atRiskOrders;

  const today = new Date();

  const dueIn = (days) =>
    orders.filter(o => {
      const due = new Date(o.due_date);
      const diff = (due - today) / (1000 * 3600 * 24);
      return diff >= 0 && diff <= days;
    }).length;

  const orderSummary = {
    dueIn7: dueIn(7),
    dueIn14: dueIn(14),
    atRisk: atRiskOrders.length
  };

  const utilization = computeMachineUtilization(machineLog);
  const downtimeReasons = computeDowntimeReasons(machineLog);
  const quality = computeQuality(machineLog);

  const ragStatus = {
    orders:
      orderSummary.atRisk / orderSummary.dueIn14 > 0.2 ? 'RED' :
      orderSummary.atRisk / orderSummary.dueIn14 > 0.1 ? 'AMBER' : 'GREEN',

    machines:
      utilization.some(u => u.utilization > 90) ? 'RED' :
      utilization.some(u => u.utilization > 85) ? 'AMBER' : 'GREEN',

    quality:
      quality.scrapRate > 3 ? 'RED' :
      quality.scrapRate > 2 ? 'AMBER' : 'GREEN'
  };

  res.json({
    orders: orderSummary,
    machineUtilization: utilization,
    downtimeReasons,
    quality,
    ragStatus
  });
});

router.get('/orders/at-risk', (req, res) => {
  const { priority, machineGroup, fromDate, toDate } = req.query;
  let result = global.atRiskOrders || [];

  // Priority filter
  if (priority) {
    result = result.filter(o =>
      o.priority &&
      o.priority.toString().trim().toLowerCase() ===
      priority.trim().toLowerCase()
    );
  }

  // Machine group filter
  if (machineGroup) {
    result = result.filter(o =>
      o.machineGroup &&
      o.machineGroup.toString().toUpperCase()
        .startsWith(machineGroup.toUpperCase())
    );
  }

  // Date range filter
  if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    result = result.filter(o => {
      const due = new Date(o.dueDate);
      return !isNaN(due) && due >= from && due <= to;
    });
  }

  res.json(result);
});

router.get('/machines/utilization', (req, res) => {
  const { machineGroup } = req.query;
  const machineLog = global.machineLog;

  const map = {};

  machineLog.forEach(r => {
    if (machineGroup &&
        !r.machine_group.toUpperCase().startsWith(machineGroup.toUpperCase()))
      return;

    const key = r.machine_id || r.machine_group;
    if (!map[key]) {
      map[key] = {
        machineId: key,
        machineGroup: r.machine_group,
        runtime: 0,
        downtime: 0
      };
    }

    map[key].runtime += r.runtime_min || 0;
    map[key].downtime += r.downtime_min || 0;
  });

  const result = Object.values(map).map(m => ({
    ...m,
    utilization: +(m.runtime / (m.runtime + m.downtime) * 100).toFixed(1)
  }));

  res.json(result);
});
router.get('/machines/downtime', (req, res) => {
  const { machineGroup } = req.query;
  const machineLog = global.machineLog;
  const map = {};

  machineLog.forEach(r => {
    if (machineGroup &&
        !r.machine_group.toUpperCase().startsWith(machineGroup.toUpperCase()))
      return;

    const reason = r.downtime_reason || 'Unknown';
    map[reason] = (map[reason] || 0) + (r.downtime_min || 0);
  });

  res.json(
    Object.entries(map)
      .map(([reason, minutes]) => ({ reason, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
  );
});

router.get('/data-quality', (req, res) => {
  res.json({
    dataIssues: [
      {
        issue: 'Inconsistent date formats',
        description:
          'Order due dates appear as Excel serial numbers and string dates (DD/MM/YYYY). ' +
          'Custom date parsing was implemented to normalize dates.'
      },
      {
        issue: 'Missing WIP records',
        description:
          'Some orders in the Orders sheet do not have corresponding WIP entries, ' +
          'preventing queue-time based risk evaluation.'
      },
      {
        issue: 'Inconsistent machine group naming',
        description:
          'Machine group names vary in formatting (e.g., "VMC", "VMC-01", "VMC 01"). ' +
          'String normalization was applied.'
      },
      {
        issue: 'No direct order-to-machine mapping',
        description:
          'Machine_Log does not reference order_id, requiring indirect joins via WIP and machine group.'
      }
    ],

    assumptions: [
      {
        assumption: 'High queue time threshold',
        value: 'Queue time > 20 hours',
        reason:
          'Chosen as a reasonable indicator of flow blockage in a machining environment.'
      },
      {
        assumption: 'Machine overload threshold',
        value: 'Utilization > 85%',
        reason:
          'Above 85% utilization machines have limited buffer to absorb variability.'
      },
      {
        assumption: 'Orders at risk window',
        value: 'Due within next 14 days',
        reason:
          'Aligns with short-term production planning and escalation horizon.'
      },
      {
        assumption: 'Scrap and rework calculation',
        value: 'Based on Machine_Log totals',
        reason:
          'Part-level traceability was not available, so quality metrics are aggregated.'
      }
    ],

    limitations: [
      'At-risk orders are recalculated only on backend restart',
      'Operations sheet not yet used for capacity vs demand analysis',
      'No historical trend analysis due to snapshot data'
    ]
  });
});
module.exports = router;