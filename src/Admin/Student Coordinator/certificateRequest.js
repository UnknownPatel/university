import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import StudentCoordinatorAside from "./studentCoordinatorAside";
import { SiRottentomatoes } from "react-icons/si";

var acces_token;
var headers;
var subdomain;

const CertificateRequest = () => {
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [notes, setNotes] = useState("");
  const [certificateRequests, setCertificateRequests] = useState([]);

  useEffect(() => {
    acces_token = localStorage.getItem("access_token");
    const roles = localStorage.getItem("roles");

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
          //   console.log(response.data.university.name);
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`/users/users/find_user?subdomain=${subdomain}`, {
          headers,
        })
        .then((responce) => {
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
        })
        .catch((error) => console.log(error));

      axios
        .get(`/student_certificates`, {
          headers,
          params: {
            subdomain: subdomain,
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
    }

    if (roles === null) {
      toast.error("Something went wrong, please Try Again!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, []);

  const handleCertificateRequest = (e, requestId, status) => {
    e.preventDefault();
    if (notes === "") {
      toast.error("Please enter some notes for the certificate");
    } else {
      if (subdomain !== null || subdomain !== "") {
        axios
          .put(
            `/student_certificates/${requestId}`,
            {
              subdomain: subdomain,
              student_certificate: {
                notes: notes,
                status: status,
              },
            },
            {
              headers,
            }
          )
          .then((res) => {
            if (res.data.status === "ok") {
              toast.success(res.data.message);
              axios
                .get(`/student_certificates`, {
                  headers,
                  params: {
                    subdomain: subdomain,
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
              toast.error(res.data.message);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="" className="flex ml-2 md:mr-24">
                <img src="" className="h-8 mr-3" alt="Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  {uniName}
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="self-center text-xl mr-2 font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                      {faculty}
                    </span>
                    <span className="sr-only">Open user menu</span>
                  </button>
                </div>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    ></p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    ></p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      ></a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      ></a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      ></a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      ></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <StudentCoordinatorAside />

      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-4xl">
            <p>certificates requested </p>
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
                  className="min-w-full divide-y table-auto text-center divide-gray-200"
                >
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                      >
                        sr.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Certificate Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Student Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Enrollment No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        No. of Copies
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        Notes
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
                    {certificateRequests.map((request, index) => {
                      return (
                        <tr>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {request?.["certificate"]?.["name"]}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {request?.["student"]?.["name"]}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {request?.["student"]?.["enrollment_number"]}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {request.number_of_copy}
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <input
                              className="shadow appearance-none border rounded w-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id={"input-notes-" + request.id}
                              onChange={(e) => setNotes(e.target.value)}
                              type="text"
                              placeholder="Enter notes for the certificate"
                            />
                          </td>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <button
                              className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                              font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                              id={"button-request" + request.id}
                              onClick={(e) => {
                                handleCertificateRequest(
                                  e,
                                  request.id,
                                  "accepted"
                                );
                              }}
                            >
                              Accept
                            </button>

                            <button
                              className="ml-2 text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                              font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                              id={"button-request" + request.id}
                              onClick={(e) => {
                                handleCertificateRequest(
                                  e,
                                  request.id,
                                  "rejected"
                                );
                              }}
                            >
                              Reject
                            </button>
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
  );
};

export default CertificateRequest;
