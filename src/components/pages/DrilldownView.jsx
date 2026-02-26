import { useEffect, useState, useMemo } from "react";
import { Card, Row, Col, Table, Select, DatePicker, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "../../assets/css/DrilldownView.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function DrilldownView() {
  const [orders, setOrders] = useState([]);
  const [machines, setMachines] = useState([]);
  const [downtime, setDowntime] = useState([]);
  const [loading, setLoading] = useState(true);

  const [machineGroup, setMachineGroup] = useState("ALL");
  const [priority, setPriority] = useState("ALL");

  /* ================= FETCH ================= */
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/api/orders/at-risk"),
      axios.get("http://localhost:3000/api/machines/utilization"),
      axios.get("http://localhost:3000/api/machines/downtime"),
    ])
      .then(([o, m, d]) => {
        setOrders(o.data);
        setMachines(m.data);
        setDowntime(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER ================= */
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const mgOk =
        machineGroup === "ALL" || o.machineGroup === machineGroup;
      const prOk = priority === "ALL" || o.priority === priority;
      return mgOk && prOk;
    });
  }, [orders, machineGroup, priority]);

  const filteredMachines = useMemo(() => {
    return machines.filter(
      (m) => machineGroup === "ALL" || m.machineGroup === machineGroup
    );
  }, [machines, machineGroup]);

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: "Machine Group",
      dataIndex: "machineGroup",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      sorter: (a, b) => a.riskScore - b.riskScore,
    },
  ];

  if (loading) {
    return (
      <div className="dd-loader">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dd-page">
      <p className="dd-title">Drilldown View</p>

      {/* ================= FILTER BAR ================= */}
      <Card size="small" className="dd-filter">
        <Row gutter={12}>
          <Col>
            <Select
              value={machineGroup}
              onChange={setMachineGroup}
              style={{ width: 170 }}
            >
              <Option value="ALL">All Machine Groups</Option>
              {[...new Set(machines.map((m) => m.machineGroup))].map((g) => (
                <Option key={g}>{g}</Option>
              ))}
            </Select>
          </Col>

          <Col>
            <Select
              value={priority}
              onChange={setPriority}
              style={{ width: 150 }}
            >
              <Option value="ALL">All Priority</Option>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Col>

          <Col>
            <RangePicker />
          </Col>
        </Row>
      </Card>

      {/* ================= MAIN GRID ================= */}
      <div className="dd-grid">
        <Row gutter={12}>
          {/* LEFT — TABLE */}
          <Col span={14}>
            <Card
              size="small"
              title="Orders At Risk"
              className="dd-card"
            
            >
              <div className="dd-table-scroll">
                <Table
                  size="small"
                  dataSource={filteredOrders}
                  columns={columns}
                  rowKey="orderId"
                  pagination={{ pageSize: 6 }}
                />
              </div>
            </Card>
          </Col>

          {/* RIGHT — CHARTS */}
          <Col span={10} style={{ height: "100%" }}>
            <div className="dd-right-stack">
              {/* Utilization */}
              <Card
                size="small"
                title="Machine Utilization"
                className="dd-card"
              >
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={filteredMachines}>
                    <XAxis dataKey="machineGroup" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="utilization" fill="#1677ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Downtime */}
              <Card
                size="small"
                title="Top Downtime Reasons"
                className="dd-card"
              >
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={downtime.slice(0, 8)}>
                    <XAxis dataKey="reason" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#1677ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}