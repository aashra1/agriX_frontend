"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { clearAuthCookies, getAuthToken, getUserData } from "@/lib/cookie";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuth: () => Promise<void>;
  businessId: string | null; 
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = await getAuthToken();
      const userData = await getUserData();

      // Log the user data to see its structure
      console.log("Raw user data from cookie:", userData);

      // Check if userData exists and has the business structure
      if (userData) {
        // The user data might be nested or direct
        let processedUserData = userData;

        // If the response has a business property (from login response)
        if (userData.business) {
          processedUserData = userData.business;
        }

        // If the response has a data property
        if (userData.data) {
          processedUserData = userData.data;
        }

        setUser(processedUserData);
        setIsAuthenticated(!!token);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await clearAuthCookies();
      setIsAuthenticated(false);
      setUser(null);
      router.push("/business/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Derive businessId from user object - check multiple possible locations
  const businessId = user?._id || user?.id || null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        loading,
        checkAuth,
        businessId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
