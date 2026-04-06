import { Button, DatePicker, message } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetCashCollectionQuery,
  useLazyExportCashCollectionQuery,
} from "../../../../redux/apiSlices/accountingSlice";
import CustomTable from "../../../common/CustomTable";

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
    render: (value) => `${value.toFixed(2)}`,
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

  // Fetch data from API
  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetCashCollectionQuery(queryParams);

  // Lazy query for export
  const [triggerExport, { isLoading: isExportLoading }] =
    useLazyExportCashCollectionQuery();

  const handleExportCashCollection = async () => {
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
        link.download = `cash-collections-export-${dateStr}.xlsx`;

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
  console.log("CashCollections API Response:", apiResponse);

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
      sl: index + 1 + (currentPage - 1) * pageSize,
      merchantId: item.customerId || "-",
      salesRep: item.salesRep || "-",
      pendingTransactions: item.totalTransactions || 0,
      totalReceivable: item.totalReceived || 0,
      date: item.date ? dayjs(item.date).format("YYYY-MM-DD") : "-",
    }));
  }, [apiResponse, currentPage, pageSize]);

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[30px] font-bold mb-2">Cash Collections</h1>
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
            onClick={handleExportCashCollection}
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
