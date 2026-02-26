function computeMachineUtilization(machineLog) {
  const map = {};

  machineLog.forEach(r => {
    const key = r.machine_group;
    if (!map[key]) map[key] = { runtime: 0, downtime: 0 };

    map[key].runtime += r.runtime_min || 0;
    map[key].downtime += r.downtime_min || 0;
  });

  return Object.entries(map).map(([group, v]) => ({
    machineGroup: group,
    utilization: +(v.runtime / (v.runtime + v.downtime) * 100).toFixed(1)
  }));
}

function computeDowntimeReasons(machineLog) {
  const map = {};

  machineLog.forEach(r => {
    if (!r.downtime_reason) return;
    map[r.downtime_reason] =
      (map[r.downtime_reason] || 0) + (r.downtime_min || 0);
  });

  return Object.entries(map)
    .map(([reason, minutes]) => ({ reason, minutes }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5);
}

function computeQuality(machineLog) {
  let scrap = 0, rework = 0, completed = 0;

  machineLog.forEach(r => {
    scrap += r.scrap_qty || 0;
    rework += r.rework_qty || 0;
    completed += r.parts_completed || 0;
  });

  return {
    scrapRate: +(scrap / (completed + scrap) * 100).toFixed(2),
    reworkRate: +(rework / completed * 100).toFixed(2)
  };
}

module.exports = {
  computeMachineUtilization,
  computeDowntimeReasons,
  computeQuality
};