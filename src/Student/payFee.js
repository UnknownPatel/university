import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import numberToWords from "number-to-words";
import { toast } from "react-toastify";

var access_token;
var subdomain;
var headers;
var studentId;

const PayFee = () => {
  const [uniName, setUniName] = useState("");
  const [student, setStudent] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [feeDetails, setFeeDetails] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  useEffect(() => {
    access_token = localStorage.getItem("access_token");
    headers = { Authorization: `Bearer ${access_token}` };

    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(`/universities/${subdomain}/get_authorization_details`)
        .then((response) => {
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`/students/find_student_by_auth_token?subdomain=${subdomain}`, {
          headers,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            if (res.data.data.student.length !== "0") {
              setStudent(res.data.data.student.name);
              studentId = res.data.data.student.id;
              setStudentDetails(res.data.data.student);
              axios
                .get(`/fee_details`, {
                  headers,
                  params: {
                    subdomain: subdomain,
                    fee_detail: {
                      semester_id: res.data.data.student.semester_id,
                    },
                  },
                })
                .then((res) => {
                  if (res.data.status === "ok") {
                    setFeeDetails(res.data.data.fee_details);
                    var updatedCombination = {};
                    res.data.data.fee_details.map((fee_detail) => {
                      axios.get(`/students/${studentId}/fetch_fee_payment_status`,{
                        headers,
                        params: {
                          subdomain: subdomain,
                          academic_year: fee_detail.academic_year,
                          semester_id: fee_detail.semester_id
                        }
                      })
                      .then(res => {
                        if (res.data.status === "ok"){
                          if(res.data.data.fee_detail.length !== "0"){
                            updatedCombination = {
                              ...updatedCombination,
                              [`${JSON.stringify(res.data.data.fee_detail.id)}`]:
                                res.data.data.status,
                            };
                            setPaymentStatus(updatedCombination);
                          }
                        }
                      })
                      .catch(err => {
                        console.error(err); 
                      })
                    })
                  } else {
                    setFeeDetails([]);
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            } else {
              setStudent([]);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const handlePayment = useCallback(
    (e) => {
      var academic_year = e.target.getAttribute("data-academic-year");
      var semester_id = e.target.getAttribute("data-semester-id")
      axios
        .post(
          `/students/${studentId}/payments`,
          {
            subdomain: subdomain,
            payment: {
              academic_year: academic_year,
            },
          },
          {
            headers,
          }
        )
        .then((res) => {
          var options = {};
          if (res.data.status === "created") {
            if (res.data.data.payment.length !== "0") {
              options = {
                key: "rzp_test_tZlQ1CoRvo4DTY",
                currency: "INR",
                name: uniName,
                description: "Test Transaction",
                order_id: res.data.data.payment.razorpay_order_id,
                handler: (res) => {
                  axios
                    .post(
                      `/students/payments/callback`,
                      {
                        order_id: res.razorpay_order_id,
                        payment_id: res.razorpay_payment_id,
                        student_id: studentId,
                        subdomain: subdomain,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${access_token}`,
                        },
                      }
                    )
                    .then((responce) => {
                      if(responce.data.status === "ok"){
                        console.log(responce.data);
                        toast.success(responce.data.message);
                        var updatedCombination = {};
                        axios.get(`/students/${studentId}/fetch_fee_payment_status`,{
                          headers,
                          params: {
                            subdomain: subdomain,
                            academic_year: academic_year,
                            semester_id: semester_id
                          }
                        })
                        .then(res => {
                          if (res.data.status === "ok"){
                            if(res.data.data.fee_detail.length !== "0"){
                              updatedCombination = {
                                ...updatedCombination,
                                [`${JSON.stringify(res.data.data.fee_detail.id)}`]:
                                  res.data.data.status,
                              };
                              setPaymentStatus(updatedCombination);
                            }
                          }
                        })
                        .catch(err => {
                          console.error(err); 
                        })
                      } else {
                        toast.error(responce.data.message);
                      }
                    })
                    .catch(function (err) {
                      console.log(err.message);
                    });
                },
                prefill: {
                  name: student,
                  contact: studentDetails?.["contact_details"]?.["mobile_number"],
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
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [Razorpay]
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <StudentNavbar uniName={uniName} studentName={student} />
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
                  // onClick={  leLogout}
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
                    {feeDetails.map((fee_detail, index) => {
                      return (
                        <tr>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {numberToWords.toOrdinal(
                              fee_detail?.["semester"]?.["name"]
                            ) + " semester"}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {fee_detail.academic_year}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {fee_detail.amount}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <button
                              data-academic-year={fee_detail.academic_year}
                              data-semester-id={fee_detail.semester_id}
                              className={`${paymentStatus?.[fee_detail.id] ? "cursor-not-allowed" : "inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition" } `}
                              onClick={handlePayment}
                              disabled={paymentStatus?.[fee_detail.id]}
                            >
                              {paymentStatus?.[fee_detail.id] ? "Paid" : "Pay Fees" }
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr></tr>
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
