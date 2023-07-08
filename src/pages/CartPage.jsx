import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  //count total price of cart items
  const getTotal = () => {
    let total = 0;
    cart?.map((item) => (total += item.price));
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  //remove cart item
  const removeCartItem = (id) => {
    try {
      const cartItems = cart.filter((item) => item._id !== id);
      setCart(cartItems);
      //update localstorage cart
      localStorage.setItem("cart", JSON.stringify(cartItems));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log("error while removing cart item", error.message);
      toast.error("Error while removing cart item");
    }
  };
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className=" text-center">
              {cart?.length > 1
                ? `You have ${cart?.length} items in your cart 
                ${auth?.token ? " " : "please login to continue"}`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((item) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  {" "}
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${item._id}`}
                    className="card-img-top"
                    alt={item.name}
                    width={"100px"}
                    height={"100px"}
                  />
                </div>
                <div className="col-md-4">
                  <p className="card-title">{item.name}</p>
                  <p>{item.description.substring(0, 30)}</p>
                  <p>Price : ${item.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {getTotal()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    update address
                  </button>
                </div>
              </>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
