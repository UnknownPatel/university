import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
var subdomain;
var host;
var reset_password_token;

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    reset_password_token = params.get('reset_password_token');
    host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
  }, [location.search]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Password changed");
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    e.preventDefault();
    const error_message = document.getElementById("error-message");
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "") {
      toast.error("Please enter password", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (password !== confirmPassword) {
      toast.error("Passwords doesn't match!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      if (subdomain !== "" || subdomain !== null) {
        axios
          .put(
            `/reset_password`,
            {
              subdomain: subdomain,
              reset_password_token: reset_password_token,
              password: password,
              confirm_password: confirmPassword,
            }
          )
          .then((res) => {
            console.log(res);
            if (res.data.status === "ok"){
              toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT
              })
              navigate("/");
            } else {
              toast.error(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT
              })
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  return (
    <div className="h-screen signupimage flex items-center justify-center bg-cover">
      <div className="container max-w-screen-md mx-auto ">
        <div className="-mt-48">
          <h2 className="p-5 "></h2>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-36">
            <div className="flex justify-center mb-3">
              <h2 className="font-semibold text-xl text-slate-900">
                {" "}
                Change Your Password
              </h2>
            </div>

            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <div className="">
                  <div className="md:col-span-4">
                    <label htmlFor="">New Password</label>
                    <input
                      type="text"
                      name=""
                      id="password"
                      onChange={handlePasswordChange}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="New Password"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label htmlFor="">Confirm New Password</label>
                    <input
                      type="password"
                      name=""
                      id="confirm_password"
                      onChange={handleConfirmPasswordChange}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="Confirm New Password"
                    />
                  </div>
                  <span
                    id={"error-message"}
                    className="text-red-500 text-xs"
                  ></span>

                  <div className="md:col-span-5 mt-3 text-center">
                    <div className="inline-flex items-end">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
