import supabase from "../../utils/supabase/server";
import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { Session } from "@supabase/supabase-js";

export default function SupabaseLogin() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Auth supabaseClient={supabase} />
  }
  else {
    return (<div>Logged in!</div>)
  }
}