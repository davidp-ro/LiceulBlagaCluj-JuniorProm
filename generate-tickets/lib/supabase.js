// @ts-check

const supabase = require("@supabase/supabase-js");
require("dotenv").config();

/**
 * Handle database operations
 */
class Supabase {
  constructor() {
    this.client = supabase.createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_KEY ?? ""
    );

    this.databaseName =
      process.env.ACTIVE_ENV === "production" ? "tickets" : "tickets_staging";
  }

  /**
   * Add a new ticket to the database, may return a fail state if a ticket with
   * the same code already exists
   *
   * @param {string} code The barcode
   * @param {string} type The type of ticket
   * @param {number} initialEntries The number of entries the ticket has
   * @param {Date} exp The expiration date
   *
   * @returns {Promise<{status: 'ok' | 'fail_duplicate' | 'fail_other', raw: any}>}
   */
  async addTicketToDb(code, type, initialEntries, exp) {
    const { data, error } = await this.client.from(this.databaseName).insert({
      code,
      entries_remaining: initialEntries,
      ticket_type: type,
      expires_at: exp,
      created_at: new Date(),
      entries: null,
    });

    if (error) {
      if (error.code === "23505") {
        return { status: "fail_duplicate", raw: error };
      } else {
        return { status: "fail_other", raw: error };
      }
    }

    return { status: "ok", raw: data };
  }
}

module.exports = Supabase;
