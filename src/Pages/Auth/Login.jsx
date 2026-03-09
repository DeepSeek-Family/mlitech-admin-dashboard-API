import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";
import image4 from "../../assets/image4.png";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";
import { useUser } from "../../provider/User";

const Login = () => {
  const navigate = useNavigate();
  const { refetch } = useUser();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    const payload = {
      identifier: values.email,
      password: values.password,
      device: "admin",
    };

    try {
      const result = await login(payload).unwrap();

      localStorage.setItem("token", result?.data?.accessToken);

      if (result?.data?.refreshToken) {
        localStorage.setItem("refreshToken", result.data.refreshToken);
      }

      message.success("Login successful!");

      // Refetch profile after login
      try {
        await refetch();
      } catch (error) {
        console.warn("Profile fetch delayed:", error);
      }

      // Navigate to dashboard
      navigate("/", { replace: true });
    } catch (err) {
      message.error(err?.data?.message || "Login failed!");
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <img src={image4} alt="logo" className="h-40 w-40 mx-auto" />
        <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
          Admin Dashboard
        </h1>
        <p>Welcome back! Please enter your details.</p>
      </div>

      <Form
        onFinish={onFinish}
        layout="vertical"
        className="flex flex-col gap-4"
      >
        <FormItem name={"email"} label={"Phone/Email"} />

        <Form.Item
          name="password"
          label={<p>Password</p>}
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            style={{
              height: 40,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        <div className="flex items-center justify-end">
          <a
            className="login-form-forgot text-[#1E1E1E] hover:text-[#3FAE6A] rounded-md font-semibold"
            href="/auth/forgot-password"
          >
            Forgot password
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontSize: "18px",
              marginTop: 20,
              borderRadius: "200px",
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
