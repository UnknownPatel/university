import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var subdomain;

const SignInSuperAdmin = () => {
  const navigate = useNavigate();
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [clientId, setClentId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }

    if (subdomain !== "" || subdomain !== null) {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`
        )
        .then((response) => {
          if (response.data.status === "ok") {
            setClentId(response.data.doorkeeper.client_id);
            setClientSecret(response.data.doorkeeper.client_secret);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const login_btn = document.getElementById("login-btn");
    login_btn.disabled = true;
    login_btn.innerHTML = "Please wait ...";
    login_btn.classList.add("cursor-not-allowed");

    if (clientId !== "" && clientSecret !== "") {
      axios
        .post(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/oauth/token`,
          {
            grant_type: "password",
            subdomain: subdomain,
            email: getEmail,
            password: getPassword,
            client_id: clientId,
            client_secret: clientSecret,
          }
        )
        .then((response) => {
          login_btn.disabled = false;
          login_btn.innerHTML = "Log In";
          login_btn.classList.remove("cursor-not-allowed");
          if (response.data.accessToken !== "") {
            const accessToken = response.data.access_token;
            localStorage.setItem("access_token", accessToken);
            axios
              .get(
                `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/find_user?subdomain=${subdomain}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
              .then((responce) => {
                console.log(responce);
                console.log(responce.data.roles);
                const roles = responce.data.roles;
                localStorage.setItem("roles", roles);
                if (responce.data.roles.includes("super_admin")) {
                  toast.success("Login Successfully !!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });
                  navigate("/uploadExcel");
                } else if (
                  responce.data.roles.includes("Examination Controller")
                ) {
                  toast.success("Login Successfully !!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });
                  navigate("/examinationDetails");
                } else if (responce.data.roles.includes("Marks Entry")) {
                  toast.success("Login Successfully !!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });

                  navigate("/marks_entry");
                } else if (responce.data.roles.includes("Academic Head")) {
                  toast.success("Login Successfully !!", {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });

                  navigate("/academic_UploadSyllabus");
                }
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response.data.error);
          login_btn.disabled = false;
          login_btn.innerHTML = "Log In";
          login_btn.classList.remove("cursor-not-allowed");
          if (err.response.data.error === "invalid_grant") {
            toast.error("Invalid Credentials", {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          } else {
            toast.error("Something went wrong, please try again!", {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center signinimage bg-cover">
      <div className="-mt-32 w-96">
        <div>
          <h2 className="font-semibold text-xl p-5 text-white"></h2>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-20">
            <div className="flex justify-center mb-3">
              <h2 className="font-semibold text-xl text-slate-900">
                {" "}
                Log In to your account
              </h2>
            </div>

            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-2 md:grid-cols-9">
                  <div className="md:col-span-9">
                    <label className="block text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={getEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                      autofocus
                      autocomplete
                      required
                    />
                  </div>

                  <div className="mt-4 md:col-span-9">
                    <label className="block text-gray-700">Password</label>
                    <input
                      type="password"
                      value={getPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      minlength="6"
                      className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="text-right mt-2 md:col-span-9">
                    <a
                      href="/ForgotPassword"
                      className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <div className="text-right mt-2 md:col-span-9">
                    <button
                      type="submit"
                      className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                      onClick={handleSubmit}
                      id="login-btn"
                    >
                      Log In
                    </button>
                  </div>

                  {/* </form> */}
                  <div className="text-right mt-2 md:col-span-9">
                    <hr className="my-6 border-gray-300 w-full" />
                  </div>

                  <div className="text-right mt-2 md:col-span-9">
                    <p className="">
                      New here?{" "}
                      <a
                        href="/universityRegistration"
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                      >
                        Create an University
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="hidden flex-col md:flex-row h-screen items-center">
          <div
            className="bg-white w-full md:max-w-md lg:max-w-full mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
      flex items-center justify-center"
          >
            <div className="w-full h-100">
              <h1 className="text-xl md:text-2xl font-bold leading-tight mt-9 mb-5">
                Log in to your account
              </h1>

              {/* <form className="mt-6" action="#" method="POST"> */}
              <div>
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={getEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  autofocus
                  autocomplete
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={getPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  minlength="6"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="text-right mt-2">
                <a
                  href="/ForgotPassword"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
            px-4 py-3 mt-6"
                onClick={handleSubmit}
                id="login-btn"
              >
                Log In
              </button>
              {/* </form> */}

              <hr className="my-6 border-gray-300 w-full" />

              <p className="">
                New here?{" "}
                <a
                  href="/signupSuperAdmin"
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Create an University
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignInSuperAdmin;
