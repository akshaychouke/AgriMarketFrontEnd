import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import SearchInput from "../Form/SearchInput";
import toast from "react-hot-toast";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { FaShoppingCart } from "react-icons/fa";
import { GiFarmTractor } from "react-icons/gi";
const Header = () => {
  const categories = useCategory();
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid d-flex justify-content-between">
          <div>
            <Link to="/" className="navbar-brand">
              <img
                src="/images/farmer_3319221.png"
                alt="titleImage"
                style={{ height: "40px", marginRight: "10px" }}
              />
              <span> Ecommerce App</span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>
          <div>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <ul className="navbar-nav ml-auto align-items-center">
                <li className="nav-item">
                  <SearchInput />
                </li>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" activeClassName="active">
                    Home
                  </NavLink>
                </li>

                {/* Categories dropdown */}
                <li className="nav-item dropdown">
                  <Link
                    to={"/categories"}
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    Categories
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to={"/categories"}>
                        All Categories
                      </Link>
                    </li>
                    {categories?.map((category) => (
                      <li key={category._id}>
                        <Link
                          className="dropdown-item"
                          to={`/category/${category.slug}`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {!auth.user ? (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/register"
                        className="nav-link"
                        activeClassName="active"
                      >
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/login"
                        className="nav-link"
                        activeClassName="active"
                      >
                        Login
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item dropdown">
                      <NavLink
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                      >
                        {auth?.user?.name}
                      </NavLink>
                      <ul className="dropdown-menu">
                        <li>
                          <NavLink
                            to={`/dashboard/${
                              auth?.user?.role === 1 ? "admin" : "user"
                            }`}
                            className="dropdown-item"
                            activeClassName="active"
                          >
                            Dashboard
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to="/login"
                            className="dropdown-item"
                            onClick={handleLogout}
                          >
                            Logout
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">
                    {/* Cart */}
                    <FaShoppingCart />
                    <Badge
                      count={cart?.length}
                      showZero
                      offset={[10, -5]}
                    ></Badge>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
