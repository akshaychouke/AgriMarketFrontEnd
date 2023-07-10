import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]); //related products
  //get single product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
      console.log("single product", data?.product);
    } catch (error) {
      console.log("error while getting single product", error.message);
    }
  };

  //call getProduct
  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  //get similar products
  const getSimilarProducts = async (pid, cid) => {
    const { data } = await axios.get(
      `http://localhost:8080/api/v1/product/similar-products/${pid}/${cid}`
    );
    console.log("related products", data?.products);
    setRelatedProducts(data?.products);
  };
  return (
    <Layout title={"Product Details"}>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category : {product.category?.name}</h6>
          <h6>Quantity : {product.quantity}</h6>
          <h6>Shipping : {product.shipping ? "Yes" : "No"}</h6>
          <button
            className="btn btn-secondary ms-1"
            onClick={() => {
              setCart([...cart, product]);
              // to add cart in local storage
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item added to cart");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts?.length < 1 && (
          <p className="text-center">No similar product found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((product) => (
            <div key={product._id} className="card m-2">
              <img
                src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{product.name}</h5>
                  <h5 className="card-title card-price">
                    {product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text">
                  {product.description.substring(0, 30)}...
                </p>

                <div className="card-name-price">
                  <button
                    className="btn btn-primary ms-1"
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
