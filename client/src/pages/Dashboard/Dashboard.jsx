import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/auth/logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(data);
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
            <th className="border p-2">Email</th>
            <th className="border p-2">IP Address</th>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} className="text-center">
              <td className="border p-2">{log.email}</td>
              <td className="border p-2">{log.ip}</td>
              <td className="border p-2">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="border p-2">
                {log.success ? "✅ Success" : "❌ Failed"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
