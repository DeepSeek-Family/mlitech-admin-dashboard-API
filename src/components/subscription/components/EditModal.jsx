import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import FeaturedInput from "../../common/PackageFeatureInput";

const EditModal = ({
  isOpen,
  isEditing,
  currentPackage,
  onCancel,
  onSubmit,
  isLoading = false,
}) => {
  const [form] = Form.useForm();

  // Set form values when modal opens or package changes
  React.useEffect(() => {
    if (isOpen && currentPackage) {
      form.setFieldsValue({
        title: currentPackage.title,
        description: currentPackage.description,
        price: Number(currentPackage.price),
        duration: currentPackage.duration,
        credit: currentPackage.credit || 0,
        paymentType: currentPackage.paymentType || "Monthly",
        loginLimit: currentPackage.loginLimit || 1,
        features: currentPackage.features || [],
        popular: currentPackage.popular || false,
      });
    } else if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, currentPackage, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    // Send the selected duration value directly as paymentType
    const updatedValues = {
      ...values,
      paymentType: values.duration,
    };

    onSubmit(updatedValues);
  };

  return (
    <Modal
      title={isEditing ? "Edit Package" : "Add Package"}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      className="rounded-lg"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Item
          name="title"
          label="Package Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="e.g. Basic Plan" className="mli-tall-input" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Short description of what this package offers"
            className="mli-tall-input"
          />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Price is required" },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null || value === "") {
                    return Promise.resolve();
                  }
                  if (isNaN(value) || Number(value) < 0) {
                    return Promise.reject(
                      new Error("Price cannot be negative")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            className="w-1/2"
          >
            <Input
              type="number"
              prefix=""
              placeholder="29.99"
              className="mli-tall-input"
              min="0"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Duration is required" }]}
            className="w-1/2"
          >
            <Select placeholder="Select duration" className="mli-tall-select">
              <Select.Option value="1 month">1 Month</Select.Option>
              {/* <Select.Option value="3 months">3 Months</Select.Option> */}
              <Select.Option value="4 months">4 Months</Select.Option>
              {/* <Select.Option value="6 months">6 Months</Select.Option> */}
              <Select.Option value="8 months">8 Months</Select.Option>
              <Select.Option value="1 year">1 Year</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* <div className="flex gap-4">
          <Form.Item
            name="credit"
            label="Credit"
            rules={[{ required: true, message: "Credit is required" }]}
            className="w-1/3"
          >
            <Input
              type="number"
              placeholder="100"
              className="mli-tall-input"
            />
          </Form.Item>

          <Form.Item
            name="paymentType"
            label="Payment Type"
            rules={[{ required: true, message: "Payment type is required" }]}
            className="w-1/3"
          >
            <Select placeholder="Select type" className="mli-tall-select">
              <Select.Option value="Monthly">Monthly</Select.Option>
              <Select.Option value="Yearly">Yearly</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="loginLimit"
            label="Login Limit"
            rules={[{ required: true, message: "Login limit is required" }]}
            className="w-1/3"
          >
            <Input
              type="number"
              placeholder="5"
              className="mli-tall-input"
            />
          </Form.Item>
        </div> */}

        <Form.Item
          name="features"
          label="Features"
          rules={[
            { required: true, message: "At least one feature is required" },
          ]}
        >
          <FeaturedInput />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleCancel}
            size="large"
            disabled={isLoading}
            className="border border-primary hover:!border-primary hover:!text-primary"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            className="bg-primary text-white rounded-lg hover:bg-[#012F60] transition-all h-auto py-2 px-6"
            size="large"
          >
            {isLoading
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
              ? "Update Package"
              : "Add Package"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditModal;
