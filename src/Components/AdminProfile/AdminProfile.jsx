import { FaUserEdit, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router";
import useDynamicTitle from "../../Hooks/useDynamicTitle";
import Swal from "sweetalert2";

export default function AdminProfile() {
  useDynamicTitle("Profile");
  const { user, updateUserPassword } = useAuth();

  const adminData = {
    name: `${user?.displayName}`,
    title: "Platform Administrator",
    email: `${user?.email}`,
    location: "Dhaka, Bangladesh",
    avatarUrl: `${user?.photoURL}`,
  };

  const handleUpdatePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Update Password",
      html: `
      <input type="password" id="currentPassword" class="swal2-input" placeholder="Current Password">
      <input type="password" id="newPassword" class="swal2-input" placeholder="New Password (min 6 chars)">
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#2E7A7A",
      cancelButtonColor: "#d33",
      preConfirm: () => {
        const currentPassword =
          document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        if (!currentPassword || !newPassword) {
          Swal.showValidationMessage(`Please fill out both fields`);
          return false;
        }
        if (newPassword.length < 6) {
          Swal.showValidationMessage(
            `New password must be at least 6 characters`
          );
          return false;
        }
        return { currentPassword, newPassword };
      },
    });

    if (formValues) {
      try {
        await updateUserPassword(
          formValues.currentPassword,
          formValues.newPassword
        );
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your password has been successfully updated!",
          confirmButtonColor: "#2E7A7A",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error Updating Password",
          text: error.message,
        });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-50px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition duration-500 hover:scale-[1.02]">
        <div className="h-20 bg-gradient-to-br from-emerald-500 to-green-700 relative">
          <Link
            to="/updateProfile"
            title="Edit Profile"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition duration-200"
          >
            <FaUserEdit className="text-xl" />
          </Link>
        </div>

        <div className="flex justify-center">
          <img
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
            src={adminData.avatarUrl}
            alt={`Profile of ${adminData.name}`}
          />
        </div>

        <div className="p-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
            {adminData.name}
          </h2>
          <p className="text-lg font-medium text-gray-600 mb-6">
            {adminData.title}
          </p>

          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition duration-150">
              <FaEnvelope className="text-xl text-emerald-500" />
              <span className="font-medium">{adminData.email}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition duration-150">
              <FaMapMarkerAlt className="text-xl text-emerald-500" />
              <span className="font-medium">{adminData.location}</span>
            </div>
          </div>

          {/* ✅ Update Password Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleUpdatePassword}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-semibold border-none"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
