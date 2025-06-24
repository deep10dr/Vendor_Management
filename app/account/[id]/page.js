import { supabase } from "@/lib/supabaseClient";
import ClientPage from "./ClientPage";

export default async function Page({ params }) {
  // ✅ Extract the id properly
  const id = params.id;

  // ✅ Use it in the query
  const { data, error } = await supabase
    .from("franchise_requests")
    .select("*")
    .eq("id", id)
    .single();

  return <ClientPage data={data} />;
}
