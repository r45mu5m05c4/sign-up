import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import supabase from "../supabase/server";
import { User } from "../types/types";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async (userId: string) => {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUserState(data);
      }
    };

    const getSessionAndFetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
      } else if (data?.session) {
        fetchUser(data.session.user.id);
      }
    };

    getSessionAndFetchUser();
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("supabaseUserId", JSON.stringify(user.id));
    } else {
      localStorage.removeItem("supabaseUserId");
    }
    setUserState(user);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      return;
    }
    localStorage.removeItem("supabaseUserId");
    setUserState(null);
  };

  const refreshAccessToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error.message);
      return;
    }
    if (data?.session) {
      const userId = data.session.user.id;
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        logout();
      } else {
        setUserState(userData);
      }
    } else {
      console.error("No session found");
      logout();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
