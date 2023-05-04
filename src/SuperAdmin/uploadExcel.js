import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


var acces_token;
var subdomain;
const UploadExcel = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  // const [subdomain, setSubdomain] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [clientId, setClentId] = useState("");
  const [clientSecret, setClentSecret] = useState("");

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
      console.log(response.data.university.name);
      setUniName(response.data.university.name);
      console.log(response)
    })
    .catch((err) => {
      console.log(err);
    });
  }

  },[]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(selectedFile !== null || selectedFile !== ""){
    axios
    .post(" http://ec2-52-66-116-8.ap-south-1.compute.amazonaws.com/api/v1/excel_sheets",{
      excel_sheet : {
      name: selectedValue,
      sheet: selectedFile
    },
    subdomain : subdomain

  },
  {
    headers : {
      'Authorization' : `Bearer ${acces_token}`,
      'Content-Type' : 'multipart/form-data'
    }
  })
}
    console.log(selectedFile);
  }

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
            {/* <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg> */}
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
            <a href="/uploadExcel" className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <span className="flex-1 ml-3 whitespace-nowrap">Upload Excel File</span>
             </a>
         </li>
         <li>
            <a href="/assignRole" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
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
       <br />
       <br />
       <form onSubmit={handleSubmit}>
        <div className='flex justify-center'>
        <label htmlFor="File_Name" className="block text-lg font-bold mb-2" >Select File:</label>
        <select className="py-3 px-4 pr-9 block w-96 rounded-2xl text-sm border-2 " onChange={(e) => {setSelectedValue(e.target.value); console.log(selectedValue);}}>
          <option>Select File</option>
          <option>Faculty Details</option>
          <option>Course and Semester Details</option>
          <option>Subject Details</option>
          <option>Faculty Supervision</option>
          <option>Marks Entry Details</option>
          <option>Faculty Assignment for Marks Entry</option>
        </select>
        </div>

        <div className='text-center text-2xl mt-10'>
        <h1>Get Started By Uploading Excel File</h1>
      </div>
      <div className='flex justify-center'>
        <input className="mt-5 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400" 
           onChange={(e) => setSelectedFile(e.target.files[0])} id="default_size" type="file" accept='.xls,.xlsx'/>
      </div>
        <div className="text-center mt-10">
            <button type='submit' className="py-3 px-8 bg-black rounded-2xl text-white font-bold" >Submit</button> 
        </div>

        </form>   
      
   </div>
         </div>
    </div>
  )
}

export default UploadExcel
