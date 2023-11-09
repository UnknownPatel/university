import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var subdomain;
var domain;
var host = window.location.host;

const SignUpSuperAdmin = () => {
  host = window.location.host;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    admin_email: "",
    admin_password: "",
    established_year: "",
    city: "",
    state: "",
    country: "",
    url: host,
  });

  useEffect(() => {
    domain = host.split(".")[host.split(".").length - 1];
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      setLoading(true);
      subdomain = arr[0];
      axios
        .post(`/check_subdomain`, {
          tenant_name: subdomain,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            setLoading(false);
            setIsAccepted(res.data.accepted);
            setIsRegistered(res.data.registered);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(()=> {
          setLoading(false);
        });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.target.innerHTML = "Submitting ...";
    event.target.disabled = true;
    event.target.classList.add("cursor-not-allowed");
    axios
      .post("/universities", {
        university: formData,
      })
      .then(function (response) {
        if (response.data.status === "created") {
          toast.success(response.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          var url = `${window.location.protocol}//${response.data.data.university.subdomain}.superadmin.${window.location.host}/`;
          window.location.replace(url);
        } else {
          event.target.innerHTML = "Submit";
          event.target.disabled = false;
          event.target.classList.remove("cursor-not-allowed");
          toast.error(response.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }
      })
      .catch(function (error) {
        let message =
          typeof error.response !== "undefined"
            ? error.response.data.message
            : error.message;
        console.warn("Error", message);
        console.log(error);
      });
  };
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  return (

    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-900 bg-cover">
      {loading ? (
        <div role="status">
        <svg aria-hidden="true" className="w-24 h-24 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
      ) : isRegistered && isAccepted ? (
        <div>
          <div className="-mt-32">
            <div>
              <h2 className="font-semibold text-xl p-5 text-white"></h2>

              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-20">
                <div className="flex justify-center mb-3">
                  <h2 className="font-semibold text-xl text-slate-900">
                    Your university is already registered, please proceed to login page.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isRegistered ? (
        <div>
          <div className="-mt-32">
            <div>
              <h2 className="font-semibold text-xl p-5 text-white"></h2>

              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-20">
                <div className="flex justify-center mb-3">
                  <h2 className="font-semibold text-xl text-slate-900">
                    Your request has been sent to Admin, please wait for the approval.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="">
        <div>
          <div className="min-h-screen bg-transparent py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-2 sm:max-w-xl sm:mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-950 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-950 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="relative bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                  <div>
                    <h1 className="text-2xl font-semibold">Register</h1>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="py-6 max-w-fit text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div className="grid text-sm grid-cols-2 sm:grid-cols-2 gap-4 gap-y-2">
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="name"
                            name="name"
                            type="text"
                            className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 px-2 py-3 border-gray-300 text-gray-600 focus:outline-none focus:borer-rose-600"
                            placeholder="University Name"
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="name"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            University Name
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="established_year"
                            name="established_year"
                            type="date"
                            className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 px-2 py-3 border-gray-300 text-gray-600 focus:outline-none focus:borer-rose-600"
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="established_year"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            Established Year
                          </label>
                        </div>
                      </div>
                      <div className="grid text-sm grid-cols-1 sm:grid-cols-1 gap-4 gap-y-2">
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="admin_email"
                            name="admin_email"
                            type="text"
                            className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 px-2 py-3 border-gray-300 text-gray-600 focus:outline-none focus:borer-rose-600"
                            placeholder="Admin Email"
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="admin_email"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            Admin Email
                          </label>
                        </div>
                      </div>
                      <div className="grid text-sm grid-cols-1 sm:grid-cols-3 gap-4 gap-y-2">
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="country"
                            name="country"
                            type="text"
                            className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 px-2 py-3 border-gray-300 text-gray-600 focus:outline-none focus:borer-rose-600"
                            placeholder="Country"
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="country"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            Country
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="state"
                            name="state"
                            type="text"
                            className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 px-2 py-3 border-gray-300 text-gray-600 focus:outline-none focus:borer-rose-600"
                            placeholder="State"
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="state"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            State
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            autoComplete="off"
                            id="city"
                            name="city"
                            type="text"
                            className="peer placeholder-transparent h-10 w-full rounded-lg border-b-2 px-2 py-3 border-gray-300 text-gray-600 focus:outline-none focus:borer-rose-600"
                            placeholder="City"
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="city"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                          >
                            City
                          </label>
                        </div>
                      </div>
                      <div className="grid text-sm grid-cols-1 sm:grid-cols-3 gap-4 gap-y-2">
                        <div className="relative text-right"></div>
                        <div className="relative text-right">
                          <button
                            type="submit"
                            className="w-full bg-gray-500 h-12 focus:bg-gray-600 text-white rounded-md px-2 py-1 mt-6"
                            onClick={handleSubmit}
                          >
                            Register
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
      </div>
      )}
      
    </div>
  );
};

export default SignUpSuperAdmin;
