import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Button, Input, message, Select } from "antd";
import { Row, Col } from "antd";
import { useCreatePushNotificationMutation } from "../../redux/apiSlices/pushNotification";

const { Option } = Select;

const PushNotifications = () => {
  const editor = useRef(null);

  // States
  const [title, setTitle] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [sendTo, setSendTo] = useState("ALL"); // Default to ALL
  const [location, setLocation] = useState("Chittagong"); // Default value
  const [tier, setTier] = useState("PLATINUM"); // Default value
  const [subscriptionType, setSubscriptionType] = useState("ACTIVE"); // Default value
  const [status, setStatus] = useState("ACTIVE"); // Default value
  const [createPushNotification, { isLoading }] = useCreatePushNotificationMutation();

  const handleSend = async () => {
    if (!title.trim() || !bodyContent.trim()) {
      message.error("Please fill in both title and body before sending.");
      return;
    }

    try {
      let payload;
      
      if (sendTo === "ALL") {
        payload = {
          sendType: "ALL",
          title: title,
          body: bodyContent,
        };
      } else {
        payload = {
          sendType: "SPECIFIC",
          title: title,
          body: bodyContent,
          location: location,
          tier: tier,
          subscriptionType: subscriptionType,
          status: status,
        };
      }

      await createPushNotification(payload).unwrap();
      message.success("Push Notification sent successfully!");
      
      // Reset fields after sending
      setTitle("");
      setBodyContent("");
      setSendTo("ALL");
      setLocation("Chittagong");
      setTier("PLATINUM");
      setSubscriptionType("ACTIVE");
      setStatus("ACTIVE");
    } catch (error) {
      message.error("Failed to send push notification. Please try again.");
      console.error("Error sending notification:", error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setBodyContent("");
    setSendTo("ALL");
    setLocation("Chittagong");
    setTier("PLATINUM");
    setSubscriptionType("ACTIVE");
    setStatus("ACTIVE");
    message.info("Notification draft cleared.");
  };

  // Check if fields should be disabled
  const isFieldsDisabled = sendTo === "ALL";

  return (
    <div className="border rounded-lg px-12 py-8 bg-white">
      <div className="flex justify-between items-center mb-[40px]">
        <h2 className="text-xl font-bold">Send Push Notifications</h2>
      </div>

      <div className="mb-4">
        {/* Use Row with flexbox to display the dropdowns inline */}
        <Row gutter={[16, 16]} justify="start" style={{ flexWrap: "wrap" }}>
          {/* Send To Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Send To</label>
              <Select
                placeholder="Select Recipients"
                value={sendTo}
                onChange={(value) => setSendTo(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
              >
                <Option value="ALL">All</Option>
                <Option value="SPECIFIC">Specific Users</Option>
              </Select>
            </div>
          </Col>

          {/* Location Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Location</label>
              <Select
                placeholder="Select Location"
                value={location}
                onChange={(value) => setLocation(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
                disabled={isFieldsDisabled}
              >
                <Option value="Chittagong">Chittagong</Option>
                <Option value="Dhaka">Dhaka</Option>
                <Option value="Sylhet">Sylhet</Option>
                <Option value="Khulna">Khulna</Option>
              </Select>
            </div>
          </Col>

          {/* Tier Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Tier</label>
              <Select
                placeholder="Select Tier"
                value={tier}
                onChange={(value) => setTier(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
                disabled={isFieldsDisabled}
              >
                <Option value="PLATINUM">Platinum</Option>
                <Option value="GOLD">Gold</Option>
                <Option value="SILVER">Silver</Option>
              </Select>
            </div>
          </Col>

          {/* Subscription Type Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">
                Subscription Type
              </label>
              <Select
                placeholder="Select Subscription Type"
                value={subscriptionType}
                onChange={(value) => setSubscriptionType(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
                disabled={isFieldsDisabled}
              >
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </div>
          </Col>

          {/* Status Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Status</label>
              <Select
                placeholder="Select Status"
                value={status}
                onChange={(value) => setStatus(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
                disabled={isFieldsDisabled}
              >
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>

      {/* Title Field */}
      <div className="mb-6 flex flex-col">
        <label className="font-bold text-[18px] mb-1 mt-2">Title</label>
        <Input
          placeholder="Enter notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mli-tall-input"
        />
      </div>

      {/* Body Editor */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="font-bold text-[18px] mb-1">Body</label>
        <JoditEditor
          ref={editor}
          value={bodyContent}
          onChange={(newContent) => setBodyContent(newContent)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={handleCancel} className="px-12 py-5" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          className="bg-primary text-white px-12 py-5"
          loading={isLoading}
        >
          Send
        </Button>
      </div>

      {/* Preview */}
      {(title || bodyContent || sendTo !== "ALL") && (
        <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          {sendTo && (
            <p className="text-md font-medium mb-2">
              <strong>Send To:</strong> {sendTo}
            </p>
          )}
          {sendTo === "SPECIFIC" && (
            <>
              {location && (
                <p className="text-md font-medium mb-2">
                  <strong>Location:</strong> {location}
                </p>
              )}
              {tier && (
                <p className="text-md font-medium mb-2">
                  <strong>Tier:</strong> {tier}
                </p>
              )}
              {subscriptionType && (
                <p className="text-md font-medium mb-2">
                  <strong>Subscription Type:</strong> {subscriptionType}
                </p>
              )}
              {status && (
                <p className="text-md font-medium mb-2">
                  <strong>Status:</strong> {status}
                </p>
              )}
            </>
          )}
          {title && <h4 className="text-md font-bold mb-2">{title}</h4>}
          {bodyContent && (
            <div
              dangerouslySetInnerHTML={{ __html: bodyContent }}
              className="prose max-w-none"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PushNotifications;