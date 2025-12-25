import { Tooltip } from "antd";
import ReusableTable from "../../common/CustomTable";

const CustomerReferredTableColumn = ({
  data,
  isLoading,
  isFetching,
  pagination,
  onPaginationChange,
  onAcknowledge,
  onToggleStatus,
  onGenerateToken,
}) => {
  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    // {
    //   title: "Sales Rep",
    //   dataIndex: "salesRep",
    //   key: "salesRep",
    //   align: "center",
    // },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
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

          {/* <Tooltip
            title={
              record.activateDate
                ? `${
                    record.status === "active" ? "Activated" : "Deactivated"
                  } on ${record.activateDate}`
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
              {record.activateDate && ` (${record.activateDate})`}
            </button>
          </Tooltip> */}

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
              disabled={record.statusProgress < 1}
            >
              {record.generatedToken
                ? `Token Generated (${record.tokenGeneratedDate})`
                : "Generate Token"}
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
