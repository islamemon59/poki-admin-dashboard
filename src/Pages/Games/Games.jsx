import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Loader from "../../Shared/Loader/Loader";
import GameCard from "./GameCard/GameCard";
import useDynamicTitle from "../../Hooks/useDynamicTitle";

const Games = () => {
  useDynamicTitle("Games");

  const {
    data: games,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data } = await axios.get("https://server.innliv.com/games");
      return data;
    },
  });

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="flex justify-center items-center h-60 text-center text-red-500 font-medium">
        Failed to load games. Please try again later.
      </div>
    );

  // ✅ If no games found
  if (!games || games.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-60 text-center text-gray-500">
        <p className="text-lg font-semibold">No games found 🎮</p>
        <p className="text-sm text-gray-400 mt-1">
          Please check back later for new updates!
        </p>
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {games.map((game) => (
        <GameCard key={game._id} game={game} refetch={refetch} />
      ))}
    </div>
  );
};

export default Games;
