import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = typeof window !== "undefined"
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : null;

export default function Home() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async () => {
    await supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div>
        <h1>TripBuddy - Přihlášení</h1>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={signIn}>Přihlásit</button>
        <button onClick={signUp}>Registrovat</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Vítej v TripBuddy!</h1>
      <p>Přihlášen jako {session.user.email}</p>
      <button onClick={signOut}>Odhlásit se</button>
    </div>
  );
}
