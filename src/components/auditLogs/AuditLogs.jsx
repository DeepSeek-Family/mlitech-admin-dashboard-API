import { useState, useMemo, useEffect } from "react";
import { Table, Modal, Tooltip, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import MarchantIcon from "../../assets/exclemetion.png";
import { useGetAuditLogsQuery } from "../../redux/apiSlices/auditLogSlice";
import { toReadableTime } from "../common/TimeConvertion";

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

const AuditLogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const navigate = useNavigate();

  // Get pagination from URL or use defaults
  const page = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("limit")) || 10;

  // Fetch audit logs from API
  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetAuditLogsQuery({
    page,
    limit: pageSize,
  });

  // Transform API data to table format
  const tableData = useMemo(() => {
    if (!apiData?.data?.data) return [];

    return apiData.data.data.map((item, index) => ({
      id: index + 1 + (page - 1) * pageSize,
      recordId: item._id,
      timeStamp: toReadableTime(item.createdAt),
      actionType: item.actionType,
      user: item.email || "N/A",
      details: item.details,
    }));
  }, [apiData, page, pageSize]);

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Timestamp",
      dataIndex: "timeStamp",
      key: "timeStamp",
      align: "center",
    },
    {
      title: "Action Type",
      dataIndex: "actionType",
      key: "actionType",
      align: "center",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      align: "center",
    },
    { title: "Details", dataIndex: "details", key: "details", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="">
          <Tooltip title="View Details">
            <button
              onClick={() => showViewModal(record)}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              View Details
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <h1 className="text-[24px] font-bold">Audit Logs</h1>
          <p className="text-[16px] font-normal mt-2">
            Track and review all actions with detailed audit logs.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Spin spinning={isLoading || isFetching}>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: apiData?.data?.meta?.total || 0,
              showTotal: (total) => `Total ${total} items`,
              showSizeChanger: true,
              onChange: (newPage, newPageSize) => {
                setSearchParams({ page: newPage, limit: newPageSize });
              },
            }}
            bordered={false}
            size="small"
            rowClassName="custom-row"
            components={components}
            className="custom-table"
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </div>

      {/* View Details Modal */}
      <Modal
        // title="Merchant Profile"
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={400}
        footer={
          [
            // <Button key="close" type="primary" onClick={handleCloseViewModal}>
            //   Close
            // </Button>,
          ]
        }
      >
        {selectedRecord && (
          <div className="flex flex-col items-center justify-between gap-3 mt-8 mb-8">
            <h1 className="text-[26px] font-bold text-primary mb-2">
              Log Details
            </h1>
            <img
              src={MarchantIcon}
              alt={selectedRecord.name}
              className="w-50 h-50 rounded-full"
            />
            <div className="flex flex-col gap-2 w-full p-4">
              <p className="text-[20px] font-bold text-secondary">
                Log Details
              </p>
              <p>
                <strong>Timestamp:</strong> {selectedRecord.timeStamp}
              </p>
              <p>
                <strong>Action:</strong> {selectedRecord.actionType}
              </p>
              <p>
                <strong>User:</strong> {selectedRecord.user}
              </p>
              <p>
                <strong>Details:</strong> {selectedRecord.details}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogs;
