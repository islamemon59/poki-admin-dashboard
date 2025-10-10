import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DeleteButton from "../DeleteButton/DeleteButton";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const GameCard = ({ game, refetch }) => {
  const [hovered, setHovered] = useState(false);

  const handleUpdate = (id) => {
    console.log("Update game:", id);
  };

  const handleDelete = async (id) => {
    console.log("Delete game:", id);
    Swal.fire({
      title: "Are you sure?",
      text: "This game will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`http://localhost:5000/games/${id}`);
          console.log(res);
          if (res.status == 200) {
            toast.success("Game has been deleted.");
            refetch();
          }
        } catch (err) {
          console.log(err);
          toast.error("Failed to delete the game.");
        }
      }
    });
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
        ${
          hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {/* Game Title */}
        <h3 className="text-center text-sm font-semibold mb-2">{game.title}</h3>

        {/* Admin Buttons */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleUpdate(game._id)}
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition"
            title="Update"
          >
            <FaEdit className="text-white" />
          </button>
          <DeleteButton
            onDelete={handleDelete}
            id={game?._id}
          />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
