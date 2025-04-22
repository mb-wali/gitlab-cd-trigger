/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 188:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(188);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GitLab pipeline status values (see https://docs.gitlab.com/ee/api/pipelines.html#list-project-pipelines):
 * - created: The pipeline has been created but has not yet been processed.
 * - preparing: The pipeline is being prepared to run.
 * - pending: The pipeline is queued and waiting for available resources to start running.
 * - waiting_for_resource: The pipeline is queued, but there are not enough resources available to start running.
 * - running: The pipeline is currently running.
 * - scheduled: The pipeline is scheduled to run at a later time.
 * - failed: The pipeline has completed running, but one or more jobs have failed.
 * - success: The pipeline has completed running, and all jobs have succeeded.
 * - canceled: The pipeline has been canceled by a user or system.
 * - skipped: The pipeline was skipped due to a configuration option or a pipeline rule.
 * - manual: The pipeline is waiting for a user to trigger it manually.
 */
const pollPipeline = async (host, projectId, token, pipelineId, webUrl) => {
    console.log(`Polling pipeline ${pipelineId} on ${host}!`);

    const url = `https://${host}/api/v4/projects/${projectId}/pipelines/${pipelineId}`;
    let status = 'pending';
    const breakStatusList = ['failed', 'success', 'canceled', 'skipped'];

    while (true) {
        // wait 15 seconds
        await wait(15000);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'PRIVATE-TOKEN': token,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                let errorMessage = `GitLab API returned status code ${response.status}.`;
                if (response.status === 401) {
                    errorMessage = "Unauthorized: invalid/expired access token was used.";
                }
                core.setFailed(errorMessage);
                break;
            }

            const data = await response.json();

            status = data.status;
            core.setOutput("status", status);
            console.log(`Pipeline status: ${status} (${webUrl})`);

            if (status === 'failed') {
                core.setFailed(`Pipeline failed!`);
            }

            if (breakStatusList.includes(status)) {
                console.log(`Status "${status}" detected, breaking loop!`);
                break;
            }
        } catch (error) {
            core.setFailed(error.message);
            break;
        }
    }

    return status;
}

async function run() {
    const host = encodeURIComponent(core.getInput('URL'));
    const projectId = encodeURIComponent(core.getInput('PROJECT_ID'));
    const triggerToken = core.getInput('GITLB_TRIGGER_TOKEN');
    const accessToken = core.getInput('ACCESS_TOKEN');
    const ref = core.getInput('REF_NAME');
    const input = core.getInput('PIPELINE_VARIABLES');
    const variables = input ? JSON.parse(input) : null;

    console.log(`Triggering pipeline ${projectId} with ref ${ref} on ${host}!`);

    try {
        const url = `https://${host}/api/v4/projects/${projectId}/trigger/pipeline`;

        // https://docs.gitlab.com/ee/api/pipeline_triggers.html#trigger-a-pipeline-with-a-token
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: triggerToken,
                ref: ref,
                variables: variables,
            }),
        });

        if (!response.ok) {
            let errorMessage = `GitLab API returned status code ${response.status}.`;
            if (response.status === 404) {
                errorMessage = "The specified resource does not exist, or an invalid/expired trigger token was used.";
            }
            return core.setFailed(errorMessage);
        }

        const data = await response.json();

        core.setOutput("id", data.id);
        core.setOutput("status", data.status);
        core.setOutput("web_url", data.web_url);
        console.log(`Pipeline id ${data.id} triggered! See ${data.web_url} for details.`);

        // poll pipeline status
        await pollPipeline(host, projectId, triggerToken, data.id, data.web_url);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()

module.exports = __webpack_exports__;
/******/ })()
;