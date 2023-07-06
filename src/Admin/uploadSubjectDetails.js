import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

var access_token;
var subdomain;
var year;
var headers;

const UploadSubjectDetails = () => {
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const navigate = useNavigate();
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    access_token = localStorage.getItem("access_token");
    year = new Date().getFullYear();
    setAcademicYears(
      Array.from(
        new Array(20),
        (val, index) => year - (index + 1) + " - " + (year - index)
      )
    );
    headers = { Authorization: `Bearer ${access_token}` };

    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`
        )
        .then((response) => {
          //   console.log(response.data.university.name);
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(headers);

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/find_user?subdomain=${subdomain}`,
          {
            headers,
          }
        )
        .then((responce) => {
          // selectedFilter = responce.data.configuration;
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    access_token = localStorage.getItem("access_token");
    const submit_button = document.getElementById("button-submit-excel-sheet");
    const file_select = document.getElementById("file_select");
    const file_input = document.getElementById("file_input");
    submit_button.disabled = true;
    submit_button.innerHTML = "Uploading ...";
    submit_button.classList.add("cursor-not-allowed");
    if (selectedFile !== null || selectedFile !== "") {
      console.log("Uploading");
      axios
        .post(
          " http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/excel_sheets",
          {
            subdomain: subdomain,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((responce) => {
          console.log(responce.data);
          submit_button.disabled = false;
          submit_button.innerHTML = "Upload";
          submit_button.classList.remove("cursor-not-allowed");
          if (responce.data.status == "created") {
            file_select.options[file_select.options.selectedIndex].text =
              "Select Sheet name";
            file_input.value = null;
            setSelectedFile("");
            setSelectedValue("");
            toast.success(responce.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          } else {
            toast.error(responce.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch(function (err) {
          submit_button.disabled = false;
          submit_button.innerHTML = "Upload";
          submit_button.classList.remove("cursor-not-allowed");
          console.log(err.message);
        });
    }
    console.log(selectedFile);
  };

  const handleSheetNameChange = (e) => {
    setSelectedValue(e.target.value);
    setSelectedFile("");
    const hidden_div = document.getElementById("hidden_div");
    const file_input = document.getElementById("file_input");
    file_input.value = null;
    if (e.target.value !== "Select Sheet name") {
      hidden_div.classList.remove("hidden");
    } else {
      hidden_div.classList.add("hidden");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
                    clip-rule="evenodd"
                    fill-rule="evenodd"
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

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/upload_SubjectDetails"
                className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Upload Subject Details</span>
              </a>
            </li>
            <li>
              <a
                href="/academic_UploadSyllabus"
                className="flex items-center p-2 text-gray-900  rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Upload Syllabus</span>
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
          <div className="text-center text-4xl mb-5">
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              Upload Subject Details Excel Sheet
            </h3>
          </div>

          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              class="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10"
            >
              {/* <div className="flex">
                <select
                  id="file_select"
                  className="form-select w-full rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  // className="block p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => {
                    handleSheetNameChange(e);
                  }}
                >
                  <option>Select Sheet name</option>
                  <option>Faculty Details</option>
                  <option>Course and Semester Details</option>
                  <option>Subject Details</option>
                  <option>Division Details</option>
                  <option>Student Details</option>
                </select>
              </div> */}

              <div id="hidden_div" className="">
                <div className="text-center text-2xl mt-5"></div>

                <div className="grid grid-cols-1 space-y-2">
                  <label className="text-start text-sm font-bold text-gray-500 tracking-wide">
                    Choose {selectedValue} Sheet
                  </label>
                  <div className="flex justify-center w-full">
                    <span class="sr-only">Choose {selectedValue} Sheet</span>
                    <input
                      type="file"
                      id="file_input"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-blue-100"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      accept=".xls,.xlsx"
                    />
                  </div>
                </div>

                {/* <div className="grid grid-cols-1 space-y-2">
                  <label className="text-start text-sm font-bold text-gray-500 tracking-wide">
                    Attach {selectedValue} Sheet
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col rounded-lg w-full border-4 border-dashed h-60 p-10 group text-center">
                      <div className="h-full w-full text-center flex flex-col justify-center items-center  ">
                        <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                          <img
                            className="has-mask h-36 object-center"
                            src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                            alt="freepik image"
                          />
                        </div>
                        <p className="pointer-none text-gray-500 ">
                          <span className="text-sm">Drag and drop</span> files
                          here <br /> or
                            select a file
                        
                          from your computer
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        accept=".xls,.xlsx"
                      />
                    </label>
                  </div>
                </div> */}
                <div className="flex justify-center mt-5">
                  <button
                    type="submit"
                    id="button-submit-excel-sheet"
                    // className="py-3 px-8 bg-black rounded-2xl text-white font-bold"
                    className="text-center w-full bg-green-600 text-gray-100 p-4 rounded-full tracking-wide
                font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-700 shadow-lg cursor-pointer transition ease-in duration-300"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadSubjectDetails;