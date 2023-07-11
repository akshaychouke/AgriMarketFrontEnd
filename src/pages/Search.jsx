import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { SERVER_URL } from "../service/api";

const Search = () => {
  const [cart, setCart] = useCart();
  const [value, setValue] = useSearch();
  const navigate = useNavigate();
  return (
    <Layout title="Search Results">
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {value?.results.length < 1
              ? "No results found"
              : `Found ${value?.results.length} results`}
          </h6>

          <div className="d-flex flex-wrap mt-4">
            {value?.results.map((product) => (
              <div
                className="card m-2"
                style={{ width: "18rem" }}
                key={product._id}
              >
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
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
