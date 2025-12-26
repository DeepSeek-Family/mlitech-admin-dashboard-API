import React from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const AddNewUserModal = ({
  visible,
  onCancel,
  onSubmit,
  editingUser = null,
  roles = [],
  roleMapping = {},
}) => {
  const [form] = Form.useForm();

  // Update form when editingUser changes
  React.useEffect(() => {
    if (editingUser) {
      form.setFieldsValue(editingUser);
    } else {
      form.resetFields();
    }
  }, [editingUser, form, visible]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingUser ? "Edit User" : "Add New User"}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={editingUser ? "Update User" : "Add User"}
      width={600}
    >
      <Form form={form} layout="vertical" className="flex flex-col gap-4 mb-6">
        <Form.Item
          name="firstName"
          label="User Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: !editingUser,
              message: "Please enter password",
            },
          ]}
        >
          <Input.Password className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role" className="mli-tall-select">
            {roles.map((role) => (
              <Option key={role} value={role}>
                {roleMapping[role] || role}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewUserModal;
