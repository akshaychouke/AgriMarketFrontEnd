import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import "../styles/CartStyles.css";
import { SERVER_URL } from "../service/api";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  // Count total price of cart items
  const getTotal = () => {
    let total = 0;
    cart?.map((item) => (total += item.price));
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };

  // Remove cart item
  const removeCartItem = (id) => {
    try {
      const cartItems = cart.filter((item) => item._id !== id);
      setCart(cartItems);
      // Update local storage cart
      localStorage.setItem("cart", JSON.stringify(cartItems));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log("Error while removing cart item", error.message);
      toast.error("Error while removing cart item");
    }
  };

  // Get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/v1/product/braintree/token`
      );
      setClientToken(data.clientToken);
    } catch (error) {
      console.log("Error while getting token", error.message);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${SERVER_URL}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment successful");
    } catch (error) {
      console.log("Error while making payment", error.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="col-12">
          <h1 className="text-center bg-light p-2 mb-3">
            {!auth?.user
              ? "Hello Guest"
              : `Hello ${auth?.token && auth?.user?.name}`}
            <p className="text-center">
              {cart?.length
                ? `You have ${cart.length} items in your cart${
                    auth?.token ? "" : ", please login to checkout!"
                  }`
                : "Your Cart Is Empty"}
            </p>
          </h1>
        </div>
      </div>
      <div className="container">
        <div className="row overflow-hidden">
          <div className="col-12">
            {cart?.map((item) => (
              <div className="card mb-3" key={item._id}>
                <div className="row no-gutters">
                  <div className="col-4">
                    <img
                      src={`${SERVER_URL}/api/v1/product/product-photo/${item._id}`}
                      className="card-img-top"
                      alt={item.name}
                      width={"100%"}
                      height={"130px"}
                    />
                  </div>
                  <div className="col-8 d-flex align-items-center justify-content-around">
                    <div className="item-details">
                      <p>{item.name}</p>
                      <p>{item.description.substring(0, 30)}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                    <div className="cart-remove-btn">
                      <button
                        className="btn btn-danger"
                        onClick={() => removeCartItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div
            className="col-12"
            style={{
              marginTop: "101px",
            }}
          >
            <div className="cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {getTotal()} </h4>
              {auth?.user?.address ? (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Add Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/login")}
                    >
                      Login to Checkout
                    </button>
                  )}
                </div>
              )}
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <div className="mt-2">
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="btn btn-primary mb-3"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing...." : "Make Payment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
