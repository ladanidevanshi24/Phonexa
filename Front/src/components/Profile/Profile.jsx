import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Context } from "../../utils/context";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import Loader from "../Loader/Loader";

const Profile = () => {
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
    if (user?._id) {
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const res = await api.get(`/user/getuserbyid/${user._id}`);
      if (res.data.success === 1) {
        setFormData({
          firstName: res.data.data.firstName || "",
          lastName: res.data.data.lastName || "",
          email: res.data.data.email || "",
          password: "",
        });
      }
    } catch (err) {
      toast.error("Failed to fetch user details");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch(
        `/user/update/${user._id}`,
        formData
      );
      if (res.data.success === 1) {
        toast.success("Profile updated successfully!");
        // Update local state and storage
        const updatedUser = res.data.data;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred while updating profile");
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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#8e2de2" }}>
          Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleUpdate} noValidate sx={{ mt: 3 }}>
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
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
              mb: 2,
              py: 1.5,
              bgcolor: "#8e2de2",
              "&:hover": { bgcolor: "#7a27c2" },
            }}
          >
            {loading ? <Loader small /> : "Update Profile"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
