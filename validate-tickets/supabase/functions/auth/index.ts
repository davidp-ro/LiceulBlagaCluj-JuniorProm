/**
 * @brief Handle authentication with the auth code
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

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { supabase, okResponse, failResponse, corsResponse } from "../lib.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return corsResponse();
  }

  const { authCode } = await req.json();
  console.log(`Authenticating with code ${authCode}`);

  const { data, error } = await supabase
    .from("auth")
    .select()
    .eq("auth_code", authCode);

  if (error || !data || data.length == 0) {
    console.warn(
      `${authCode} :: Failed to authenticate w/ error: ${error ?? "Unknown"}`
    );
    return failResponse(
      error?.message ?? "Invalid auth code / Cod de autentificare invalid"
    );
  }

  console.log(`${authCode} :: Ok`);
  return okResponse(data[0].id ?? "Authenticated");
});
