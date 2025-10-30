import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Link, useParams } from "react-router";
import Loader from "../../../Shared/Loader/Loader";
import useDynamicTitle from "../../../Hooks/useDynamicTitle";

const GameDetails = () => {
  const { id } = useParams();
  const [hovered, setHovered] = useState(null);
  console.log(id);
  const { data: games } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const { data } = await axios.get("https://server.innliv.com/games");
      return data;
    },
  });
  const { data: game, isLoading } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      const { data } = await axios.get(`https://server.innliv.com/games/${id}`);
      return data;
    },
  });

  useDynamicTitle(game?.title);
  const otherGames = games?.filter((g) => g?._id != id);
  console.log(game);

  if (isLoading) return <Loader />;

  if (!game)
    return <h2 className="text-center text-red-500">Game not found!</h2>;

  // ✅ Validate URL before using it in iframe
  const isValidUrl = (url) => {
    try {
      return url && (url.startsWith("http://") || url.startsWith("https://"));
    } catch {
      return false;
    }
  };
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {/* Main Game */}
      <h1 className="text-2xl font-bold mb-4 text-center">{game?.title}</h1>
      {isValidUrl(game?.gameUrl) ? (
        <iframe
          src={game?.gameUrl}
          title={game?.title}
          className="w-full h-[500px] rounded-xl shadow-lg mb-8"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-[500px] flex flex-col items-center justify-center rounded-xl bg-gray-200 text-gray-600 mb-8">
          <p className="text-lg font-semibold">
            ⚠️ Invalid game URL — cannot display game
          </p>
          {game?.thumbnail && (
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-40 h-40 object-cover rounded-lg mt-4 shadow"
            />
          )}
        </div>
      )}

      {/* Recommended Games */}
      <h2 className="text-xl font-semibold mb-4">Other Games</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {otherGames?.map((g) => (
          <Link
            key={g?._id}
            to={`/games/${g?._id}`}
            className="rounded-xl overflow-hidden shadow-md relative group"
            onMouseEnter={() => setHovered(g?._id)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={g?.thumbnail}
              alt={g?.title}
              className="w-full h-32 object-cover"
            />
            <div
              className={`absolute text-sm bottom-1 left-0 w-full font-bold bg-opacity-60 p-2 text-white text-center transform transition-transform duration-500
          ${hovered === g?._id ? "translate-y-0" : "translate-y-full"}`}
            >
              {g?.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameDetails;
