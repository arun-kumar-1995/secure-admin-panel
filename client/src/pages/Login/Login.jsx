import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api";
import { useToast } from "../../contexts/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [loginMethod, setLoginMethod] = useState("email");

  const navigate = useNavigate();
  const toast = useToast();

  
  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/send-otp", { email });
      toast.success("An OTP sent to your email");
      console.log(email);
      navigate(`/verify-otp/${email}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="">Admin Login</h2>

        <form className="form">
          <select
            value={loginMethod}
            onChange={(e) => setLoginMethod(e.target.value)}
            className="selector"
          >
            <option value="email">Email</option>
            <option value="ip">IP Login</option>
          </select>
          {loginMethod === "email" ? (
            <>
              <input
                type="email"
                placeholder="Enter email."
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
                placeholder="Enter IP address"
                className="ip-input"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
              <button onClick={requestOtp} className="btn btn-login">
                Login
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
