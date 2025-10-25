import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadImage } from "../../Api/imageUploadApi"; // your custom image upload API
import useDynamicTitle from "../../Hooks/useDynamicTitle";

const AddAdForm = () => {
  useDynamicTitle("Run Ads");
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const onSubmit = async (data) => {
    if (!selectedFile) {
      return Swal.fire("Error!", "Please select an image.", "error");
    }

    setIsSubmitting(true);

    try {
      // Upload image first
      const uploadedImageUrl = await uploadImage(selectedFile);

      const adData = {
        title: data.title,
        image: uploadedImageUrl,
        link: data.link,
        position: data.position,
      };

      const res = await axios.post("http://localhost:5000/ads", adData);

      if (res.data?.success) {
        Swal.fire("Added!", "Ad has been added successfully.", "success");
        reset();
        setSelectedFile(null);
        setPreviewUrl("");
      } else {
        Swal.fire("Error!", "Failed to add ad.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", err.message || "Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#2E7A7A]">
        Add New Ad
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="Ad title"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
                setPreviewUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="w-full border p-2 rounded-md"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md mt-2"
            />
          )}
        </div>

        {/* Redirect Link */}
        <div>
          <label className="font-semibold">Redirect Link</label>
          <input
            {...register("link", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Position */}
        <div>
          <label className="font-semibold">Position</label>
          <select
            {...register("position", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
          >
            <option value="">Select Position</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2E7A7A] text-white font-semibold py-2 rounded-md hover:bg-[#246363] transition"
        >
          {isSubmitting ? <span className="loading loading-spinner text-success"></span> : "Add Ad"}
        </button>
      </form>
    </div>
  );
};

export default AddAdForm;
