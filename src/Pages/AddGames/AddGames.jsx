import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadImage } from "../../Api/imageUploadApi";
import useCategories from "../../Hooks/useCategories";
import useDynamicTitle from "../../Hooks/useDynamicTitle";
import GameDescriptionEditor from "./GameDescriptionEditor";

const AddGames = () => {
  useDynamicTitle("Add Games");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { allCategories } = useCategories();

  const {
    register,
    handleSubmit,
    control,
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

      const newGame = {
        title: formData.title,
        category: formData.category,
        gameUrl: formData.gameUrl,
        thumbnail: thumbnailUrl,
        description: formData.description,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
      };

      console.log("Adding game:", newGame);

      const { data: res } = await axios.post(
        "https://server.innliv.com/games",
        newGame
      );

      console.log(res);

      if (res?.result.insertedId) {
        Swal.fire("Success!", "Game added successfully!", "success");
        reset();
        setPreviewUrl("");
        setSelectedFile(null);
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
          <select
            {...register("category", { required: true })}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            {allCategories?.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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

        {/* Description */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold mb-1">Description</label>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <GameDescriptionEditor
                // Lexical deals with its own state, so you only pass the onChange handler
                onChange={field.onChange}
                // value={field.value} // Lexical manages its own internal state via the config
              />
            )}
          />

          {/* ⚠️ NOTE: This Lexical setup requires you to use the @lexical/html package 
     to convert the editor's internal state into an HTML string that your 
     `dangerouslySetInnerHTML` display code expects. */}
        </div>

        {/* === SEO Meta Fields === */}
        <hr className="my-4 border-gray-300 md:col-span-2" />
        <h3 className="text-xl font-semibold text-[#144D75] md:col-span-2">
          🧩 SEO Meta Info
        </h3>

        {/* Meta Description */}
        <div className="flex flex-col md:col-span-2 mt-2">
          <label className="font-semibold mb-1">Meta Description</label>
          <textarea
            {...register("metaDescription")}
            rows="2"
            maxLength={160}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none resize-none"
            placeholder="Enter short SEO-friendly description (max 160 chars)"
          ></textarea>
          <p className="text-xs text-gray-400 mt-1">
            This will appear as the game's description in Google search results.
          </p>
        </div>

        {/* Meta Keywords */}
        <div className="flex flex-col md:col-span-2 mt-2">
          <label className="font-semibold mb-1">Meta Keywords</label>
          <input
            {...register("metaKeywords")}
            type="text"
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#2E7A7A] outline-none"
            placeholder="e.g. car games, racing, multiplayer"
          />
          <p className="text-xs text-gray-400 mt-1">
            Comma-separated keywords to help SEO (optional).
          </p>
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
