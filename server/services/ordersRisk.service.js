function computeAtRiskOrders(orders, wip, utilizationMap) {
  const today = new Date();

  return orders.filter(o => {
    const due = new Date(o.due_date);
    const days = (due - today) / (1000 * 3600 * 24);
    if (days < 0 || days > 14) return false;

    const w = wip.find(x => x.order_id === o.order_id);
    if (!w) return false;

    return (
      w.queue_time_hours > 20 ||
      w.hold_flag === 'Y' ||
      utilizationMap[w.machine_group] > 85
    );
  });
}

module.exports = { computeAtRiskOrders };