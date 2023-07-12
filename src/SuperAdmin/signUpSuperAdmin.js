import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpSuperAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    admin_email: "",
    admin_password: "",
    established_year: "",
    city: "",
    state: "",
    country: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    event.target.innerHTML = "Submitting ...";
    event.target.disabled = true;
    event.target.classList.add("cursor-not-allowed");
    axios
      .post(
        "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/universities",
        {
          university: formData,
        }
      )
      .then(function (response) {
        if (response.data.status === "created") {
          toast.success(response.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          var url = `${window.location.protocol}//${response.data.data.university.subdomain}.${window.location.host}/`;
          setTimeout(() => {
            window.location.replace(url);
          }, 5000);
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
    <div className="h-screen flex items-center justify-center signupimage bg-cover">
      <div className="-mt-32">
        <div>
          <h2 className="font-semibold text-xl p-5 text-white"></h2>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-20">
            <div className="flex justify-start mb-3">
              <h2 className="font-semibold text-xl text-slate-900">
                {" "}
                Registration Form
              </h2>
            </div>

            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-2 md:grid-cols-9">
                  <div className="md:col-span-4">
                    <label htmlFor="name">University Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="University name"
                    />
                  </div>

                  <div className="md:col-span-5">
                    <label htmlFor="established_year">Established Year</label>
                    <input
                      type="date"
                      name="established_year"
                      id="established_year"
                      value={formData.established_year}
                      onChange={handleChange}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label htmlFor="admin_email">Admin Email Address</label>
                    <input
                      type="email"
                      name="admin_email"
                      id="admin_email"
                      value={formData.admin_email}
                      onChange={handleChange}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="email"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label htmlFor="admin_password">Admin Password</label>
                    <input
                      type="password"
                      name="admin_password"
                      id="admin_password"
                      value={formData.admin_password}
                      onChange={handleChange}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="Password"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label htmlFor="country">Country / region</label>
                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                      <input
                        type="text"
                        name="country"
                        id="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                      />
                      {/*  */}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label htmlFor="state">State / province</label>
                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label htmlFor="zipcode">City</label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      placeholder="city"
                    />
                  </div>

                  <div className="md:col-span-5 mt-3 text-right">
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

export default SignUpSuperAdmin;
