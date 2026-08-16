"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext({ user: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    (async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (data) {
          setProfile(data);
          return;
        }
        // No profile row yet — this happens for brand-new accounts, including
        // first-time Google sign-ins. Build a sensible default username from
        // whatever the auth provider gave us.
        const meta = user.user_metadata || {};
        const rawDesired =
          meta.username || meta.full_name || meta.name || user.email.split("@")[0];
        const desired = String(rawDesired).replace(/\s+/g, "").slice(0, 24);
        const { data: created } = await supabase
          .from("profiles")
          .insert({ id: user.id, username: desired })
          .select()
          .maybeSingle();
        if (created) {
          setProfile(created);
          return;
        }
        const fallback = `${desired}${Math.floor(1000 + Math.random() * 9000)}`;
        const { data: created2 } = await supabase
          .from("profiles")
          .insert({ id: user.id, username: fallback })
          .select()
          .maybeSingle();
        setProfile(created2 || null);
      } catch (e) {
        setProfile(null);
      }
    })();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
