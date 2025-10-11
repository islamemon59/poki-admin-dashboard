import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { FaGamepad, FaUsers, FaUserShield, FaChartLine } from "react-icons/fa";
const useDashboardData = () => {
  const { data: totalGames = 0, isLoading: isGamesLoading } = useQuery({
    queryKey: ["totalGames"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/total-games");
      console.log("Games:", data);
      return data?.totalGames || 0;
    },
  });

  const { data: totalUsers = 0, isLoading: isUsersLoading } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/total-users");
      console.log("Users:", data);
      return data?.totalUsers || 0;
    },
  });

  const isLoading = isGamesLoading || isUsersLoading;

  const stats = [
    {
      title: "Total Games",
      value: totalGames,
      icon: <FaGamepad className="text-4xl text-blue-600" />,
      bg: "bg-blue-100",
      iconBg: "bg-blue-200",
    },
    {
      title: "Active Users",
      value: totalUsers,
      icon: <FaUsers className="text-4xl text-emerald-600" />,
      bg: "bg-emerald-100",
      iconBg: "bg-emerald-200",
    },
    {
      title: "Admin Profile",
      value: "Emon Hossain",
      icon: <FaUserShield className="text-4xl text-indigo-600" />,
      bg: "bg-indigo-100",
      iconBg: "bg-indigo-200",
    },
    // Added a new stat for a more balanced grid layout
    {
      title: "Monthly Revenue",
      value: "$15.5K",
      icon: <FaChartLine className="text-4xl text-amber-600" />,
      bg: "bg-amber-100",
      iconBg: "bg-amber-200",
    },
  ];
  return { stats, isLoading };
};

export default useDashboardData;
