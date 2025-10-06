// GoogleButton.jsx
import React from "react";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function GoogleButton() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();

      if (res.user) {
        Swal.fire({
          title: "Successfully Login",
          icon: "success",
          draggable: true,
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.message}`);
    }
  };
  return (
    <button
      onClick={handleGoogleLogin}
      aria-label={"Sign in with Google"}
      className="flex items-center gap-3 w-full justify-center mx-auto mt-3 px-5 py-3 rounded-full bg-white shadow-md hover:shadow-lg active:scale-95 transition transform text-sm font-medium"
      style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.12)" }}
    >
      {/* Official multi-color G */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M17.64 9.2045c0-.638-.057-1.252-.162-1.84H9v3.48h4.84c-.208 1.12-.84 2.07-1.793 2.71v2.25h2.897c1.693-1.56 2.66-3.86 2.66-6.6z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.465-.8 5.953-2.176l-2.897-2.25c-.803.54-1.83.86-3.056.86-2.35 0-4.342-1.586-5.05-3.72H1.01v2.336C2.49 15.96 5.49 18 9 18z"
          fill="#34A853"
        />
        <path
          d="M3.95 10.714a5.41 5.41 0 010-3.43V4.95H1.01A9 9 0 000 9c0 1.45.35 2.83.99 4.05l2.96-2.336z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.579c1.316 0 2.5.452 3.43 1.34l2.57-2.57C13.465.8 11.43 0 9 0 5.49 0 2.49 2.04 1.01 4.95l2.94 2.336C4.658 5.165 6.65 3.579 9 3.579z"
          fill="#EA4335"
        />
      </svg>

      <span className="text-gray-700">Sign in with Google</span>
    </button>
  );
}
