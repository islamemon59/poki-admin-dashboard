
import { NavLink } from "react-router";
import { FiHome } from "react-icons/fi";

const DashboardNavLinks = () => {

  const linkClasses = ({ isActive }) =>
    `${
      isActive ? "bg-emerald-700 dark:bg-emerald-800" : ""
    } flex items-center gap-3 rounded p-3 text-white transition-colors 
    hover:bg-emerald-600 hover:text-black 
    dark:hover:bg-emerald-500 dark:hover:text-white`;

  return (
    <ul className="flex flex-1 flex-col gap-1 py-3">
      <li className="px-3">
        <NavLink to="/" className={linkClasses}>
          <FiHome className="text-xl" />
          <div className="flex w-full flex-1 flex-col items-start justify-center text-xl font-semibold gap-0 overflow-hidden truncate">
            Home
          </div>
        </NavLink>
      </li>
    </ul>
  );
};

export default DashboardNavLinks;
