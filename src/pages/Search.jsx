import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";
const Search = () => {
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
              <div key={product._id} className="product-link">
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">
                      {product.description.substring(0, 30)}...
                    </p>
                    <p className="card-text">$ {product.price}</p>
                    <div>
                      <button
                        className="btn btn-primary ms-1"
                        onClick={() => navigate(`/product/${product.slug}`)}
                      >
                        See Details
                      </button>
                      <button className="btn btn-secondary ms-1">
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
    </Layout>
  );
};

export default Search;
