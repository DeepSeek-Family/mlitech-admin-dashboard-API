import { Button, Col, DatePicker, Form, Row, Select, Spin } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useCustomerReportAnalyticsQuery,
  useLazyExportCustomerChartMonthlyDataQuery,
} from "../../../redux/apiSlices/reportAnalyticsApi";
import { useGetCustomerProfileQuery } from "../../../redux/apiSlices/customerSlice";
import CustomTable from "../../common/CustomTable";
import { useUser } from "../../../provider/User";

const { Option } = Select;

// Dropdown options for frontend filtering
const subscriptionOptions = ["All Status", "active", "inActive"];
const paymentOptions = ["All Payments", "Paid", "Unpaid"];
const metricOptions = ["Revenue", "Visits", "Points Redeemed"];
const pointsFilterOptions = ["All", "Points Redeemed", "Points Accumulated"];
const locationOptions = [
  "All Cities",
  "Abu Dhabi",
  "Ajman",
  "Birmingham",
  "Dhaka",
  "Doha",
  "Dubai",
  "Fujairah",
  "Glasgow",
  "Islamabad",
  "Jeddah",
  "Karachi",
  "Kuwait City",
  "Lahore",
  "Liverpool",
  "London",
  "Manchester",
  "Manama",
  "Muscat",
  "Peshawar",
  "Quetta",
  "Ras Al Khaimah",
  "Rawalpindi",
  "Riyadh",
  "Sharjah",
  "Umm Al Quwain",
];

export default function MonthlyStatsChartCustomer() {
  const { user } = useUser();
  const userRole = user?.role;
  const isViewAdmin = userRole === "VIEW_ADMIN";

  const [searchParams, setSearchParams] = useSearchParams();

  // Default dates: current year start and end
  const currentYear = new Date().getFullYear();
  const defaultStartDate = `${currentYear}-01-01`;
  const defaultEndDate = `${currentYear}-12-31`;

  // Read values from URL params with defaults
  const fromDate = searchParams.get("c_startDate") || defaultStartDate;
  const toDate = searchParams.get("c_endDate") || defaultEndDate;
  const customerName = searchParams.get("c_customerName") || "All Customers";
  const location = searchParams.get("c_location") || "All Cities";
  const selectedSubscription =
    searchParams.get("c_subscription") || "All Status";
  const selectedPayment = searchParams.get("c_payment") || "All Payments";
  const selectedMetric = searchParams.get("c_metric") || "all";
  const selectedPointsFilter =
    searchParams.get("c_pointsFilter") || "Points Accumulated";
  const chartType = searchParams.get("c_chartType") || "Bar";
  const currentPage = parseInt(searchParams.get("c_page") || "1", 10);

  // Helper function to update URL params
  const updateSearchParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (
          value &&
          value !== "" &&
          value !== "All Status" &&
          value !== "All Payments" &&
          value !== "all" &&
          value !== "All" &&
          value !== "All Customers" &&
          value !== "All Cities" &&
          value !== "Bar"
        ) {
          newParams.set(key, value);
        } else if (key === "c_startDate" && value !== defaultStartDate) {
          newParams.set(key, value);
        } else if (key === "c_endDate" && value !== defaultEndDate) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
        return newParams;
      });
    },
    [setSearchParams, defaultStartDate, defaultEndDate],
  );

  // Build query params for API
  const queryParams = useMemo(() => {
    const params = [];

    if (fromDate) {
      params.push({ name: "startDate", value: fromDate });
    }
    if (toDate) {
      params.push({ name: "endDate", value: toDate });
    }
    if (
      customerName &&
      customerName.trim() !== "" &&
      customerName !== "All Customers"
    ) {
      params.push({ name: "customerName", value: customerName.trim() });
    }
    if (location && location.trim() !== "" && location !== "All Cities") {
      params.push({ name: "location", value: location.trim() });
    }
    if (selectedSubscription && selectedSubscription !== "All Status") {
      params.push({ name: "subscriptionStatus", value: selectedSubscription });
    }
    if (selectedPayment && selectedPayment !== "All Payments") {
      params.push({ name: "paymentStatus", value: selectedPayment });
    }
    if (currentPage > 1) {
      params.push({ name: "page", value: currentPage });
    }

    return params;
  }, [
    fromDate,
    toDate,
    customerName,
    location,
    selectedSubscription,
    selectedPayment,
    currentPage,
  ]);

  // Fetch data from API
  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useCustomerReportAnalyticsQuery(queryParams);

  // Fetch customer list for dropdown
  const { data: customerListResponse, isLoading: isLoadingCustomers } =
    useGetCustomerProfileQuery([]);

  // Lazy query for export (only triggers on button click)
  const [triggerExport, { isLoading: isExportLoading }] =
    useLazyExportCustomerChartMonthlyDataQuery();

  // Transform API data for table
  const tableData = useMemo(() => {
    if (!apiResponse?.data?.records) return [];

    return apiResponse.data.records.map((record, index) => ({
      key: index,
      sl: index + 1,
      date: record.date ? dayjs(record.date).format("YYYY-MM-DD") : "-",
      customerId: record.customUserId || "-",
      CustomerName: record.customerName || "-",
      Location: record.location || "-",
      SubscriptionStatus: record.subscriptionStatus || "-",
      PaymentStatus: record.paymentStatus || "-",
      Revenue: record.revenue || "-",
      Visits: record.users || "-",
      "Points Redeemed": record.pointsRedeemed ?? "-",
      "Points Accumulated": record.pointsAccumulated ?? "-",
    }));
  }, [apiResponse]);

  // Transform monthly data for chart
  const chartData = useMemo(() => {
    if (!apiResponse?.data?.monthlyData) return [];

    return apiResponse.data.monthlyData.map((item) => ({
      date: `${item.monthName} ${item.year}`,
      Revenue: item.revenue || 0,
      Visits: item.users || 0,
      "Points Accumulated": item.pointsAccumulated || 0,
      "Points Redeemed": item.pointsRedeemed || 0,
    }));
  }, [apiResponse]);

  // Calculate max values for 3D bar effect
  const maxValues = useMemo(() => {
    if (chartData.length === 0) {
      return {
        Revenue: 100,
        Visits: 100,
        "Points Accumulated": 100,
        "Points Redeemed": 100,
      };
    }
    return {
      Revenue: Math.max(...chartData.map((d) => d.Revenue)) || 100,
      Visits: Math.max(...chartData.map((d) => d.Visits)) || 100,
      "Points Accumulated":
        Math.max(...chartData.map((d) => d["Points Accumulated"])) || 100,
      "Points Redeemed":
        Math.max(...chartData.map((d) => d["Points Redeemed"])) || 100,
    };
  }, [chartData]);

  // Custom 3D Bar with watermark
  const Custom3DBarWithWatermark = ({
    x,
    y,
    width,
    height,
    fill,
    dataKey,
    payload,
  }) => {
    const depth = 10;
    const maxValue = maxValues[dataKey] || 100;
    const currentValue = payload?.[dataKey] || 0;

    if (!currentValue || !height || height <= 0) {
      return null;
    }

    const scale = maxValue / currentValue;
    const watermarkHeight = height * scale;
    const watermarkY = y - (watermarkHeight - height);

    return (
      <g>
        <g opacity={0.1}>
          <rect
            x={x}
            y={watermarkY}
            width={width}
            height={watermarkHeight}
            fill={fill}
          />
          <polygon
            points={`${x},${watermarkY} ${x + depth},${watermarkY - depth} ${
              x + width + depth
            },${watermarkY - depth} ${x + width},${watermarkY}`}
            fill={fill}
          />
          <polygon
            points={`${x + width},${watermarkY} ${x + width + depth},${
              watermarkY - depth
            } ${x + width + depth},${watermarkY + watermarkHeight} ${
              x + width
            },${watermarkY + watermarkHeight}`}
            fill={fill}
          />
        </g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          opacity={0.4}
        />
        <polygon
          points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${
            y - depth
          } ${x + width},${y}`}
          fill={fill}
          opacity={0.6}
        />
        <polygon
          points={`${x + width},${y} ${x + width + depth},${y - depth} ${
            x + width + depth
          },${y + height} ${x + width},${y + height}`}
          fill={fill}
          opacity={0.7}
        />
      </g>
    );
  };

  const handleExportChartData = async () => {
    try {
      const result = await triggerExport(queryParams);

      if (result.data) {
        // Create a blob URL and trigger download
        const blob = result.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Generate filename with current date
        const dateStr = new Date().toISOString().split("T")[0];
        link.download = `customer-report-${dateStr}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    { title: "Date", dataIndex: "date", key: "date", align: "center" },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      align: "center",
    },
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "CustomerName",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location",
      align: "center",
    },
    {
      title: "Membership Status",
      dataIndex: "SubscriptionStatus",
      key: "SubscriptionStatus",
      align: "center",
    },
    {
      title: "Payment Status",
      dataIndex: "PaymentStatus",
      key: "PaymentStatus",
      align: "center",
    },
    { title: "Revenue", dataIndex: "Revenue", key: "Revenue", align: "center" },
    { title: "Visits", dataIndex: "Visits", key: "Visits", align: "center" },
    {
      title: "Points Redeemed",
      dataIndex: "Points Redeemed",
      key: "Points Redeemed",
      align: "center",
    },
    {
      title: "Points Accumulated",
      dataIndex: "Points Accumulated",
      key: "Points Accumulated",
      align: "center",
    },
  ];

  // Handle clear selection
  const handleClearSelection = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      // Remove all customer-related params
      newParams.delete("c_startDate");
      newParams.delete("c_endDate");
      newParams.delete("c_customerName");
      newParams.delete("c_location");
      newParams.delete("c_subscription");
      newParams.delete("c_payment");
      newParams.delete("c_metric");
      newParams.delete("c_pointsFilter");
      newParams.delete("c_chartType");
      newParams.delete("c_page");
      return newParams;
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <Form layout="vertical">
        {/* From -> To Date Picker */}
        <div style={{ marginBottom: "0.5rem", width: "100%" }}>
          <Row gutter={[8, 8]} wrap>
            <Col flex="1 1 200px">
              <Form.Item label="Start Date" style={{ marginBottom: "0.5rem" }}>
                <DatePicker
                  value={fromDate ? dayjs(fromDate) : null}
                  onChange={(date) =>
                    updateSearchParam(
                      "c_startDate",
                      date ? dayjs(date).format("YYYY-MM-DD") : "",
                    )
                  }
                  style={{ width: "100%" }}
                  placeholder="Start Date"
                  className="mli-tall-picker"
                />
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item label="End Date" style={{ marginBottom: "0.5rem" }}>
                <DatePicker
                  value={toDate ? dayjs(toDate) : null}
                  onChange={(date) =>
                    updateSearchParam(
                      "c_endDate",
                      date ? dayjs(date).format("YYYY-MM-DD") : "",
                    )
                  }
                  style={{ width: "100%" }}
                  placeholder="End Date"
                  className="mli-tall-picker"
                />
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item
                label={<span className="mli-custom-label">Customer Name</span>}
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={customerName || undefined}
                  onChange={(value) =>
                    updateSearchParam("c_customerName", value || "")
                  }
                  style={{ width: "100%" }}
                  placeholder="Select Customer Name"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  className="mli-tall-select"
                  loading={isLoadingCustomers}
                >
                  <Option value="">All Customers</Option>
                  {customerListResponse?.data?.map((customer) => (
                    <Option
                      key={customer._id}
                      value={customer.firstName || customer._id}
                    >
                      {customer.firstName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item label="City" style={{ marginBottom: "0.5rem" }}>
                <Select
                  value={location || undefined}
                  onChange={(value) => {
                    if (value === "All Cities" || value === "") {
                      updateSearchParam("c_location", "");
                    } else {
                      updateSearchParam("c_location", value || "");
                    }
                  }}
                  style={{ width: "100%" }}
                  placeholder="Select City"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  className="mli-tall-select"
                >
                  {locationOptions.map((loc) => (
                    <Option key={loc} value={loc === "All Cities" ? "" : loc}>
                      {loc}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item
                label="Membership Status"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedSubscription}
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    updateSearchParam("c_subscription", value)
                  }
                  className="mli-tall-select"
                >
                  {subscriptionOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option === "All Status"
                        ? option
                        : option.charAt(0).toUpperCase() + option.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Bottom row: Payment Status, Chart Type, Metrics + buttons */}
          <Row gutter={[8, 8]} wrap style={{ marginTop: 8 }}>
            <Col flex="1 1 220px">
              <Form.Item
                label="Payment Status"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedPayment}
                  style={{ width: "100%" }}
                  onChange={(value) => updateSearchParam("c_payment", value)}
                  className="mli-tall-select"
                >
                  {paymentOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 220px">
              <Form.Item
                label="Select Chart Type"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={chartType}
                  style={{ width: "100%" }}
                  onChange={(value) => updateSearchParam("c_chartType", value)}
                  className="mli-tall-select"
                >
                  <Option value="Bar">Bar Chart</Option>
                  <Option value="Line">Line Chart</Option>
                  <Option value="Area">Area Chart</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 220px">
              <Form.Item
                label="Select Metrics"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedMetric}
                  style={{ width: "100%" }}
                  onChange={(value) => updateSearchParam("c_metric", value)}
                  className="mli-tall-select"
                >
                  <Option value="all">All Metrics</Option>
                  {metricOptions
                    .filter((option) => !(isViewAdmin && option === "Revenue"))
                    .map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 220px">
              <Form.Item
                label="Points Filter"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedPointsFilter}
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    updateSearchParam("c_pointsFilter", value)
                  }
                  className="mli-tall-select"
                >
                  {pointsFilterOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 220px">
              <Form.Item label="Actions" style={{ marginBottom: "0.5rem" }}>
                <div className="flex gap-2">
                  <Button
                    onClick={handleClearSelection}
                    className="bg-red-500 !border-red-500 px-6 py-[19px] rounded-md text-white hover:!text-red-500 text-[14px] font-bold"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={handleExportChartData}
                    loading={isExportLoading}
                    disabled={isExportLoading}
                    className="bg-primary px-6 py-[19px] rounded-md text-white hover:text-secondary text-[14px] font-bold"
                  >
                    Export Report Monthly
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>

      {/* Chart */}
      <div
        className="p-4 rounded-lg border"
        style={{ width: "100%", height: 400, marginTop: "40px" }}
      >
        {isLoading || isFetching ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <ResponsiveContainer>
            {chartType === "Bar" ? (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="20%"
                barGap={13}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {!isViewAdmin &&
                  (selectedMetric === "all" ||
                    selectedMetric === "Revenue") && (
                    <Bar
                      dataKey="Revenue"
                      fill="#7086FD"
                      shape={(props) => (
                        <Custom3DBarWithWatermark
                          {...props}
                          dataKey="Revenue"
                        />
                      )}
                    />
                  )}
                {(selectedMetric === "all" || selectedMetric === "Visits") && (
                  <Bar
                    dataKey="Visits"
                    fill="#6FD195"
                    shape={(props) => (
                      <Custom3DBarWithWatermark {...props} dataKey="Visits" />
                    )}
                  />
                )}
                {(selectedMetric === "all" ||
                  selectedMetric === "Points Redeemed") && (
                  <Bar
                    dataKey="Points Redeemed"
                    fill="#FFAE4C"
                    shape={(props) => (
                      <Custom3DBarWithWatermark
                        {...props}
                        dataKey="Points Redeemed"
                      />
                    )}
                  />
                )}
              </BarChart>
            ) : chartType === "Line" ? (
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {!isViewAdmin &&
                  (selectedMetric === "all" ||
                    selectedMetric === "Revenue") && (
                    <Line type="monotone" dataKey="Revenue" stroke="#7086FD" />
                  )}
                {(selectedMetric === "all" || selectedMetric === "Visits") && (
                  <Line type="monotone" dataKey="Visits" stroke="#6FD195" />
                )}
                {(selectedMetric === "all" ||
                  selectedMetric === "Points Redeemed") && (
                  <Line
                    type="monotone"
                    dataKey="Points Redeemed"
                    stroke="#FFAE4C"
                  />
                )}
              </LineChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {!isViewAdmin &&
                  (selectedMetric === "all" ||
                    selectedMetric === "Revenue") && (
                    <Area
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#7086FD"
                      fill="#7086FD"
                    />
                  )}
                {(selectedMetric === "all" || selectedMetric === "Visits") && (
                  <Area
                    type="monotone"
                    dataKey="Visits"
                    stroke="#6FD195"
                    fill="#6FD195"
                  />
                )}
                {(selectedMetric === "all" ||
                  selectedMetric === "Points Redeemed") && (
                  <Area
                    type="monotone"
                    dataKey="Points Redeemed"
                    stroke="#FFAE4C"
                    fill="#FFAE4C"
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Ant Design Table */}
      <div style={{ marginTop: "50px" }}>
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-[22px] font-bold">Data Table</h1>
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={handleExportChartData}
            loading={isExportLoading}
            disabled={isExportLoading}
          >
            Export Report
          </Button>
        </div>
        <CustomTable
          data={tableData}
          columns={columns.filter((col) => {
            // Hide Revenue column for VIEW_ADMIN
            if (col.dataIndex === "Revenue" && isViewAdmin) {
              return false;
            }

            // Always show basic columns (not metric-related)
            if (
              ![
                "Revenue",
                "Users",
                "Points Redeemed",
                "Points Accumulated",
              ].includes(col.dataIndex)
            ) {
              return true;
            }

            // Points filter logic
            if (selectedPointsFilter !== "All") {
              // Show only the selected points column
              if (col.dataIndex === selectedPointsFilter) {
                return true;
              }
              // Hide other points columns
              if (
                col.dataIndex === "Points Redeemed" ||
                col.dataIndex === "Points Accumulated"
              ) {
                return false;
              }
            }

            // Metric filter logic
            if (selectedMetric === "all") {
              return true;
            }
            return col.dataIndex === selectedMetric;
          })}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={{
            current: currentPage,
            pageSize: 6,
            total: apiResponse?.pagination?.total || 0,
          }}
          onPaginationChange={(page) =>
            updateSearchParam("c_page", page > 1 ? page.toString() : "")
          }
          rowKey="key"
        />
      </div>
    </div>
  );
}
