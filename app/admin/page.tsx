"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<"overview" | "users" | "business">(
    "overview",
  );
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    users: false,
    businesses: false,
  });

  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchBusinesses = async () => {
    setLoading((prev) => ({ ...prev, businesses: true }));
    try {
      const res = await fetch("/api/admin/businesses", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || data.data || []);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading((prev) => ({ ...prev, businesses: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBusinesses();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      // Note: Removed useAuth().getToken() because cookies handle this
      const res = await fetch(`/api/business/admin/approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // THIS IS THE KEY: Sends cookies to Next.js
        body: JSON.stringify({ action: "Approve" }),
      });

      const data = await res.json();

      if (data.success) {
        setBusinesses((prev) =>
          prev.map((b) =>
            b._id === id
              ? { ...b, businessVerified: true, businessStatus: "Approved" }
              : b,
          ),
        );
        alert("Business approved!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/businesses/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "Reject", reason: "Rejected by admin" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBusinesses(businesses.filter((b) => b._id !== id));
        }
      }
    } catch (error) {
      console.error("Error rejecting business:", error);
    }
  };

  if (view === "users")
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 font-serif">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setView("overview")}
            className="flex items-center gap-2 text-emerald-900 hover:text-emerald-700"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <button
            onClick={fetchUsers}
            disabled={loading.users}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <RefreshCw
              size={16}
              className={loading.users ? "animate-spin" : ""}
            />{" "}
            Refresh
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-6">All Users</h2>
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-medium text-gray-700">Name</th>
                  <th className="py-4 px-6 font-medium text-gray-700">Email</th>
                  <th className="py-4 px-6 font-medium text-gray-700">Phone</th>
                  <th className="py-4 px-6 font-medium text-gray-700">Role</th>
                  <th className="py-4 px-6 font-medium text-gray-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading.users ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">{u.fullName}</td>
                      <td className="py-4 px-6">{u.email}</td>
                      <td className="py-4 px-6">{u.phoneNumber}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${u.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

  if (view === "business")
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 font-serif">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setView("overview")}
            className="flex items-center gap-2 text-emerald-900 hover:text-emerald-700"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <button
            onClick={fetchBusinesses}
            disabled={loading.businesses}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <RefreshCw
              size={16}
              className={loading.businesses ? "animate-spin" : ""}
            />{" "}
            Refresh
          </button>
        </div>
        <h2 className="text-2xl font-semibold mb-6">Business Verifications</h2>
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-medium text-gray-700">
                    Business Name
                  </th>
                  <th className="py-4 px-6 font-medium text-gray-700">Email</th>
                  <th className="py-4 px-6 font-medium text-gray-700">Owner</th>
                  <th className="py-4 px-6 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="py-4 px-6 font-medium text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading.businesses ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Loading businesses...
                    </td>
                  </tr>
                ) : businesses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No businesses found
                    </td>
                  </tr>
                ) : (
                  businesses.map((b) => (
                    <tr
                      key={b._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 font-medium">
                        {b.businessName}
                      </td>
                      <td className="py-4 px-6">{b.email}</td>
                      <td className="py-4 px-6">{b.ownerName}</td>
                      <td className="py-4 px-6">
                        {b.businessVerified ||
                        b.businessStatus === "Approved" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!b.businessVerified &&
                        b.businessStatus === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApprove(b._id)}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(b._id)}
                              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            {b.businessStatus}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

  const pendingBusinesses = businesses.filter(
    (b) => !b.businessVerified && b.businessStatus === "Pending",
  ).length;
  const totalBusinesses = businesses.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-serif">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
            <ShieldCheck size={32} className="text-emerald-900" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users and business verifications
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          onClick={() => setView("users")}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 text-center cursor-pointer hover:shadow-md hover:border-emerald-200 transition"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-emerald-900" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {users.length}
          </div>
          <div className="text-lg text-emerald-900 font-medium">
            Total Users
          </div>
          <p className="text-sm text-gray-500 mt-2">Click to view all users</p>
        </div>
        <div
          onClick={() => setView("business")}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 text-center cursor-pointer hover:shadow-md hover:border-emerald-200 transition"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-emerald-900" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {totalBusinesses}
          </div>
          <div className="text-lg text-emerald-900 font-medium">
            Total Businesses
          </div>
          <div className="mt-2">
            {pendingBusinesses > 0 ? (
              <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                {pendingBusinesses} pending approval
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                All businesses verified
              </span>
            )}
          </div>
        </div>
      </div>

      {pendingBusinesses > 0 && (
        <div className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Building2 size={20} className="text-amber-800" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">
                  Pending Approvals
                </h3>
                <p className="text-sm text-amber-700">
                  You have {pendingBusinesses} business
                  {pendingBusinesses !== 1 ? "es" : ""} waiting for approval
                </p>
              </div>
            </div>
            <button
              onClick={() => setView("business")}
              className="px-4 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 transition"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Admins:</span>
              <span className="font-medium">
                {users.filter((u) => u.role === "Admin").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Regular Users:</span>
              <span className="font-medium">
                {users.filter((u) => u.role !== "Admin").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Verified Businesses:
              </span>
              <span className="font-medium">
                {businesses.filter((b) => b.businessVerified).length}
              </span>
            </div>
          </div>
        </div>
        <div className="p-5 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Recent Users</h3>
          <div className="space-y-2">
            {users.slice(0, 3).map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <span className="text-sm truncate">{user.fullName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Recent Businesses</h3>
          <div className="space-y-2">
            {businesses.slice(0, 3).map((business) => (
              <div
                key={business._id}
                className="flex items-center justify-between"
              >
                <span className="text-sm truncate">
                  {business.businessName}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${business.businessVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                >
                  {business.businessVerified ? "✓" : "⏱"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
