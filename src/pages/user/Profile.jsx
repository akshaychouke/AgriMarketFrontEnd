import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  //auth context
  const [auth, setAuth] = useAuth();

  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const API_URL = "http://localhost:8080";

  useEffect(() => {
    const { name, email, phone, address, password } = auth?.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
  }, [auth?.user]);

  //function to handle the submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_URL}/api/v1/auth/profile`, {
        name,
        email,
        password,
        phone,
        address,
      });

      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        //to update in leocal storage
        let ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data?.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success(data?.message);
        setTimeout(() => {
          navigate("/dashboard/user");
        }, 1000);
      }
      //to check if the response is success or not
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <Layout title="Profile">
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="form-container" style={{ minHeight: "90vh" }}>
              <form onSubmit={handleSubmit}>
                <h4 className="title">User Profile</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    placeholder="Enter your Contact Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="Address"
                    placeholder="Enter your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
