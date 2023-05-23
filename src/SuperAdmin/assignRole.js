import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

var acces_token;
var subdomain;
var id;
const AssignRole = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [clientId, setClentId] = useState("");
  const [clientSecret, setClentSecret] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [data, setData] = useState([{}]);
  const [roleData, setRoleData] = useState([{}]);
  const [fName, setFname] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [id, setId] = useState("");
  const [facultyName, setFacultyName] = useState([]);
  const [facultyId, setFacultyId] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [role, setRole] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [remove, setRemove] = useState("");
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    setFaculties([]);
    acces_token = localStorage.getItem("access_token");
    console.log(acces_token);
    const headers = { Authorization: `Bearer ${acces_token}` };
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
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setData(response.data.data.users);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/roles?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setRoleData(response.data.data.role_names);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/assigned_role_users?subdomain=${subdomain}`,
          { headers }
        )
        .then((get_response) => {
          if (get_response.data.message === "Details found") {
            console.log(get_response.data.data.users);
            setFaculties(get_response.data.data.users);
          }
        })
        .catch((error) => console.log(error));
    }

    // axios
    // .post(
    //   `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/${id}/assign_role`,
    //   {
    //     user: {
    //       role_name: selectedValue,
    //     },subdomain: subdomain
    //   },
    //   {
    //     headers: {
    //       'Authorization' : `Bearer ${acces_token}`
    //     }
    //   }
    // )
    // .then((responce) => {
    //   console.log(responce.data);
    //   setFacultyId( responce.data.data.user.id);
    //   setFacultyName( responce.data.data.user.first_name);
    //   setDesignation( responce.data.data.user.designation);
    //   setRole(responce.data.data.role)
    //   console.warn(responce.data.data.user.designation)
    //   // console.log(responce.data.data.user.first_name);

    //   if (responce.data.success === false) {
    //   // } else {
    //   //   alert("successfully updated");
    //   }
    // })
    // .catch(function (err) {
    //   console.log(err.message);
    // });
  }, []);

  const toggleContent = () => {
    console.log("Button Clicked");
    setIsHidden(!isHidden);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    acces_token = localStorage.getItem("access_token");
    // Assign Role API
    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/${id}/assign_role`,
        {
          user: {
            role_name: selectedValue,
          },
          subdomain: subdomain,
        },
        {
          headers: {
            Authorization: `Bearer ${acces_token}`,
          },
        }
      )
      .then((responce) => {
        console.log(responce.data);
        setFacultyId([...facultyId, responce.data.data.user.id]);
        setFacultyName([...facultyName, responce.data.data.user.first_name]);
        setDesignation([...designation, responce.data.data.user.designation]);
        setRole([...role, responce.data.data.role]);
        console.log(responce.data.data.role);
        // console.log(responce.data.data.user.first_name);

        if (responce.data.success === false) {
          // } else {
          //   alert("successfully updated");
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };

  const handleRemoveRole = (e) => {
    e.preventDefault();
    console.log(e.target.getAttribute("data-id"));
    acces_token = localStorage.getItem("access_token");

    const faculty_id = e.target.getAttribute("data-id");
    const role_name = e.target.getAttribute("data-role-name");

    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/${faculty_id}/deassign_role`,
        {
          user: {
            role_name: role_name,
          },
          subdomain: subdomain,
        },
        {
          headers: {
            Authorization: `Bearer ${acces_token}`,
          },
        }
      )
      .then((responce) => {
        console.log(responce.data);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");

    axios
      .post(
        "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/roles",
        {
          role: {
            name: roleName,
          },
          subdomain: subdomain,
        },
        {
          headers: {
            Authorization: `Bearer ${acces_token}`,
          },
        }
      )
      .then((responce) => {
        console.log(responce.data);
        setRoleName("");
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };

  const handleonChange = (event) => {
    setId(event.target.value);
    var selectedIndex = event.target.options.selectedIndex;
    setFname(
      event.target.options[selectedIndex].getAttribute("data-designation")
    );
    console.log(
      event.target.options[selectedIndex].getAttribute("data-designation")
    );
    // const node = document.getElementById('select_name');
    // console.log(e.target.getAttribute("data-designation"));
  };

  const handleLogout = () => {
    const accessToken = localStorage.getItem("access_token");
    // Get Authorization details
    axios
      .get(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`
      )
      .then(function (response) {
        setClentId(response.data.doorkeeper.client_id);
        setClentSecret(response.data.doorkeeper.client_secret);
      })
      .catch(function (error) {
        console.log(error.message);
      });

    // Logout API request
    axios
      .post(
        " http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/oauth/revoke",
        {
          token: { accessToken },
          subdomain: subdomain,
          client_id: clientId,
          client_secret: clientSecret,
        }
      )
      .then((response) => {
        navigate("/");
        localStorage.removeItem("access_token");
      })
      .catch((error) => {
        console.error(error);
      });
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
                  <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
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
              <a
                href="/uploadExcel"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Upload Excel File
                </span>
              </a>
            </li>
            <li>
              <a
                href="/assignRole"
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Assign Roles</span>
              </a>
            </li>
            <li>
              <a
                href="/approve_reject"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Approve/Reject Registrations
                </span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Profile Settings
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

      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-4xl mb-10">
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              Assign Roles
            </h3>
          </div>

          <div className="flex justify-start mt-5">
            <div className="bg-white rounded-lg">
              <select
                className="form-select rounded ml-2 justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                id="select_name"
                onChange={handleonChange}
              >
                <option>Select Faculty name</option>
                {data.map((item) => {
                  // console.log( item.id)
                  return (
                    <>
                      {/* <p id="designation_store" style={{display:"none"}} >{item.designation}</p> */}
                      <option
                        id={item.designation}
                        value={item.id}
                        data-designation={item.designation}
                      >
                        {item.first_name} {item.last_name}
                      </option>
                    </>
                  );
                })}
              </select>

              <select
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                onChange={(e) => {
                  setSelectedValue(e.target.value);
                  console.log(selectedValue);
                }}
              >
                <option>Select Role</option>
                {roleData.map((item) => {
                  // console.log( item.id)
                  return (
                    <>
                      <option value={item.name}> {item.name} </option>
                    </>
                  );
                })}
              </select>

              <button
                className="text-center mr-24 bg-green-600 text-gray-100 p-2 rounded tracking-wide
                font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-700 shadow-md cursor-pointer transition ease-in duration-300"
                onClick={handleSubmit}
              >
                Assign
              </button>

              <button
                onClick={toggleContent}
                className="absolute p-2 mr-10 bg-black rounded right-0 text-white font-bold"
              >
                Create Role
              </button>
            </div>
          </div>
          <p class="text-sm mt-2 ml-2 text-gray-300">
            <span>{fName}</span>
          </p>

          <div className="flex justify-end mr-2 mt-1">
            {/* Toggle Button */}
            <div
              className={`${
                isHidden ? "hidden" : "block"
              } rounded-md flex justify-center`}
            >
              <div className="flex items-center">
                <label className="mr-2">Role Name: </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="form-input border border-gray-400 rounded p-2"
                />
              </div>
              <button
                type="submit"
                className="text-center ml-2 bg-green-600 text-gray-100 p-2 rounded tracking-wide
                font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-700 shadow-md cursor-pointer transition ease-in duration-300"
                onClick={handleCreateRole}
              >
                Submit
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="overflow-hidden border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                          Faculty Name
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                          Designation
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                          Assigned Role
                        </th>

                        <th className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {faculties.map((faculty, index) => (
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {faculty.first_name} {faculty.last_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {faculty.designation}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {faculty.role_names}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <a
                              className="text-red-500 hover:text-red-700"
                              href="#"
                              data-id={faculty.id}
                              data-role-name={faculty.role_names}
                              onClick={handleRemoveRole}
                            >
                              Revoke Role
                            </a>
                          </td>
                        </tr>
                      ))}
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

export default AssignRole;
