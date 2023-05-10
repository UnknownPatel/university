import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";

const ExamTimeTable = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }
  const [activeButton, setActiveButton] = useState("button1");

  function toggleContent(buttonId) {
    setActiveButton(buttonId);
  }
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };
  return (
    <div>
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
                    Institute Name
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
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src=""
                        alt="user photo"
                      />
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
                <button
                  className="bg-gray-300 py-2 px-4 rounded-md"
                  onClick={toggleDropdown}
                >
                  Examination
                </button>
                <div
                  className={`bg-white shadow rounded-md mt-2 py-2 ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <a
                  href="/examBlockDetails"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Enter Block Details
                </a>
                <a
                  href="/examAssignSupervision"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Assign Supervision
                </a>
                <a
                  href="/examTimeTable"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Time Table
                </a>
                </div>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="ml-3">Create TimeTable</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Faculty Supervision List
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    View Supervision List
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="p-4 sm:ml-64">
          <div className="p-4 rounded-lg mt-14">
            <div className="text-center text-4xl">
              <p>Examination</p>
            </div>
            <hr className="mt-2" />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button1" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button1")}
              >
                Time Table
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button2" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button2")}
              >
                Blockwise Report
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button3" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button3")}
              >
                Jr.Supervisor Tab
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button4" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button4")}
              >
                Sr.Supervisor Tab
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button5" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button5")}
              >
                Other Duties
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              {/* Button Content 1 */}
              <div
                id="content1"
                className={`w-full p-4 rounded-lg ${
                  activeButton === "button1" ? "block" : "hidden"
                }`}
              >
                <div className="text-center text-2xl">University Name</div>
                <div className="text-center text-2xl"></div>
                <div className="text-center text-2xl">Time Table</div>
                <br />
                <div className="flex justify-center">
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Department:
                  </label>
                  <select className="form-select text-sm md:text-base lg:text-base mr-2 border-2 px-3 py-2">
                    <option>Select Department</option>
                  </select>
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Examination
                  </label>
                  <select className="form-select text-sm md:text-base lg:text-base mr-2 border-2 px-3 py-2">
                    <option>Select Examination</option>
                    <option>Winter</option>
                    <option>Summers</option>
                  </select>
                </div>
                <div className="flex justify-center items-center  ml-64 mt-2">
                  <label
                    htmlFor="year-picker"
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select year:
                  </label>
                  <DatePicker
                    id="year-picker1"
                    selected={selectedYear}
                    onChange={handleYearChange}
                    showYearPicker
                    dateFormat="yyyy"
                    className="border rounded px-3 py-2 w-52 justify-center"
                  />
                </div>
                <div className="flex flex-col mt-5">
                  <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Subject Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Subject Code
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Day And Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Time
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <select className="form-select text-sm md:text-sm lg:text-sm mr-2 border-2">
                                  <option>Select Subject Name</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <select className="form-select text-sm md:text-sm lg:text-sm mr-2 border-2">
                                  <option>Select Code</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <input
                                  className="shadow appearance-none border rounded w-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id=""
                                  type="text"
                                  placeholder="Day and Date"
                                />
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <input
                                  className="shadow appearance-none border rounded w-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id=""
                                  type="text"
                                  placeholder="Time"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold">
                    Download
                  </button>
                </div>
              </div>
              {/* Button Content 2 */}
              <div
                id="content2"
                className={`w-full  rounded-lg ${
                  activeButton === "button2" ? "block" : "hidden"
                }`}
              >
                <div className="text-center text-2xl">University Name</div>
                <div className="text-center text-2xl">Block Wise Report</div>
                <div className="flex flex-col mt-5">
                  <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Subject Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Subject Code
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Time
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                No. of Rooms
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                No. of Blocks
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                No. of Students
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                1
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                2
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                3
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                4
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                5
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                6
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                7
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold">
                    Download
                  </button>
                </div>
              </div>
              {/* Button Content 3 */}
              <div
                id="content3"
                className={`w-full  rounded-lg ${
                  activeButton === "button3" ? "block" : "hidden"
                }`}
              >
                <div className="text-center text-2xl">University Name</div>
                <div className="text-center text-2xl">
                  Junior Supervisor List
                </div>
                <div className="flex justify-center mt-5 ml-56">
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Examination:
                  </label>
                  <select className="form-select text-sm md:text-base lg:text-base mr-2 border-2">
                    <option>Select Examination</option>
                    <option>Winter</option>
                    <option>Summers</option>
                  </select>
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Year:
                  </label>
                  <DatePicker
                    id="year-picker"
                    selected={selectedYear}
                    onChange={handleYearChange}
                    showYearPicker
                    dateFormat="yyyy"
                    className="border rounded px-3 py-2"
                  />
                </div>
                <div className="flex flex-col mt-5">
                  <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Designation
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Department
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Morning
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Morning
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Evening
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Evening
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Sign
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                1
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                2
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                3
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                4
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                5
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                6
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                7
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                8
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold">
                    Download
                  </button>
                </div>
              </div>
              {/* Button Content 4 */}
              <div
                id="content4"
                className={`w-full  rounded-lg ${
                  activeButton === "button4" ? "block" : "hidden"
                }`}
              >
                <div className="flex justify-center mt-5 ml-56">
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Examination:
                  </label>
                  <select className="form-select text-sm md:text-base lg:text-base mr-2 border-2">
                    <option>Select Examination</option>
                    <option>Winter</option>
                    <option>Summers</option>
                  </select>
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Year:
                  </label>
                  <DatePicker
                    id="year-picker"
                    selected={selectedYear}
                    onChange={handleYearChange}
                    showYearPicker
                    dateFormat="yyyy"
                    className="border rounded px-3 py-2"
                  />
                </div>
                <div className="flex flex-col mt-5">
                  <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Designation
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Department
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Morning
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Morning
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Evening
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Date & Evening
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Sign
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                1
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                2
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                3
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                4
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                5
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                6
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                7
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                8
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold">
                    Download
                  </button>
                </div>
              </div>
              {/* Button Content 5 */}
              <div
                id="content5"
                className={`w-full  rounded-lg ${
                  activeButton === "button5" ? "block" : "hidden"
                }`}
              >
                <div className="text-center text-2xl">University Name</div>
                <div className="text-center text-2xl">Other Duties</div>
                <div className="flex flex-col mt-5">
                  <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Name of Staff
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                designation
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Assigned Duty
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Sign
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"></td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"></td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"></td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTimeTable;
