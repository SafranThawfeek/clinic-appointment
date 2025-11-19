import React from "react";
import { Bell, Search } from "lucide-react";
import { useSearch } from "../context/SearchContext";

export default function Topbar() {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow mb-6">
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-80">
        <Search className="h-5 w-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-blue-600" />
          <img
            src="/images/doctor-left.png"
            alt="profile"
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />
      </div>
    </div>
  );
}
