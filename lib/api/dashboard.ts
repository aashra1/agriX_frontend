import axiosInstance from "./axios";

export interface DashboardData {
  success: boolean;
  message?: string;
  products: any[];
  orders: any[];
  wallet: {
    balance: number;
    currency: string;
  };
}

export const getBusinessDashboard = async (): Promise<DashboardData> => {
  try {
    let products = [];
    try {
      const productsRes = await axiosInstance.get("/api/product/business");
      products = productsRes.data.products || productsRes.data.data || [];
    } catch (error) {
      console.error("Products error:", error);
    }

    let orders = [];
    try {
      const ordersRes = await axiosInstance.get(
        "/api/order/business/orders?page=1&limit=10",
      );
      orders = ordersRes.data.orders || [];
    } catch (error) {
      console.error("Orders error:", error);
    }

    let wallet = { balance: 0, currency: "NPR" };
    try {
      const walletRes = await axiosInstance.get(
        "/api/wallets/business/balance",
      );
      wallet = walletRes.data.data || { balance: 0, currency: "NPR" };
    } catch (error) {
      console.error("Wallet error:", error);
    }

    return {
      success: true,
      products,
      orders,
      wallet,
    };
  } catch (error: any) {
    console.error("Error fetching dashboard:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch dashboard",
      products: [],
      orders: [],
      wallet: { balance: 0, currency: "NPR" },
    };
  }
};
