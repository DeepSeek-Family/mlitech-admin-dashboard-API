import { Button, Col, DatePicker, Form, Input, Row, Select, Table, Spin } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
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
import { useMerchantReportAnalyticsQuery } from "../../../redux/apiSlices/reportAnalyticsApi";

const { Option } = Select;

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

// Dropdown options for frontend filtering
const subscriptionOptions = ["All Statuses", "Active", "Inactive"];
const paymentOptions = ["All Payments", "Paid", "Unpaid"];
const metricOptions = ["Revenue", "Users", "Points Redeemed"];

export default function MonthlyStatsChartMerchant() {
  // Default dates: current year start and end
  const currentYear = new Date().getFullYear();
  const defaultStartDate = dayjs(`${currentYear}-01-01`);
  const defaultEndDate = dayjs(`${currentYear}-12-31`);

  const [fromDate, setFromDate] = useState(defaultStartDate);
  const [toDate, setToDate] = useState(defaultEndDate);
  const [merchantName, setMerchantName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState("All Statuses");
  const [selectedPayment, setSelectedPayment] = useState("All Payments");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [chartType, setChartType] = useState("Bar");

  // Build query params for API
  const queryParams = useMemo(() => {
    const params = [];
    
    if (fromDate) {
      params.push({ name: "startDate", value: dayjs(fromDate).format("YYYY-MM-DD") });
    }
    if (toDate) {
      params.push({ name: "endDate", value: dayjs(toDate).format("YYYY-MM-DD") });
    }
    if (merchantName && merchantName.trim() !== "") {
      params.push({ name: "merchantName", value: merchantName.trim() });
    }
    if (location && location.trim() !== "") {
      params.push({ name: "location", value: location.trim() });
    }
    if (selectedSubscription && selectedSubscription !== "All Statuses") {
      params.push({ name: "subscriptionStatus", value: selectedSubscription });
    }
    if (selectedPayment && selectedPayment !== "All Payments") {
      params.push({ name: "paymentStatus", value: selectedPayment });
    }
    
    return params;
  }, [fromDate, toDate, merchantName, location, selectedSubscription, selectedPayment]);

  // Fetch data from API
  const { data: apiResponse, isLoading, isFetching } = useMerchantReportAnalyticsQuery(queryParams);

  // Transform API data for table
  const tableData = useMemo(() => {
    if (!apiResponse?.data?.records) return [];
    
    return apiResponse.data.records.map((record, index) => ({
      key: index,
      sl: index + 1,
      date: record.joiningDate ? dayjs(record.joiningDate).format("YYYY-MM-DD") : "",
      merchantId: record._id || "",
      MerchantName: record.merchantName || "",
      Location: record.location || "",
      SubscriptionStatus: record.subscriptionStatus || "",
      PaymentStatus: record.paymentStatus || "",
      DaysToExpire: record.daysToExpire ?? "",
      Revenue: record.totalRevenue ?? "",
      Users: record.usersCount ?? "",
      "Points Redeemed": record.pointsRedeemed ?? "",
    }));
  }, [apiResponse]);

  // Transform monthly data for chart
  const chartData = useMemo(() => {
    if (!apiResponse?.data?.monthlyData) return [];
    
    return apiResponse.data.monthlyData.map((item) => ({
      date: `${item.monthName} ${item.year}`,
      Revenue: item.totalRevenue || 0,
      Users: item.usersCount || 0,
      "Points Redeemed": item.pointsRedeemed || 0,
    }));
  }, [apiResponse]);

  // Calculate max values for 3D bar effect
  const maxValues = useMemo(() => {
    if (chartData.length === 0) {
      return {
        Revenue: 100,
        Users: 100,
        "Points Redeemed": 100,
      };
    }
    return {
      Revenue: Math.max(...chartData.map((d) => d.Revenue)) || 100,
      Users: Math.max(...chartData.map((d) => d.Users)) || 100,
      "Points Redeemed": Math.max(...chartData.map((d) => d["Points Redeemed"])) || 100,
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
            } ${x + width + depth},${watermarkY + watermarkHeight} ${x + width},${
              watermarkY + watermarkHeight
            }`}
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
      title: "Merchant ID",
      dataIndex: "merchantId",
      key: "merchantId",
      align: "center",
    },
    {
      title: "Merchant Name",
      dataIndex: "MerchantName",
      key: "MerchantName",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location",
      align: "center",
    },
    {
      title: "Subscription Status",
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
    {
      title: "Days to Expire",
      dataIndex: "DaysToExpire",
      key: "DaysToExpire",
      align: "center",
    },
    { title: "Revenue", dataIndex: "Revenue", key: "Revenue", align: "center" },
    { title: "Users", dataIndex: "Users", key: "Users", align: "center" },
    {
      title: "Points Redeemed",
      dataIndex: "Points Redeemed",
      key: "Points Redeemed",
      align: "center",
    },
  ];

  // Handle clear selection
  const handleClearSelection = () => {
    setFromDate(defaultStartDate);
    setToDate(defaultEndDate);
    setMerchantName("");
    setLocation("");
    setSelectedSubscription("All Statuses");
    setSelectedPayment("All Payments");
    setSelectedMetric("all");
    setChartType("Bar");
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
                  onChange={(date) => setFromDate(date)}
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
                  onChange={(date) => setToDate(date)}
                  style={{ width: "100%" }}
                  placeholder="End Date"
                  className="mli-tall-picker"
                />
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item
                label={<span className="mli-custom-label">Merchant Name</span>}
                style={{ marginBottom: "0.5rem" }}
              >
                <Input
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  style={{ width: "100%", height: "40px" }}
                  placeholder="Enter Merchant Name"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item label="Location" style={{ marginBottom: "0.5rem" }}>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: "100%", height: "40px" }}
                  placeholder="Enter Location"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item
                label="Subscription Status"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedSubscription}
                  style={{ width: "100%" }}
                  onChange={setSelectedSubscription}
                  className="mli-tall-select"
                >
                  {subscriptionOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
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
                  onChange={setSelectedPayment}
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
                  onChange={setChartType}
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
                  onChange={setSelectedMetric}
                  className="mli-tall-select"
                >
                  <Option value="all">All Metrics</Option>
                  {metricOptions.map((option) => (
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
                  <Button className="bg-primary px-6 py-[19px] rounded-md text-white hover:text-secondary text-[14px] font-bold">
                    Export Report
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
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
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
                {(selectedMetric === "all" || selectedMetric === "Revenue") && (
                  <Bar
                    dataKey="Revenue"
                    fill="#7086FD"
                    shape={(props) => (
                      <Custom3DBarWithWatermark {...props} dataKey="Revenue" />
                    )}
                  />
                )}
                {(selectedMetric === "all" || selectedMetric === "Users") && (
                  <Bar
                    dataKey="Users"
                    fill="#6FD195"
                    shape={(props) => (
                      <Custom3DBarWithWatermark {...props} dataKey="Users" />
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
                {(selectedMetric === "all" || selectedMetric === "Revenue") && (
                  <Line type="monotone" dataKey="Revenue" stroke="#7086FD" />
                )}
                {(selectedMetric === "all" || selectedMetric === "Users") && (
                  <Line type="monotone" dataKey="Users" stroke="#6FD195" />
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
                {(selectedMetric === "all" || selectedMetric === "Revenue") && (
                  <Area
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#7086FD"
                    fill="#7086FD"
                  />
                )}
                {(selectedMetric === "all" || selectedMetric === "Users") && (
                  <Area
                    type="monotone"
                    dataKey="Users"
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
          <Button className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold">
            Export Report
          </Button>
        </div>
        <Table
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          loading={isLoading || isFetching}
          columns={columns.filter(
            (col) =>
              selectedMetric === "all" || 
              !["Revenue", "Users", "Points Redeemed"].includes(col.dataIndex) ||
              col.dataIndex === selectedMetric
          )}
          dataSource={tableData}
          pagination={{ 
            pageSize: 6,
            total: apiResponse?.pagination?.total || 0,
            showTotal: (total) => `Total ${total} records`
          }}
        />
      </div>
    </div>
  );
}
