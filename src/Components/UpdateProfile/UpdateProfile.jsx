/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { uploadImage } from "../../Api/imageUploadApi";
import useAuth from "../../Hooks/useAuth";
import { Link, useNavigate } from "react-router";
import useDynamicTitle from "../../Hooks/useDynamicTitle";

export default function UpdateProfile() {
  useDynamicTitle("Update Profile");
  const { updateUserProfile } = useAuth();
  const navigate = useNavigate()

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const image = form.image.files[0];

    const imageUrl = await uploadImage(image);

    updateUserProfile(name, imageUrl)
      .then(() => {
        toast.success("Admin Profile Updated Successfully");
        navigate("/profile")
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#EDF6F8] p-8 w-full max-w-lg relative"
      >
        {/* Close Button */}
        <Link
          to="/profile"
          className="absolute top-4 right-4 text-[#144D75] hover:text-[#2E7A7A] transition"
          title="Close"
        >
          ✕
        </Link>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-center text-[#144D75] mb-6 border-b border-[#65B0D5]/30 pb-3"
        >
          Admin Profile Update
        </motion.h2>

        {/* Form */}
        <motion.form
          onSubmit={handleUpdateProfile}
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-[#144D75] mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter admin name"
              className="w-full input input-bordered outline-none bg-[#EDF6F8] border border-[#65B0D5]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3489BD] text-[#144D75] placeholder-[#144D75]/60"
              required
            />
          </div>

          {/* Image Field */}
          <div>
            <label className="block text-sm font-semibold text-[#144D75] mb-2">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              className="file-input file-input-bordered w-full bg-[#EDF6F8] border border-[#65B0D5]/40 text-[#144D75] focus:outline-none focus:ring-2 focus:ring-[#3489BD] rounded-lg cursor-pointer"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-[#2E7A7A] hover:bg-[#144D75] text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200"
          >
            Update Profile
          </motion.button>
        </motion.form>

        {/* Subtle Footer */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/profile"
            className="text-[#144D75] hover:text-[#2E7A7A] text-sm font-medium underline underline-offset-2 transition"
          >
            Cancel
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
