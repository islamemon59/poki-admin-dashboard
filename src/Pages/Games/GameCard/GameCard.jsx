import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const GameCard = ({ game }) => {
  const [hovered, setHovered] = useState(false);

  const handleUpdate = (id) => {
    console.log("Update game:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete game:", id);
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Game Thumbnail */}
      <img
        src={game.thumbnail}
        alt={game.title}
        className="w-full h-full object-cover"
      />

      {/* Smooth Bottom-Up Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-end gap-3 text-white 
        transform transition-all duration-500 ease-out
        ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      >
        {/* Game Title */}
        <h3 className="text-center text-sm font-semibold mb-2">
          {game.title}
        </h3>

        {/* Admin Buttons */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleUpdate(game._id)}
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition"
            title="Update"
          >
            <FaEdit className="text-white" />
          </button>
          <button
            onClick={() => handleDelete(game._id)}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-full transition"
            title="Delete"
          >
            <FaTrashAlt className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
