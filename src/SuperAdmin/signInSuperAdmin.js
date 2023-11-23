import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import PurePanel from "antd/es/tooltip/PurePanel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams, useLocation} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Admin/loader";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  var access_token;

  useEffect(() => {
    setLoading(true);
    domain = host.split(".")[host.split(".").length - 1];
    access_token = localStorage.getItem("access_token");
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      setIsSuperAdmin(arr[1] === "superadmin");
      setIsStudent(arr[1] === "student");
      setDisabled(arr[1] !== "superadmin" && arr[0] !== "admin");
      setIsAdmin(arr[0] === "admin");
      subdomain = arr[0];
    }

    if (subdomain === "admin") {
      setLoading(true);
      setIsApproved(true);
      if (access_token !== null) {
        var headers = { Authorization: `Bearer ${access_token}` };
        axios
          .get(`/find_user`, {
            headers,
          })
          .then((res) => {
            console.log(res.data.roles.includes("admin"));
            if (res.data.status === "ok") {
              if (res.data.roles.includes("admin")) {
                toast.error("You are already logged in!");
                navigate("/pendingRequests");
              }else {
                toast.error("You are not authorized to access the Admin panel.");
                navigate(-1);
              }
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
          .get(`/get_authorization_details`)
          .then((res) => {
            if (res.data.status === "ok") {
              setClentId(res.data.doorkeeper.client_id);
              setClientSecret(res.data.doorkeeper.client_secret);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (subdomain !== "" || subdomain !== null) {
      setLoading(true);
      if (access_token !== null) {
        var headers = { Authorization: `Bearer ${access_token}` };
        axios
          .get(`/users/users/find_user?subdomain=${subdomain}`, {
            headers,
          })
          .then((responce) => {
            if (responce.data.status === "ok") {
              const roles = responce.data.roles;
              if (arr[1] === "superadmin") {
                if (roles.includes("super_admin")) {
                  toast.info("You are already logged in");
                  navigate("/uploadExcel");
                }
              } else {
                toast.info("You are already logged in");
                if (roles.includes("Examination Controller")) {
                  navigate("/examinationDetails");
                } else if (roles.includes("Marks Entry")) {
                  navigate("/marks_entry");
                } else if (roles.includes("Academic Head")) {
                  navigate("/academic_UploadSyllabus")
                } else if (roles.includes("Student Coordinator")) { 
                  navigate("/feeDetails")
                } else {
                  navigate("/facultyDashboard");
                }
              }
            }
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setLoading(false);
          });
      } else {
        axios
          .get(`/universities/${subdomain}/get_authorization_details`)
          .then((response) => {
            if (response.data.status === "ok") {
              if (response.data.university.status === "accepted") {
                setClentId(response.data.doorkeeper.client_id);
                setClientSecret(response.data.doorkeeper.client_secret);
                setIsApproved(true);
              }
              setIsRegistered(response.data.university.status !== null);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  const handleSendOTP = (e) => {
    e.target.innerHTML = "Sending OTP ... ";

    if (isStudent) {
      if (getMobileNumber === "") {
        toast.error("Please enter mobile number to recieve OTP");
        setDisabled(false);
        e.target.innerHTML = "Send Otp";
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

  const disable_login_button = (login_btn) => {
    login_btn.disabled = true;
    login_btn.innerHTML = "Please wait ...";
    login_btn.classList.add("cursor-not-allowed");
  };

  const enable_login_button = (login_btn) => {
    login_btn.disabled = false;
    login_btn.innerHTML = "Log In";
    login_btn.classList.remove("cursor-not-allowed");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const login_btn = document.getElementById("login-btn");
    disable_login_button(login_btn);
    if (clientId !== "" && clientSecret !== "") {
      var request_body = {
        grant_type: "password",
        client_id: clientId,
        client_secret: clientSecret,
      };

      if (!isAdmin) {
        request_body["subdomain"] = subdomain;
      }

      if (isSuperAdmin) {
        if (getEmail === "") {
          toast.error("Please enter email");
          enable_login_button(login_btn);
        } else if (getPassword === "") {
          toast.error("Password can't be blank");
          enable_login_button(login_btn);
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
                        enable_login_button(login_btn);
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
              enable_login_button(login_btn);
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
          enable_login_button(login_btn);
        } else if (otp === "") {
          toast.error("OTP can't be blank");
          enable_login_button(login_btn);
        } else {
          request_body["otp"] = otp;
          request_body["mobile_number"] = getMobileNumber;
          if (subdomain !== "" || subdomain !== null) {
            axios
              .post(`/oauth/token`, request_body)
              .then((res) => {
                if (res.data.access_token !== "") {
                  const accessToken = res.data.access_token;
                  localStorage.setItem("access_token", accessToken);
                  toast.success("Successfully Logged in!");
                  navigate("/studentHomePage");
                } else {
                  enable_login_button(login_btn);
                  toast.error("Not allowed");
                }
              })
              .catch((err) => {
                toast.error("Invalid OTP");
                enable_login_button(login_btn);
                console.error(err);
              });
          }
        }
      } else if (isAdmin) {
        if (getEmail === "") {
          toast.error("Please enter email");
          enable_login_button(login_btn);
        } else if (getPassword === "") {
          toast.error("Password can't be blank");
          enable_login_button(login_btn);
        } else {
          request_body["email"] = getEmail;
          request_body["password"] = getPassword;

          axios
            .post("/oauth/token", request_body)
            .then((res) => {
              login_btn.disabled = false;
              login_btn.innerHTML = "Log In";
              login_btn.classList.remove("cursor-not-allowed");
              if (res.data.accessToken !== "") {
                const accessToken = res.data.access_token;
                localStorage.setItem("access_token", accessToken);
                axios
                  .get(`/users/users/find_user`, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      const roles = res.data.roles;
                      if (roles.includes("admin")) {
                        toast.success("Successfully Logged in");
                        navigate("/pendingRequests");
                      }
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      } else {
        if (getEmail === "") {
          toast.error("Please enter Email Address / Mobile Number");
          enable_login_button(login_btn);
        } else if (otp === "") {
          toast.error("OTP can't be blank");
          enable_login_button(login_btn);
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
                enable_login_button(login_btn);
                console.error(err);
              });
          }
        }
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-900 bg-cover">
      {loading ? (
        <>
          <Loader />
        </>
      ) : (isRegistered && isApproved) || isAdmin ? (
        <div>
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
                      <h1 className="text-2xl font-semibold">Sign In</h1>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                        {/* Email Address  */}
                        <div
                          className={`${
                            isStudent ? "hidden" : "relative text-right"
                          }`}
                        >
                          <input
                            autoComplete="off"
                            id="email"
                            type="email"
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
                        {/* Mobile Number / Email Address */}
                        <div className={`${isStudent ? "relative" : "hidden"}`}>
                          <input
                            autoComplete="off"
                            id="mobile/email"
                            type="text"
                            className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                            placeholder="Mobile Number / Email Address"
                            onChange={(e) => setMobileNumber(e.target.value)}
                            autoFocus
                            required
                          />
                          <label
                            htmlFor="mobile/email"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            Mobile Number / Email Address
                          </label>
                        </div>
                        {/* Password */}
                        <div
                          className={`${
                            isSuperAdmin || isAdmin ? "relative" : "relative"
                          }`}
                        >
                          <input
                            autoComplete="off"
                            id="password"
                            type="password"
                            className={`${
                              disabled ? "cursor-not-allowed" : ""
                            } peer placeholder-transparent h-10 w-full rounded-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600`}
                            placeholder="Otp"
                            onChange={(e) =>
                              isSuperAdmin || isAdmin
                                ? setPassword(e.target.value)
                                : setOtp(e.target.value)
                            }
                            minLength={6}
                            disabled={disabled}
                            required
                          />
                          <label
                            htmlFor="password"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            {isSuperAdmin || isAdmin ? "Password" : "OTP"}
                          </label>
                        </div>
                        {/* Forgot Password */}
                        <div
                          className={`${
                            isSuperAdmin || isAdmin ? "relative" : "hidden"
                          }`}
                        >
                          <a
                            href="/ForgotPassword"
                            className="text-sm font-semibold text-blue-700 hover:text-blue-800 focus:text-blue-800"
                          >
                            Forgot Password?
                          </a>
                        </div>
                        <div
                          className={
                            isSuperAdmin || isAdmin ? "hidden" : "relative"
                          }
                        >
                          <div className="items-end">
                            <button
                              onClick={handleSendOTP}
                              className={`flex p-1 font-semibold max-w-full text-blue-500 text-end cursor-pointer`}
                            >
                              Send Otp
                            </button>
                          </div>
                        </div>
                        <div className="relative text-right">
                          <button
                            type="submit"
                            className="w-full bg-gray-500 focus:bg-gray-600 text-white rounded-md px-2 py-1 mt-6"
                            onClick={handleSubmit}
                            id="login-btn"
                          >
                            Log In
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
      ) : !isRegistered ? (
        <div className="-mt-32">
          <div>
            <h2 className="font-semibold text-xl p-5 text-white"></h2>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-20">
              <div className="flex justify-center mb-3">
                <h2 className="font-semibold text-xl text-slate-900">
                  Your University is not yet registered,
                  <Link
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                    to={`${window.location.protocol}//${
                      host.split(".")[host.split(".").length - 1]
                    }/universityRegistration`}
                  >
                    Click here
                  </Link>{" "}
                  to register.
                </h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="-mt-32">
            <div>
              <h2 className="font-semibold text-xl p-5 text-white"></h2>

              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-20">
                <div className="flex justify-center mb-3">
                  <h2 className="font-semibold text-xl text-slate-900">
                    Your request has been sent to Admin, please wait for the
                    approval.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInSuperAdmin;
