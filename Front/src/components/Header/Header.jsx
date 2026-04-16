import { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TbSearch } from "react-icons/tb";
import { CgShoppingCart } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import { toast } from "react-toastify";
import "./Header.scss";
import Search from "./Search/Search";
import { Context } from "../../utils/context";
import Cart from "../Cart/Cart";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const navigate = useNavigate();
    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 200) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, []);

    const { cartCount, showCart, setShowCart, user, setUser, setIsAdmin } = useContext(Context);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setIsAdmin(false);
        toast.info("Logged out successfully");
        navigate("/");
    };

    return (
        <>
            <header
                className={`main-header-b ${scrolled ? "sticky-header" : ""}`}
            >
                <div className="header-content-a">
                    <ul className="leftt">
                        <li onClick={() => navigate("/")}>Home</li>
                        <li onClick={() => navigate("/products")}>Products</li>
                        <li onClick={() => navigate("/about")}>About</li>
                    </ul>
                    <div className="center" onClick={() => navigate("/")}>
                        PhoneX
                    </div>
                    <div className="right">
                        <TbSearch onClick={() => setSearchModal(true)} />
                        <span
                            className="cart-icon"
                            onClick={() => setShowCart(true)}
                        >
                            <CgShoppingCart />
                            {!!cartCount && <span>{cartCount}</span>}
                        </span>
                        <div className="user-icon-container">
                            <FaRegUser onClick={() => user ? setShowProfile(!showProfile) : navigate("/login")} />
                            {user && showProfile && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <p className="name">{user?.firstName} {user?.lastName}</p>
                                        <p className="email">{user?.email}</p>
                                    </div>
                                    <div className="profile-actions" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <Button 
                                            variant="outlined" 
                                            size="small" 
                                            fullWidth
                                            onClick={() => {
                                                setShowProfile(false);
                                                navigate("/profile");
                                            }}
                                            sx={{ color: "#8e2de2", borderColor: "#8e2de2", "&:hover": { borderColor: "#7a27c2", color: "#7a27c2" } }}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            size="small" 
                                            fullWidth
                                            onClick={() => {
                                                setShowProfile(false);
                                                navigate("/orders");
                                            }}
                                            sx={{ color: "#8e2de2", borderColor: "#8e2de2", "&:hover": { borderColor: "#7a27c2", color: "#7a27c2" } }}
                                        >
                                            My Orders
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            fullWidth
                                            onClick={handleLogout}
                                            sx={{ bgcolor: "#8e2de2", "&:hover": { bgcolor: "#7a27c2" } }}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="mobile-menu-icon" onClick={() => setMobileMenu(true)}>
                            <AiOutlineMenu />
                        </span>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <div className={`mobile-menu-drawer ${mobileMenu ? "show" : ""}`}>
                <div className="drawer-header">
                    <div className="logo">PhoneX</div>
                    <VscChromeClose onClick={() => setMobileMenu(false)} />
                </div>
                <ul className="mobile-nav-links">
                    <li onClick={() => { navigate("/"); setMobileMenu(false); }}>Home</li>
                    <li onClick={() => { navigate("/products"); setMobileMenu(false); }}>Products</li>
                    <li onClick={() => { navigate("/about"); setMobileMenu(false); }}>About</li>
                    {user ? (
                        <>
                            <li onClick={() => { navigate("/profile"); setMobileMenu(false); }}>Profile</li>
                            <li onClick={() => { navigate("/orders"); setMobileMenu(false); }}>Orders</li>
                            <li onClick={() => { handleLogout(); setMobileMenu(false); }}>Logout</li>
                        </>
                    ) : (
                        <li onClick={() => { navigate("/login"); setMobileMenu(false); }}>Login</li>
                    )}
                </ul>
            </div>
            {mobileMenu && <div className="drawer-overlay" onClick={() => setMobileMenu(false)}></div>}
            {searchModal && <Search setSearchModal={setSearchModal} />}
            {showCart && <Cart />}
        </>
    );
};

export default Header;
