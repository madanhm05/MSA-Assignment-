const QualityCard = ({ scrap, rework }) => {
  return (
    <div className="chart-card">
      <h3>Scrap & Rework</h3>

      <div className="quality-grid">
        <div>
          <p>Scrap Rate</p>
          <h2>{scrap}%</h2>
        </div>

        <div>
          <p>Rework Rate</p>
          <h2>{rework}%</h2>
        </div>
      </div>
    </div>
  );
};

export default QualityCard;