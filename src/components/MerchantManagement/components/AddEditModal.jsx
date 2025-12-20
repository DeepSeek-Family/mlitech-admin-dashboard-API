import { DatePicker, Form, Input, Modal, Select } from "antd";
import { useGetPackagesQuery } from "../../../redux/apiSlices/packageSlice";
import { useGetTierQuery } from "../../../redux/apiSlices/PointTierSlice";

const AddEditModal = ({
  visible,
  selectedRecord,
  form,
  handleAddMerchant,
  handleUpdateMerchant,
  setIsAddModalVisible,
  setIsEditModalVisible,
}) => {
  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };
const {data:subscribers} =useGetPackagesQuery();
const packages = subscribers?.data || [];
const  {data:tier}=useGetTierQuery()
const tiersList = tier?.data || [];
console.log("tierList", tiersList);



  return (
    <Modal
      open={visible}
      title={selectedRecord ? "Edit Merchant" : "Add New Merchant"}
      onCancel={handleCancel}
      onOk={selectedRecord ? handleUpdateMerchant : handleAddMerchant}
      okText={selectedRecord ? "Update Merchant" : "Add Merchant"}
      destroyOnClose
      width={800}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-4">
            <Form.Item
              name="salesRep"
              label="Sales Rep"
              rules={[{ required: true, message: "Please enter Sales Rep" }]}
            >
              <Input
                placeholder="Enter sales rep name"
                className="mli-tall-input"
              />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter First Name" },
              ]}
            >
              <Input
                placeholder="Enter First Name"
                className="mli-tall-input"
              />
            </Form.Item>

            <Form.Item
              name="businessName"
              label="Business Name"
              rules={[
                { required: true, message: "Please enter Business Name" },
              ]}
            >
              <Input
                placeholder="Enter business name"
                className="mli-tall-input"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter email address" },
              ]}
            >
              <Input
                placeholder="Enter email address"
                className="mli-tall-input"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input
                placeholder="Enter phone number"
                className="mli-tall-input"
              />
            </Form.Item>
          </div>

          <div className="flex flex-col gap-4">
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please select city" }]}
            >
              <Select placeholder="Select city" className="mli-tall-select">
                <Select.Option value="Dhaka">Dhaka</Select.Option>
                <Select.Option value="Chittagong">Chittagong</Select.Option>
                <Select.Option value="Sylhet">Sylhet</Select.Option>
                <Select.Option value="Khulna">Khulna</Select.Option>
                <Select.Option value="Rajshahi">Rajshahi</Select.Option>
                <Select.Option value="Barisal">Barisal</Select.Option>
                <Select.Option value="Rangpur">Rangpur</Select.Option>
                <Select.Option value="Mymensingh">Mymensingh</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="subscription"
              label="Subscription"
              rules={[
                { required: true, message: "Please select subscription" },
              ]}
            >
              <Select
                placeholder="Select subscription"
                className="mli-tall-select"
              >
                {packages.map((pkg) => (
                  <Select.Option key={pkg._id} value={pkg.title}>
                    {pkg.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="lastPaymentDate"
              label="Last Payment Date"
              rules={[
                { required: true, message: "Please select last payment date" },
              ]}
            >
              <DatePicker
                placeholder="Select last payment date"
                style={{ width: "100%" }}
                className="mli-tall-picker"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[{ required: true, message: "Please select expiry date" }]}
            >
              <DatePicker
                placeholder="Select expiry date"
                style={{ width: "100%" }}
                className="mli-tall-picker"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              name="tier"
              label="Tier"
              rules={[{ required: true, message: "Please select tier" }]}
            >
              <Select placeholder="Select tier" className="mli-tall-select">
                {tiersList.map((tier) => (
                  <Select.Option key={tier._id} value={tier.title}>
                    {tier.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: !selectedRecord, message: "Please enter password" }]}
            >
              <Input.Password
                placeholder="Enter password"
                className="mli-tall-input"
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
