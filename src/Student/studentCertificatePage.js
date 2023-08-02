import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

var access_token;
var subdomain;
var headers;
var studentId;
var amount;

const StudentCertificatePage = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [student, setStudent] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [fees, setFees] = useState("");

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
        .get(`/certificates`, {
          headers,
          params: {
            subdomain: subdomain,
          },
        })
        .then((res) => {
          if (res.data.status === "ok") {
            if (res.data.data.certificates.length !== 0) {
              console.log("Hello");
              setCertificates(res.data.data.certificates);
            } else {
              setCertificates([]);
            }
          } else {
            setCertificates([]);
          }
        })
        .catch((err) => {
          console.error(err);
        });

      axios
        .get(`/students/find_student_by_auth_token?subdomain=${subdomain}`, {
          headers,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            if (res.data.data.student.length !== "0") {
              setStudent(res.data.data.student.name);
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

  const handleCertificateChange = (e) => {
    e.preventDefault();
    var selectedIndex = e.target.options.selectedIndex;
    amount = e.target.options[selectedIndex].getAttribute("data-amount");
  }

  const handleNoOfCopiesChange = (e) => {
    e.preventDefault();
    var no_of_copies = e.target.value;
    setFees(amount * no_of_copies);
  }

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
                href="#"
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
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <p>Request For Certificate</p>
          </div>
          <div className="mt-5">
            <select
              onChange={handleCertificateChange}
              className=" form-select rounded justify-center text-sm md:text-base lg:text-base ml-3 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto">
              <option value="">--- Select Certificate Type ---</option>
              {certificates.map((certificate) => {
                return (
                  <option value={certificate.id} data-amount={certificate.amount}>{certificate.name}</option>
                )
              })}
            </select>
            <select 
              onChange={handleNoOfCopiesChange}
              className=" form-select rounded justify-center text-sm md:text-base lg:text-base ml-3 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto">
              <option value="">--- Select No. of copies ---</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </div>
          <div className="mt-5">
            <textarea
              type=""
              name="reason"
              id="reason"
              placeholder="Reason for Certificate"
              className="h-10 border-0 border-b-2 border-b-gray-700 mt-1 ml-3 rounded px-4 bg-gray-50"
            />
            <div className="mt-5 ml-5">
            fees:-{fees}
            </div>
          </div>
          <div className="mt-5">
            <button className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificatePage;
