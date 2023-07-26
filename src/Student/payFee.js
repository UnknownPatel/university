import React from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";

const PayFee = () => {
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  const handlePayment = useCallback(() => {
    const options = {
      key: "rzp_test_tZlQ1CoRvo4DTY",
      amount: "30000",
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      // image: "https://example.com/your_logo",
      order_id: "order_MG1xpRicjhhT3X",
      handler: (res) => {
        console.log(res);
        var subdomain = "silver_oak";
        var access_token = "K7G3jeCx9XmZWN8ogc6Zk4pYJKLX4Q1V2on8d9pLwgg";
        var headers = { Authorization: `Bearer ${access_token}` };

        axios
          .post(
            `https://9c5d-182-69-164-36.ngrok-free.app/api/v1/students/payments/callback`,
            {
              order_id: res.razorpay_order_id,
              subdomain: subdomain,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then((responce) => {
            console.log(responce);
          })
          .catch(function (err) {
            console.log(err.message);
          });
      },
      prefill: {
        name: "Piyush Garg",
        card_number: "5267 3181 8797 5449",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        subdomain: "silver_oak",
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
    rzpay.on("payment.success", (res) => {
      console.log(res);
    });
  }, [Razorpay]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      <StudentNavbar />
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/StudentHomePage"
                className="flex items-center p-2 text-gray-900 rounded-lg   dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Home</span>
              </a>
            </li>
            <li>
              <a
                href="/payFee"
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Pay Fees</span>
              </a>
            </li>
            <li>
              <a
                href="/feeReceipt"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Fee Receipt</span>
              </a>
            </li>
            <li>
              <a
                href="/StudentSyllabusView"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Syllabus</span>
              </a>
            </li>
            <li>
              <a
                href="/StudentCertificatePage"
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Certificate</span>
              </a>
            </li>
            <li>
              <a
                href="/certificateTracking"
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Certificate Tracking</span>
              </a>
            </li>
            <li>
              <a
                href="/UpdateProfile"
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Update Profile</span>
              </a>
            </li>
            <li>
              <div className="p-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  onClick={handleLogout}
                >
                  <span className="">Logout</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-4xl">
            <p>Fee Payments</p>
          </div>
        </div>

        <div
          id="certificate_req_viewport"
          className="flex flex-col mt-5"
          // style={{ height: 485 }}
        >
          <div className="">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="border rounded-lg">
                <table
                  id="my-table"
                  className="min-w-full divide-y text-center divide-gray-200"
                >
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        sr.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Semester
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Academic Year
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center divide-y divide-gray-200">
                    <tr>
                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        1
                      </td>
                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        3rd
                      </td>
                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        2022-2023
                      </td>
                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        35000
                      </td>
                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        <button
                          className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                          onClick={handlePayment}
                        >
                          Click
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayFee;
