import React, { useState } from 'react';
import './../css/dropdown.css'; // Ensure the path is correct

const MultiLevelDropdown = ({ items }) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderItems = (menuItems, level = 0) => {
    return menuItems.map((item, index) => {
      const key = `${level}-${index}`;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <li key={key} className="relative">
          <button
            onClick={() => hasChildren && toggleMenu(key)}
            className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 ${hasChildren ? 'font-semibold' : ''}`}
          >
            {item.label}
            {hasChildren && (
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${openMenus[key] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          {hasChildren && openMenus[key] && (
            <ul className={`absolute left-full top-0 mt-0 ml-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${item.label === 'Agents List' ? 'first' : ''}`}>
              {renderItems(item.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="relative inline-block text-left">
      <ul className="mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        {renderItems(items)}
      </ul>
    </div>
  );
};

export default MultiLevelDropdown;
