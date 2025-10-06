import {
  FaUserEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

export default function AdminProfile() {
  const {user} = useAuth()
  const adminData = {
    name: `${user?.displayName}`,
    title: "Platform Administrator",
    email: `${user?.email}`,
    location: "Dhaka, Bangladesh",
    avatarUrl: `${user?.photoURL}`, // Replace with actual image URL
  };

  return (
    <div className="min-h-[calc(100vh-50px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition duration-500 hover:scale-[1.02]">
        {/* Header and Background */}
        <div className="h-20 bg-gradient-to-br from-emerald-500 to-green-700 relative">
          {/* Edit Button */}
          <button
            title="Edit Profile"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition duration-200"
          >
            <FaUserEdit className="text-xl" />
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center">
          <img
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
            src={adminData.avatarUrl}
            alt={`Profile of ${adminData.name}`}
          />
        </div>

        <div className="p-6 text-center">
          {/* Name and Title */}
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
            {adminData.name}
          </h2>
          <p className="text-lg font-medium text-gray-600 mb-6">
            {adminData.title}
          </p>

          {/* Details Section */}
          <div className="space-y-4 text-left">
            {/* Email */}
            <div className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition duration-150">
              <FaEnvelope className="text-xl text-emerald-500" />
              <span className="font-medium">{adminData.email}</span>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition duration-150">
              <FaMapMarkerAlt className="text-xl text-emerald-500" />
              <span className="font-medium">{adminData.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
