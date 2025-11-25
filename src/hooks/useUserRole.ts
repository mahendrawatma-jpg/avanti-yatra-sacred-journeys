import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type AppRole = "admin" | "user";

interface UseUserRoleResult {
  user: User | null;
  role: AppRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  dashboardPath: string;
  dashboardLabel: string;
}

export const useUserRole = (): UseUserRoleResult => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          setRole(roleData?.role as AppRole || "user");
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .single()
              .then(({ data }) => {
                setRole(data?.role as AppRole || "user");
              });
          }, 0);
        } else {
          setRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = role === "admin";
  const dashboardPath = isAdmin ? "/admin" : "/user-dashboard";
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "Dashboard";

  return {
    user,
    role,
    isAdmin,
    isLoading,
    dashboardPath,
    dashboardLabel,
  };
};
