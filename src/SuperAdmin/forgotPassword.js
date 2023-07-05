import React from "react";
import { useState } from "react";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="bg-blue-950 h-scree signupimage">
      <div className="container max-w-screen-md mx-auto ">
        <div>
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
                      name="admin_email"
                      id="admin_email"
                      value={formData.email}
                      onChange={handleChange}
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
