import React from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import { FaUniversity, FaUserGraduate } from "react-icons/fa";
import { BsPersonSquare } from "react-icons/bs";
import { SlCalender, SlScreenSmartphone } from "react-icons/sl";
import { MdOutlineMail } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import profile from "../Images/icons8-users-64.png";

const StudentHomePage = () => {
  const navigate = useNavigate();

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
                className="flex items-center p-2 text-gray-900 rounded-lg  bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
          <div className="text-center text-5xl">
            <p>Welcome</p>
          </div>

          <div className="flex">
            <div className="w-full  sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-2/5 p-4">
              <div className="bg-slate-100 rounded-lg shadow-md h-full flex flex-col">
                <div className="flex justify-center mt-2">
                  <img
                    className="w-40 h-40 flex justify-center rounded-sm"
                    src={profile}
                    alt="Image 1"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-semibold mt-5 mb-2 text-center">
                    Student Name
                  </h2>
                  <p className="text-gray-600 text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <a
                    href="/studentProfile"
                    className="text-blue-500 font-semibold mt-7 flex justify-end"
                  >
                    More Details
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-full md:w-full lg:w-3/4 xl:w-3/5 p-4">
              <div className="bg-slate-100 rounded-lg shadow-md h-full flex flex-col">
                <div className="flex mt-9 ml-10">
                  <FaUniversity size={30} />
                  <div className="ml-10 text-xl ">University Name</div>
                </div>
                <div className="flex mt-5 ml-10">
                  <FaUserGraduate size={30} />
                  <div className="ml-10 text-xl">Cource Name</div>
                </div>
                <div className="flex mt-5 ml-10">
                  <BsPersonSquare size={30} />
                  <div className="ml-10 text-xl">Gender</div>
                </div>
                <div className="flex mt-5 ml-10">
                  <SlCalender size={30} />
                  <div className="ml-10 text-xl">Birth Date</div>
                </div>
                <div className="flex mt-5 ml-10">
                  <MdOutlineMail size={30} />
                  <div className="ml-10 text-xl">Email Id</div>
                </div>
                <div className="flex mt-5 ml-10 ">
                  <SlScreenSmartphone size={30} />
                  <div className="ml-10 text-xl">Phone No.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-80 sm:w-full md:w-full lg:w-3/4 xl:w-full p-4">
            <div className="bg-slate-100 rounded-lg shadow-md h-full flex flex-col">
              <div className="text-4xl mt-3 ml-5 flex">
                <HiOutlineSpeakerphone className=" mr-10" />
                Announcements
              </div>
              <hr className="mt-3" />
              <div className="p-4 flex-grow">
                <h2 className="text-lg font-semibold mt-5 mb-2 text-center">
                  About Exam
                </h2>
                <p className="text-gray-600 text-center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <a
                href="#"
                className="text-blue-500 font-semibold mb-5 mr-5 flex justify-end"
              >
                More Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
