import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignUpSuperAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name:"",
    admin_email:"",
    admin_password:"",
    established_year: "",
    city:"",
    state: "",
    country: "",
    examination_controller_email: "",
    assistant_exam_controller_email: "",
    academic_head_email: "",
    hod_email: "",
  })
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
    .post("http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/universities",{
      university: formData
    })
    .then(function(response) {
      console.log(response);
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
    });
    setTimeout(() => {
      navigate("/");
    },5000)
    })
    .catch(function(error) {
      let message = typeof error.response !== "undefined" ? error.response.data.message
        :error.message;
        console.warn("Error", message);
        console.log(error);
    });
  }
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }
  return (
    <div className='bg-blue-900 '>

        <div className="container max-w-screen-lg mx-auto ">
          <div>
            <h2 className="font-semibold text-xl  text-blue-600">
            Registration Form
            </h2>
            <p className="text-gray-500 mb-6"></p>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">University Details</p>
                  <p>Please fill out all the fields.</p>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="full_name">University Name</label>
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

                    {/* <div className="md:col-span-5">
                      <label htmlFor="subDomain">Sub Domain</label>
                      <input
                        type="text"
                        name="subdomain"
                        id="subdomain"
                        value={formData.subdomain}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        // value=""
                        placeholder="Sub Domain Name"
                      />
                    </div> */}

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


                    <div className="md:col-span-5">
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
                    <div className="md:col-span-3">
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
                    

                    {/* <div className="md:col-span-3">
                      <label htmlFor="address">Admin Email</label>
                      <input
                        type="email"
                        name="admin_email"
                        id="admin_email"
                        // value={getEmail}
                        // onChange={(e) => setEmail(e.target.value)}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        // value=""
                        placeholder="email@domain.com"
                      />
                    </div> */}

                    {/* <div className="md:col-span-2">
                      <label htmlFor="city">Contact Number</label>
                      <input
                        type="number"
                        name="contact_number"
                        id="contact_number"
                        
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        
                        placeholder="contact number"
                      />
                    </div> */}

                    <div className="md:col-span-2">
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

                    <div className="md:col-span-2">
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

                    <div className="md:col-span-1">
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
                    {/* <div className="md:col-span-2">
                      <label htmlFor="city">Upload Logo</label>
                      <input
                        id="file_input"
                        type="file"
                        className="h-10 py-2 border mt-1 rounded px-4 w-full bg-gray-50"
                        
                        placeholder="contact number"
                      />
                    </div> */}
                    
                    <div className="md:col-span-5">
                      <label htmlFor="examination_controller_email">Examination Controller Email</label>
                      <input
                        type="email"
                        name="examination_controller_email"
                        id="examination_controller_email"
                        value={formData.examination_controller_email}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Examination Controller Email"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="assistant_exam_controller_email">Assistant Exam Controller Email</label>
                      <input
                        type="email"
                        name="assistant_exam_controller_email"
                        id="assistant_exam_controller_email"
                        value={formData.assistant_exam_controller_email}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Assistant Exam Controller Email"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="academic_head_email">Academic Head Email</label>
                      <input
                        type="email"
                        name="academic_head_email"
                        id="academic_head_email"
                        value={formData.academic_head_email}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Academic Head Email"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="hod_email">HOD Mail</label>
                      <input
                        type="email"
                        name="hod_email"
                        id="hod_email"
                        value={formData.hod_email}
                        onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="HOD Mail"
                      />
                    </div>

                    <div className="md:col-span-5 text-right">
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
  )
}

export default SignUpSuperAdmin
