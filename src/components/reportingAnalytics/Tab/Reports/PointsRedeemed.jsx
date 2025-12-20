import { Button, DatePicker, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Sample data for points redeemed
const data = [
  {
    sl: 1,
    customerName: "John Doe",
    period: "2025-01",
    customerId: "C001",
    redemptions: 15,
    totalPointsRedeemed: 3200,
    date: "2025-01-01",
  },
  {
    sl: 2,
    customerName: "Jane Smith",
    period: "2025-02",
    customerId: "C002",
    redemptions: 10,
    totalPointsRedeemed: 2500,
    date: "2025-02-01",
  },
  {
    sl: 3,
    customerName: "Mike Johnson",
    period: "2025-03",
    customerId: "C003",
    redemptions: 20,
    totalPointsRedeemed: 4500,
    date: "2025-03-01",
  },
];

// Table columns
const columns = [
  { title: "Period", dataIndex: "period", key: "period", align: "center" },
  {
    title: "Customer ID",
    dataIndex: "customerId",
    key: "customerId",
    align: "center",
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
    align: "center",
  },
  {
    title: "Redemptions",
    dataIndex: "redemptions",
    key: "redemptions",
    align: "center",
  },
  {
    title: "Total Points Redeemed",
    dataIndex: "totalPointsRedeemed",
    key: "totalPointsRedeemed",
    align: "center",
    render: (value) => value.toLocaleString(),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
  },
];

export default function PointsRedeemed() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read values from URL params
  const fromDate = searchParams.get("pr_fromDate") || "";
  const toDate = searchParams.get("pr_toDate") || "";
  const currentPage = parseInt(searchParams.get("pr_page") || "1", 10);

  // Helper function to update URL params
  const updateSearchParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value && value !== "") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  }, [setSearchParams]);

  // Filter data based on URL params
  const filteredData = useMemo(() => {
    let filtered = data;
    if (fromDate) {
      filtered = filtered.filter((item) =>
        dayjs(item.date).isSameOrAfter(dayjs(fromDate), "day")
      );
    }
    if (toDate) {
      filtered = filtered.filter((item) =>
        dayjs(item.date).isSameOrBefore(dayjs(toDate), "day")
      );
    }
    return filtered;
  }, [fromDate, toDate]);

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[30px] font-bold mb-2">Points Redeemed</h1>
        <div className="flex justify-between">
          <div>
            <DatePicker
              value={fromDate ? dayjs(fromDate) : null}
              onChange={(date) => updateSearchParam("pr_fromDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
              style={{ marginLeft: "auto", marginRight: "20px" }}
              placeholder="From Date"
              format="YYYY-MM-DD"
            />
            <DatePicker
              value={toDate ? dayjs(toDate) : null}
              onChange={(date) => updateSearchParam("pr_toDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
              style={{ marginRight: "20px" }}
              placeholder="To Date"
              format="YYYY-MM-DD"
            />
          </div>
          <Button className="bg-primary text-white font-semibold px-[20px] hover:!text-black">
            Export Report
          </Button>
        </div>
      </div>
      <Table
        bordered={false}
        size="small"
        rowClassName="custom-row"
        className="custom-table"
        columns={columns}
        dataSource={filteredData.map((row, index) => ({
          ...row,
          key: index,
        }))}
        pagination={{ 
          current: currentPage,
          pageSize: 6,
          onChange: (page) => updateSearchParam("pr_page", page > 1 ? page.toString() : "")
        }}
      />
    </div>
  );
}
