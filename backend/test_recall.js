require('dotenv').config();
const hindsightService = require('./src/services/hindsightService');

async function test() {
  const q1 = await hindsightService.recallMemory("Have we seen a Payment API database connection pool failure?");
  console.log("=== Q1: Payment API ==="); 
  console.log(q1.results.map(r => r.text));

  const q2 = await hindsightService.recallMemory("Have we seen Redis memory configuration cause a deployment problem?");
  console.log("=== Q2: Order Service ===");
  console.log(q2.results.map(r => r.text));

  const q3 = await hindsightService.recallMemory("Have we seen database timeout configuration cause authentication failures?");
  console.log("=== Q3: Auth Service ===");
  console.log(q3.results.map(r => r.text));
}
test();
