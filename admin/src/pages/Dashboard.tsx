import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Paper, Box, CircularProgress } from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, verified_users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const data = [
    { name: 'Verified Users', value: stats.verified_users },
    { name: 'Unverified Users', value: stats.total_users - stats.verified_users },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="body1" gutterBottom>
            Total Users: {stats.total_users}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Verified Users: {stats.verified_users}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
