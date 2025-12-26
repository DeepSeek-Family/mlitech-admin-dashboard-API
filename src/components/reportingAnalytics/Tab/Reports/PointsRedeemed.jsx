import { Button, DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetPointsRedeemedQuery } from "../../../../redux/apiSlices/accountingSlice";
import CustomTable from "../../../common/CustomTable";

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
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Build query params for API
  const queryParams = useMemo(() => {
    const params = [];
    if (fromDate) {
      params.push({ name: "startDate", value: fromDate });
    }
    if (toDate) {
      params.push({ name: "endDate", value: toDate });
    }
    params.push({ name: "page", value: currentPage });
    params.push({ name: "limit", value: 6 });
    return params;
  }, [fromDate, toDate, currentPage]);

  // Fetch data from API
  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetPointsRedeemedQuery(queryParams);

  // Debug: Log API response structure
  console.log("PointsRedeemed API Response:", apiResponse);

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
    [setSearchParams]
  );

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
      customerName: item.customerName || "-",
      redemptions: item.redemptionCount || 0,
      totalPointsRedeemed: item.totalPointsRedeemed || 0,
      period: item.period || "-",
      date: item.date ? dayjs(item.date).format("YYYY-MM-DD") : "-",
    }));
  }, [apiResponse, currentPage]);

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[30px] font-bold mb-2">Points Redeemed</h1>
        <div className="flex justify-between">
          <div>
            <DatePicker
              value={fromDate ? dayjs(fromDate) : null}
              onChange={(date) =>
                updateSearchParam(
                  "fromDate",
                  date ? dayjs(date).format("YYYY-MM-DD") : ""
                )
              }
              style={{ marginLeft: "auto", marginRight: "20px" }}
              placeholder="From Date"
              format="YYYY-MM-DD"
            />
            <DatePicker
              value={toDate ? dayjs(toDate) : null}
              onChange={(date) =>
                updateSearchParam(
                  "toDate",
                  date ? dayjs(date).format("YYYY-MM-DD") : ""
                )
              }
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
      <CustomTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={{
          current: currentPage,
          pageSize: 6,
          total: apiResponse?.pagination?.total || 0,
        }}
        onPaginationChange={(page) =>
          updateSearchParam("page", page > 1 ? page.toString() : "")
        }
        rowKey="key"
      />
    </div>
  );
}
