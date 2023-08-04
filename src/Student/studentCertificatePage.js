import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

var access_token;
var subdomain;
var headers;
var amount;

const StudentCertificatePage = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [student, setStudent] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [certificateId, setCertificateId] = useState("");
  const [numberOfCopies, setNumberOfCopies] = useState("");
  const [reason, setReason] = useState("");
  const [text, setText] = useState("");
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
              setStudentId(res.data.data.student.id);
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

  const handleCertificateTypeChange = (e) => {
    e.preventDefault();
    var selectedIndex = e.target.options.selectedIndex;
    if (e.target.value === "Select Type") {
      setText("");
      setCertificateId("");
      amount = "";
    } else {
      amount = e.target.options[selectedIndex].getAttribute("data-amount");
      setCertificateId(e.target.value);
      setText(`₹ ${amount} per copy`);
    }
  };

  const handleNoOfCopiesChange = (e) => {
    e.preventDefault();
    if (e.target.value == "Select Number of copies") {
      setFees("");
      setNumberOfCopies("");
    } else {
      if (amount == "") {
        setFees(amount);
      } else {
        setFees(amount * e.target.value);
      }
      setNumberOfCopies(e.target.value);
    }
  };

  const handleCertificateRequest = (e) => {
    console.log(certificateId);
    console.log(numberOfCopies);
    console.log(fees);
    console.log(reason);
    if (certificateId === "") {
      toast.error("Please select Certificate type");
    } else if (numberOfCopies === "") {
      toast.error("Please select Number of copies ( Min : 1 )");
    } else if (fees === "") {
      toast.error("Please select number of copies ( Min : 1 )");
    } else if (reason === "") {
      toast.error(
        "You need to mention the reason in order to request the certificate"
      );
    } else {
      if (subdomain !== null || subdomain !== "") {
        console.log("Hello");
        axios
          .post(
            `/students/${studentId}/request_certificate`,
            {
              subdomain: subdomain,
              student_certificate: {
                number_of_copy: numberOfCopies,
                certificate_id: certificateId,
                amount: fees,
                reason: reason,
              },
            },
            {
              headers
            }
          )
          .then((res) => {
            if (res.data.status === "created"){
              toast.success(res.data.message);
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

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
          <div className="mt-5 flex flex-col">
            <label htmlFor="certificate-type" className="px-3 py-2">
              Certificate Type *
            </label>
            <select
              onChange={handleCertificateTypeChange}
              id="certificate-type"
              className="form-select rounded justify-center text-sm md:text-base lg:text-base ml-3 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 -mt-2 w-96"
            >
              <option value="Select Type">Select Type</option>
              {certificates.map((certificate) => {
                return (
                  <option
                    key={certificate.id}
                    value={certificate.id}
                    data-amount={certificate.amount}
                  >
                    {certificate.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="number-of-copies" className="px-3 py-2">
              {" "}
              Number of Copies *
            </label>
            <select
              onChange={handleNoOfCopiesChange}
              className=" form-select rounded justify-center text-sm md:text-base lg:text-base ml-3 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-96 -mt-2"
            >
              <option value="Select Number of copies">
                Select Number of copies
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
            <span
              className={`${
                text === "" ? "hidden" : "text-sm py-2 text-right w-96"
              }`}
            >
              {text}
            </span>
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="reason" className="px-3 py-2">
              {" "}
              Reason *
            </label>
            <textarea
              rows="5"
              name="reason"
              id="reason"
              onChange={(e) => {
                setReason(e.target.value);
              }}
              placeholder="Reason for Certificate"
              className="border-0 border-b-2 border-b-gray-700 ml-3 w-96 rounded px-3 py-2 -mt-2 bg-gray-50"
            />
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="" className="px-3 py-2">
              {" "}
              Amount{" "}
            </label>
            <input
              type="text"
              value={fees}
              className="bg-gray-50 border-0 border-b-2 text-gray-900 text-sm rounded-lg block w-96 px-3 py-2 ml-3 border-gray-600 "
              placeholder="₹ 0"
              disabled={true}
            />
          </div>
          <div className="mt-5">
            <button
              onClick={handleCertificateRequest}
              className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-3 ml-3 rounded"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificatePage;
