const bwipjs = require("bwip-js");
const Jimp = require("jimp");
const fs = require("fs");

async function generateTicket(code, pageFile, x, y) {
  const codeImgBinary = await bwipjs.toBuffer({
    bcid: "code128",
    text: code,
    scale: 3,
    height: 10,
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

async function generateTickets(template, count) {
  fs.copyFileSync(template, "tickets.png");

  initalCount = count;
  while (count) {
    // TODO: Replace with crypto.js random
    const code = `LB22-${Math.floor(Math.random() * 1000000)}`;

    await generateTicket(
      code,
      "tickets.png",
      2480 / 2 - 462 / 2,
      (initalCount - count + 1) * 400
    );
    count--;
  }

  // TODO: Cleanup temp__code.png
}

(async function () {
  await generateTickets("LucianBlagaHS-A4TicketSheet.png", 3);
})();
