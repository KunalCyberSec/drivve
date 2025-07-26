import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

interface User {
  mobile: string;
  is_authenticated: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (mobile: string, is_authenticated: string) => {
    try {
      await axios.put(`/admin/users/${mobile}`, null, {
        params: { is_authenticated },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mobile</TableCell>
              <TableCell>Authenticated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.mobile}>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.is_authenticated}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() =>
                      updateUser(
                        user.mobile,
                        user.is_authenticated === "true" ? "false" : "true"
                      )
                    }
                  >
                    Toggle Auth
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
