import { Button, DatePicker, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Sample data for cash receivable
const data = [
  {
    sl: 1,
    date: "2025-01-01",
    merchantId: "M-1001",
    transactions: 5,
    totalCollected: 1200.5,
    salesRep: "John Doe",
    location: "Chicago",
  },
  {
    sl: 2,
    date: "2025-02-01",
    merchantId: "M-1002",
    transactions: 3,
    totalCollected: 850.0,
    salesRep: "Jane Smith",
    location: "Los Angeles",
  },
  {
    sl: 3,
    date: "2025-03-01",
    merchantId: "M-1003",
    transactions: 7,
    totalCollected: 1500.0,
    salesRep: "Alice Johnson",
    location: "New York",
  },
];

// Table columns
const columns = [
  {
    title: "Customer ID",
    dataIndex: "merchantId",
    key: "merchantId",
    align: "center",
  },
  {
    title: "Sales Rep",
    dataIndex: "salesRep",
    key: "salesRep",
    align: "center",
  },
  { title: "Date", dataIndex: "date", key: "date", align: "center" },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    align: "center",
  },
  {
    title: "Transactions",
    dataIndex: "transactions",
    key: "transactions",
    align: "center",
  },
  {
    title: "Total Outstanding",
    dataIndex: "totalCollected",
    key: "totalCollected",
    align: "center",
    render: (value) => `$${value.toFixed(2)}`,
  },
];

export default function CashReceivable() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read values from URL params
  const fromDate = searchParams.get("cr_fromDate") || "";
  const toDate = searchParams.get("cr_toDate") || "";
  const currentPage = parseInt(searchParams.get("cr_page") || "1", 10);

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
        <h1 className="text-[30px] font-bold mb-2">Cash Receivable</h1>
        <div className="flex justify-between">
          <div>
            <DatePicker
              value={fromDate ? dayjs(fromDate) : null}
              onChange={(date) => updateSearchParam("cr_fromDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
              style={{ marginLeft: "auto", marginRight: "20px" }}
              placeholder="From Date"
              format="YYYY-MM-DD"
            />
            <DatePicker
              value={toDate ? dayjs(toDate) : null}
              onChange={(date) => updateSearchParam("cr_toDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
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
          onChange: (page) => updateSearchParam("cr_page", page > 1 ? page.toString() : "")
        }}
      />
    </div>
  );
}
