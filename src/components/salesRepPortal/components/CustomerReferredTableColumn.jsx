import { Tooltip } from "antd";
import ReusableTable from "../../common/CustomTable";
import { useUser } from "../../../provider/User";

const CustomerReferredTableColumn = ({
  data,
  isLoading,
  isFetching,
  pagination,
  onPaginationChange,
  onAcknowledge,
  onToggleStatus,
  onGenerateToken,
  userRole,
}) => {
  const { user } = useUser();
  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Sales Rep Name",
      dataIndex: "salesRepName",
      key: "salesRepName",
      align: "center",
    },
    {
      title: "Referral ID",
      dataIndex: "salesRepReferralId",
      key: "salesRepReferralId",
      align: "center",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
    },
    {
      title: "Account Status",
      dataIndex: "actionStatus",
      key: "actionStatus",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Tooltip
            title={
              record.acknowledgeDate
                ? `Acknowledged on ${record.acknowledgeDate}`
                : "Acknowledge cash payment"
            }
          >
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={() => onAcknowledge(record)}
              disabled={record.statusProgress > 0}
            >
              {record.acknowledgeDate
                ? `Acknowledged (${record.acknowledgeDate})`
                : "Acknowledge"}
            </button>
          </Tooltip>

          <Tooltip
            title={
              record.subscriptionStatusChangedDate
                ? `${
                    record.status === "active" ? "Activated" : "Deactivated"
                  } on ${record.subscriptionStatusChangedDate}`
                : `${
                    record.status === "active" ? "Deactivate" : "Activate"
                  } user account`
            }
          >
            <button
              className={`px-3 py-1 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed ${
                record.status === "active"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={() => onToggleStatus(record)}
              disabled={record.statusProgress < 1}
            >
              {record.status === "active" ? "Deactivate" : "Activate"}
              {record.subscriptionStatusChangedDate &&
                ` (${record.subscriptionStatusChangedDate})`}
            </button>
          </Tooltip>

          <Tooltip
            title={
              record.generatedToken
                ? `Token generated on ${record.tokenGeneratedDate}`
                : "Generate cash payment token"
            }
          >
            <button
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={() => onGenerateToken(record)}
              disabled={record.status !== "active" || record.generatedToken}
              style={{
                display:
                  userRole === "ADMIN" || userRole === "SUPER_ADMIN"
                    ? "block"
                    : "none",
              }}
            >
              {record.generatedToken
                ? `Token Generated (${record.tokenGeneratedDate})`
                : "Cash Received"}
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ReusableTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowKey="id"
    />
  );
};

export default CustomerReferredTableColumn;
