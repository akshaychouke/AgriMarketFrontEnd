import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Modal } from "antd";
import CategoryForm from "../../components/Form/CategoryForm";
import { SERVER_URL } from "../../service/api";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");
  const API_URL = `${SERVER_URL}/api/v1/category`;
  //Modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  //to handle form submit - create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/create-category`, { name });
      if (data?.success === true) {
        toast.success("Category created successfully");
        setName("");
        getAllCategories();
      } else {
        toast.error("Error while creating category");
      }
    } catch (error) {
      console.log("error while creating category", error.message);
      toast.error("Error while creating category");
    }
  };

  //get categories from backend
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/get-Categories`);
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

  //to handle form submit - update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${API_URL}/update-category/${selectedCategory._id}`,
        { name: updatedCategory }
      );
      if (data?.success === true) {
        toast.success("Category updated successfully");
        setSelectedCategory(null);
        setUpdatedCategory("");
        setIsModalVisible(false);
        getAllCategories();
      } else {
        toast.error("Error while updating category");
      }
    } catch (error) {
      console.log("error while updating category", error.message);
      toast.error("Error while updating category");
    }
  };

  //to handle  - delete category
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL}/delete-category/${id}`);
      if (data?.success === true) {
        toast.success("Category Deleted successfully");
        getAllCategories();
      } else {
        toast.error("Error while deleting category");
      }
    } catch (error) {
      console.log("error while deleting category", error.message);
      toast.error("Error while deleting category");
    }
  };

  return (
    <Layout title="Dashboard - Create Category">
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h2>Manage Categories</h2>
            <div className="p-3 w-50">
              {/* passing the props to the Category form */}
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setIsModalVisible(true);
                            setUpdatedCategory(category.name);
                            setSelectedCategory(category);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handleDelete(category._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setIsModalVisible(false)}
              open={isModalVisible}
              footer={null}
            >
              <CategoryForm
                value={updatedCategory}
                setValue={setUpdatedCategory}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
