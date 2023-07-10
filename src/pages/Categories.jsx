import React, { useState, useEffect } from "react";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title="Categories">
      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row container">
          <h2 className="text-center">See the Products category wise</h2>
          {categories.map((category) => (
            <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={category._id}>
              <div className="card">
                <Link className="btn cat-btn" to={`/category/${category.slug}`}>
                  {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
