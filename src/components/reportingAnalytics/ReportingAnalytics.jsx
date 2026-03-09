import React from "react";
import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import MerchantReportingAnalytics from "./Tab/MerchantReportingAnalytics";
import CustomerReportingAnalytics from "./Tab/CustomerReportingAnalytics";
import AccountingReports from "./Tab/AccountingReports";

const { TabPane } = Tabs;

export default function ReportingAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active tab from URL or default to "1"
  const activeTab = searchParams.get("tab") || "1";

  const handleTabChange = (key) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", key);
      return newParams;
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        tabBarStyle={{
          borderBottom: "none", // Remove the border
        }}
        tabBarGutter={20} // Add some space between tabs
      >
        <TabPane
          tab={
            <span
              style={{
                padding: "10px 20px", // Button-like padding
                borderRadius: "4px", // Rounded corners
                backgroundColor: "#3FAE6A", // Button background color
                color: "#fff", // White text
                fontSize: "16px", // Font size
                fontWeight: "bold", // Bold text
                cursor: "pointer", // Pointer cursor
                transition: "background-color 0.3s", // Smooth transition for hover effect
              }}
            >
              Merchant Reporting
            </span>
          }
          key="1"
        >
          <MerchantReportingAnalytics />
        </TabPane>
        <TabPane
          tab={
            <span
              style={{
                padding: "10px 20px",
                borderRadius: "4px",
                backgroundColor: "#2196F3",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Customer Reporting
            </span>
          }
          key="2"
        >
          <CustomerReportingAnalytics />
        </TabPane>
        <TabPane
          tab={
            <span
              style={{
                padding: "10px 20px",
                borderRadius: "4px",
                backgroundColor: "#FF9800",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Accounting Reports
            </span>
          }
          key="3"
        >
          <AccountingReports />
        </TabPane>
      </Tabs>
    </div>
  );
}
