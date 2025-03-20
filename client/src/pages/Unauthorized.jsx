import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../api";
import { useToast } from "../../contexts/ToastContext";

const Unauthorized = () => {
  const { ip } = useParams();
  const toast = useToast();

  const blockIPAddress = async () => {
    if (!ip) return;

    try {
      const response = await API.post("/auth/block-ipaddress", { ip });
      toast.success(response.data?.message || "IP blocked successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block IP");
    }
  };

  useEffect(() => {
    blockIPAddress();
  }, [ip]);

  return (
    <div>
      <h1>Unauthorized Login</h1>
      <p>Your IP ({ip}) has been blocked due to unauthorized access.</p>
    </div>
  );
};

export default Unauthorized;
