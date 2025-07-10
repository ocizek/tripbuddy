
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [session, setSession] = useState(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [newTripName, setNewTripName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        fetchTrips();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTrips();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const fetchTrips = async () => {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", supabase.auth.getUser().then(u => u.data.user?.id));
    setTrips(data || []);
  };

  const createTrip = async () => {
    if (!newTripName) return;
    const user = await supabase.auth.getUser();
    await supabase.from("trips").insert([{ name: newTripName, user_id: user.data.user?.id }]);
    setNewTripName("");
    fetchTrips();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return <div><h1>Přihlášení nutné</h1></div>;
  }

  return (
    <div>
      <h1>Moje výlety</h1>
      <input placeholder="Název výletu" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} />
      <button onClick={createTrip}>Vytvořit výlet</button>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>{trip.name}</li>
        ))}
      </ul>
      <button onClick={signOut}>Odhlásit</button>
    </div>
  );
}
