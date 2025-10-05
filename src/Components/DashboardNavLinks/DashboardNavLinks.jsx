import { NavLink } from "react-router";
import { FiHome } from "react-icons/fi";
import { FaGamepad, FaUserShield } from "react-icons/fa";
import { MdOutlineGames, MdSystemUpdateAlt } from "react-icons/md";

const DashboardNavLinks = () => {
  const linkClasses = ({ isActive }) =>
    `${
      isActive ? "bg-emerald-700 dark:bg-emerald-800" : ""
    } flex items-center gap-3 rounded p-3 text-white transition-colors duration-400 
    hover:bg-emerald-100/30 hover:text-black`;

  return (
    <ul className="flex flex-1 flex-col gap-1 py-3">
      <li className="px-3">
        <NavLink to="/" className={linkClasses}>
          <FiHome className="text-xl" />
          <div className="flex w-full flex-1 flex-col items-start justify-center text-xl font-semibold gap-0 overflow-hidden truncate">
            Home
          </div>
        </NavLink>
      <NavLink to="/games" className={linkClasses}>
        <MdOutlineGames className="text-2xl text-white" />
        <div className="flex w-full flex-1 flex-col items-start justify-center text-xl font-semibold overflow-hidden truncate">
          Games
        </div>
      </NavLink>

      {/* Add Games */}
      <NavLink to="/addGames" className={linkClasses}>
        <FaGamepad className="text-2xl text-white" />
        <div className="flex w-full flex-1 flex-col items-start justify-center text-xl font-semibold overflow-hidden truncate">
          Add Games
        </div>
      </NavLink>

        <NavLink to="/updateGames" className={linkClasses}>
          <MdSystemUpdateAlt className="text-xl" />
          <div className="flex flex-1 flex-col text-xl font-semibold overflow-hidden truncate">
            Update Games
          </div>
        </NavLink>

        <NavLink to="/profile" className={linkClasses}>
          <FaUserShield className="text-xl" />
          <div className="flex flex-1 flex-col text-xl font-semibold overflow-hidden truncate">
            Profile
          </div>
        </NavLink>
      </li>
    </ul>
  );
};

export default DashboardNavLinks;
