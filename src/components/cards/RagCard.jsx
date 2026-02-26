import { getRagColor } from "../../utils/ragColor";

const RagCard = ({ title, status }) => {
  const color = getRagColor(status);

  return (
    <div className="rag-card">
      <p className="rag-title">{title}</p>
      <div className="rag-status">
        <span
          className="rag-dot"
          style={{ backgroundColor: color }}
        />
        <h3 style={{ color }}>{status}</h3>
      </div>
    </div>
  );
};

export default RagCard;