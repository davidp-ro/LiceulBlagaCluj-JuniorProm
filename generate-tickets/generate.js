// @ts-check

const Tickets = require("./lib/tickets");

(async function () {
  console.log('Start...');
  const initialTime = new Date();

  await Tickets.generate("LucianBlagaHS-A4TicketSheet_TEMPLATE.png", 5, 10);

  const finalTime = new Date();
  // @ts-ignore
  console.log(`Done in ${finalTime - initialTime}ms`);
})();
