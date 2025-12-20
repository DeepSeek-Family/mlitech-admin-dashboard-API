import { Button, DatePicker, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Sample data for revenue per user with added date field
const data = [
  {
    sl: 1,
    customerId: "C-2001",
    customers: "Alice",
    transactions: 120,
    totalRevenue: 3000.5,
    date: "2025-01-01",
  },
  {
    sl: 2,
    customerId: "C-2002",
    customers: "Jhon",
    transactions: 95,
    totalRevenue: 2200.0,
    date: "2025-02-01",
  },
  {
    sl: 3,
    customerId: "C-2003",
    customers: "Doe",
    transactions: 150,
    totalRevenue: 5000.0,
    date: "2025-03-01",
  },
];

// Table columns
const columns = [
  {
    title: "Customer ID",
    dataIndex: "customerId",
    key: "customerId",
    align: "center",
  },
  {
    title: "Customers",
    dataIndex: "customers",
    key: "customers",
    align: "center",
  },
  {
    title: "Transactions",
    dataIndex: "transactions",
    key: "transactions",
    align: "center",
  },
  {
    title: "Total Revenue",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    align: "center",
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
  },
];

export default function RevenuePerUser() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read values from URL params
  const fromDate = searchParams.get("rpu_fromDate") || "";
  const toDate = searchParams.get("rpu_toDate") || "";
  const currentPage = parseInt(searchParams.get("rpu_page") || "1", 10);

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
        <h1 className="text-[30px] font-bold mb-2">Revenue Per User</h1>
        <div className="flex justify-between">
          <div>
            <DatePicker
              value={fromDate ? dayjs(fromDate) : null}
              onChange={(date) => updateSearchParam("rpu_fromDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
              style={{ marginLeft: "auto", marginRight: "20px" }}
              placeholder="From Date"
              format="YYYY-MM-DD"
            />
            <DatePicker
              value={toDate ? dayjs(toDate) : null}
              onChange={(date) => updateSearchParam("rpu_toDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
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
          onChange: (page) => updateSearchParam("rpu_page", page > 1 ? page.toString() : "")
        }}
      />
    </div>
  );
}
