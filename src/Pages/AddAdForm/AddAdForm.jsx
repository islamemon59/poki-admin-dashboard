import React, { useState, useEffect } from "react";
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
  const [adsList, setAdsList] = useState([]);
  const [adType, setAdType] = useState("image"); // image or code

  // Fetch existing ads
  const fetchAds = async () => {
    try {
      const res = await axios.get("https://server.innliv.com/ads");
      if (res.data?.success) setAdsList(res.data.ads);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const onSubmit = async (data) => {
    if (adType === "image" && !selectedFile) {
      return Swal.fire("Error!", "Please select an image.", "error");
    }
    if (adType === "code" && !data.code) {
      return Swal.fire("Error!", "Please enter ad code.", "error");
    }

    setIsSubmitting(true);

    try {
      let adData = {
        title: data.title,
        position: data.position,
        type: adType,
      };

      if (adType === "image") {
        const uploadedImageUrl = await uploadImage(selectedFile);
        adData.image = uploadedImageUrl;
        adData.link = data.link;
      } else if (adType === "code") {
        adData.content = data.code; // HTML/JS code for Google Ads or any network
      }

      const res = await axios.post("http://localhost:5000/ads", adData);

      if (res.data?.success) {
        Swal.fire("Added!", "Ad has been added successfully.", "success");
        reset();
        setSelectedFile(null);
        setPreviewUrl("");
        fetchAds();
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

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This ad will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://server.innliv.com/ads/${id}`);
        Swal.fire("Deleted!", "Ad has been deleted.", "success");
        fetchAds();
      } catch (err) {
        console.log(err);
        Swal.fire("Error!", "Failed to delete ad.", "error");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#2E7A7A]">
        Add New Ad (Admin)
      </h2>

      {/* Ad Type Selector */}
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${
            adType === "image" ? "bg-[#2E7A7A] text-white" : "bg-gray-200"
          }`}
          onClick={() => setAdType("image")}
        >
          Image Ad
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${
            adType === "code" ? "bg-[#2E7A7A] text-white" : "bg-gray-200"
          }`}
          onClick={() => setAdType("code")}
        >
          Code Ad (Google/Other)
        </button>
      </div>

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

        {adType === "image" && (
          <>
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
                {...register("link")}
                className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {adType === "code" && (
          <div>
            <label className="font-semibold">Ad Code (Google/Other)</label>
            <textarea
              {...register("code")}
              rows={6}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
              placeholder="Paste ad HTML/JS code here"
            />
          </div>
        )}

        {/* Position Selector */}
        <div>
          <label className="font-semibold">Position</label>
          <select
            {...register("position", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
          >
            <option value="">Select Position</option>
            <option value="left">Left Sidebar</option>
            <option value="bottom">Bottom Ads</option>
            <option value="right">Right Sidebar</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            *Right Sidebar can hold multiple ads.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2E7A7A] text-white font-semibold py-2 rounded-md hover:bg-[#246363] transition"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner text-white"></span>
          ) : (
            "Add Ad"
          )}
        </button>
      </form>

      {/* Admin Ads List */}
      {adsList.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 text-[#2E7A7A]">
            Existing Ads
          </h3>
          <div className="space-y-4">
            {adsList.map((ad) => (
              <div
                key={ad._id}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <div className="flex items-center gap-4">
                  {ad.type === "image" && (
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{ad.title}</p>
                    <p className="text-sm text-gray-500">{ad.position}</p>
                    <p className="text-xs text-gray-500">
                      {ad.type === "code"
                        ? "Code Ad (Google/Other)"
                        : "Image Ad"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAdForm;
