import { useEffect, useState } from "react";
import { API } from "../../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await API.get("/logs/get-logs");
        console.log(response.data.data);
        setLogs(response.data.data.logs);
      } catch (err) {
        toast.error("Failed to fetch logs");
        navigate("/");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="container">
      <h2 className="">Admin Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Id</th>
            <th>IP Address</th>
            <th>Device Type</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs?.map((log, idx) => (
            <tr key={idx} className="text-center">
              <td>{log._id}</td>
              <td>{log.ip}</td>
              <td>{log.deviceInfo}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.status ? "✅ Success" : "❌ Failed"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
