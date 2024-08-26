import React, { useEffect, useRef, useState } from "react";
import { downloadFile } from "../../shared/apiService";

let useClickOutside = (handler) => {
  let domNode = useRef();

  useEffect(() => {
    let maybeHandler = (event) => {
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const Download = ({ module, className }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("ply");

  let domNode = useClickOutside(() => {
    setDropdownOpen(false);
  });

  const options = ["ply", "xyz", "pcd", "pts", "xyzrgb"];

  const handleItemClick = (label) => {
    setSelectedLabel(label);
    setDropdownOpen(false);
  };

  const handleDownloadClick = () => {
    downloadFile(module, selectedLabel);
  };

  return (
    <div className={`flex justify-end items-center ${className}`}>
      <div ref={domNode} className="relative inline-block text-left">
        <div className="flex">
          <button
            onClick={handleDownloadClick}
            className="bg-gray-300 flex items-center rounded-l-md px-4 py-2 text-base font-medium text-black hover:bg-[#4E99A8] hover:text-white"
          >
            Download
          </button>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-300 flex items-center rounded-r-md px-4 py-2 text-base font-medium text-black hover:bg-[#4E99A8] hover:text-white"
          >
            .{selectedLabel}
            <span className="pl-2">
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current"
              >
                <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
              </svg>
            </span>
          </button>
        </div>
        <div
          className={`absolute left-0 z-40 mt-2 w-full rounded-md bg-white dark:bg-dark-2 py-2 transition-all duration-200 ease-in-out ${
            dropdownOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }`}
        >
          {options.map((option) => (
            <DropdownItem
              key={option}
              label={option}
              onClick={() => handleItemClick(option)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Download;

const DropdownItem = ({ label, onClick }) => {
  return (
    <span
      onClick={onClick}
      className="block px-4 py-2 text-base cursor-pointer text-body-color dark:text-dark-6 hover:bg-gray-200 dark:hover:bg-primary/5 hover:text-primary"
    >
      .{label}
    </span>
  );
};
