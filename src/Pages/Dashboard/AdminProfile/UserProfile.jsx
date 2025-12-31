import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  notification,
  Upload,
  Avatar,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/authSlice";
import { getImageUrl } from "../../../components/common/imageUrl";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [phoneValue, setPhoneValue] = useState("");

  // Fetch profile data using RTK Query
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch,
  } = useProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    // Set initial values from fetched profile data
    if (profile) {
      form.setFieldsValue({
        username: profile.firstName || "",
        email: profile.email || "",
        address: profile.address || profile.location || "",
        language: profile.language || "english",
        phone: profile.phone || "",
      });
      setPhoneValue(profile.phone || "");

      // Set the image URL and file list if a profile image exists
      if (profile.profile || profile.image || profile.profileImage) {
        const profileImg =
          profile.profile || profile.image || profile.profileImage;
        setImageUrl(profileImg);
        setFileList([
          {
            uid: "-1",
            name: "profile.jpg",
            status: "done",
            url: profileImg,
          },
        ]);
      }
    }
  }, [profile, form]);

  // Clean up blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const onFinish = async (values) => {
    try {
      // Get the file object itself, not just the URL
      const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

      // Create a FormData object for server submission with file
      const formData = new FormData();

      formData.append("firstName", values.username);
      formData.append("phone", phoneValue || "");
      formData.append("address", values.address || "");
      formData.append("language", values.language || "");

      if (imageFile) {
        formData.append("profile", imageFile);
      }

      // Call the update mutation
      await updateProfile(formData).unwrap();

      message.success("Profile Updated Successfully!");
      refetch(); // Refresh profile data
    } catch (error) {
      console.error("Profile update error:", error);
      message.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    // Only keep the most recent file in the list
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);

    if (limitedFileList.length > 0 && limitedFileList[0].originFileObj) {
      // Create blob URL for preview
      const newImageUrl = URL.createObjectURL(limitedFileList[0].originFileObj);

      // Clean up previous blob URL if exists
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl(newImageUrl);
    } else {
      setImageUrl(null);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      notification.error({
        message: "Invalid File Type",
        description: "Please upload an image file.",
      });
    }

    // Check file size (optional)
    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      notification.error({
        message: "File too large",
        description: "Image must be smaller than 2MB.",
      });
    }

    return isImage && isLessThan2MB;
  };

  const handleFormSubmit = () => {
    form.submit(); // This will trigger the onFinish function
  };

  return (
    <div className="flex justify-center items-center shadow-xl rounded-lg pt-5 pb-12">
      {isProfileLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          style={{ width: "80%" }}
          onFinish={onFinish}
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-5">
            {/* Profile Image */}
            <div className="col-span-2 flex justify-start items-center gap-5">
              <Form.Item style={{ marginBottom: 0 }}>
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="/upload" // This will be overridden by the manual form submission
                  onChange={handleImageChange}
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  listType="picture-card"
                  maxCount={1}
                >
                  {imageUrl ? (
                    <Avatar
                      size={100}
                      src={getImageUrl(imageUrl)}
                      style={{ borderRadius: "8px" }}
                    />
                  ) : (
                    <Avatar
                      size={100}
                      icon={<UploadOutlined />}
                      style={{ borderRadius: "8px" }}
                    />
                  )}
                </Upload>
              </Form.Item>
              <h2 className="text-[24px] font-bold">
                {profile?.firstName || ""}
              </h2>
            </div>

            {/* Username */}
            <Form.Item
              name="username"
              label="Full Name"
              style={{ marginBottom: 0 }}
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input
                placeholder="Enter your Username"
                style={{
                  height: 45,
                  backgroundColor: "#ffffff",
                  border: "1px solid #d8d8d8",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />
            </Form.Item>

            {/* Email (Disabled) */}
            <Form.Item
              name="email"
              label="Email"
              style={{ marginBottom: 0 }}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter your Email"
                style={{
                  height: "45px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #d8d8d8",
                  outline: "none",
                }}
                disabled // Disable the email field
              />
            </Form.Item>

            {/* Phone Number */}
            <Form.Item
              name="phone"
              label={<p>Phone Number</p>}
              style={{ marginBottom: 0 }}
              rules={[
                { required: true, message: "Please enter your phone number" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    // Validate that it's a valid phone number format
                    if (!/^\+?[1-9]\d{1,14}$/.test(value.replace(/\D/g, ""))) {
                      return Promise.reject(
                        new Error("Please enter a valid phone number")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                countries={[
                  "PK",
                  "AE",
                  "OM",
                  "QA",
                  "KW",
                  "BH",
                  "SA",
                  "BD",
                  "GB",
                ]}
                value={phoneValue}
                onChange={(value) => {
                  setPhoneValue(value);
                  form.setFieldValue("phone", value);
                }}
                placeholder="Enter your phone number"
                className="phone-input-no-focus"
                style={{
                  height: 45,
                  border: "1px solid #d8d8d8",
                  borderRadius: "8px",
                  paddingLeft: "12px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            </Form.Item>

            {/* Country */}
            {/* <Form.Item
              name="country"
              label="Country"
              style={{ marginBottom: 0 }}
              rules={[
                { required: true, message: "Please select your country" },
              ]}
            >
              <Select
                placeholder="Select your Country"
                style={{
                  height: "45px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #E0E4EC", // Custom border for language
                }}
              >
                <Option value="english">USA</Option>
                <Option value="french">Dubai</Option>
              </Select>
            </Form.Item> */}

            {/* City */}
            {/* <Form.Item
              name="city"
              label="City"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, message: "Please select your city" }]}
            >
              <Select
                placeholder="Select your City"
                style={{
                  height: "45px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #E0E4EC", // Custom border for language
                }}
              >
                <Option value="english">New York</Option>
                <Option value="french">Manhattan</Option>
              </Select>
            </Form.Item> */}

            {/* Update Profile Button */}
            <div className="col-span-2 text-end mt-2">
              <Form.Item>
                {/* Option 1: Use standard Ant Design Button */}
                <Button
                  htmlType="submit"
                  block
                  loading={isUpdating}
                  disabled={isUpdating}
                  style={{ height: 40 }}
                  className="bg-primary px-8 py-5 rounded-lg text-white hover:text-secondary text-[17px] font-bold"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default UserProfile;
