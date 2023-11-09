import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Admin/loader";

var subdomain;
var host;
var url;
var access_token = localStorage.getItem("access_token");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    url = window.location.origin;
    host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (access_token !== null) {
      setLoading(true);
      var headers = { Authorization: `Bearer ${access_token}` };
      if (subdomain === "admin") {
        axios
          .get(`/find_user`, {
            headers,
          })
          .then((res) => {
            if (res.data.status === "ok") {
              setEmail(res.data.user.email);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        axios
          .get(`/users/users/find_user?subdomain=${subdomain}`, {
            headers,
          })
          .then((responce) => {
            if (responce.data.status === "ok") {
              setEmail(responce.data.user.email);
            }
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (subdomain == null || subdomain !== "") {
      console.log(subdomain);
      axios
        .post("/forgot_password", {
          email: email,
          subdomain: subdomain,
          url: url,
        })
        .then(function (response) {
          console.log(response);
          if (response.data.status === "ok") {
            if (response.data.data.token.length !== 0) {
              setResetToken(response.data.data.token);
              toast.success(response.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            } else {
              setResetToken("");
              toast.error("Something went wrong", {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          } else {
            toast.error("Something went wrong", {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-900 bg-cover">
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div>
          <div className="min-h-screen bg-transparent py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-2 sm:max-w-xl sm:mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-950 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-950 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div
                className="relative bg-white shadow-lg sm:rounded-3xl sm:p-20"
                style={{ width: 476 }}
              >
                <div className="max-w-md mx-auto">
                  <div>
                    <h1 className="text-2xl font-semibold">Forgot Password</h1>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      {/* Email Address  */}
                      <div className={`${"relative text-right"}`}>
                        <input
                          autoComplete="off"
                          id="email"
                          type="email"
                          value={email}
                          className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 px-2 py-3 border-gray-300 text-gray-600 focus:outline-none focus:borer-rose-600"
                          placeholder="Enter email address"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Email Address
                        </label>
                      </div>
                      <div className="relative text-right">
                        <button
                          type="submit"
                          className="w-full bg-gray-500 focus:bg-gray-600 text-white rounded-md px-2 py-1 mt-6"
                          onClick={handleSubmit}
                          id="login-btn"
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
      )}
    </div>
  );
};

export default ForgotPassword;
