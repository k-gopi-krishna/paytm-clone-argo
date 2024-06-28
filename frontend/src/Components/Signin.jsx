import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
const Signin = () => {
  const [details, setDetails] = useState({
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        "https://paytm-clone-backend.vercel.app/api/v1/user/signin",
        details
      );
      localStorage.setItem("token", result.data.token);
      console.log(result);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error("invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-slate-50 text-black flex flex-col w-[325px] py-7 rounded-md">
      <header className="flex flex-col items-center mb-6 gap-2 text-center">
        <h1 className="font-bold text-3xl">Sign In</h1>
        <p className="font-semibold  text-slate-600 mx-3">
          Enter your information to access your account
        </p>
      </header>
      <form className="flex flex-col gap-4 items-center mx-7">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">UserName</label>
            <input
              value={details.name}
              onChange={handleInputChange}
              name="name"
              type="text"
              placeholder="john@gmail.com"
              className="py-2 px-2 rounded-md bg-white w-[240px] border-slate-300 border-[1px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Password</label>
            <input
              value={details.password}
              onChange={handleInputChange}
              name="password"
              type="text"
              placeholder="*****"
              className="py-2 px-2 rounded-md bg-white w-[240px] border-slate-300 border-[1px]"
            />
          </div>
        </div>
        {loading ? (
          <ScaleLoader color="black" />
        ) : (
          <button
            className="text-center w-full bg-black text-white py-2 text-sm font-semibold rounded-md"
            // type="submit"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        )}
        <Link to={"/signup"}>
          <span className="text-sm font-semibold">
            Don't have an account ? Signup
          </span>
        </Link>
      </form>
    </div>
  );
};

export default Signin;
