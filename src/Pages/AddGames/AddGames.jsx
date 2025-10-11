import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadImage } from "../../Api/imageUploadApi";
import Loader from "../../Shared/Loader/Loader";

const AddGames = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      // Upload file if selected
      let thumbnailUrl = formData?.thumbnail || "";
      if (selectedFile) {
        const uploaded = await uploadImage(selectedFile);
        thumbnailUrl = uploaded;
      }

      // Convert rating to number
      const rating = parseFloat(formData.rating) || 0;

      const newGame = {
        title: formData.title,
        category: formData.category,
        gameUrl: formData.gameUrl,
        previewVideo: formData.previewVideo,
        thumbnail: thumbnailUrl,
        rating,
        description: formData.description,
      };

      console.log("Adding game:", newGame);

      const { data: res } = await axios.post(
        "http://localhost:5000/games",
        newGame
      );

      console.log(res);

      if (res?.result.insertedId) {
        Swal.fire("Success!", "Game added successfully!", "success");
        reset();
        setPreviewUrl("");
        setSelectedFile(null);
        navigate("/games");
      } else {
        Swal.fire("Error!", "Failed to add game!", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to add game!", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#2E7A7A]">
        Add New Game
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="Enter game title"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Category</label>
          <input
            {...register("category", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="Shooting, Soccer, Racing..."
          />
        </div>

        {/* Game URL */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Game URL</label>
          <input
            {...register("gameUrl", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Preview Video */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Preview Video</label>
          <input
            {...register("previewVideo")}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col md:col-span-1">
          <label className="font-semibold mb-1">Upload Thumbnail</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, or JPEG (max 2MB)
                </p>
              </div>
              <input
                id="thumbnailFile"
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
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="w-32 h-32 rounded-md object-cover border mt-2 mx-auto"
            />
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Rating</label>
          <input
            type="number"
            step="0.1"
            {...register("rating")}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="e.g. 4.5"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold mb-1">Description</label>
          <textarea
            {...register("description")}
            rows="4"
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none resize-none"
            placeholder="Write a short description about the game..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2E7A7A] text-white font-semibold py-3 rounded-md hover:bg-[#246363] transition"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner text-success"></span>
            ) : (
              "Add Game"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGames;
