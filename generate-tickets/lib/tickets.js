// @ts-check

const fs = require("fs");
const crypto = require("crypto");
const Supabase = require("./supabase");
const Barcode = require("./barcode");

const Tickets = {
  /**
   * Copy the template file to the file that will be populated with tickets
   *
   * @private
   *
   * @param {number} pageFileNumber Current page number
   * @param {import('../options.json')} options Generator options
   * 
   * @returns {string} Current page file path
   */
  __copyTemplateToPageFile(pageFileNumber, options) {
    const outFile = `out/${options.files.output.filename}_${pageFileNumber}.${options.files.output.extension}`;
    fs.copyFileSync(options.files.template, outFile);
    return outFile;
  },

  /**
   * Complete generation flow (DB, barcodes, pages)
   *
   * @param {import('../options.json')} options Generator options
   */
  async generate(options) {
    const supabase = new Supabase();

    let ticketCount = options.ticketsToGenerate;
    let page = 1;
    let currentPerPage = 0;

    if (!fs.existsSync("out")) {
      fs.mkdirSync("out");
    }
    let currentPagePath = this.__copyTemplateToPageFile(page, options);

    let initalCount = ticketCount;
    while (ticketCount) {
      const currentCount = initalCount - ticketCount + 1;
      const code = `LB22-${crypto.randomInt(100000, 999999)}`;

      console.log(
        `Generating ticket ${currentCount} of ${initalCount} (${code})`
      );

      // TODO: Uncomment this!
      const dbRes = await supabase.addTicketToDb(
        code,
        "student+generic",
        1,
        "2022-11-30T12:00:00.000"
      );

      // TODO: Temporary, to avoid adding data to db:
      // let dbRes = {
      //   status: "ok",
      //   raw: null,
      // };

      if (dbRes.status === "fail_duplicate") {
        console.log("Duplicate code, retrying");
        continue;
      } else if (dbRes.status === "ok") {
        await Barcode.generateTicket(
          code,
          currentPagePath,
          options.ticketPostitions[currentPerPage].x,
          options.ticketPostitions[currentPerPage].y,
          // @ts-ignore - in theory safe to ignore as long as the json schema is respected
          options.ticketPostitions[currentPerPage].rotation,
        );

        ++currentPerPage;
        if (currentPerPage >= options.ticketsPerPage) {
          ++page;
          currentPerPage = 0;
          currentPagePath = this.__copyTemplateToPageFile(page, options);
        }

        console.log("Ok, next!");
      } else if (dbRes.status === "fail_other") {
        console.error("Failed to add to db, skipping...");
        console.log(dbRes.raw);
      }

      ticketCount--;
    }

    Barcode.cleanup();
  },
};

module.exports = Tickets;
