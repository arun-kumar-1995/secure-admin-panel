import { useEffect, useState } from "react";
import { API } from "../../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await API.get("/logs/get-logs");
        setLogs(response.data.data.logs);
      } catch (err) {
        toast.error("Failed to fetch logs");
        navigate("/");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>IP Address</th>
              <th>Device Type</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <tr key={idx}>
                  <td>{log._id}</td>
                  <td>{log.ip}</td>
                  <td>{log.deviceInfo}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td className={log.status ? "success" : "failed"}>
                    {log.status === "Success" ? "✅ Success" : "❌ Failed"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
