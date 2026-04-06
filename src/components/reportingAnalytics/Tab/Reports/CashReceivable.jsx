import { Button, DatePicker, message } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetCashReceivableQuery,
  useLazyExportCashReceivableQuery,
} from "../../../../redux/apiSlices/accountingSlice";
import CustomTable from "../../../common/CustomTable";

// Table columns
const columns = [
  {
    title: "Customer ID",
    dataIndex: "customerId",
    key: "customerId",
    align: "center",
  },
  {
    title: "Sales Rep",
    dataIndex: "salesRep",
    key: "salesRep",
    align: "center",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    align: "center",
  },
  {
    title: "Transactions",
    dataIndex: "totalTransactions",
    key: "totalTransactions",
    align: "center",
  },
  {
    title: "Total Outstanding",
    dataIndex: "totalOutstanding",
    key: "totalOutstanding",
    align: "center",
    render: (value) => `${value.toFixed(2)}`,
  },
];

export default function CashReceivable() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read values from URL params
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "10", 10);

  // Build query params for API
  const queryParams = useMemo(() => {
    const params = [];
    if (startDate) {
      params.push({ name: "startDate", value: startDate });
    }
    if (endDate) {
      params.push({ name: "endDate", value: endDate });
    }
    params.push({ name: "page", value: currentPage });
    params.push({ name: "limit", value: pageSize });
    return params;
  }, [startDate, endDate, currentPage, pageSize]);

  const shouldSkipCashReceivableQuery = Boolean(startDate) && !Boolean(endDate);

  // Fetch data from API
  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetCashReceivableQuery(queryParams, {
    skip: shouldSkipCashReceivableQuery,
  });

  // Lazy query for export
  const [triggerExport, { isLoading: isExportLoading }] =
    useLazyExportCashReceivableQuery();

  const handleExportCashReceivable = async () => {
    try {
      const result = await triggerExport([
        { name: "startDate", value: startDate },
        { name: "endDate", value: endDate },
      ]);

      if (result.data) {
        // Create a blob URL and trigger download
        const blob = result.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Generate filename with current date
        const dateStr = new Date().toISOString().split("T")[0];
        link.download = `cash-receivable-export-${dateStr}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        message.success("Report exported successfully!");
      }
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export report");
    }
  };

  // Debug: Log API response structure
  console.log("CashReceivable API Response:", apiResponse);

  // Helper function to update URL params
  const updateSearchParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (value && value !== "") {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
        return newParams;
      });
    },
    [setSearchParams],
  );
  const handlePageSizeChange = (newPageSize) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("limit", newPageSize.toString());
      newParams.delete("page");
      return newParams;
    });
  };
  // Transform API data for table
  const filteredData = useMemo(() => {
    // API response has nested data structure: apiResponse.data.data
    if (!apiResponse?.data?.data) return [];

    const dataArray = Array.isArray(apiResponse.data.data)
      ? apiResponse.data.data
      : [];

    return dataArray.map((item, index) => ({
      key: index,
      sl: index + 1 + (currentPage - 1) * 6,
      customerId: item.customerId || item._id || "-",
      salesRep: item.salesRep || "-",
      location: item.location || "-",
      totalTransactions: item.totalTransactions || 0,
      totalOutstanding: item.totalOutstanding || 0,
    }));
  }, [apiResponse, currentPage]);

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[30px] font-bold mb-2">Cash Receivable</h1>
        <div className="flex justify-between">
          <div>
            <DatePicker
              value={startDate ? dayjs(startDate) : null}
              onChange={(date) =>
                updateSearchParam(
                  "startDate",
                  date ? dayjs(date).format("YYYY-MM-DD") : "",
                )
              }
              style={{ marginLeft: "auto", marginRight: "20px" }}
              placeholder="From Date"
              format="YYYY-MM-DD"
            />
            <DatePicker
              value={endDate ? dayjs(endDate) : null}
              onChange={(date) =>
                updateSearchParam(
                  "endDate",
                  date ? dayjs(date).format("YYYY-MM-DD") : "",
                )
              }
              style={{ marginRight: "20px" }}
              placeholder="To Date"
              format="YYYY-MM-DD"
            />
          </div>
          <Button
            className="bg-primary text-white font-semibold px-[20px] hover:!text-black"
            onClick={handleExportCashReceivable}
            loading={isExportLoading}
            disabled={isExportLoading}
          >
            Export Report
          </Button>
        </div>
      </div>
      <CustomTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: apiResponse?.pagination?.total || 0,
        }}
        onPaginationChange={(page) =>
          updateSearchParam("page", page > 1 ? page.toString() : "")
        }
        onPageSizeChange={handlePageSizeChange}
        rowKey="key"
      />
    </div>
  );
}
