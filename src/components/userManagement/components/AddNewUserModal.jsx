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
          rules={[
            { required: true, message: "Please enter email" },
            {
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input className="mli-tall-input" type="email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input className="mli-tall-input" type="tel" />
        </Form.Item>
        {!editingUser && (
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
            <Input.Password className="mli-tall-input" />
          </Form.Item>
        )}
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
