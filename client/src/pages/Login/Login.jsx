import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useToast } from "../../contexts/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const toast = useToast();

  const requestOtp = async () => {
    try {
      await API.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await API.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container">
      <h2 className="">Admin Login</h2>
      {step === 1 ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={requestOtp} className="btn btn-request">
            Request OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="p-2 border mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} className="btn btn-verify">
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
