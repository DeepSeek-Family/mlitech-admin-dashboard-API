import React from "react";
import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import RevenuePerUser from "./Reports/RevenuePerUser";
import PointsRedeemed from "./Reports/PointsRedeemed";
import CashReceivable from "./Reports/CashReceivable";
import CashCollections from "./Reports/CashCollections";
import { useUser } from "../../../provider/User";

const { TabPane } = Tabs;

export default function AccountingReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();

  // Get active accounting tab from URL or default to "1"
  const activeAccountingTab = searchParams.get("accountingTab") || "1";

  const handleAccountingTabChange = (key) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("accountingTab", key);
      return newParams;
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <h1 className="text-[30px] font-bold mb-2">Accounting Reports</h1>
      <Tabs
        activeKey={activeAccountingTab}
        onChange={handleAccountingTabChange}
        type="card"
      >
        <TabPane
          tab={<span className="custom-tab-text">Cash Collection</span>}
          key="1"
        >
          <CashCollections />
        </TabPane>
        <TabPane
          tab={<span className="custom-tab-text">Cash Receivable</span>}
          key="2"
        >
          <CashReceivable />
        </TabPane>
        {user?.role === "VIEW_ADMIN" || (
          <TabPane
            tab={<span className="custom-tab-text">Revenue Per User</span>}
            key="3"
          >
            <RevenuePerUser />
          </TabPane>
        )}
        <TabPane
          tab={<span className="custom-tab-text">Points Redeemed</span>}
          key="4"
        >
          <PointsRedeemed />
        </TabPane>
      </Tabs>
    </div>
  );
}
