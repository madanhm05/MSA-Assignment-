export const calculateMachineUtilization = (runtime, downtime) => {
  if (!runtime && !downtime) return 0;
  return (runtime / (runtime + downtime)) * 100;
};

export const calculateScrapRate = (scrapQty, completedQty) => {
  if (!completedQty) return 0;
  return (scrapQty / (completedQty + scrapQty)) * 100;
};

export const calculateReworkRate = (reworkQty, completedQty) => {
  if (!completedQty) return 0;
  return (reworkQty / completedQty) * 100;
};