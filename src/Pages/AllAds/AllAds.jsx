import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import Loader from "../../Shared/Loader/Loader";

const AllAds = () => {
  const queryClient = useQueryClient();

  // Fetch all ads
  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/ads");
      return data.ads;
    },
  });

  // Delete ad mutation
const mutation = useMutation({
  mutationFn: async (id) => {
    return await axios.delete(`http://localhost:5000/ads/${id}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["ads"]);
  },
});


  if (isLoading) return <Loader/>

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the ad permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(id);
      }
    });
  };

  return (
<div className="max-w-6xl mx-auto p-6 min-h-screen bg-white rounded-lg">
  <h2 className="text-3xl font-bold text-center mb-8 text-[#2E7A7A]">
    Manage Ads
  </h2>

  {ads && ads.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {ads.map((ad) => (
        <div
          key={ad._id}
          className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-lg font-bold text-gray-800">{ad.title}</h3>
            <p className="text-sm text-gray-600 truncate">{ad.link}</p>
            <p className="text-sm font-medium text-gray-500">
              Position: {ad.position}
            </p>
            <div className="flex gap-2 mt-2">
              <Link
                to={`/edit/${ad._id}`}
                className="flex-1 bg-yellow-500 text-white text-center px-2 py-1 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </Link>
              <button
                className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(ad._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 text-lg mt-6">
      No ads found. Please add some ads to manage.
    </p>
  )}
</div>


  );
};

export default AllAds;
