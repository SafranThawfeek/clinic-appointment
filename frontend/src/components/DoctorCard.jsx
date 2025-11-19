import React from "react";
import Avatar from "./Avatar";

export default function DoctorCard({ name, specialty, patients, img }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow flex items-center gap-4">
      <Avatar src={img} name={name} size={48} className="border" />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-500">{specialty}</p>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-800">{patients}</div>
        <div className="text-xs text-gray-400">Bookings</div>
      </div>
    </div>
  );
}
