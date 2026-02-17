"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  MapPin,
  User,
  Loader2,
  ArrowLeft,
  Package,
  DollarSign,
  Clock,
  Filter,
  Download,
} from "lucide-react";
import BusinessSidebar from "../_components/BusinessSidebar";
import BusinessHeader from "../_components/BusinessHeader";
import { getBusinessOrders } from "@/lib/api/order";
import { Order } from "@/lib/api/order";

type Customer = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder: string;
  addresses?: string[];
};

export default function BusinessCustomersPage() {
  const router = useRouter();
  const { businessId, loading: authLoading } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "orders" | "spent" | "recent">(
    "recent",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<"all" | "week" | "month" | "year">(
    "all",
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!businessId) return;

      setIsLoading(true);
      try {
        // Fetch all orders for this business
        const ordersResponse = await getBusinessOrders(1, 100); // Get up to 100 orders
        const orders = ordersResponse.orders || [];

        // Process orders to extract unique customers
        const customerMap = new Map<string, Customer>();

        orders.forEach((order: Order) => {
          // Skip if user is not an object (shouldn't happen with proper population)
          if (typeof order.user !== "object" || !order.user) return;

          const userId = (order.user as any)._id;
          const userFullName =
            (order.user as any).fullName || "Unknown Customer";
          const userEmail = (order.user as any).email || "";
          const userPhone = (order.user as any).phone || "";

          if (!customerMap.has(userId)) {
            customerMap.set(userId, {
              _id: userId,
              fullName: userFullName,
              email: userEmail,
              phone: userPhone,
              totalOrders: 0,
              totalSpent: 0,
              firstOrder: order.createdAt,
              lastOrder: order.createdAt,
              addresses: [],
            });
          }

          const customer = customerMap.get(userId)!;
          customer.totalOrders += 1;
          customer.totalSpent += order.total;

          // Update first and last order dates
          if (new Date(order.createdAt) < new Date(customer.firstOrder)) {
            customer.firstOrder = order.createdAt;
          }
          if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
            customer.lastOrder = order.createdAt;
          }

          // Add unique shipping address
          if (order.shippingAddress) {
            const addressString = `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}`;
            if (!customer.addresses?.includes(addressString)) {
              customer.addresses = [
                ...(customer.addresses || []),
                addressString,
              ];
            }
          }
        });

        const customersList = Array.from(customerMap.values());
        setCustomers(customersList);
        setFilteredCustomers(customersList);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId) {
      fetchCustomers();
    }
  }, [businessId]);

  useEffect(() => {
    // Filter and sort customers
    let filtered = [...customers];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.fullName.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          (customer.phone && customer.phone.includes(query)),
      );
    }

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();

      switch (dateRange) {
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (customer) => new Date(customer.lastOrder) >= cutoff,
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case "orders":
          comparison = a.totalOrders - b.totalOrders;
          break;
        case "spent":
          comparison = a.totalSpent - b.totalSpent;
          break;
        case "recent":
          comparison =
            new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredCustomers(filtered);
  }, [customers, searchQuery, sortBy, sortOrder, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) return null;
    return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
        <Loader2 className="animate-spin text-green-800" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />

      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader searchPlaceholder="Search customers..." />

        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Link
                  href="/business/dashboard"
                  className="text-gray-500 hover:text-green-800"
                >
                  Dashboard
                </Link>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-green-800 font-medium">Customers</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">My Customers</h1>
              <p className="text-gray-500 mt-1">
                {filteredCustomers.length}{" "}
                {filteredCustomers.length === 1 ? "customer" : "customers"}{" "}
                found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <Filter size={18} />
                <span className="text-sm font-medium">Filters</span>
              </button>
              <button
                onClick={() => {
                  // Export customers data
                  const csv = [
                    [
                      "Name",
                      "Email",
                      "Phone",
                      "Total Orders",
                      "Total Spent",
                      "First Order",
                      "Last Order",
                    ],
                    ...filteredCustomers.map((c) => [
                      c.fullName,
                      c.email,
                      c.phone || "",
                      c.totalOrders.toString(),
                      c.totalSpent.toString(),
                      formatDate(c.firstOrder),
                      formatDate(c.lastOrder),
                    ]),
                  ]
                    .map((row) => row.join(","))
                    .join("\n");

                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "customers.csv";
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <Download size={18} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
              />
            </div>

            {showFilters && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      Date Range:
                    </span>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as any)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-800"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customers Table */}
          {filteredCustomers.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm border border-gray-200/50">
              <Users size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No customers found
              </h3>
              <p className="text-gray-500">
                {searchQuery || dateRange !== "all"
                  ? "No customers match your search criteria. Try adjusting your filters."
                  : "You haven't had any customers yet. Orders will appear here once customers start buying."}
              </p>
              {(searchQuery || dateRange !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDateRange("all");
                  }}
                  className="mt-6 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-gray-200/50">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center hover:text-green-800"
                        >
                          Customer
                          <SortIcon field="name" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        <button
                          onClick={() => handleSort("orders")}
                          className="flex items-center hover:text-green-800"
                        >
                          Orders
                          <SortIcon field="orders" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        <button
                          onClick={() => handleSort("spent")}
                          className="flex items-center hover:text-green-800"
                        >
                          Total Spent
                          <SortIcon field="spent" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        <button
                          onClick={() => handleSort("recent")}
                          className="flex items-center hover:text-green-800"
                        >
                          Last Order
                          <SortIcon field="recent" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="hover:bg-gray-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-green-800 font-bold text-lg">
                                {customer.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 group-hover:text-green-800 transition-colors">
                                {customer.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Customer since {formatDate(customer.firstOrder)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {customer.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                <span>{customer.email}</span>
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={14} className="text-gray-400" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-green-600" />
                            <span className="font-medium text-gray-900">
                              {customer.totalOrders}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-green-600" />
                            <span className="font-medium text-gray-900">
                              {formatCurrency(customer.totalSpent)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(customer.lastOrder)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/business/orders?customer=${customer._id}`}
                              className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                            >
                              <ShoppingBag size={14} />
                              View Orders
                            </Link>
                            {customer.addresses &&
                              customer.addresses.length > 0 && (
                                <div className="relative group/address">
                                  <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors">
                                    <MapPin size={16} />
                                  </button>
                                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 hidden group-hover/address:block z-50">
                                    <p className="text-xs font-medium text-gray-700 mb-2">
                                      Shipping Addresses
                                    </p>
                                    {customer.addresses.map((addr, i) => (
                                      <p
                                        key={i}
                                        className="text-xs text-gray-600 mb-1 last:mb-0"
                                      >
                                        • {addr}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          {customers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-800">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {customers.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-800">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Average Orders/Customer
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(
                        customers.reduce((acc, c) => acc + c.totalOrders, 0) /
                        customers.length
                      ).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-800">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Average Spend/Customer
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(
                        customers.reduce((acc, c) => acc + c.totalSpent, 0) /
                          customers.length,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
