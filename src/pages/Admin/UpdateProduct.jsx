import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../../service/api";
const { Option } = Select;

const UpdateProduct = () => {
  const [categoris, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState("");
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const paramas = useParams();
  const API_URL = `${SERVER_URL}/api/v1`;

  //get single product from backend
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/product/get-product/${paramas.slug}`
      );
      const product = data?.product;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setId(product._id);
      setCategory(product.category._id);
      setQuantity(product.quantity);
      setShipping(product.shipping);

      console.log("product", product);
    } catch (error) {
      console.log("error while getting single product", error.message);
      toast.error("Error while getting single product");
    }
  };

  useEffect(() => {
    getSingleProduct();
    // eslint-disable-next-line
  }, []);

  //get categories from backend
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/category/get-Categories`);
      if (data.success === true) {
        setCategories(data?.categories);
        console.log("categories", data.categories);
      }
    } catch (error) {
      console.log("error while getting categories", error.message);
      toast.error("Error while getting categories");
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  //to handle  update - update  product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.put(
        `${API_URL}/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product updated successfully");
        setTimeout(() => {
          navigate("/dashboard/admin/products");
        }, 1000);
      } else {
        toast.error("Error while updating product");
      }
    } catch (error) {
      console.log("error while updating product", error.message);
      toast.error("Error while updating product");
    }
  };

  //to handle  delete - delete product
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      let answer = window.prompt("Are You Sure want to delete this product ? ");
      if (!answer) return;
      const { data } = await axios.delete(
        `${API_URL}/product/delete-product/${id}`
      );
      if (data?.success) {
        toast.success("Product deleted successfully");
        setTimeout(() => {
          navigate("/dashboard/admin/products");
        }, 1000);
      }
    } catch (error) {
      console.log("error while deleting product", error.message);
      toast.error("Error while deleting product");
    }
  };
  return (
    <Layout title="Dashboard - Update Product">
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h2>Update Product</h2>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Please Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categoris.map((cate) => (
                  <Option key={cate._id} value={cate._id}>
                    {cate.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label
                  htmlFor="upload images"
                  className="btn btn-outline-secondary col-md-12"
                >
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    id="upload images"
                    hidden
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product Image"
                      height={"100px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`${API_URL}/product/product-photo/${id}`}
                      alt="product Image"
                      height={"150px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>{" "}
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>{" "}
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  value={shipping === true ? "Yes" : "No"}
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="d-flex">
                <div className="mb-3">
                  <button
                    className="btn btn-primary m-2"
                    onClick={handleUpdate}
                  >
                    UPDATE PRODUCT
                  </button>
                </div>
                <div className="mb-3">
                  <button className="btn btn-danger m-2" onClick={handleDelete}>
                    DELETE PRODUCT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
