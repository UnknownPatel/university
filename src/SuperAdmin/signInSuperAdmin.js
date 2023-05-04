import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SignInSuperAdmin = () => {
    const navigate = useNavigate();
    const [getEmail, setEmail] = useState("");
    const [getPassword, setPassword] = useState("");
    const [subdomain, setSubdomain] = useState(null);

    useEffect(() => {
      const host = window.location.host;
      const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
      if (arr.length > 0) setSubdomain(arr[0]);

      console.log(arr)
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      // console.log("form submited");
      axios
        .get(
          ` http://ec2-52-66-116-8.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`
          // { params: { subdomain: subdomain } }
        )
        .then(function (response) {
          // setClentId(response.data.doorkeeper.client_id);
          // setClentSecret(response.data.doorkeeper.client_secret);
          axios
            .post(
              "http://ec2-52-66-116-8.ap-south-1.compute.amazonaws.com/api/v1/oauth/token",
              {
                grant_type: "password",
                subdomain: subdomain,
                email: getEmail,
                password: getPassword,
                client_id: response.data.doorkeeper.client_id,
                client_secret: response.data.doorkeeper.client_secret,
              }
            )
            .then((response) => {
              console.log(response.data);
  
              if (response.data.success === false) {
                // alert("Incorrect password or email id");
              } else {
                alert("logged in successfully !!");
                // navigate("/AdminDashboard");
                // const accessToken = localStorage.setItem(response.data.access_token);
                const accessToken = response.data.access_token;
                localStorage.setItem("access_token", accessToken);
                navigate("/home");
              }
            })
            .catch((err) => {
              console.log(err);
              console.log(err.response);
              alert("Incorrect password or email id");
            });
        })
        .catch(function (error) {
          console.log(error.message);
        });
    };
  return (
    <div>
      <section className="flex flex-col md:flex-row h-screen items-center">

<div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
  <img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?size=626&ext=jpg" alt="" className="w-full h-full object-cover"/>
</div>

<div className="bg-white w-full md:max-w-md lg:max-w-full mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
      flex items-center justify-center">

  <div className="w-full h-100">


    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>

    {/* <form className="mt-6" action="#" method="POST"> */}
      <div>
        <label className="block text-gray-700">Email Address</label>
        <input type="email" value={getEmail} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email Address" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autofocus autocomplete required/>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Password</label>
        <input type="password" value={getPassword} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" minlength="6" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" required/>
      </div>

      <div className="text-right mt-2">
        <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
      </div>

      <button type="submit" className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
            px-4 py-3 mt-6" onClick={handleSubmit}>Log In</button>
    {/* </form> */}

    <hr className="my-6 border-gray-300 w-full"/>

    <p className="mt-8">Need an account? <a href="/signupSuperAdmin" className="text-blue-500 hover:text-blue-700 font-semibold">
        Create an University
        </a></p>
    <p><a href="/AdminLogin" className='text-blue-500 hover:text-blue-700 font-semibold'>Admin login</a></p>

  </div>
</div>

</section>
    </div>
  )
}

export default SignInSuperAdmin
