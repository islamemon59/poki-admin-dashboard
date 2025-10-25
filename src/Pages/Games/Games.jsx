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
    refetch,
  } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/games");
      return data;
    },
  });


  console.log(games);
  if (isLoading) return <Loader />;
  return (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {games?.map((game) => (
        <GameCard key={game._id} game={game} refetch={refetch} />
      ))}
    </div>
  );
};

export default Games;
