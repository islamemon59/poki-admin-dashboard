import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../../Shared/Loader/Loader";
import { uploadImage } from "../../../Api/imageUploadApi";
import toast from "react-hot-toast";

const UpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Fetch game data
  const { data: game, isLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/games/${id}`);
      return data;
    },
  });

  // Reset form with fetched data
  useEffect(() => {
    if (game) {
      reset(game);
    }
  }, [game, reset]);

  // Handle form submission
const onSubmit = async (formData) => {
  try {
    let thumbnailUrl = formData.thumbnail || game.thumbnail; // fallback to existing

    // Only upload if a new file is selected
    if (selectedFile) {
      const uploaded = await uploadImage(selectedFile);
      thumbnailUrl = uploaded;
    }

    // Convert rating to number
    const rating = parseFloat(formData.rating) || 0;

    // Prepare update object
    const updateData = {
      title: formData.title,
      category: formData.category,
      gameUrl: formData.gameUrl,
      previewVideo: formData.previewVideo,
      thumbnail: thumbnailUrl,
      rating,
      description: formData.description,
    };

    console.log("Sending updateData:", updateData);

    const { data: res } = await axios.put(
      `http://localhost:5000/games/${id}`,
      updateData
    );

    if (res?.result?.modifiedCount > 0 || res?.success) {
      Swal.fire("Updated!", "Game updated successfully!", "success");
      navigate("/games");
    } else {
      toast("No data was modified.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to update game!");
  }
};


  if (isLoading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#2E7A7A]">
        Update Game Info
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            {...register("title", { required: true })}
            defaultValue={game?.title}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="Enter game title"
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-semibold">Category</label>
          <input
            {...register("category", { required: true })}
            defaultValue={game?.category}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="Shooting, Soccer, Racing..."
          />
        </div>

        {/* Game URL */}
        <div>
          <label className="font-semibold">Game URL</label>
          <input
            {...register("gameUrl", { required: true })}
            defaultValue={game?.gameUrl}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Preview Video */}
        <div>
          <label className="font-semibold">Preview Video</label>
          <input
            {...register("previewVideo")}
            defaultValue={game?.previewVideo}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Thumbnail */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Thumbnail</label>

          {/* URL input */}
          <input
            type="url"
            {...register("thumbnail")}
            defaultValue={game?.thumbnail}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="Enter image URL (https://...)"
          />

          {/* File upload */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="thumbnailFile"
              className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
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

          {/* Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="w-32 h-32 rounded-md object-cover border mt-2"
            />
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="font-semibold">Rating</label>
          <input
            type="number"
            step="0.1"
            {...register("rating")}
            defaultValue={game?.rating}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="e.g. 4.5"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            {...register("description")}
            defaultValue={game?.description}
            rows="3"
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none resize-none"
            placeholder="Write a short description about the game..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2E7A7A] text-white font-semibold py-2 rounded-md hover:bg-[#246363] transition"
        >
          {isSubmitting ? <span className="loading loading-spinner text-success"></span> : "Update Game"}
        </button>
      </form>
    </div>
  );
};

export default UpdateForm;
