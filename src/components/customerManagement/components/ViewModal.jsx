import { Modal, Table } from "antd";
import MarchantIcon from "../../../assets/marchant.png";

const ViewModal = ({ visible, onCancel, selectedRecord, columns2, data }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={false}
      title="Customer Details"
    >
      {selectedRecord && (
        <div>
          <div className="flex flex-row justify-between items-start gap-3 mt-8">
            <img
              src={MarchantIcon}
              alt={selectedRecord.name}
              className="w-214 h-214 rounded-full"
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
                <strong>Points Balance:</strong> {selectedRecord.totalSales}
              </p>
              <p>
                <strong>Tier:</strong> {selectedRecord.tier || "N/A"}
              </p>
              <p>
                <strong>Membership:</strong> {selectedRecord.subscription}
              </p>
              <p>
                <strong>Last Payment Date:</strong>{" "}
                {selectedRecord.lastPaymentDate || "00-00-0000"}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {selectedRecord.expiryDate || "00-00-0000"}
              </p>
            </div>
          </div>
          <Table
            columns={columns2}
            dataSource={[]}
            rowKey="orderId"
            pagination={{ pageSize: 5 }}
            className="mt-6"
          />
        </div>
      )}
    </Modal>
  );
};

export default ViewModal;
