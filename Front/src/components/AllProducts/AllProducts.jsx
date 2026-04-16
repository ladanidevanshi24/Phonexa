import React, { useState, useEffect, useContext } from "react";
import "./AllProducts.scss";
import Products from "../Products/Products"; // Reuse existing Products component
import { Context } from "../../utils/context";
import axios from "axios";
import { BiSearchAlt } from "react-icons/bi";
import { IoFilter, IoClose } from "react-icons/io5";

const AllProducts = () => {
    const { products, setProducts, categories, setCategories } = useContext(Context);
    
    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [priceRange, setPriceRange] = useState(100000); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        if (!products) getProducts();
        if (!categories) getCategories();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, selectedCategory, priceRange]);

    const getProducts = async () => {
        try {
            const res = await axios.get("http://localhost:9328/api/v1/product/getallproduct");
            setProducts(res.data);
        } catch (err) {
            console.log("Error fetching products:", err);
        }
    };

    const getCategories = async () => {
        try {
            const res = await axios.get("http://localhost:9328/api/v1/categroy/getCategory");
            setCategories(res.data);
        } catch (err) {
            console.log("Error fetching categories:", err);
        }
    };

    const filterProducts = () => {
        let tempProducts = products?.data || [];

        // Search Filter
        if (searchQuery) {
            tempProducts = tempProducts.filter(p => 
                p.productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category Filter
        if (selectedCategory !== "all") {
            tempProducts = tempProducts.filter(p => p.categoryId === selectedCategory);
        }

        // Price Filter
        tempProducts = tempProducts.filter(p => Number(p.price) <= priceRange);

        setFilteredProducts(tempProducts);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setPriceRange(100000);
    };

    return (
        <div className="all-products-container">
            <div className="layout">
                {/* Mobile Filter Button */}
                <button 
                    className="mobile-filter-btn"
                    onClick={() => setShowMobileFilters(true)}
                >
                    <IoFilter /> Show Filters
                </button>

                {/* Filters Sidebar */}
                <div className={`filters-sidebar ${showMobileFilters ? "show" : ""}`}>
                    <button 
                        className="sidebar-close-btn"
                        onClick={() => setShowMobileFilters(false)}
                    >
                        <IoClose />
                    </button>

                    <div className="filter-section">
                        <h3>Search</h3>
                        <div style={{ position: "relative" }}>
                            <input 
                                type="text" 
                                className="search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <BiSearchAlt style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Categories</h3>
                        <div className="category-list">
                            <div 
                                className={`category-item ${selectedCategory === "all" ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setShowMobileFilters(false);
                                }}
                            >
                                All Products
                            </div>
                            {categories?.data?.map(cat => (
                                <div 
                                    key={cat._id}
                                    className={`category-item ${selectedCategory === cat._id ? "active" : ""}`}
                                    onClick={() => {
                                        setSelectedCategory(cat._id);
                                        setShowMobileFilters(false);
                                    }}
                                >
                                    {cat.categoryName}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Price Range</h3>
                        <div className="price-filter">
                            <input 
                                type="range" 
                                className="range-slider"
                                min="0"
                                max="100000"
                                step="500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                            />
                            <div className="price-values">
                                <span>₹0</span>
                                <span>Up to ₹{priceRange}</span>
                            </div>
                        </div>
                    </div>

                    <button className="clear-filters" onClick={clearFilters}>
                        Clear All Filters
                    </button>
                </div>

                {/* Products Section */}
                <div className="content-section">
                    <div className="section-header">
                        <h2>Explore Products</h2>
                        <span className="result-count">
                            Showing {filteredProducts.length} results
                        </span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="products-grid-wrapper">
                            <Products 
                                innerPage={true} 
                                products={{ data: filteredProducts }} 
                            />
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
