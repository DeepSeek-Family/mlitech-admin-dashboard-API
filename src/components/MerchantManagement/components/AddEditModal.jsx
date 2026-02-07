import { DatePicker, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { useGetPackagesQuery } from "../../../redux/apiSlices/packageSlice";
import { useGetTierQuery } from "../../../redux/apiSlices/PointTierSlice";

const { Option } = Select;

const AddEditModal = ({
  visible,
  selectedRecord,
  form,
  handleAddMerchant,
  handleUpdateMerchant,
  setIsAddModalVisible,
  setIsEditModalVisible,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");

  // Update selectedCountry when visible or selectedRecord changes
  React.useEffect(() => {
    if (visible && selectedRecord?.raw?.country) {
      setSelectedCountry(selectedRecord.raw.country);
    } else if (!visible) {
      setSelectedCountry("");
    }
  }, [visible, selectedRecord]);

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };
  const { data: subscribers } = useGetPackagesQuery();
  const packages = subscribers?.data || [];
  const { data: tier } = useGetTierQuery();
  const tiersList = tier?.data || [];
  console.log("tierList", tiersList);

  const countryCityData = {
    Pakistan: [
      "Islamabad",
      "Rawalpindi",
      "Karachi",
      "Lahore",
      "Peshawar",
      "Quetta",
    ],
    "United Arab Emirates": [
      "Abu Dhabi",
      "Dubai",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "Fujairah",
      "Umm Al Quwain",
    ],
    Oman: ["Muscat"],
    Qatar: ["Doha"],
    Kuwait: ["Kuwait City"],
    Bahrain: ["Manama"],
    "Saudi Arabia": ["Jeddah", "Riyadh"],
    Bangladesh: ["Dhaka"],
    "United Kingdom": [
      "London",
      "Manchester",
      "Birmingham",
      "Glasgow",
      "Liverpool",
    ],
  };

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
              rules={[{ required: true, message: "Please enter First Name" }]}
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
                {
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                placeholder="Enter email address"
                className="mli-tall-input"
                type="email"
              />
            </Form.Item>
          </div>

          <div className="flex flex-col gap-4">
            {selectedRecord && (
              <Form.Item name="merchantId" label="Merchant ID">
                <Input
                  placeholder="Merchant ID"
                  className="mli-tall-input"
                  disabled
                />
              </Form.Item>
            )}
            {/* Country */}
            <Form.Item
              name="country"
              label="Country"
              rules={[
                { required: true, message: "Please select your country" },
              ]}
            >
              <Select
                placeholder="Select your country"
                showSearch
                optionFilterProp="children"
                className="mli-tall-select"
                onChange={(value) => {
                  setSelectedCountry(value);
                  form.setFieldValue("city", undefined);
                }}
              >
                {Object.keys(countryCityData).map((country) => (
                  <Option key={country} value={country}>
                    {country}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* City */}
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please select your City" }]}
            >
              <Select
                placeholder="Select your city"
                showSearch
                optionFilterProp="children"
                className="mli-tall-select"
                disabled={!selectedCountry}
              >
                {selectedCountry &&
                  countryCityData[selectedCountry] &&
                  countryCityData[selectedCountry].map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            {/* <Form.Item
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
                {packages && packages.length > 0
                  ? packages.map((pkg) => (
                      <Select.Option key={pkg._id} value={pkg.title}>
                        {pkg.title}
                      </Select.Option>
                    ))
                  : null}
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
                disabled={!!selectedRecord}
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
                disabled={!!selectedRecord}
              />
            </Form.Item> */}

            {/* <Form.Item
              name="tier"
              label="Tier"
              // rules={[{ required: true, message: "Please select tier" }]}
            >
              <Select
                placeholder="Select tier"
                className="mli-tall-select"
                disabled
              >
                {tiersList && tiersList.length > 0
                  ? tiersList.map((tier) => (
                      <Select.Option key={tier._id} value={tier.title}>
                        {tier.name}
                      </Select.Option>
                    ))
                  : null}
              </Select>
            </Form.Item> */}

            {!selectedRecord && (
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new Password!",
                  },
                  {
                    validator(_, value) {
                      if (!value) return Promise.resolve();

                      const hasUpperCase = /[A-Z]/.test(value);
                      const hasLowerCase = /[a-z]/.test(value);
                      const hasNumber = /\d/.test(value);
                      const hasSpecialChar =
                        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

                      if (
                        hasUpperCase &&
                        hasLowerCase &&
                        hasNumber &&
                        hasSpecialChar
                      ) {
                        return Promise.resolve();
                      }

                      const missing = [];
                      if (!hasUpperCase) missing.push("uppercase letter");
                      if (!hasLowerCase) missing.push("lowercase letter");
                      if (!hasNumber) missing.push("number");
                      if (!hasSpecialChar) missing.push("special character");

                      return Promise.reject(
                        new Error(
                          `Password must contain at least one ${missing.join(
                            ", one ",
                          )}`,
                        ),
                      );
                    },
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter password"
                  className="mli-tall-input"
                />
              </Form.Item>
            )}

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter phone number" },
                {
                  pattern:
                    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: "Please enter a valid phone number",
                },
              ]}
            >
              <Input
                placeholder="e.g. +1-234-567-8900"
                className="mli-tall-input"
                type="tel"
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
