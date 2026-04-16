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
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination
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
    width: '95%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: { xs: 2, md: 4 },
    borderRadius: 2,
};

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        productName: "",
        price: "",
        description: "",
        categoryId: ""
    });
    const [newImg, setNewImg] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchProducts(page);
    }, [page]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:9328/api/v1/categroy/getCategory");
            setCategories(res.data.data);
        } catch (err) {
            toast.error("Error fetching categories");
        }
    };

    const fetchProducts = async (currentPage) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:9328/api/v1/product/getallproduct?page=${currentPage}&limit=15`);
            setProducts(res.data.data);
            setTotalPages(res.data.pagination?.totalPages || 1);
        } catch (err) {
            toast.error("Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDelete = async (id) => {
        setUpdateLoading(true);
        try {
            await axios.delete(`http://localhost:9328/api/v1/product/deleteProduct/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts(page);
        } catch (err) {
            toast.error("Error deleting product");
        } finally {
            setUpdateLoading(false);
        }
    };


    const handleOpen = (product) => {
        setEditingProduct(product);
        setFormData({
            productName: product.productName,
            price: product.price,
            description: product.description,
            categoryId: product.categoryId?._id || product.categoryId
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProduct(null);
        setNewImg(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        const fd = new FormData();
        fd.append("productName", formData.productName);
        fd.append("price", formData.price);
        fd.append("description", formData.description);
        fd.append("categoryId", formData.categoryId);
        if (newImg) fd.append("porductImg", newImg);

        try {
            await axios.put(`http://localhost:9328/api/v1/product/updateProduct/${editingProduct._id}`, fd);
            toast.success("Product updated successfully");
            handleClose();
            fetchProducts(page);
        } catch (err) {
            toast.error("Error updating product");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading && products.length === 0) return <Loader />;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {updateLoading && <Loader full />}
            <Typography variant="h4" gutterBottom sx={{ color: "#212121", fontWeight: 700, fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
                Manage Products
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#8e2de2" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Image</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Price</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Category</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Loader small />
                                </TableCell>
                            </TableRow>
                        ) : (

                            products.map((prod) => (
                                <TableRow key={prod._id} hover>
                                    <TableCell>
                                        <img src={prod.porductImg} alt={prod.productName} style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }} />
                                    </TableCell>
                                    <TableCell sx={{ minWidth: 120 }}>{prod.productName}</TableCell>
                                    <TableCell>₹{prod.price}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{prod.categoryId?.categoryName || "N/A"}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton color="primary" size="small" onClick={() => handleOpen(prod)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => handleDelete(prod._id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    size="large"
                />
            </Box>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
// ... (rest of the modal code remains same)
                    <Typography variant="h6" component="h2" gutterBottom>
                        Edit Product
                    </Typography>
                    <form onSubmit={handleUpdate}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            sx={{ mt: 2, mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.categoryId}
                                label="Category"
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <MenuItem key={cat._id} value={cat._id}>{cat.categoryName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                            Change Product Image
                            <input type="file" hidden onChange={(e) => setNewImg(e.target.files[0])} />
                        </Button>
                        {newImg && <Typography variant="caption" display="block" sx={{ mb: 2 }}>{newImg.name}</Typography>}
                        <Button 
                            fullWidth 
                            variant="contained" 
                            type="submit" 
                            disabled={updateLoading}
                            sx={{ bgcolor: "#8e2de2", '&:hover': { bgcolor: "#7a27c2" } }}
                        >
                            {updateLoading ? <Loader small /> : "Update Product"}
                        </Button>

                    </form>
                </Box>
            </Modal>
        </Container>
    );
};

export default ManageProducts;
