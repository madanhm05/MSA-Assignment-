import { useEffect, useState } from "react";
import { Spin, Tag, Empty } from "antd";
import axios from "axios";
import "../../assets/css/DataQualityPage.css";

export default function DataQualityPage() {
  const [data, setData] = useState({
    dataIssues: [],
    assumptions: [],
    limitations: [],
  });
  const [loading, setLoading] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/data-quality")
      .then((res) => {
        setData(res.data);
        setApiFailed(false);
      })
      .catch((err) => {
        console.error(err);
        setApiFailed(true); // ✅ mark failure
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="title">Data Quality & Assumptions</h1>

      <div className="main">
        {/* TOP ROW */}
        <div className="top-row">
          {/* Data Issues */}
          <div className="card">
            <div className="card-header">Data Issues</div>
            <div className="card-body">
              {data.dataIssues?.length ? (
                data.dataIssues.map((item, idx) => (
                  <div key={idx} className="item">
                    <Tag color="red">ISSUE</Tag>
                    <div className="heading">{item.issue}</div>
                    <div className="text">{item.description}</div>
                  </div>
                ))
              ) : (
                <Empty description="No data" />
              )}
            </div>
          </div>

          {/* Assumptions */}
          <div className="card">
            <div className="card-header">Assumptions</div>
            <div className="card-body">
              {data.assumptions?.length ? (
                data.assumptions.map((item, idx) => (
                  <div key={idx} className="item">
                    <Tag color="blue">ASSUMPTION</Tag>
                    <div className="heading">{item.assumption}</div>
                    <div className="text">
                      <b>Value:</b> {item.value}
                    </div>
                    <div className="text">{item.reason}</div>
                  </div>
                ))
              ) : (
                <Empty description="No data" />
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="bottom-row">
          <div className="card">
            <div className="card-header">Limitations</div>
            <div className="card-body">
              {data.limitations?.length ? (
                <ul>
                  {data.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              ) : (
                <Empty description="No data" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}