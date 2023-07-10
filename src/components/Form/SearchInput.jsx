import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [value, setValue] = useSearch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/search/${value.keyword}`
      );
      console.log("data", data);
      setValue({ ...value, results: data.result });
      navigate("/search");
    } catch (error) {
      console.log("error while searching", error.message);
    }
  };

  return (
    <div>
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={value.keyword}
          style={{
            border: "1px solid gray",
            borderRadius: "10px",
            outline: "none", // Remove default focus outline
            boxShadow: "none", // Remove default focus box shadow
          }}
          onChange={(e) => setValue({ ...value, keyword: e.target.value })}
        />

        <button
          className="btn btn-outline-success"
          type="submit"
          style={{ borderRadius: "10px" }}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
