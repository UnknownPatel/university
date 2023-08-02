import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import { MdOutlineFileDownload } from "react-icons/md";
import numberToWords from "number-to-words";
import axios from "axios";

var access_token;
var subdomain;
var headers;
var studentId;

const FeeReceipt = () => {
  const [uniName, setUniName] = useState("");
  const [student, setStudent] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [feeDetails, setFeeDetails] = useState([]);

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
                .get(
                  `/students/${res.data.data.student.id}/fetch_paid_fee_detail`,
                  {
                    headers,
                    params: {
                      subdomain: subdomain,
                    },
                  }
                )
                .then((res) => {
                  console.log(res);
                  if (res.data.status === "ok") {
                    if (res.data.data.fee_details.length !== "0") {
                      console.log("Hello Fee Details Found");
                      setFeeDetails(res.data.data.fee_details);
                    }
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            } else {
              setStudentDetails([]);
              setStudent([]);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const navigate = useNavigate();

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
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Home</span>
              </a>
            </li>
            <li>
              <a
                href="/payFee"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Pay Fees</span>
              </a>
            </li>
            <li>
              <a
                href="/feeReceipt"
                className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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

      <div className="pt-4 sm:ml-64">
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-4xl">
            <p>Fees Transaction Reciept</p>
          </div>

          <div
            id="Fee_table_viewport"
            className="flex flex-col mt-5 h-[65vh] max-h-fit "
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y table-auto divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                        >
                          Academic Year
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Semester
                        </th>
                        <th
                          scope="col"
                          className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
                        >
                          Receipt Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Receipt No
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Payment Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Download
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {feeDetails.map((feeDetail) => {
                        return (
                          <tr key={feeDetail.id}>
                            <td className=" px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              {feeDetail.academic_year}
                            </td>
                            <td className=" px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              {numberToWords.toOrdinal(
                                feeDetail?.["semester"]?.["name"]
                              ) + " semester"}
                            </td>
                            <td className=" px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              01/03/2023
                            </td>
                            <td className=" px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              230103-10694
                            </td>
                            <td className=" px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              {feeDetail.amount}
                            </td>
                            <td className=" px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              Online
                            </td>
                            <td className=" px-6 py-4 text-sm flex justify-center text-gray-800 whitespace-nowrap">
                              <MdOutlineFileDownload size={20} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeReceipt;
