import { useState } from "react";
import { Modal, Form, Button, Select, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Option } = Select;

// Customer Segment Select Component
const CustomerSegmentSelect = () => {
  return (
    <Form.Item
      name="segment"
      label="All customers (that have transacted with this merchant)"
      rules={[{ required: true, message: "Please select a segment" }]}
    >
      <Select placeholder="Choose segment" className="mli-tall-select">
        <Option value="New Customers">New Customers</Option>
        <Option value="Returning Customers">Returning Customers</Option>
        <Option value="VIP Customers">VIP Customers</Option>
      </Select>
    </Form.Item>
  );
};

// Points Input Component
const PointsInput = () => {
  return (
    <Form.Item
      name="title"
      label="All customers that have at least x number of points"
      rules={[{ required: true, message: "Please enter a number" }]}
    >
      <Input placeholder="" className="mli-tall-input" />
    </Form.Item>
  );
};

// Radius Input Component
const RadiusInput = () => {
  return (
    <Form.Item
      name="message"
      label="Customers located within x km of radius from the merchant location"
      rules={[{ required: true, message: "Please enter distance/KM" }]}
    >
      <Input placeholder="" className="mli-tall-input" />
    </Form.Item>
  );
};

// Promotion Message Component
const PromotionMessage = () => {
  return (
    <Form.Item
      name="additionalInfo"
      label="Promotion/discount message"
      rules={[{ required: false }]}
    >
      <Input.TextArea
        placeholder="Enter additional information here"
        autoSize={{ minRows: 3, maxRows: 6 }}
        className="mli-tall-input"
      />
    </Form.Item>
  );
};

// Image Upload Component
const ImageUpload = ({ uploadedImage, onUploadChange, onRemove }) => {
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Form.Item name="image" label="Upload Image (JPG/PNG only)">
      <Upload
        listType="picture"
        fileList={uploadedImage}
        beforeUpload={beforeUpload}
        onChange={onUploadChange}
        onRemove={onRemove}
        maxCount={1}
        accept=".jpg,.jpeg,.png"
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <p className="text-sm text-gray-500 mt-1">
        Allowed file types: JPG, PNG. Maximum file size: 2MB.
      </p>
    </Form.Item>
  );
};

// Main Notifications Modal Component
const NotificationsModal = ({ visible, onCancel }) => {
  const [uploadedImage, setUploadedImage] = useState([]);
  const [form] = Form.useForm();

  const handleSendNotification = (values) => {
    onCancel();
    Swal.fire({
      icon: "success",
      title: "Notification Sent!",
      text: `Message has been sent to ${values.segment}.`,
      timer: 1500,
      showConfirmButton: false,
    });
    setUploadedImage([]);
    form.resetFields();
  };

  const handleCancel = () => {
    setUploadedImage([]);
    form.resetFields();
    onCancel();
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadedImage(fileList);
  };

  return (
    <Modal
      title="Send Notification"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      closable={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSendNotification}
        className="flex flex-col gap-4"
      >
        <CustomerSegmentSelect />

        <PointsInput />

        <RadiusInput />

        <PromotionMessage />

        <ImageUpload
          uploadedImage={uploadedImage}
          onUploadChange={handleUploadChange}
          onRemove={(file) =>
            setUploadedImage((prev) => prev.filter((f) => f.uid !== file.uid))
          }
        />

        <div className="flex gap-2 mt-4">
          <Button type="default" className="flex-1" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="flex-1">
            Send
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NotificationsModal;
