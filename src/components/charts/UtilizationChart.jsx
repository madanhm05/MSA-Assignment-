const UtilizationChart = ({ data }) => {
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h3>Machine Utilization</h3>
      {data.map((item, index) => (
        <div key={index}>
          {item.machineGroup} — {item.utilization}%
        </div>
      ))}
    </div>
  );
};

export default UtilizationChart;