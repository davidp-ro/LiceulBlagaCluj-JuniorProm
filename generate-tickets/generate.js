// @ts-check

/**!
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
 */

const Tickets = require("./lib/tickets");

(async function () {
  console.log("Start...");
  const initialTime = new Date();

  await Tickets.generate(require("./options.json"));

  const finalTime = new Date();
  // @ts-ignore
  console.log(`Done in ${finalTime - initialTime}ms`);
})();
