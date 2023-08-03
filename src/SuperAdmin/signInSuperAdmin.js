import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import PurePanel from "antd/es/tooltip/PurePanel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var subdomain;
var domain;
var host = window.location.host;

const SignInSuperAdmin = () => {
  const navigate = useNavigate();
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getMobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [clientId, setClentId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    domain = host.split(".")[host.split('.').length - 1]
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      setIsSuperAdmin(arr[1] === "superadmin");
      setIsStudent(arr[1] === "student");
      setDisabled(arr[1] !== "superadmin");
      subdomain = arr[0];
    }

    if (subdomain !== "" || subdomain !== null) {
      axios
        .get(`/universities/${subdomain}/get_authorization_details`)
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

  const handleSendOTP = (e) => {
    console.log("Clicked");
    e.target.innerHTML = "Sending OTP ... ";

    if (isStudent) {
      if (getMobileNumber === "") {
        toast.error("Please enter mobile number to recieve OTP");
      } else {
        if (subdomain !== "" || subdomain !== null) {
          axios
            .post(`/students/otp_login`, {
              subdomain: subdomain,
              mobile_number: getMobileNumber,
            })
            .then((res) => {
              e.target.innerHTML = "Send Otp";
              if (res.data.status === "ok") {
                setIsOtpSent(true);
                setDisabled(false);
                toast.success(res.data.message);
              } else {
                setIsOtpSent(false);
                setDisabled(true);
                toast.error(res.data.message);
              }
            })
            .catch((err) => {
              e.target.innerHTML = "Send Otp";
              setIsOtpSent(true);
              setDisabled(false);
              console.error(err);
            });
        } else {
          toast.error("Your university has not been registered yet.");
        }
      }
    } else {
      if (getEmail === "") {
        toast.error("Please enter email address to recieve OTP");
      } else {
        if (subdomain !== "" || subdomain !== null) {
          axios
            .post(`/users/users/send_otp`, {
              subdomain: subdomain,
              email: getEmail,
            })
            .then((res) => {
              e.target.innerHTML = "Send Otp";
              if (res.data.status === "ok") {
                setIsOtpSent(true);
                setDisabled(false);
                toast.success(res.data.message);
              } else {
                setIsOtpSent(false);
                setDisabled(true);
                toast.error(res.data.message);
              }
            })
            .catch((err) => {
              e.target.innerHTML = "Send Otp";
              console.error(err);
            });
        } else {
          toast.error("Your university has not been registered yet.");
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const login_btn = document.getElementById("login-btn");
    login_btn.disabled = true;
    login_btn.innerHTML = "Please wait ...";
    login_btn.classList.add("cursor-not-allowed");

    if (clientId !== "" && clientSecret !== "") {
      var request_body = {
        grant_type: "password",
        subdomain: subdomain,
        client_id: clientId,
        client_secret: clientSecret,
      };
      if (isSuperAdmin) {
        if (getEmail === "") {
          toast.error("Please enter email");
        } else if (getPassword === "") {
          toast.error("Password can't be blank");
        } else {
          request_body["email"] = getEmail;
          request_body["password"] = getPassword;

          axios
            .post(`/oauth/token`, request_body)
            .then((response) => {
              login_btn.disabled = false;
              login_btn.innerHTML = "Log In";
              login_btn.classList.remove("cursor-not-allowed");
              if (response.data.accessToken !== "") {
                const accessToken = response.data.access_token;
                localStorage.setItem("access_token", accessToken);
                axios
                  .get(`/users/users/find_user?subdomain=${subdomain}`, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  })
                  .then((responce) => {
                    console.log(responce);
                    if (responce.status === 200) {
                      const roles = responce.data.roles;
                      localStorage.setItem("roles", roles);
                      if (roles.includes("super_admin")) {
                        toast.success("Successfully Logged in");
                        navigate("/uploadExcel");
                      } else {
                        login_btn.disabled = false;
                        login_btn.innerHTML = "Log In";
                        login_btn.classList.remove("cursor-not-allowed");
                        toast.error(
                          "You dont have rights to access the page, contact your administrator"
                        );
                      }
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
      } else if (isStudent) {
        if (getMobileNumber === "") {
          toast.error("Please enter Mobile Number");
        } else if (otp === "") {
          toast.error("OTP can't be blank");
        } else {
          request_body["otp"] = otp;
          request_body["mobile_number"] = getMobileNumber;
          if (subdomain !== "" || subdomain !== null) {
            axios
              .post(`/oauth/token`, request_body)
              .then((res) => {
                login_btn.disabled = false;
                login_btn.innerHTML = "Log In";
                login_btn.classList.remove("cursor-not-allowed");
                if (res.data.access_token !== "") {
                  const accessToken = res.data.access_token;
                  localStorage.setItem("access_token", accessToken);
                  toast.success("Successfully Logged in!");
                  navigate("/studentHomePage");
                } else {
                  login_btn.disabled = false;
                  login_btn.innerHTML = "Log In";
                  login_btn.classList.remove("cursor-not-allowed");
                  toast.error("Not allowed");
                }
              })
              .catch((err) => {
                toast.error("Invalid OTP");
                login_btn.disabled = false;
                login_btn.innerHTML = "Log In";
                login_btn.classList.remove("cursor-not-allowed");
                console.error(err);
              });
          }
        }
      } else {
        if (getEmail === "") {
          toast.error("Please enter Email Address / Mobile Number");
        } else if (otp === "") {
          toast.error("OTP can't be blank");
        } else {
          request_body["otp"] = otp;
          request_body["email"] = getEmail;
          if (subdomain !== "" || subdomain !== null) {
            axios
              .post(`/oauth/token`, request_body)
              .then((res) => {
                if (res.data.access_token !== "") {
                  const accessToken = res.data.access_token;
                  localStorage.setItem("access_token", accessToken);
                  axios
                    .get(`/users/users/find_user?subdomain=${subdomain}`, {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    })
                    .then((responce) => {
                      console.log(responce);
                      if (responce.status === 200) {
                        const roles = responce.data.roles;
                        localStorage.setItem("roles", roles);
                        if (roles.includes("Examination Controller")) {
                          toast.success("Successfully Logged in");
                          navigate("/examinationDetails");
                        } else if (roles.includes("Marks Entry")) {
                          toast.success("Successfully logged in");
                          navigate("/marks_entry");
                        } else if (roles.includes("Academic Head")) {
                          toast.success("Successfully logged in");
                          navigate("/academic_UploadSyllabus");
                        } else if (roles.includes("Student Coordinator")) {
                          toast.success("Successfully logged in");
                          navigate("/feeDetails");
                        } else {
                          toast.success("Successfully logged in");
                          navigate("/facultyDashboard");
                        }
                      }
                    })
                    .catch((error) => console.log(error));
                }
              })
              .catch((err) => {
                login_btn.disabled = false;
                login_btn.innerHTML = "Log In";
                login_btn.classList.remove("cursor-not-allowed");
                console.error(err);
              });
          }
        }
      }
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
                  <div className={`${isStudent ? "hidden" : ""} md:col-span-9`}>
                    <label className="block text-gray-700">
                      Enter Email Address
                    </label>
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

                  <div className={`${isStudent ? "" : "hidden"} md:col-span-9`}>
                    <label className="block text-gray-700">
                      Enter Mobile Number
                    </label>
                    <input
                      type="text"
                      value={getMobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter Mobile Number"
                      className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                      autofocus
                      autocomplete
                      required
                    />
                  </div>

                  <div className="flex justify-end w-full md:col-span-9">
                    <button
                      onClick={handleSendOTP}
                      className={`${
                        isSuperAdmin ? "hidden" : "flex"
                      } pl-3 max-w-full text-blue-500 text-end cursor-pointer`}
                    >
                      Send Otp
                    </button>
                  </div>

                  <div
                    className={`${
                      isSuperAdmin ? "mt-4" : "-mt-4"
                    } md:col-span-9`}
                  >
                    <label className="block text-gray-700">
                      {isSuperAdmin ? "Password" : "OTP"}
                    </label>
                    <input
                      type="password"
                      value={isSuperAdmin ? getPassword : otp}
                      onChange={(e) =>
                        isSuperAdmin
                          ? setPassword(e.target.value)
                          : setOtp(e.target.value)
                      }
                      placeholder={
                        isSuperAdmin ? "Enter Password" : "Enter OTP"
                      }
                      minlength="6"
                      disabled={disabled}
                      className={`${
                        disabled ? "cursor-not-allowed" : ""
                      } w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none`}
                      required
                    />
                  </div>

                  <div
                    className={` ${
                      isSuperAdmin ? "" : "hidden"
                    } text-right mt-2 md:col-span-9`}
                  >
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
                      <Link
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                        to={`${window.location.protocol}//${host.split(".")[host.split('.').length - 1]}/universityRegistration`}
                      >
                        Register University
                      </Link>
                    </p>
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

export default SignInSuperAdmin;
