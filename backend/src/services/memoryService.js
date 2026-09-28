const hindsightService = require('./hindsightService');

const ingestDeployment = async (deployment) => {
  try {
    let changesText = "None.";
    if (deployment.changes) {
      let changesObj = deployment.changes;
      if (typeof changesObj === 'string') {
        try {
          changesObj = JSON.parse(changesObj);
        } catch (e) {
          changesObj = {};
        }
      }
      
      if (Array.isArray(changesObj) && changesObj.length > 0) {
        changesText = changesObj.map(c => `${c.component} changing from ${c.oldValue} to ${c.newValue}`).join(', ');
      } else if (typeof changesObj === 'object' && Object.keys(changesObj).length > 0) {
        changesText = JSON.stringify(changesObj);
      }
    }

    const text = `Deployment #${deployment.id} for ${deployment.service_name}, version ${deployment.version}, was deployed to ${deployment.environment}.
Status: ${deployment.status}.
Commit: ${deployment.commit_hash || 'N/A'}.
Duration: ${deployment.duration || 'N/A'} seconds.
Infrastructure/configuration changes included: ${changesText}`;

    await hindsightService.retainMemory(text);
  } catch (error) {
    console.warn(`Deployment created, but Hindsight memory retention failed. Error: ${error.message}`);
  }
};

const ingestIncident = async (incident) => {
  try {
    const text = `Incident #${incident.id}: ${incident.service_name} deployment ${incident.version} in ${incident.environment} failed.
Incident: ${incident.title}.
Error: ${incident.error || 'N/A'}.
Root cause: ${incident.root_cause || 'N/A'}.
Resolution: ${incident.resolution || 'N/A'}.`;

    await hindsightService.retainMemory(text);
  } catch (error) {
    console.warn(`Incident created, but Hindsight memory retention failed. Error: ${error.message}`);
  }
};

const ingestInfrastructureChange = async (change) => {
  try {
    const text = `Infrastructure Change #${change.id}: ${change.service_name} ${change.environment} deployment ${change.version} changed ${change.component} from ${change.old_value} to ${change.new_value}.`;

    await hindsightService.retainMemory(text);
  } catch (error) {
    console.warn(`Infrastructure change created, but Hindsight memory retention failed. Error: ${error.message}`);
  }
};

module.exports = {
  ingestDeployment,
  ingestIncident,
  ingestInfrastructureChange
};
