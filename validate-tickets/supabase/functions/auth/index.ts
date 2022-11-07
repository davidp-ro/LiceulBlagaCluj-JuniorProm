import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  "Access-Control-Allow-Headers":
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
  "Content-Type": "application/json",
  "Served-By": "supabase-edge__lb22-junior-prom",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(JSON.stringify({ status: "ok", data: null }), {
      headers: HEADERS,
    });
  }

  const { authCode } = await req.json();

  const { data, error } = await supabase
    .from("auth")
    .select()
    .eq("auth_code", authCode);

  if (error || !data || data.length == 0) {
    return new Response(
      JSON.stringify({
        status: "fail",
        data: error?.message ?? "Something went wrong",
      }),
      {
        status: 500,
        headers: HEADERS,
      }
    );
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      data: data[0].id ?? "Authenticated",
    }),
    {
      status: 200,
      headers: HEADERS,
    }
  );
});
