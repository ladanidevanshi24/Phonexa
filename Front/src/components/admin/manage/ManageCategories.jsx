import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Modal,
    TextField,
    CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newName, setNewName] = useState("");
    const [newImg, setNewImg] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:9328/api/v1/categroy/getCategory");
            setCategories(res.data.data);
        } catch (err) {
            toast.error("Error fetching categories");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setUpdateLoading(true);
        try {
            await axios.delete(`http://localhost:9328/api/v1/categroy/deleteCategory/${id}`);
            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (err) {
            toast.error("Error deleting category");
        } finally {
            setUpdateLoading(false);
        }
    };


    const handleOpen = (category) => {
        setEditingCategory(category);
        setNewName(category.categoryName);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCategory(null);
        setNewName("");
        setNewImg(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        const fd = new FormData();
        fd.append("categoryName", newName);
        if (newImg) fd.append("catImg", newImg);

        try {
            await axios.put(`http://localhost:9328/api/v1/categroy/updateCategory/${editingCategory._id}`, fd);
            toast.success("Category updated successfully");
            handleClose();
            fetchCategories();
        } catch (err) {
            toast.error("Error updating category");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <Loader />;


    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {updateLoading && <Loader full />}
            <Typography variant="h4" gutterBottom sx={{ color: "#212121", fontWeight: 700 }}>

                Manage Categories
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#8e2de2" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Image</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat._id} hover>
                                <TableCell>
                                    <img src={cat.catImg} alt={cat.categoryName} style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
                                </TableCell>
                                <TableCell>{cat.categoryName}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpen(cat)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(cat._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Edit Category
                    </Typography>
                    <form onSubmit={handleUpdate}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                        />
                        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                            Change Image
                            <input type="file" hidden onChange={(e) => setNewImg(e.target.files[0])} />
                        </Button>
                        {newImg && <Typography variant="caption">{newImg.name}</Typography>}
                        <Button 
                            fullWidth 
                            variant="contained" 
                            type="submit" 
                            disabled={updateLoading}
                            sx={{ bgcolor: "#8e2de2", '&:hover': { bgcolor: "#7a27c2" } }}
                        >
                            {updateLoading ? <Loader small /> : "Update Category"}
                        </Button>

                    </form>
                </Box>
            </Modal>
        </Container>
    );
};

export default ManageCategories;
