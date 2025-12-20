import { Button, DatePicker, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Sample data for cash receivable
const data = [
  {
    sl: 1,
    merchantId: 101,
    salesRep: "John Doe",
    pendingTransactions: 5,
    totalReceivable: 1200.5,
    date: "2025-01-01",
  },
  {
    sl: 2,
    merchantId: 102,
    salesRep: "Jane Smith",
    pendingTransactions: 3,
    totalReceivable: 850.0,
    date: "2025-02-01",
  },
  {
    sl: 3,
    merchantId: 103,
    salesRep: "Alice Johnson",
    pendingTransactions: 7,
    totalReceivable: 1500.0,
    date: "2025-03-01",
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
  {
    title: "Transactions",
    dataIndex: "pendingTransactions",
    key: "pendingTransactions",
    align: "center",
  },
  {
    title: "Total Received",
    dataIndex: "totalReceivable",
    key: "totalReceivable",
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

export default function CashCollections() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read values from URL params
  const fromDate = searchParams.get("cc_fromDate") || "";
  const toDate = searchParams.get("cc_toDate") || "";
  const currentPage = parseInt(searchParams.get("cc_page") || "1", 10);

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
        <h1 className="text-[30px] font-bold mb-2">Cash Collections</h1>
        <div className="flex justify-between">
          <div>
            <DatePicker
              value={fromDate ? dayjs(fromDate) : null}
              onChange={(date) => updateSearchParam("cc_fromDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
              style={{ marginLeft: "auto", marginRight: "20px" }}
              placeholder="From Date"
              format="YYYY-MM-DD"
            />
            <DatePicker
              value={toDate ? dayjs(toDate) : null}
              onChange={(date) => updateSearchParam("cc_toDate", date ? dayjs(date).format("YYYY-MM-DD") : "")}
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
          onChange: (page) => updateSearchParam("cc_page", page > 1 ? page.toString() : "")
        }}
      />
    </div>
  );
}
