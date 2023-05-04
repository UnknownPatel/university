import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

var acces_token;
var subdomain;
const AssignRole = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [clientId, setClentId] = useState("");
  const [clientSecret, setClentSecret] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    acces_token = localStorage.getItem("acces_token");
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0){ subdomain = arr[0]}
    console.log(subdomain);

    if (subdomain !== null || subdomain !== ""){
    axios
    .get(`http://ec2-52-66-116-8.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`)
    .then((response) => {
      // console.log(response.data.university.name);
      setUniName(response.data.university.name);
      console.log(response)
    })
    .catch((err) => {
      console.log(err);
    });
  }

  axios
  .get("http://ec2-52-66-116-8.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names",{
      subdomain: subdomain,
      token: { acces_token }
  })
  .then(response => {
    setData(response.data)
    console.log(response.data);
  })
  .catch(error => console.log(error));


  },[]);

  const toggleContent = () => {
    setIsHidden(!isHidden);
  };

  const handleLogout = () => {
    const accessToken = localStorage.getItem("access_token");
    
    axios
      .get(
        `http://ec2-52-66-116-8.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`
        
      )
      .then(function (response) {
        setClentId(response.data.doorkeeper.client_id);
        setClentSecret(response.data.doorkeeper.client_secret);
      })
      .catch(function (error) {
        console.log(error.message);
      });
    axios
      .post(
        " http://ec2-52-66-116-8.ap-south-1.compute.amazonaws.com/api/v1/oauth/revoke",
        {
          token: { accessToken },
          subdomain: subdomain,
          client_id: clientId,
          client_secret: clientSecret,
        }
      )
      .then((response) => {
        // console.log(response.data);
        // Remove the access token from local storage
        navigate("/");
        localStorage.removeItem("access_token");
        // Do any other necessary clean up and redirect the user to the login page
        // ...
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  <div className="px-3 py-3 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start">
        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
         </button>
        <a href="" className="flex ml-2 md:mr-24">
          <img src="" className="h-8 mr-3" alt="Logo" />
          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">{uniName}</span>
        </a>
      </div>
      <div className="flex items-center">
          <div className="flex items-center ml-3">
            <div>
              <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src="" alt="user photo"/>
              </button>
            </div>
            <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
              <div className="px-4 py-3" role="none">
                <p className="text-sm text-gray-900 dark:text-white" role="none">
                 
                </p>
                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                  
                </p>
              </div>
              <ul className="py-1" role="none">
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem"></a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem"></a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem"></a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem"></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </div>
</nav>

<aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
   <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
      <li>
            <a href="/uploadExcel" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <span className="flex-1 ml-3 whitespace-nowrap">Upload Excel File</span>
              </a>
         </li>
         <li>
            <a href="/assignRole" className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <span className="ml-3">Assign Roles</span>
            </a>
         </li>
         <li>
            <a href="/approve_reject" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <span className="flex-1 ml-3 whitespace-nowrap">Approve/Reject Registrations</span>
               
            </a>
         </li>
         
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <span className="flex-1 ml-3 whitespace-nowrap">Profile Settings</span>
            </a>
         </li>
         <div className="p-4">
            <button type="button" className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
              onClick={handleLogout}>
            <span className="">Logout</span>
            </button> 
          </div>
      </ul>
   </div>
</aside>

<div className="p-4 sm:ml-64">
   <div className="p-4 rounded-lg mt-14">
    <div className='text-center text-4xl'>
        <p>{uniName}</p>
    </div>
        <div className='flex justify-between mt-10'>
        <label htmlFor="" className="block text-sm font-bold">Select Faculty Name:</label>
          <select className="py-3 px-4 pr-9 block w-60 rounded-md text-sm border-2 ">
            <option>Select Name</option>
            {data.map(users => (
              <option key={users.id} value={users.id}>{users.name}</option>
            ))}
          </select>
              {/* <div className="">
                <input
                  type="text"
                  name=""
                  id=""
                  autoComplete=""
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div> */}
              <label htmlFor="" className="block text-sm font-bold">Designation:</label>
              <div className="">
                <input
                  type="text"
                  name=""
                  id=""
                  autoComplete=""
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
        </div>
        <div>
        <label htmlFor="hs-select-label" className="block text-sm font-bold mb-2">Assign Role:</label>
        <select className="py-3 px-4 pr-9 block w-96 rounded-2xl text-sm border-2 ">
          <option>Examination Controller</option>
          <option>Assistant Exam Controller</option>
          <option>Academic Head</option>
          <option>HOD</option>

        </select>
        </div>
        <div className="text-center mt-10">
            <button className="py-3 px-8 bg-black rounded-2xl text-white font-bold">Submit</button> 
        </div>

        {/* Toggle Button */}
        <div>
          <button onClick={toggleContent} className="py-3 px-8 bg-black rounded-2xl text-white font-bold">
            {/* {isHidden ? 'Show Content' : 'Hide Content'} */}Create Role
          </button>
            <div className={`${isHidden ? 'hidden' : 'block'} mt-4 p-4 bg-gray-100 rounded-md flex justify-evenly`}>
            <label htmlFor="" className="block font-bold">Role Name:</label>
              <div className="">
                <input
                  type="text"
                  name=""
                  id=""
                  autoComplete=""
                  className="block w-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="text-center">
            <button className="py-3 px-8 bg-black rounded-2xl text-white font-bold">Submit</button> 
        </div>
            </div>
        </div>


        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        Faculty Name
                                    </th>
                                    <th
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        Designation
                                    </th>
                                    <th
                                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                    >
                                        Assign Role
                                    </th>
                                    
                                    <th
                                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                    >
                                        Remove
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                        
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        
                                    </td>
                                    
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a
                                            className="text-red-500 hover:text-red-700"
                                            href="#"
                                        >
                                            
                                        </a>
                                    </td>
                                </tr>
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      
   </div>
         </div>
    </div>
  )
}

export default AssignRole
