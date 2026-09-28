const hindsightService = require('./hindsightService');
const llmService = require('./llmService');

const analyzeDeployment = async (deployment, isBacktest = false) => {
  console.log('[Agent] Starting deployment analysis');
  
  // 1. Build a dynamic Hindsight recall query
  const changesObj = deployment.changes ? (typeof deployment.changes === 'string' ? JSON.parse(deployment.changes) : deployment.changes) : null;
  let changesDesc = '';
  if (Array.isArray(changesObj)) {
    changesDesc = changesObj.map(c => `${c.component} changes from ${c.oldValue} to ${c.newValue}`).join(', ');
  } else if (changesObj) {
    changesDesc = 'configuration changes';
  }

  const query = `Find previous deployments, incidents, infrastructure changes, deployment reflections, feedback, and outcomes related to ${deployment.service_name}, ${deployment.environment} deployments, and ${changesDesc}`;
  
  console.log('[Agent] Recalling historical context with query:', query);
  
  // 2. Call Hindsight recall
  let memories = [];
  try {
    const recallResults = await hindsightService.recallMemory(query);
    if (recallResults && recallResults.results && Array.isArray(recallResults.results)) {
      if (isBacktest) {
        memories = recallResults.results
          .map(r => r.text)
          .filter(text => {
            const mentionId = text.includes(`deployment #${deployment.id}`) || text.includes(`Deployment #${deployment.id}`);
            const mentionVersion = text.includes(deployment.version);
            return !mentionId && !mentionVersion;
          });
      } else {
        memories = recallResults.results.map(r => r.text);
      }
    }
    console.log('[Agent] Historical memories retrieved:', memories.length);
  } catch (err) {
    console.error('[Agent] Failed to recall historical context:', err.message);
  }

  // 3. Send to Groq
  console.log('[Agent] Sending context to Groq');
  
  const prompt = `
You are a DevOps Pipeline Agent. Analyze the risk of the current deployment based ONLY on the provided historical evidence.
If no historical evidence is provided, explicitly state "No relevant historical deployment memory was found" in your historical evidence and reasons. DO NOT invent previous incidents.

--- CURRENT DEPLOYMENT ---
Service: ${deployment.service_name}
Environment: ${deployment.environment}
Version: ${deployment.version}
Commit: ${deployment.commit_hash || 'N/A'}
Status: ${deployment.status}
Changes: ${JSON.stringify(changesObj)}

--- HISTORICAL EVIDENCE ---
${memories.length > 0 ? memories.join('\n') : "No relevant historical deployment memory was found."}

Analyze the risk and return a JSON object with this exact structure (no markdown fences, just JSON):
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "riskScore": <integer 0-100>,
  "historicalEvidence": [
    "<string array of summarized relevant past incidents or deployments from evidence>"
  ],
  "riskReasons": [
    "<string array explaining why current deployment is risky>"
  ],
  "recommendation": "<string recommendation before deploying>",
  "confidence": "LOW" | "MEDIUM" | "HIGH"
}
`;

  const responseText = await llmService.generateResponse(prompt);
  console.log('[Agent] Analysis completed');
  
  // 4. Robust JSON parsing
  let analysis = null;
  try {
    // Strip markdown formatting if the model returns it
    let cleanText = responseText.trim();
    if (cleanText.startsWith('\`\`\`')) {
      cleanText = cleanText.replace(/^\`\`\`(json)?/i, '').trim();
    }
    if (cleanText.endsWith('\`\`\`')) {
      cleanText = cleanText.replace(/\`\`\`$/, '').trim();
    }
    
    // Find the first { and last }
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
    
    analysis = JSON.parse(cleanText);
  } catch (error) {
    console.error('[Agent] Failed to parse LLM response as JSON. Response was:', responseText);
    throw new Error('LLM did not return a valid JSON object');
  }

  return analysis;
};

module.exports = {
  analyzeDeployment
};
