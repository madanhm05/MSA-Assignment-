const express = require('express');
const cors = require('cors');
const readExcel = require('./utils/excelReader');

const { computeMachineUtilization } = require('./services/kpi.service');
const { computeAtRiskOrders } = require('./services/ordersRisk.service');

const app = express();
app.use(cors());

const data = readExcel('./data/Machining_PPC_Sample_Data.xlsx');

global.orders = data.orders;
global.wip = data.wip;
global.machineLog = data.machineLog;

const utilizationArr = computeMachineUtilization(global.machineLog);
const utilizationMap = {};
utilizationArr.forEach(u => utilizationMap[u.machineGroup] = u.utilization);

global.atRiskOrders = computeAtRiskOrders(
  global.orders,
  global.wip,
  utilizationMap
);

console.log('At Risk Orders:', global.atRiskOrders.length);

app.use('/api', require('./routes/dashboard.routes'));

app.listen(3000, () => console.log('Backend running on port 3000'));