"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import BusinessSidebar from "../_components/BusinessSidebar";
import BusinessHeader from "../_components/BusinessHeader";
import {
  handleGetBusinessWalletBalance,
  handleGetBusinessTransactions,
} from "@/lib/actions/wallet-actions";

type Transaction = {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  reference: string;
  description: string;
  createdAt: string;
  metadata?: {
    orderId?: string;
    paymentId?: string;
    orderTotal?: number;
  };
};

type WalletInfo = {
  balance: number;
  currency: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function BusinessPaymentsPage() {
  const { businessId } = useAuth();
  const [wallet, setWallet] = useState<WalletInfo>({
    balance: 0,
    currency: "NPR",
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "all">("all");

  useEffect(() => {
    if (businessId) {
      fetchWalletData();
    }
  }, [businessId, pagination.page]);

  // In your BusinessPaymentsPage component, update fetchWalletData:

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching wallet data for page:", pagination.page);

      const [balanceResult, transactionsResult] = await Promise.all([
        handleGetBusinessWalletBalance(),
        handleGetBusinessTransactions(pagination.page, pagination.limit),
      ]);

      console.log("Balance result:", balanceResult);
      console.log("Transactions result:", transactionsResult);

      if (balanceResult.success) {
        setWallet(balanceResult.data);
      } else {
        console.error("Balance fetch failed:", balanceResult.message);
      }

      if (transactionsResult.success) {
        console.log("Setting transactions:", transactionsResult.data);
        setTransactions(transactionsResult.data);
        setPagination(transactionsResult.pagination);
      } else {
        console.error("Transactions fetch failed:", transactionsResult.message);
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTransactionIcon = (type: string) => {
    if (type === "credit") {
      return <TrendingUp size={20} className="text-green-600" />;
    }
    return <TrendingDown size={20} className="text-red-600" />;
  };

  const getOrderLink = (reference: string) => {
    return `/business/orders/${reference}`;
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;
    if (dateRange !== "all") {
      const days = dateRange === "7days" ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const txDate = new Date(t.createdAt);
      if (txDate < cutoff) return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-crimsonpro bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="relative">
          <div
            className="animate-spin rounded-full h-12 w-12 border-3 border-t-transparent"
            style={{ borderColor: "#0B3D0B", borderTopColor: "transparent" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />

      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader searchPlaceholder="Search transactions..." />

        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/business/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="text-green-800" size={32} />
                  <h1 className="text-4xl font-bold text-gray-900">Payments</h1>
                </div>
                <p className="text-gray-600">
                  View all your earnings and transaction history
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-green-800">
                  {formatCurrency(wallet.balance)}
                </p>
                <p className="text-xs text-gray-400 mt-1">{wallet.currency}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === "all"
                      ? "bg-green-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("credit")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    filter === "credit"
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  <TrendingUp size={16} />
                  Credits
                </button>
                <button
                  onClick={() => setFilter("debit")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    filter === "debit"
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  <TrendingDown size={16} />
                  Debits
                </button>
              </div>

              <div className="flex gap-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>

                <button
                  onClick={fetchWalletData}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Transaction History
              </h2>
            </div>

            {filteredTransactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="p-6 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            transaction.type === "credit"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span
                              className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                                transaction.type === "credit"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {transaction.type === "credit"
                                ? "CREDIT"
                                : "DEBIT"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(transaction.createdAt)}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 mb-1">
                            {transaction.description}
                          </p>
                          {transaction.metadata?.orderId && (
                            <Link
                              href={getOrderLink(transaction.reference)}
                              className="text-xs text-green-700 hover:text-green-800 inline-flex items-center gap-1"
                            >
                              View Order #{transaction.reference.slice(-6)}
                              <ArrowLeft size={12} className="rotate-180" />
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            transaction.type === "credit"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Balance: {formatCurrency(transaction.balance)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Wallet size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No transactions yet
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  When customers pay for your products, you'll see the
                  transactions here.
                </p>
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
