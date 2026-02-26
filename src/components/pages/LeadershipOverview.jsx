import { useData } from "../../Context/DataContext";
import { Card, Row, Col, Spin, Tag } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import "./LeadershipOverview.css";
import "../../assets/css/LeadershipOverview.css";

export default function LeadershipOverview() {
  const { overview, downtime, loading } = useData();

  if (loading || !overview) return <Spin />;

  const k = overview.orders;

  const ragColor = (v) =>
    v === "RED" ? "red" : v === "AMBER" ? "orange" : "green";

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      
 <div className="dashboard-header">
        <h1>Production Leadership Dashboard</h1>
        <p>High level view of orders, machines, and quality</p>
      </div>
      {/* ===== ORDER COMMITMENTS ===== */}
      <p className="section-title">Order Commitments</p>
    <Row gutter={[16, 16]} >
  <Col xs={24} sm={12} lg={6}>
    <Card className="kpi-card">
      <div className="kpi-label">Due in 7 Days</div>
      <div className="kpi-value">{k.dueIn7}</div>
    </Card>
  </Col>

  <Col xs={24} sm={12} lg={6}>
    <Card className="kpi-card">
      <div className="kpi-label">Due in 14 Days</div>
      <div className="kpi-value">{k.dueIn14}</div>
    </Card>
  </Col>

  <Col xs={24} sm={12} lg={6}>
    <Card className="kpi-card kpi-risk">
      <div className="kpi-label">Orders At Risk</div>
      <div className="kpi-value">{k.atRisk}</div>
    </Card>
  </Col>

  {/* ✅ ADD THIS */}
  <Col xs={24} sm={12} lg={6}>
    <Card className="kpi-card">
      <div className="kpi-label">Scrap Rate</div>
      <div className="kpi-value">
        {overview.quality?.scrapRate ?? 0}%
      </div>
    </Card>
  </Col>
</Row>

      {/* ===== OVERALL HEALTH ===== */}
      <h3 className="section-title">Overall Health</h3>
      <Row gutter={[16, 16]} >
        <Col xs={24} sm={8}>
          <Card className="health-card">
            <Tag color={ragColor(overview.ragStatus.orders)}>●</Tag>
            Orders
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="health-card">
            <Tag color={ragColor(overview.ragStatus.machines)}>●</Tag>
            Machines
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="health-card">
            <Tag color={ragColor(overview.ragStatus.quality)}>●</Tag>
            Quality
          </Card>
        </Col>
      </Row>

      {/* ===== CHARTS ===== */}
      <Row gutter={[16, 16]} className="charts-row" >
        <Col xs={24} lg={12}>
          <Card title="Machine Utilization (%)" className="chart-card">
            <div className="chart-box">
              <ResponsiveContainer>
                <BarChart data={overview.machineUtilization}>
                  <XAxis dataKey="machineGroup" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#3b82f6"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Top Downtime Reasons (Minutes)" className="chart-card">
            <div className="chart-box">
              <ResponsiveContainer>
                <BarChart data={downtime.slice(0, 5)}>
                  <XAxis dataKey="reason" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#3b82f6"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}