import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

var acces_token;
var headers;
var subdomain;

const CertificateTracking = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [student, setStudent] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [certificateRequests, setCertificateRequests] = useState([]);

  useEffect(() => {
    acces_token = localStorage.getItem("access_token");
    headers = { Authorization: `Bearer ${acces_token}` };

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
              setStudentId(res.data.data.student.id);
              setSemesterId(res.data.data.student.semester_id);
              axios
                .get(`/student_certificates`, {
                  headers,
                  params: {
                    subdomain: subdomain,
                    student_certificate: {
                      student_id: res.data.data.student.id,
                    },
                  },
                })
                .then((res) => {
                  if (res.data.status === "ok") {
                    setCertificateRequests(res.data.data.student_certificates);
                  } else {
                    setCertificateRequests([]);
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
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <p>Certificate Tracking</p>
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
                          Certificate
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
                          Number Of Copy
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Request Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Approval Date
                        </th>
                        
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Acknowledgement
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Download
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {certificateRequests.map((request, index) => {
                        return (
                          <tr key={request.id}>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase">
                              {request?.["certificate"]?.["name"]}
                            </td>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase">
                              {semesterId}
                            </td>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase">
                              {request.number_of_copy}
                            </td>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500">
                              {request.requested_date}
                            </td>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500">
                              {request.approval_date}
                            </td>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500">{request.status}</td>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500">{request.notes}</td>
                            <td className="px-6 py-3 text-xs font-bold text-center text-gray-500"></td>
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

export default CertificateTracking;
