const { HindsightClient } = require('@vectorize-io/hindsight-client');
require('dotenv').config();

const client = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_BASE_URL,
  apiKey: process.env.HINDSIGHT_API_KEY || undefined
});

const getBankId = () => {
  const bankId = process.env.HINDSIGHT_BANK_ID;
  if (!bankId) throw new Error('HINDSIGHT_BANK_ID is not configured');
  return bankId;
};

const retainMemory = async (memory) => {
  const bankId = getBankId();
  // Stringify structured memory so it can be ingested as text
  const content = typeof memory === 'string' ? memory : JSON.stringify(memory);
  try {
    await client.retain(bankId, content);
    return { success: true, message: 'Memory retained in Hindsight' };
  } catch (error) {
    throw handleHindsightError(error);
  }
};

const recallMemory = async (query) => {
  const bankId = getBankId();
  try {
    const results = await client.recall(bankId, query);
    return results;
  } catch (error) {
    throw handleHindsightError(error);
  }
};

const handleHindsightError = (error) => {
  let message = error.message || 'Unknown error';
  
  // Sanitize API key from error message if it accidentally leaked
  const apiKey = process.env.HINDSIGHT_API_KEY;
  if (apiKey && message.includes(apiKey)) {
    message = message.replace(new RegExp(apiKey, 'g'), '[REDACTED_API_KEY]');
  }

  if (error.status === 401 || message.includes('401') || message.includes('Unauthorized')) {
    return new Error('Hindsight Cloud authentication failed. Please check your API key.');
  }
  
  if (error.code === 'ECONNREFUSED' || message.includes('fetch failed') || message.includes('ECONNRESET')) {
    return new Error('Hindsight Cloud is unreachable. Please verify network or base URL.');
  }

  return new Error(`Hindsight operation failed: ${message}`);
};

module.exports = {
  retainMemory,
  recallMemory
};
