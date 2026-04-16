import React, { useContext } from "react";
import { MdClose } from "react-icons/md";
import { BsCartX } from "react-icons/bs";
import { Context } from "../../utils/context";
import CartItem from "./CartItem/CartItem";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../utils/api";
import { toast } from "react-toastify";

import "./Cart.scss";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate()
    const { cartItems, setShowCart, setCartItems, cartSubTotal } = useContext(Context);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async (amount) => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            alert("you are offline");
            return;
        }

        if (!amount || amount <= 0) {
            toast.error("Invalid amount");
            return;
        }

        // Get user info for prefill
        const currentUser = JSON.parse(localStorage.getItem("user")) || {};
        const userEmail = currentUser.email || "test@example.com";
        const userName = `${currentUser.firstName || "Guest"} ${currentUser.lastName || ""}`;

        const option = {
            key: "rzp_test_dEYhZg38SrkYMD",
            currency: "INR",
            amount: Math.round(amount * 100), // Razorpay handles amount in subunits (paise)
            name: "PhoneX",
            description: "Thanks for buying products from our website",
            image: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg",
            handler: async function (response) {
                try {
                    const orderData = {
                        userId: currentUser._id,
                        products: cartItems.map(item => ({
                            productId: item._id,
                            quantity: item.quantity // Fixed item.attributes.quantity to item.quantity
                        })),
                        totalAmount: cartSubTotal
                    };
                    
                    await api.post("/booking/create", orderData);
                    
                    setShowCart(false)
                    setCartItems([])
                    navigate("/orders") // Redirect to order history
                    toast.success("Payment successful! Order placed.");
                } catch (error) {
                    toast.error("Payment successful but failed to save order details.");
                }
            },
            prefill: {
                name: userName,
                email: userEmail,
                contact: "9999999999" // Fallback contact for test env
            },
            theme: {
                color: "#8e2de2"
            }
        };

        const paymentObject = new window.Razorpay(option);
        paymentObject.open();
    };

    return (
        <div className="cart-panel">
            <div
                className="opac-layer"
                onClick={() => setShowCart(false)}
            ></div>
            <div className="cart-content">
                <div className="cart-header">
                    <span className="heading">Shopping Cart</span>
                    <span
                        className="close-btn"
                        onClick={() => setShowCart(false)}
                    >
                        <MdClose className="close-btn" />
                        <span className="text">close</span>
                    </span>
                </div>

                {!cartItems.length && (
                    <div className="empty-cart">
                        <BsCartX />
                        <span>No products in the cart.</span>
                        <button className="return-cta" onClick={() => { }}>
                            RETURN TO SHOP
                        </button>
                    </div>
                )}

                {!!cartItems.length && (
                    <>
                        <CartItem />
                        <div className="cart-footer">
                            <div className="subtotal">
                                <span className="text">Subtotal:</span>
                                <span className="text total">
                                    &#8377;{cartSubTotal}
                                </span>
                            </div>
                            <div className="button">
                                <button
                                    className="checkout-cta"
                                    onClick={() => displayRazorpay(cartSubTotal)}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
