import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../service/api";
const useCategory = () => {
  const [categories, setCategories] = useState([]);

  //get cat
  const getcategories = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/v1/category/get-Categories`
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
