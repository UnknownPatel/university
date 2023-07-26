import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

var subdomain;
var host;
var url;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    url = window.location.origin;
    host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
  }, []);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (subdomain == null || subdomain !== "") {
      axios
        .post(
          "/forgot_password",
          {
            email: email,
            subdomain: subdomain,
            url: url
          }
        )
        .then(function (response) {
          console.log(response);
          if (response.data.status === "ok" ) {
            if (response.data.data.token.length !== 0) {
              setResetToken(response.data.data.token)
              toast.success(response.data.message, {
                position: toast.POSITION.BOTTOM_LEFT
              });
            } else {
              setResetToken("");
              toast.error("Something went wrong", {
                position: toast.POSITION.BOTTOM_LEFT
              });
            }
          } else {
            toast.error("Something went wrong", {
              position: toast.POSITION.BOTTOM_LEFT
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div className="bg-blue-950 signupimage h-screen flex items-center justify-center bg-cover">
      <div className="container max-w-screen-md mx-auto ">
        <div className="-mt-48">
          <h2 className="p-5 "></h2>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-44">
            <div className="flex justify-center mb-3">
              <h2 className="font-semibold text-xl text-slate-900">
                {" "}
                Forgot Password
              </h2>
            </div>

            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <div className="">
                  <div className="md:col-span-4">
                    <label htmlFor="admin_email">Enter Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="admin_email"
                      value={email}
                      onChange={handleEmailChange}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="email"
                    />
                  </div>

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

export default ForgotPassword;
