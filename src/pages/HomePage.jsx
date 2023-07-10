import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import SliderImage from "./SliderImage";
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]); //categories
  const [radio, seRadio] = useState([]); //prices
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/api/v1";

  //get categories from backend
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/category/get-Categories`);
      if (data?.success === true) {
        setCategories(data?.categories);
        console.log("categories", data.categories);
      }
    } catch (error) {
      console.log("error while getting categories", error.message);
      toast.error("Error while getting categories");
    }
  };

  //call getAllCategories
  useEffect(() => {
    getAllCategories();
    getTotal();
  }, []);

  //get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/product/product-list/${page}`
      );
      setLoading(false);
      console.log("all products", data?.products);
      setProducts(data?.products);
    } catch (error) {
      setLoading(false);
      console.log(
        "error while getting all products in homepage",
        error.message
      );
    }
  };

  //call getAllProducts
  useEffect(() => {
    if (!(checked.length || radio.length)) {
      getAllProducts();
    }
    //eslint-disable-next-line
  }, [checked.length, radio.length]);

  //get total products count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/product/product-count`);
      if (data?.success === true) {
        setTotal(data?.total);
        console.log("total", data.total);
      }
    } catch (error) {
      console.log("error while getting total", error.message);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  //load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log("error while loading more products", error.message);
    }
  };
  //handle filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  //to get filtered products
  const getFilteredProducts = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/product/product-filter`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log("error while getting filtered products", error.message);
    }
  };

  //call getFilteredProducts
  useEffect(() => {
    if (checked.length || radio.length) {
      getFilteredProducts();
    }
  }, [checked, radio]);
  return (
    <Layout title="Ecommerce App - Home">
      {/* banner image */}
      {/* <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      /> */}
      <SliderImage />

      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          {/* filter for categories */}
          <h4 className="text-center">Filter by Category</h4>
          <div className="d-flex flex-column">
            {categories.map((cate) => (
              <Checkbox
                key={cate._id}
                onChange={(e) => handleFilter(e.target.checked, cate._id)}
              >
                {cate.name}
              </Checkbox>
            ))}
          </div>

          {/* Filter for price */}
          <h4 className="text-center mt-4">Filter by Prices</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => seRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio key={p._id} value={p.array}>
                    {p.name}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Reset Filter
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((product) => (
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
                      className="btn btn-dark ms-1"
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
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
