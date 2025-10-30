import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { FaGamepad, FaUsers, FaUserShield, FaChartLine } from "react-icons/fa";
import useAuth from "./useAuth";
const useDashboardData = () => {
  const {user} = useAuth();
  const { data: totalGames = 0, isLoading: isGamesLoading, refetch: refetchGames } = useQuery({
    queryKey: ["totalGames"],
    queryFn: async () => {
      const { data } = await axios.get("https://server.innliv.com/total-games");
      return data?.totalGames || 0;
    },
  });

  const { data: totalUsers = 0, isLoading: isUsersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: async () => {
      const { data } = await axios.get("https://server.innliv.com/total-users");
      return data?.totalUsers || 0;
    },
  });

  const isLoading = isGamesLoading || isUsersLoading;
    // ✅ Combined refetch function
  const refetchAll = async () => {
    await Promise.all([refetchGames(), refetchUsers()]);
  };

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
      value: `${user?.displayName || "Admin"}`,
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
  return { stats, isLoading, refetchAll };
};

export default useDashboardData;
