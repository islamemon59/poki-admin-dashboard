import { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import GoogleButton from "../../Components/SocialLogin/GoogleLogin";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isValue, setIsValue] = useState("");
  const { createUser } = useAuth();
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    console.log(name, email, password);

    try {
      const res = await createUser(email, password);
      if (res.user) {
        Swal.fire({
          title: "Registration Successful",
          icon: "success",
          draggable: true,
        });
        navigate("/")
        form.reset()
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(`${error?.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3489BD] via-[#65B0D5] to-[#2E7A7A] p-4">
      <div className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account 🌱
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="text-white font-semibold">Full Name</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-white text-xl" />
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full pl-10 bg-white/30 text-gray-700 placeholder-white/70 focus:outline-none outline-none border-none focus:ring-2 focus:ring-[#EDF6F8]"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="text-white font-semibold">Email</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-white text-xl" />
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                className="input input-bordered w-full pl-10 bg-white/30 text-gray-700 placeholder-white/70 focus:outline-none outline-none border-none focus:ring-2 focus:ring-[#EDF6F8]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="text-white font-semibold">Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-white text-xl" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => setIsValue(e.target.value)}
                className="input input-bordered w-full pl-10 bg-white/30 text-gray-700 placeholder-white/70 focus:outline-none outline-none border-none focus:ring-2 focus:ring-[#EDF6F8]"
                required
              />
              {isValue && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/80 hover:text-white"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full bg-[#2E7A7A] hover:bg-[#144D75] text-white font-semibold text-lg border-none shadow-lg"
          >
            Register
          </button>

          {/* Divider */}
          <div className="divider text-white">OR</div>

          {/* Login Link */}
          <p className="text-center text-white/80 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
        <GoogleButton/>
      </div>
    </div>
  );
}
