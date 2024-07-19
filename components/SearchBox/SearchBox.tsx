import React from 'react';

const SearchBox = () => { 
  return (
    <div className="relative w-full max-w-xl mx-auto bg-white rounded-full h-18 lg:max-w-none">
      <input
        placeholder="e.g. Blog"
        className="rounded-full w-full h-18 bg-white py-5 pl-8 pr-32 outline-none border-4 border-black-100 shadow-md hover:outline-none focus:ring-cool-indigo-200 focus:border-cool-indigo-200"
        type="text"
        name="query"
        id="query"
      />
      <button
        type="submit"
        className="absolute inline-flex items-center h-12 px-4 py-2 text-sm text-black transition duration-150 ease-in-out rounded-full outline-none right-3 top-3 bg-cool-indigo-600 sm:px-6 sm:text-base sm:font-medium hover:bg-cool-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-500"
      >

        
        <svg
          className="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search
      </button>
    </div>
  );
};

export default SearchBox;
