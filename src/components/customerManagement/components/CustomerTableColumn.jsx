import { Tooltip } from "antd";
import { FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { Switch } from "antd";
import Swal from "sweetalert2";
import ReusableTable from "../../common/CustomTable";

const CustomerTableColumn = ({
  data,
  isLoading,
  isFetching,
  pagination,
  onPaginationChange,
  onView,
  onDelete,
  onStatusChange,
}) => {
  const baseColumns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
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
      title: "Membership",
      dataIndex: "subscription",
      key: "subscription",
      align: "center",
      render: (subscription) => (
        <span
          className={
            subscription === "Active" || subscription
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {subscription === "Active" || subscription ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Tier",
      dataIndex: "tier",
      key: "tier",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    {
      title: "Referd Rep",
      dataIndex: "refdRep",
      key: "refdRep",
      align: "center",
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      align: "center",
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 140,
      render: (_, record) => (
        <div
          className="flex gap-2 justify-between align-middle py-[7px] px-[15px] border border-primary rounded-md"
          style={{ alignItems: "center" }}
        >
          <Tooltip title="View Details">
            <button
              onClick={() => onView(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <IoEyeSharp />
            </button>
          </Tooltip>

          {/* <Tooltip title="Edit">
            <button
              onClick={() => onEdit(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <FaEdit />
            </button>
          </Tooltip> */}

          <Tooltip title="Delete">
            <button
              onClick={() => onDelete(record.recordId || record.id)}
              className="text-red-500 hover:text-red-700 text-md"
            >
              <FaTrash />
            </button>
          </Tooltip>

          <Switch
            size="small"
            checked={record.status === "Active"}
            style={{
              backgroundColor: record.status === "Active" ? "#3fae6a" : "gray",
            }}
            onChange={(checked) => {
              Swal.fire({
                title: "Are you sure?",
                text: `You are about to change status to ${
                  checked ? "Active" : "Inactive"
                }.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, change it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  onStatusChange(
                    record.recordId,
                    checked ? "Active" : "Inactive",
                  );
                }
              });
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <ReusableTable
      data={data}
      columns={baseColumns}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowKey="key"
    />
  );
};

export default CustomerTableColumn;
