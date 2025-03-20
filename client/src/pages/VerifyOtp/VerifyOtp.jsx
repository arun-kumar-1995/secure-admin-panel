import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { API } from "../../api";
import { getDeviceInfo } from "../../utils/deviceInfo";
import { handleAppRouting } from "../../utils/handleAppRouting";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [directIp, setDirectIp] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { email } = useParams();

  const getIp = async () => {
    try {
      const response = await API.get("/auth/get-ip");
      const userIp = response.data?.data?.ip;
      setDirectIp(userIp);

      // Handle routing
      const route = handleAppRouting(userIp);
      navigate(route);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    getIp();
  }, [navigate, toast]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    const deviceInfo = getDeviceInfo();

    try {
      await API.post("/auth/verify-otp", {
        email,
        otp,
        deviceInfo,
        ip: directIp
      });
      toast.success("Login successful");
      navigate("/Dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2>Verify OTP</h2>
        <form className="form">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} className="btn btn-verify">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
