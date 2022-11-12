/**
 * @brief Common functions, constants and instances
 * 
 * @license GPL-3.0
 * 
 * Copyright (C) 2022 <David Pescariu, @davidp-ro>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { createClient } from "https://esm.sh/@supabase/supabase-js";

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

/********************************[ Responses ]********************************/

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  "Access-Control-Allow-Headers":
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
  "Content-Type": "application/json",
  "Served-By": "supabase-edge__lb22-junior-prom",
};

// deno-lint-ignore no-explicit-any
export const okResponse = (data: any) => {
  return new Response(
    JSON.stringify({
      status: "ok",
      data: data,
    }),
    {
      status: 200,
      headers: HEADERS,
    }
  );
};

export const failResponse = (error: string | Error, code = 500) => {
  return new Response(
    JSON.stringify({
      status: "fail",
      data: error,
    }),
    {
      status: code,
      headers: HEADERS,
    }
  );
};

export const corsResponse = () => {
  return new Response(JSON.stringify({ status: "ok", data: null }), {
    headers: HEADERS,
  });
};
