import React from "react";

const AdminLogin = () => {
  return (
    <div>
      <section className="flex flex-col md:flex-row h-screen items-center">
        <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
          {/* <img
            src="https://img.freepik.com/premium-vector/man-with-key-near-computer-account-login-password-vector-male-character-concept-business_566886-1945.jpg?w=2000"
            alt=""
            className="w-full h-full object-cover"
          /> */}
          {/* <img
            src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7963.jpg?size=626&ext=jpg&ga=GA1.1.273664279.1682681851&semt=sph"
            alt=""
            className="w-full h-full object-cover"
          /> */}
          <img
            src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?size=626&ext=jpg&ga=GA1.1.273664279.1682681851&semt=sph"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="bg-white w-full md:max-w-md lg:max-w-full mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
      flex items-center justify-center"
        >
          <div className="w-full h-100">
            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
              Admin Login
            </h1>

            <form className="mt-6" action="#" method="POST">
              <div>
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  name=""
                  id=""
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
                  name=""
                  id=""
                  placeholder="Enter Password"
                  minlength="6"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
              focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="text-right mt-2">
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
              px-4 py-3 mt-6"
              >
                Log In
              </button>
            </form>

            <hr className="my-6 border-gray-300 w-full" />

            <p className="mt-8">
              If You Are Super Admin{" "}
              <a
                href="#"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                SuperAdmin Login
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
