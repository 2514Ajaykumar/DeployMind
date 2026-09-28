require('dotenv').config();
const hindsightService = require('./src/services/hindsightService');

async function test() {
  console.log("=== Q1 ===");
  const q1 = await hindsightService.recallMemory("What happened after the Order Service Redis memory deployment was analyzed?");
  console.log(q1.results.map(r => r.text));

  console.log("=== Q2 ===");
  const q2 = await hindsightService.recallMemory("What did engineers report about the Order Service Redis memory deployment?");
  console.log(q2.results.map(r => r.text));
}
test();
