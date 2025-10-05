import { FaGamepad, FaUsers, FaUserShield, FaChartLine } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";

export default function AdminDashboardHome() {
  const stats = [
    {
      title: "Total Games",
      value: 120,
      icon: <FaGamepad className="text-4xl text-blue-600" />,
      bg: "bg-blue-100",
      iconBg: "bg-blue-200",
    },
    {
      title: "Active Users",
      value: 58,
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <header className="mb-10 pt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
          Welcome Back, Admin!
        </h1>
      </header>
      {/* --- */}

      {/* Stats Cards - Modernized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Extra Section - Modernized Panel */}
      <div className="mt-10 p-8 rounded-3xl bg-white shadow-2xl border border-gray-100 text-center">
        <MdLeaderboard className="text-7xl text-sky-500 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Platform Performance Insights
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Deep dive into **real-time metrics** to track game uploads, user
          engagement, and overall system performance. Use the sidebar for
          detailed analytics reports.
        </p>
      </div>
    </div>
  );
}
