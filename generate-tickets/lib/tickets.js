// @ts-check

const fs = require("fs");
const crypto = require("crypto");
const Supabase = require("./supabase");
const Barcode = require("./barcode");

const Tickets = {
  /**
   * Complete generation flow (DB, barcodes, pages)
   * 
   * @param {string} template Path to the template file
   * @param {number} count Number of tickets to generate
   * @param {number} maxPerPage (WIP) Number of tickets per page
   */
  async generate(template, count, maxPerPage) {
    const supabase = new Supabase();
    let page = 1;
    let currentPerPage = 0;
    if (!fs.existsSync("out")) {
      fs.mkdirSync("out");
    }
    fs.copyFileSync(template, `out/tickets_${page}.png`);
  
    let initalCount = count;
    while (count) {
      const currentCount = initalCount - count + 1;
      const code = `LB22-${crypto.randomInt(100000, 999999)}`;
  
      console.log(`Generating ticket ${currentCount} of ${initalCount} (${code})`);
  
      const dbRes = await supabase.addTicketToDb(
        code,
        "student+generic",
        5,
        "2022-10-30T12:00:00.000"
      );
  
      if (dbRes.status === "fail_duplicate") {
        console.log("Duplicate code, retrying");
        continue;
      } else if (dbRes.status === "ok") {
        // todo: This still needs a bit of work to get proper alignment
        const y = (initalCount - currentPerPage + 1) * 400
        
        await Barcode.generateTicket(
          code,
          `out/tickets_${page}.png`,
          2480 / 2 - 462 / 2, // x coord
          y, // y coord
        )
  
        ++currentPerPage;
        if (currentPerPage >= maxPerPage) {
          ++page;
          currentPerPage = 0;
          fs.copyFileSync(template, `out/tickets_${page}.png`);
        }
  
        console.log("Ok, next!");
      } else if (dbRes.status === "fail_other") {
        console.error("Failed to add to db, skipping...");
        console.log(dbRes.raw);
      }
      
      count--;
    }
  
    Barcode.cleanup();
  }
}

module.exports = Tickets;
