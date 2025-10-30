import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadImage } from "../../Api/imageUploadApi";
import Loader from "../../Shared/Loader/Loader";
import useDynamicTitle from "../../Hooks/useDynamicTitle";

const positions = ["left", "right", "bottom"];

const EditAd = () => {
  useDynamicTitle("Update Ads");
    const [loading, setLoading] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch ad data
  const { data: ad, isLoading } = useQuery({
    queryKey: ["ad", id],
    queryFn: async () => {
      const { data } = await axios.get(`https://server.innliv.com/ads/${id}`);
      return data.ad;
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    position: "left",
  });

  // Populate form when ad data is fetched
  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title,
        image: ad.image,
        link: ad.link,
        position: ad.position,
      });
      setPreviewUrl(ad.image);
    }
  }, [ad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let imageUrl = formData.image;

      // Upload new file if selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const updateData = { ...formData, image: imageUrl };


      const { data: res } = await axios.put(
        `https://server.innliv.com/ads/${id}`,
        updateData
      );

      if (res.success) {
        Swal.fire("Updated!", "Ad updated successfully!", "success");
        navigate("/ads");
        setLoading(false)
      } else {
        Swal.fire("Error", "No changes were made.", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to update ad.", "error");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#2E7A7A]">
        Edit Ad
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
          />
        </div>

        {/* Link */}
        <div>
          <label className="font-semibold">Link</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
          />
        </div>

        {/* Position */}
        <div>
          <label className="font-semibold">Position</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
          >
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Image</label>

          {/* URL input */}
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
          />

          {/* File upload */}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, JPEG (max 2MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>
          </div>

          {/* Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-md object-cover border mt-2"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#2E7A7A] text-white font-semibold py-2 rounded-md hover:bg-[#246363] transition"
        >
          {loading ? <span className="loading loading-spinner text-success"></span> : "Update Ad"}
        </button>
      </form>
    </div>
  );
};

export default EditAd;
