const bwipjs = require("bwip-js");
const Jimp = require("jimp");
const fs = require("fs");
const crypto = require("crypto");
const Supabase = require("./lib/supabase");

async function generateTicket(code, pageFile, x, y) {
  const codeImgBinary = await bwipjs.toBuffer({
    bcid: "code128",
    text: code,
    scale: 3,
    height: 15,
    includetext: true,
    textxalign: "center",
    paddingheight: 5,
    paddingwidth: 10,
    textyoffset: 2,
  });

  fs.writeFileSync("temp__code.png", codeImgBinary, "binary");

  const barcode = await Jimp.read("temp__code.png");
  const page = await Jimp.read(pageFile);
  page.composite(barcode, x, y);
  page.write(pageFile);
}

async function generateTickets(template, count, maxPerPage) {
  const supabase = new Supabase();
  let page = 1;
  let currentPerPage = 0;
  if (!fs.existsSync("out")) {
    fs.mkdirSync("out");
  }
  fs.copyFileSync(template, `out/tickets_${page}.png`);

  initalCount = count;
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
      
      await generateTicket(
        code,
        `out/tickets_${page}.png`,
        2480 / 2 - 462 / 2, // x coord
        y // y coord
      );

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

  fs.unlinkSync("temp__code.png");
}

(async function () {
  console.log('Start...');
  const initialTime = new Date();

  await generateTickets("LucianBlagaHS-A4TicketSheet.png", 3, 2);

  const finalTime = new Date();
  console.log(`Done in ${finalTime - initialTime}ms`);
})();
