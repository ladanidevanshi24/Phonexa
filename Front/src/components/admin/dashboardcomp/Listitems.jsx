import React, { useContext } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CategoryIcon from "@mui/icons-material/Category";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Context } from "../../../utils/context";
import { toast } from "react-toastify";
import Divider from "@mui/material/Divider";

export const MainListItems = () => {
  const navigate = useNavigate();
  const { setUser, setIsAdmin } = useContext(Context);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAdmin(false);
    toast.info("Admin Logged Out");
    navigate("/admin/login");
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate("/admin/profile")}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/admin/userlist")}>
        <ListItemIcon>
          <ChecklistIcon />
        </ListItemIcon>
        <ListItemText primary="User List" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/admin/postproduct")}>
        <ListItemIcon>
          <EventIcon />
        </ListItemIcon>
        <ListItemText primary="Post Product" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/admin/postcategory")}>
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Post Category" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/admin/manage-products")}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Manage Products" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/admin/manage-categories")}>
        <ListItemIcon>
          <AppRegistrationIcon />
        </ListItemIcon>
        <ListItemText primary="Manage Categories" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate("/admin/orders")}>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>

      <Divider sx={{ my: 1 }} />

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon sx={{ color: "error.main" }} />
        </ListItemIcon>
        <ListItemText primary="Logout" sx={{ color: "error.main" }} />
      </ListItemButton>
    </React.Fragment>
  );
};
export default MainListItems;
