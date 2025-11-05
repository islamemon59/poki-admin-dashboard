import { MdLeaderboard } from "react-icons/md";
import Loader from "../Shared/Loader/Loader";
import useDashboardData from "../Hooks/useDashboardData";
import useDynamicTitle from "../Hooks/useDynamicTitle";

export default function AdminDashboardHome() {
  useDynamicTitle("Home");
  const { stats, isLoading, refetchAll } = useDashboardData();

  if (isLoading) return <Loader />;

  refetchAll();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10 pt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
          Welcome Back, Admin!
        </h1>
      </header>
      {/* --- */}

      {/* Stats Cards - Modernized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <div
            key={index}
            // Modern Card Style: Rounded borders, strong shadow, hover effect
            className={`p-6 rounded-3xl ${stat.bg} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between ">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {stat.title}
                </p>
                {/* Value - Larger and Bolder */}
                <h2 className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </h2>
              </div>
              {/* Icon - With rounded background for emphasis */}
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
      {/* --- */}
    </div>
  );
}
