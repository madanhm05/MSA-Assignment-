import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [overview, setOverview] = useState(null);
  const [atRiskOrders, setAtRiskOrders] = useState([]);
  const [machineUtil, setMachineUtil] = useState([]);
  const [downtime, setDowntime] = useState([]);
  const [dataQuality, setDataQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [overviewRes, riskRes, utilRes, downRes, qualityRes] =
        await Promise.all([
          api.get("/overview"),
          api.get("/orders/at-risk"),
          api.get("/machines/utilization"),
          api.get("/machines/downtime"),
          api.get("/data-quality"),
        ]);

      setOverview(overviewRes.data);
      setAtRiskOrders(riskRes.data);
      setMachineUtil(utilRes.data);
      setDowntime(downRes.data);
      setDataQuality(qualityRes.data);
    } catch (err) {
      console.error("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        overview,
        atRiskOrders,
        machineUtil,
        downtime,
        dataQuality,
        loading,
        refresh: fetchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);