import { Modal, Table } from "antd";
import MarchantIcon from "../../../assets/image-fallback.jpg";
import moment from "moment/moment";
import { getImageUrl } from "../../common/imageUrl";

const ViewModal = ({ visible, onCancel, selectedRecord, columns2, data }) => {
  const subscriptionData =
    selectedRecord?.subscriptionData ?? selectedRecord?.raw?.subscriptionData;
  const sellsData = selectedRecord?.raw?.sells || selectedRecord?.sells || [];

  const sellsColumns = [
    // {
    //   title: "SL",
    //   dataIndex: "sl",
    //   key: "sl",
    //   align: "center",
    // },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (value) => (value ? moment(value).format("lll") : "N/A"),
    },
    {
      title: "Merchant",
      dataIndex: ["merchant", "businessName"],
      key: "merchantName",
      align: "center",
      render: (_, record) => record?.merchant?.businessName || "N/A",
    },
    {
      title: "Total Bill",
      dataIndex: "totalBill",
      key: "totalBill",
      align: "center",
    },
    {
      title: "Discounted Bill",
      dataIndex: "discountedBill",
      key: "discountedBill",
      align: "center",
    },
    {
      title: "Points Earned",
      dataIndex: "pointsEarned",
      key: "pointsEarned",
      align: "center",
    },
    {
      title: "Points Redeemed",
      dataIndex: "pointRedeemed",
      key: "pointRedeemed",
      align: "center",
    },
    {
      title: "Final Points",
      dataIndex: "finalPoints",
      key: "finalPoints",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value) =>
        value ? value.charAt(0).toUpperCase() + value.slice(1) : "N/A",
    },
  ];

  const sellsTableData = sellsData.map((sell, index) => ({
    ...sell,
    sl: index + 1,
  }));

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width={1200}
      footer={false}
      title="Customer Details"
    >
      {selectedRecord && (
        <div>
          <div className="flex flex-row justify-between items-start gap-3 mt-8">
            <img
              src={getImageUrl(selectedRecord?.image)}
              alt={selectedRecord.name}
              style={{
                width: "168px",
                height: "168px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                display: "block",
              }}
            />
            <div className="flex flex-col gap-2 border border-primary rounded-md p-4 w-full">
              <p className="text-[22px] font-bold text-primary">
                Customer Profile
              </p>

              {/* Displaying the customer details */}
              <p>
                <strong>Customer Name:</strong> {selectedRecord.customerName}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedRecord.phone}
              </p>
              <p>
                <strong>Email Address:</strong> {selectedRecord.email}
              </p>
              <p>
                <strong>Address:</strong> {selectedRecord.location}
              </p>

              {/* Adding the new fields */}
              <p className="text-[22px] font-bold text-primary mt-4">
                Loyalty Points
              </p>
              <p>
                <strong>Points Balance:</strong> {selectedRecord.pointsBalance}
              </p>
              {/* <p>
                <strong>Tier:</strong> {selectedRecord.tier || "N/A"}
              </p> */}
              <p>
                <strong>Membership:</strong>{" "}
                <span
                  style={{
                    color:
                      selectedRecord.subscription === "active"
                        ? "#52c41a"
                        : "#ff4d4f",
                    fontWeight: "bold",
                  }}
                >
                  {selectedRecord.subscription === "active"
                    ? "Active"
                    : "Inactive"}
                </span>
              </p>
              <p>
                <strong>Last Payment Date:</strong>{" "}
                {subscriptionData?.currentPeriodStart
                  ? moment(subscriptionData.currentPeriodStart).format("l")
                  : "N/A"}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {subscriptionData?.currentPeriodEnd
                  ? moment(subscriptionData.currentPeriodEnd).format("l")
                  : "N/A"}
              </p>
            </div>
          </div>
          <Table
            columns={sellsColumns}
            dataSource={sellsTableData}
            rowKey={(record) => record.sellId}
            pagination={{ pageSize: 5 }}
            className="mt-6"
          />
        </div>
      )}
    </Modal>
  );
};

export default ViewModal;
