import React from "react";
import { useNavigate,useLocation} from "react-router-dom";
import { useState, useEffect } from "react";
const Spinner = ({path = "login"}) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount); // decrement count
    }, 1000);

    // redirect once count is equal to 0
    count === 0 && navigate(`/${path}`,{
      state:location.pathname
    });

    // cleanup the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [count, navigate,location,path]);
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h3>Redirecting to login in {count} seconds</h3>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
