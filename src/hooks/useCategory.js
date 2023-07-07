import { useState, useEffect } from "react";
import axios from "axios";
const useCategory = () => {
  const [categories, setCategories] = useState([]);

  //get cat
  const getcategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-Categories"
      );
      setCategories(data?.categories);
    } catch (error) {
      console.log("error in useCategory ", error.message);
    }
  };
  useEffect(() => {
    getcategories();
  }, []);

  return categories;
};

export default useCategory;
