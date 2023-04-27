import React from 'react'

const SignUpSuperAdmin = () => {
  return (
    <div className='bg-blue-900 '>

        <div className="container max-w-screen-lg mx-auto ">
          <div>
            <h2 className="font-semibold text-xl  text-blue-600">
            Registration Form
            </h2>
            <p className="text-gray-500 mb-6"></p>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">University Details</p>
                  <p>Please fill out all the fields.</p>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="full_name">University Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        
                        placeholder="University name"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="email">Address</label>
                      <input
                        type="text"
                        name="subdomain"
                        id="subdomain"
                        
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        
                        placeholder="Address"
                      />
                    </div>


                    <div className="md:col-span-5">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        name="support_email"
                        id="support_email"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="email"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="address">Password</label>
                      <input
                        type="password"
                        name="admin_password"
                        id="admin_password"
                        
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        
                        placeholder="Password"
                      />
                    </div>
                    {/* <div className="md:col-span-5">
                      <label htmlFor="email">Sub Domain</label>
                      <input
                        type="text"
                        name="subdomain"
                        id="subdomain"
                        // value={formData.subdomain}
                        // onChange={handleChange}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        // value=""
                        placeholder="email@domain.com"
                      />
                    </div> */}

                    {/* <div className="md:col-span-3">
                      <label htmlFor="address">Admin Email</label>
                      <input
                        type="email"
                        name="admin_email"
                        id="admin_email"
                        // value={getEmail}
                        // onChange={(e) => setEmail(e.target.value)}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        // value=""
                        placeholder="email@domain.com"
                      />
                    </div> */}

                    <div className="md:col-span-2">
                      <label htmlFor="city">Contact Number</label>
                      <input
                        type="number"
                        name="contact_number"
                        id="contact_number"
                        
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        
                        placeholder="contact number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="country">Country / region</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="text"
                          name="country"
                          id="country"
                          placeholder="Country"
                        
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          
                        />
                        {/*  */}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="state">State / province</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="text"
                          name="state"
                          id="state"
                          placeholder="State"
                        
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          
                        />
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <label htmlFor="zipcode">City</label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        
                        className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="city"
                        
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="city">Upload Logo</label>
                      <input
                        id="file_input"
                        type="file"
                        className="h-10 py-2 border mt-1 rounded px-4 w-full bg-gray-50"
                        
                        placeholder="contact number"
                      />
                    </div>
                    
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          type="submit"
                        
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      
    </div>
  )
}

export default SignUpSuperAdmin
