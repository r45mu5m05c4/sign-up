import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import supabase from "../supabase/server";

interface UserContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<any | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("supabaseUserId");
    if (storedUserId) {
      const userData = JSON.parse(storedUserId);
      setUserState(userData);
    }
  }, []);

  const setUser = (user: any | null) => {
    if (user) {
      localStorage.setItem("supabaseUserId", JSON.stringify(user));
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
  };

  const refreshAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      setUserState(data.session.user);
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
