import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { BiLogOut } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import DashboardNavLinks from "../Components/DashboardNavLinks/DashboardNavLinks";
import useAuth from "../Hooks/useAuth";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    signOutUser()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      });
  };

  return (
    <>
      {/* Mobile trigger */}
      <button
        title="Side navigation"
        type="button"
        className={`fixed left-2 top-1 z-40 block h-10 w-10 rounded bg-white opacity-100 lg:hidden ${
          isSideNavOpen
            ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
            : ""
        }`}
        aria-haspopup="menu"
        aria-label="Side navigation"
        aria-expanded={isSideNavOpen ? "true" : "false"}
        aria-controls="nav-menu-5"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full transition-all duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-6 transform rounded-full transition duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full transition-all duration-300"
          ></span>
        </div>
      </button>

      {/* Side Navigation */}
      <aside
        id="nav-menu-5"
        aria-label="Side navigation"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-76 pt-8 flex-col border-r border-emerald-700  bg-emerald-600 transition-transform duration-300 ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          onClick={() => setIsSideNavOpen(false)}
          className="absolute top-3 right-3 text-white hover:text-black lg:hidden sm:block cursor-pointer"
          aria-label="Close side navigation"
        >
          <MdClose size={24} />
        </button>
        {/* <div className="flex flex-col items-center gap-4 border-b border-emerald-700 dark:border-emerald-800 p-6">
          <div className="shrink-0">
            <a
              href="#"
              className="relative flex h-12 w-12 items-center justify-center rounded-full text-white"
            >
              <img
                src={user?.photoURL}
                alt={user?.displayName}
                title={user?.displayName}
                width="48"
                height="48"
                className="max-w-full rounded-full"
              />
              <span className="absolute bottom-0 right-0 inline-flex items-center justify-center gap-1 rounded-full border-2 border-white bg-teal-500 p-1 text-sm text-white">
                <span className="sr-only"> online </span>
              </span>
            </a>
          </div>
          <div className="flex min-h-[2rem] w-full min-w-0 flex-col items-start justify-center gap-0 text-center">
            <h4 className="w-full truncate text-base text-white dark:text-emerald-200">
              {user?.displayName}
            </h4>
            <p className="w-full truncate text-sm text-white dark:text-emerald-300">
              {user?.email}
            </p>
          </div>
        </div> */}
        <nav
          aria-label="side navigation"
          className="flex-1 divide-y divide-emerald-700 overflow-auto"
        >
          <DashboardNavLinks />
        </nav>

        <footer className="border-t border-emerald-700 p-3">
          <button
            onClick={handleLogOut}
            className="flex w-full items-center justify-center gap-2 rounded p-3 font-bold text-white transition-colors hover:text-red-500"
          >
            <BiLogOut size={24} />
            Logout
          </button>
        </footer>
      </aside>

      {/* 🛠 Change: add lg:ml-72 to prevent content overlap on large screens */}
      <div className="lg:pl-76 p-4  mx-auto bg-white min-h-screen">
        <Outlet />
      </div>

      {/* Backdrop */}
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 transition-colors sm:hidden ${
          isSideNavOpen ? "block " : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
    </>
  );
};

export default DashboardLayout;
