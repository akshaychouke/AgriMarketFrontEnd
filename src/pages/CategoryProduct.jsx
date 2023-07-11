import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { SERVER_URL } from "../service/api";

const CategoryProduct = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const getProductByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log("Error in getting products by category", error.message);
    }
  };

  useEffect(() => {
    getProductByCategory();
  }, [params.slug]);
  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category.name}</h4>
        <h6 className="text-center">{products.length} result found</h6>
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap">
              {products?.map((product) => (
                <div key={product._id} className="card m-2">
                  <div className="card m-2" style={{ width: "18rem" }}>
                    <img
                      src={`${SERVER_URL}/api/v1/product/product-photo/${product._id}`}
                      className="card-img-top"
                      alt={product.name}
                    />
                    <div className="card-body">
                      <div className="card-name-price">
                        <h5 className="card-title">{product.name}</h5>
                        <h5 className="card-title card-price">
                          {product.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </h5>
                      </div>
                      <p className="card-text ">
                        {product.description.substring(0, 60)}...
                      </p>
                      <div className="card-name-price">
                        <button
                          className="btn btn-info ms-1"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          See Details
                        </button>
                        <button
                          className="btn btn-secondary ms-1"
                          onClick={() => {
                            setCart([...cart, product]);
                            // to add cart in local storage
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, product])
                            );
                            toast.success("Item added to cart");
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
