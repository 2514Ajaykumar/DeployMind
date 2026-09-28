const calculateScorecard = (results) => {
  let failuresOrRollbacks = 0;
  let successfulOrNoIssue = 0;
  let riskDetections = 0;
  let missedFailures = 0;
  let falseAlarms = 0;
  let correctSafePredictions = 0;

  for (const r of results) {
    const isFailure = ['FAILED', 'ROLLED_BACK'].includes(r.actualOutcome);
    const isSuccess = ['SUCCESS', 'NO_ISSUE'].includes(r.actualOutcome);
    const isHighRisk = ['HIGH', 'MEDIUM'].includes(r.predictedRisk);
    const isLowRisk = r.predictedRisk === 'LOW';

    if (isFailure) {
      failuresOrRollbacks++;
      if (isHighRisk) {
        riskDetections++;
        r.classification = 'RISK_DETECTED';
      } else if (isLowRisk) {
        missedFailures++;
        r.classification = 'MISSED_FAILURE';
      }
    } else if (isSuccess) {
      successfulOrNoIssue++;
      if (isLowRisk) {
        correctSafePredictions++;
        r.classification = 'CORRECT_SAFE_PREDICTION';
      } else if (isHighRisk) {
        falseAlarms++;
        r.classification = 'FALSE_ALARM';
      }
    }
  }

  const riskDetectionRate = failuresOrRollbacks > 0 
    ? Number(((riskDetections / failuresOrRollbacks) * 100).toFixed(2)) 
    : null;
    
  const safePredictionRate = successfulOrNoIssue > 0 
    ? Number(((correctSafePredictions / successfulOrNoIssue) * 100).toFixed(2)) 
    : null;

  return {
    totalEvaluated: results.length,
    failuresOrRollbacks,
    successfulOrNoIssue,
    riskDetections,
    missedFailures,
    falseAlarms,
    correctSafePredictions,
    riskDetectionRate,
    safePredictionRate
  };
};

module.exports = { calculateScorecard };
