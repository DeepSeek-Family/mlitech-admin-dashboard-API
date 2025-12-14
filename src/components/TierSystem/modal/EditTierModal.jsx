import { Modal, Form, Input, Button } from "antd";

const EditTierModal = ({
  visible,
  isAddMode,
  editingTier,
  form,
  isAdding,
  isUpdating,
  onCancel,
  onSave,
}) => {
  return (
    <Modal
      title={
        isAddMode ? "Add New Tier" : `Set Rules - ${editingTier?.name || ""}`
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "",
          threshold: 0,
          reward: "",
          lockoutDuration: 0,
          pointsSystemLockoutDuration: 0,
          minSpend: 0,
        }}
        onFinish={onSave}
        className="flex flex-col gap-4"
      >
        <Form.Item
          label="Tier Name"
          name="name"
          rules={[{ required: true, message: "Please enter tier name" }]}
        >
          <Input type="text" className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          label="Points Threshold"
          name="threshold"
          rules={[{ required: true, message: "Please enter threshold" }]}
        >
          <Input type="number" className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          label="Reward"
          name="reward"
          rules={[{ required: true, message: "Please enter reward" }]}
        >
          <Input className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          label="Point accumulation rule"
          name="lockoutDuration"
          rules={[{ required: true, message: "Please enter rule" }]}
        >
          <Input type="number" className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          label="Point redemption rule"
          name="pointsSystemLockoutDuration"
          rules={[
            { required: true, message: "Please enter redemption rule" },
            {
              pattern: /^[1-9]\d*$/,
              message: "Redemption rule must be a number greater than 0",
            },
          ]}
        >
          <Input type="number" min="1" className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          label="Min Total Spend ($)"
          name="minSpend"
          rules={[{ required: true, message: "Please enter min spend" }]}
        >
          <Input type="number" className="mli-tall-input" />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onCancel}
            className="border border-primary"
            disabled={isAdding || isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-primary text-white hover:text-secondary font-bold"
            loading={isAdding || isUpdating}
            disabled={isAdding || isUpdating}
          >
            {isAdding || isUpdating
              ? "Saving..."
              : isAddMode
              ? "Add Tier"
              : "Save Changes"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditTierModal;
