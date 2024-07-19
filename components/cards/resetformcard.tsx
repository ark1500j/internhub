import React from "react";

interface Props{
 reset:boolean
}


export default function ResetFormCard() {
  return (
    <div className={`max-w-80`}>
      <div className=""></div>
      <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
      <div className="relative">
          <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
            New Password
          </p>
          <input
            placeholder="Password"
            type="password"
            className="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
          />
        </div>
        <div className="relative">
          <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
            Confirm Password
          </p>
          <input
            placeholder="Password"
            type="password"
            className="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
          />
        </div>
        <div className="relative">
          <button className="w-full inline-block pt-2 pr-3 pb-2 pl-3 text-xl font-medium text-center text-white bg-purple-800 rounded-lg transition duration-200 hover:bg-purple-900 ease">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
