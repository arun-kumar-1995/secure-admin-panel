import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { API } from "../../api";
import { useParams } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { email } = useParams();
  console.log(email);

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
      <div className="wrapper">
        <h2 className="">Verify Otp</h2>
        <form className="form">
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp} className="btn btn-verify">
              Verify OTP
            </button>
          </>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
