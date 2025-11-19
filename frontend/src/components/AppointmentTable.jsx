import React from "react";
import Avatar from "./Avatar";

export default function AppointmentTable({
  list = [],
  page = 1,
  total = 0,
  limit = 10,
  onPageChange = () => {},
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  // new prop: show or hide action column/buttons
  showActions = true,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="border-b bg-gray-100 text-left text-gray-600">
              <th className="p-3">Date & Time</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Status</th>
              {showActions && <th className="p-3 text-right">Action</th>}
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 6 : 5} className="text-center py-8 text-gray-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              list.map((appt) => (
                <tr key={appt._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 align-top">
                    <div className="text-sm font-medium">
                      {appt.date}
                    </div>
                    <div className="text-xs text-gray-500">{appt.time}</div>
                  </td>

                  <td className="p-3 align-top">
                    <div className="flex items-center gap-3">
                      <Avatar src={appt.patientImage} name={appt.patientName} size={40} className="border" />
                      <div>
                        <div className="font-medium">{appt.patientName}</div>
                        <div className="text-xs text-gray-500">{appt.patientPhone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 align-top">
                    <div className="flex items-center gap-3">
                      <Avatar src={appt.doctorImage} name={appt.doctorName} size={40} className="border" />
                      <div>
                        <div className="font-medium">{appt.doctorName}</div>
                        <div className="text-xs text-gray-500">{appt.doctorSpeciality || appt.specialization}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 align-top">{appt.mode}</td>

                  <td className="p-3 align-top">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appt.status === "CheckedOut"
                          ? "bg-blue-100 text-blue-700"
                          : appt.status === "CheckedIn"
                          ? "bg-yellow-100 text-yellow-700"
                          : appt.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : appt.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "Scheduled"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>

                  {showActions && (
                    <td className="p-3 align-top text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onView(appt)}
                          className="text-gray-600 hover:text-gray-800"
                          title="View"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onEdit(appt)}
                          className="text-blue-600 hover:underline"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(appt)}
                          className="text-red-600 hover:underline"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">Showing {list.length} of {total} results</div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* simple numeric pages */}
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 rounded ${p === page ? "bg-blue-700 text-white" : "border"}`}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
