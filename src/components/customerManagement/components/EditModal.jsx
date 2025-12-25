import { DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";

const EditModal = ({
  visible,
  title,
  onCancel,
  onSubmit,
  form,
  selectedRecord,
  fields,
  loading = false,
}) => {
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      confirmLoading={loading}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" className="flex flex-col gap-4 mb-6">
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules || []}
          >
            {field.type === "date" ? (
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                className="mli-tall-picker"
              />
            ) : (
              <Input className="mli-tall-input" placeholder={field.placeholder} />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditModal;
