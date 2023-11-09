import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiSad, BiHappy } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import RejectUniversity from "./modals/rejectUniversity";
import Loader from "./loader";

var access_token = localStorage.getItem("access_token");

const AcceptedUniversities = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [rejectModal, setRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (access_token === null) {
      toast.error("You are not authorized to access the page.");
      navigate("/");
    } else {
      setIsLoading(true);
      axios
        .get("/universities")
        .then((res) => {
          setUniversities(res.data.accepted_universities);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <div>
        <nav
          className={`fixed top-0 z-50 w-full bg-white dark:bg-gray-800 dark:border-gray-700`}
        >
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
                    {"University"}
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
                        {}
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

        <aside
          id="logo-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="/pendingRequests"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Pending Requests
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="/acceptedUniversities"
                  className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Accepted University
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="/rejectedUniversities"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Rejected University
                  </span>
                </a>
              </li>

              <div className="p-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  onClick={handleLogout}
                >
                  <span className="">Logout</span>
                </button>
              </div>
            </ul>
          </div>
        </aside>

        <div className="h- p-4 sm:ml-64">
          <div className="p-4 rounded-lg mt-14">
            <div className="text-center text-4xl mb-5">
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                Accepted Universities
              </h3>
            </div>

            <div className="flex flex-col mt-5">
              <div className="">
                {isLoading ? (
                  <div className="w-full flex items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <div className="p-1.5 w-full inline-block align-middle">
                    <div className="border rounded-lg">
                      <table className="min-w-full divide-y table-auto divide-gray-200">
                        {universities.length === 0 ? (
                          <tbody className="text-center divide-y divide-gray-200">
                            <tr className="items-center">
                              <td
                                colSpan={3}
                                className="px-6 py-4 bg-white  border-2 border-red-900 border-collapse rounded-3xl text-black text-3xl whitespace-nowrap"
                              >
                                No University is accepted yet!
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          <>
                            <thead className="sticky top-0 bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  Sr No.
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  Univerisity Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-center divide-y divide-gray-200">
                              {universities.map((university, index) => {
                                return (
                                  <tr key={university.id}>
                                    <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {index + 1}
                                    </td>
                                    <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {university.name}
                                    </td>
                                    <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      <button
                                        id={university.id}
                                        className="text-center w-auto bg-transparent text-red-600 p-3 ml-2 rounded-full tracking-wide
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-gray-100 shadow-lg cursor-pointer transition ease-in duration-300"
                                        onClick={() => {
                                          setRejectModal(true);
                                        }}
                                      >
                                        <div className="flex">
                                          <BiSad size={20} className="mr-2" />{" "}
                                          Reject
                                        </div>
                                      </button>

                                      {rejectModal && (
                                        <RejectUniversity
                                          setOpenModal={setRejectModal}
                                          id={university.id}
                                          setUniversities={setUniversities}
                                          subdomain={university.subdomain}
                                        />
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </>
                        )}
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedUniversities;
