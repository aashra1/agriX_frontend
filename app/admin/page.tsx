"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  ShieldCheck,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";

export default function AdminDashboard() {
  const [view, setView] = useState<"overview" | "users" | "business">(
    "overview",
  );
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
    fetch("/api/business/admin/all")
      .then((res) => res.json())
      .then((data) => setBusinesses(data));
  }, []);

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/business/admin/approve/${id}`, {
      method: "PUT",
    });
    if (res.ok) {
      setBusinesses(
        businesses.map((b) => (b._id === id ? { ...b, isVerified: true } : b)),
      );
    }
  };

  if (view === "users")
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 font-serif">
        <button
          onClick={() => setView("overview")}
          className="flex items-center gap-2 text-emerald-900 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className="text-2xl font-semibold mb-6">All Users</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase">
              <th className="py-3 font-medium">Name</th>
              <th className="py-3 font-medium">Email</th>
              <th className="py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50 text-gray-800">
                <td className="py-4">{u.fullName}</td>
                <td className="py-4">{u.email}</td>
                <td className="py-4 text-sm text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  if (view === "business")
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 font-serif">
        <button
          onClick={() => setView("overview")}
          className="flex items-center gap-2 text-emerald-900 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className="text-2xl font-semibold mb-6">Business Verifications</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase">
              <th className="py-3 font-medium">Business Name</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b._id} className="border-b border-gray-50 text-gray-800">
                <td className="py-4 font-medium">{b.businessName}</td>
                <td className="py-4">
                  {b.isVerified ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs">
                      Approved
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs">
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-4 text-right">
                  {!b.isVerified ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(b._id)}
                        className="p-1 hover:bg-emerald-50 text-emerald-900 rounded"
                      >
                        <Check size={20} />
                      </button>
                      <button className="p-1 hover:bg-red-50 text-red-600 rounded">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-sm text-right px-2">
                      Verified
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-serif">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
          <ShieldCheck size={32} className="text-emerald-900" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div
          onClick={() => setView("users")}
          className="p-6 bg-gray-50 rounded-xl text-center cursor-pointer hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100"
        >
          <Users size={28} className="text-emerald-900 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{users.length}</div>
          <div className="text-sm text-emerald-900 font-medium">
            Total Users
          </div>
        </div>

        <div
          onClick={() => setView("business")}
          className="p-6 bg-gray-50 rounded-xl text-center cursor-pointer hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100"
        >
          <Building2 size={28} className="text-emerald-900 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {businesses.length}
          </div>
          <div className="text-sm text-emerald-900 font-medium">
            Total Businesses
          </div>
        </div>
      </div>
    </div>
  );
}
