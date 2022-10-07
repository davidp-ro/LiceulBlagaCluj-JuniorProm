// @ts-check

const fs = require("fs");
const bwipjs = require("bwip-js");
const Jimp = require("jimp");

const Barcode = {
  /**
   * Filename for the image used for the current barcode
   */
  TEMP_IMG_FILENAME: "temp__code.png",
  
  /**
   * Generate the barcode image and place it on the page
   * 
   * @param {string} code Generated code that's *already* in the db
   * @param {string} pageFile Path to the page file
   * @param {number} x X coordiante of the barcode
   * @param {number} y Y coordinate of the barcode
   */
  async generateTicket(code, pageFile, x, y) {
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
  
    fs.writeFileSync(this.TEMP_IMG_FILENAME, codeImgBinary, "binary");
  
    const barcode = await Jimp.read(this.TEMP_IMG_FILENAME);
    const page = await Jimp.read(pageFile);
    page.composite(barcode, x, y);
    page.write(pageFile);
  },

  /**
   * Clean up the temporary image file
   */
  cleanup() {
    fs.unlinkSync("temp__code.png");
  }
}

module.exports = Barcode;
