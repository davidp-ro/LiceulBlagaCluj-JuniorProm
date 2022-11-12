/**
 * @brief Handle validating and updating a ticket upon scanning it
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
import { supabase, corsResponse, failResponse, okResponse } from "../lib.ts";

interface Ticket {
  code: string;
  entries_remaining: number;
  ticket_type: "student+generic" | "guest+vip";
  expires_at: Date;
  created_at: Date;
  entries: Date[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return corsResponse();
  }

  const { barcode } = await req.json();
  console.log(`Checking code ${barcode}`);

  let { data, error } = await supabase
    .from("tickets")
    .select()
    .eq("code", barcode);

  if (error) {
    console.warn(`${barcode} :: Failed to fetch data w/ error: ${error}`);
    return failResponse(error?.message ?? "Something went wrong");
  }

  if (!data || data.length == 0) {
    console.warn(`${barcode} :: Ticket not found`);
    return failResponse("Ticket not found", 400);
  }

  const ticket: Ticket = data[0];
  if (ticket.entries_remaining <= 0) {
    console.warn(`${barcode} :: Ticket has no entries remaining`);
    return failResponse("NO_ENTRY:Ticket has no entries remaining", 200);
  }
  if (ticket.expires_at < new Date()) {
    console.warn(`${barcode} :: Ticket has expired`);
    return failResponse("NO_ENTRY:Ticket has expired", 200);
  }

  let entries = ticket.entries;
  if (!entries) {
    entries = [];
  }

  ({ data, error } = await supabase
    .from("tickets")
    .update({
      code: ticket.code,
      entries_remaining: ticket.entries_remaining - 1,
      ticket_type: ticket.ticket_type,
      expires_at: ticket.expires_at,
      created_at: ticket.created_at,
      entries: [...entries, new Date()],
    })
    .eq("code", barcode)
    .select());

  if (error) {
    console.warn(`${barcode} :: Failed to update w/ error: ${error}`);
    return failResponse(error?.message ?? "Something went wrong");
  }

  console.log(
    `${barcode} :: Ticket is ok. Entries remaining: ${
      ticket.entries_remaining - 1
    }`
  );
  return okResponse(data);
});
