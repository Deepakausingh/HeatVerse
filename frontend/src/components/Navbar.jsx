import React, { useState } from "react";
import { NavLink } from "react-router-dom";


// Imported External Icons
import ComicIcon from "../assets/icons/comic.png";
import StoriesIcon from "../assets/icons/stories.png";
import VideohubIcon from "../assets/icons/videohub.png";

export default function Navbar() {
  const [activeExternal, setActiveExternal] = useState("");

  // INTERNAL NAV ITEMS (UNCHANGED)
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: "fas fa-home",
      activeClass: "bg-green-600 text-white",
      inactiveClass: "dark:bg-gray-700 hover:bg-green-200 hover:text-black",
      tooltip: "Home",
    },
    {
      name: "Write",
      path: "/create",
      icon: "fas fa-pen",
      activeClass: "bg-indigo-700 text-white",
      inactiveClass: "bg-indigo-600 text-white hover:bg-indigo-700",
      tooltip: "Write Story",
    },
    {
      name: "Manage",
      path: "/manage",
      icon: "fas fa-tasks",
      activeClass: "bg-green-700 text-white",
      inactiveClass: "bg-green-600 text-white hover:bg-green-700",
      tooltip: "Manage Stories",
    },
  ];

  // EXTERNAL NAV ITEMS (NOW USING IMPORTED IMAGES)
  const externalItems = [
    {
      name: "Stories",
      icon: StoriesIcon,
      link: "https://youtube.com",
      tooltip: "Adult World",
    },
    {
      name: "Videohub",
      icon: VideohubIcon,
      link: "https://facebook.com",
      tooltip: "VideoHub",
    },
    {
      name: "comic",
      icon: ComicIcon,
      link: "https://comictop.vercel.app",
      tooltip: "ComicTop",
    },
  ];

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="bg-white/50 backdrop-blur-md dark:bg-black/40 sticky top-0 z-10 shadow-sm hidden sm:block">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">

          <NavLink to="/" className="text-2xl font-bold">
            VelvetVibes
          </NavLink>

          <div className="flex space-x-3">

            {/* INTERNAL NAV */}
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center justify-center w-10 h-10 rounded transition ${
                    isActive ? item.activeClass : item.inactiveClass
                  }`
                }
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="tooltip">{item.tooltip}</span>
              </NavLink>
            ))}

            {/* EXTERNAL NAV */}
            {externalItems.map((ext, i) => (
              <a
                key={i}
                href={ext.link}
                target="_blank"
                onClick={() => setActiveExternal(ext.name)}
                className={`group relative flex items-center justify-center w-10 h-10 rounded transition ${
                  activeExternal === ext.name
                    ? "bg-white text-black font-bold"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <img src={ext.icon} className="w-full rounded-md" />
                <span className="tooltip">{ext.tooltip}</span>
              </a>
            ))}

          </div>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <footer className="sm:hidden fixed bottom-0 left-0 w-full bg-black/90 text-white border-t border-gray-700 flex justify-around py-1 z-50">

  {/* INTERNAL NAV ITEMS */}
  {navItems.map((item, i) => (
    <NavLink
      key={i}
      to={item.path}
      className={({ isActive }) =>
        `group flex items-center justify-center w-12 h-12 rounded-md ${
          isActive ? "bg-green-600" : "hover:bg-green-700"
        }`
      }
    >
      <i className={`${item.icon} text-2xl`}></i>
      <span className="tooltip-mobile">{item.tooltip}</span>
    </NavLink>
  ))}

  {/* EXTERNAL NAV ITEMS */}
  {externalItems.map((ext, i) => (
    <a
      key={i}
      href={ext.link}
      target="_blank"
      className="group flex items-center justify-center w-12 h-12 rounded-md hover:bg-gray-700"
      onClick={() => setActiveExternal(ext.name)}
    >
      <img src={ext.icon} className="w-full object-contain rounded-md" />
      <span className="tooltip-mobile">{ext.tooltip}</span>
    </a>
  ))}

</footer>


      {/* TOOLTIP CSS */}
      <style>{`
        .tooltip {
          position: absolute;
          top: -38px;
          left: 50%;
          transform: translateX(-50%);
          background: black;
          color: white;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 5px;
          opacity: 0;
          pointer-events: none;
          white-space: nowrap;
          transition: opacity .2s, transform .2s;
        }
        .group:hover .tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }

        .tooltip-mobile {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          background: black;
          color: white;
          padding: 3px 8px;
          font-size: 12px;
          border-radius: 6px;
          opacity: 0;
          pointer-events: none;
          transition: opacity .2s, transform .2s;
        }
        .group:active .tooltip-mobile {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }
      `}</style>
    </>
  );
}
