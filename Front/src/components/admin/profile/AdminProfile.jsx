import React, { useState, useEffect, useContext } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Context } from "../../../utils/context";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
} from "@mui/material";
import Loader from "../../Loader/Loader";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const AdminProfile = () => {
  const { user, setUser } = useContext(Context);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminDetails();
    }
  }, [user]);

  const fetchAdminDetails = async () => {
    try {
      const adminId = user?._id || user?.id;
      if (!adminId) {
        setFetching(false);
        return;
      }
      const res = await api.get(`/admin/getadmin/${adminId}`);
      if (res && res.data && res.data.success === 1) {
        setFormData({
          firstName: res.data.data.firstName || "",
          lastName: res.data.data.lastName || "",
          email: res.data.data.email || "",
          password: "", // Don't show password
        });
      } else {
        toast.error(res?.data?.message || "Failed to fetch admin data");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to fetch administrator details");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (user?.id === 'admin_static') {
      return toast.warning("Static System Admin cannot be updated. Use a database account.");
    }
    setLoading(true);
    try {
      const res = await api.patch(`/admin/update/${user._id}`, formData);
      if (res.data.success === 1) {
        toast.success("Admin Profile updated successfully!");
        const updatedUser = res.data.data;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(res.data.message || "Failed to update admin profile");
      }
    } catch (err) {
      toast.error("An error occurred while updating admin profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 10 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 3, textAlign: "center" }}>
        <Avatar sx={{ m: "0 auto 20px", bgcolor: "#1976d2", width: 60, height: 60 }}>
          <AdminPanelSettingsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 4 }}>
          Administrator Profile
        </Typography>
        <Box component="form" onSubmit={handleUpdate} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Admin Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="New Password (optional)"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 5,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            {loading ? <Loader small /> : "Save Changes"}
          </Button>
          {user?.id === 'admin_static' && (
            <Typography variant="caption" color="error" sx={{ mt: 2, display: "block" }}>
              Note: You are currently using the static system login. Updates are restricted.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminProfile;
