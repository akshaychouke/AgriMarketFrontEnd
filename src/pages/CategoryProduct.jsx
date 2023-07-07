import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const getProductByCategory = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-category/${params.slug}`
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
      <div className="container mt-3">
        <h4 className="text-center">Category - {category.name}</h4>
        <h6 className="text-center">{products.length} result found</h6>
        <div className="row mt-3">
          <div className="col-md-9">
            <h1 className="text-center">All Products</h1>
            <div className="d-flex flex-wrap">
              {products?.map((product) => (
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
      </div>
    </Layout>
  );
};

export default CategoryProduct;
