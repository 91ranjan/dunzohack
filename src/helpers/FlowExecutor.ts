import { performance } from 'perf_hooks';
import { List, Map, fromJS } from 'immutable';
import * as RandExp from 'randexp';
import * as logger from 'tracer';
import Steps from '../definitions';
import CommonWeb from '../definitions/commonweb';

import Context from './context';
import FeaturesModel from '../model/FeaturesModel';
import { getSequence, getSequenceFromReport } from './usecaseHelpers';
import JsonApi from '../utils/JsonApi';
import ReportsModel from '../model/ReportsModel';
const _console = logger.colorConsole();
const Request = new JsonApi();

const stepTypeWithPath  = <any> [
    'Click',
    'Dropdown Select',
    'Checkbox Select',
    'Text Input',
    'Radio Select',
    'Verification',
    'Wait for'
]

function getMap(variables) {
    const varMap = {};
    variables && variables.forEach(variable => {
        varMap[variable.id] = variable
    });
    return varMap;
}

// Replaces the variables in the path with actual value.
function resolvePath(path, inputs = {}) {
    if (path) {
        const vars = path.match(/\{\w+\}/g);
        if (vars && vars.length) {
            vars.forEach(inputVar => {
                const inputVal = inputs[inputVar.slice(1, -1)];
                if (inputVal) {
                    path = path.replace(new RegExp(`${inputVar}`, 'gi'), inputVal.value);
                }
            })
        }
    }

    return path;
}

async function executeScript(script) {
    const util = require('util');
    return new Promise((resolve, reject) => {
        let result = '';
        const cons = {
        log: (...args) => result += (util.format(...args) + '\n'),
        };
        eval(`((console) => { ${script} })`)(cons);

        setTimeout(() => resolve(result), 1500);
    });
}

async function patchVariables(inputs, varMap) {
    for(var input in inputs) {
        let value = inputs[input];
        if (value.var_ref) {
            value = varMap[value.var_ref];
        }
        if (value.type === 'script') {
            value.value = await executeScript(value.value);
        }
        inputs[input] = value;
    }
    return inputs;
}

/**
 * Expands/Resolve the variables.
 * @param variables Variables object
 * @returns {Object} Returns the variables with values resolved.
 */
function resolveVariables(variables){
    for (let input in variables) {
        const randExpReg = new RegExp(/randExp\(.*?\/\)/g);
        if (input !== 'xpath' && input !== 'selector' && typeof variables[input] === 'object') {
            const valueArray = variables[input].value.split(randExpReg);
            const randExps = variables[input].value.match(randExpReg);
            if (randExps) {
                let finalInputVal = '';
                for(var i= 0; i <valueArray.length; i++) {
                    finalInputVal += valueArray[i];
                    if (randExps[i]) {
                        let randExp = randExps[i].substring(9, randExps[i].indexOf('/)'));
                        randExp = new RandExp(randExp).gen()
                        finalInputVal += randExp;
                    }
                }
                variables[input].value = finalInputVal;
            }
        }
    }
    return variables;
}

//Hirerchy of variables
// 1. Step level inputs like xpath and selector will be overridden by flow level vars.
// 2. Flow level inputs like "input value" will be overridden by suite level vars.
// 3. Patch the xpath and selector with variables.
// usecaseInputs are inputs from the flow or the steps defined in the usecase
function getStepInputs(suiteLevelStepInputs, stepInputAtFlowLevel, step) {
    let stepInputs = <any>{};

    const type = step.get('type');
    let selector = step.get('selector');
    let xpath = step.get('xpath');

    // We path the steps predefined inputs from the flow inputs.
    if (xpath) {
        stepInputs.xpath = { value: xpath }; // Variable
    }
    if (selector) {
        stepInputs.selector = { value: selector } // Variable
    }

    //2. Now we read and override flow level inputs to step level inputs
    // We apply flow level step variables defined in the flow.
    // Merging flow's step inputs with the suite flow step inputs
    // to create a final set of step level inputs.
    // We override the variables in the step inptu with the flow
    // default inputs
    if ((<any>Object).entries(stepInputAtFlowLevel).length !== 0 && stepInputAtFlowLevel.constructor === Object) {
        // Suite level inputs override flow level step inputs defined at the flow level.
        stepInputs = Object.assign( stepInputs, stepInputAtFlowLevel )
    }

    //3. Now we override the step inputs with suite level inputs
    stepInputs = Object.assign( stepInputs, suiteLevelStepInputs )

    //4. Now we resolve the path variables with final set of variables.
    stepInputs.selector = resolvePath(stepInputs.selector ? stepInputs.selector.value : undefined, stepInputs)
    stepInputs.xpath = resolvePath(stepInputs.xpath ? stepInputs.xpath.value : undefined , stepInputs)

    //TODO: Implement the random value generator
    //TODO: Only variable value should have rand and should be resolved before the execution.


    return resolveVariables(stepInputs);

}

async function _asyncForEach(array, callback) {
    let returns = [];
    for (let index = 0; index < array.size; index++) {
        returns.push(await callback(array.get(index), index, array));
    }
    return returns;
}

async function asyncForEach(array, callback) {
    let returns = [];
    for (let index = 0; index < array.length; index++) {
        returns.push(await callback(array[index], index, array));
    }
    return returns;
}

export default class Workflow {
    constructor() {}

    async runStep(step, inputs, _context) {
        let stepObj = step.get('step_ref');
        const target = stepObj.get('target')
        const query = stepObj.get('query');


        if (Steps[query]) {
            return await Steps[query].test(
                    _context,
                    inputs
                    )
        } else if (target === 'Web') {
            const type = stepObj.get('type');

            if (Steps[query]) {
                return await Steps[query].test(_context, {...inputs})
            } else if (CommonWeb[type]) {
                return await CommonWeb[type].test(_context, {...inputs});
            } else if (CommonWeb[query]) {
                return await CommonWeb[query].test(_context, {...inputs});
            } else {
                return new Promise((resolve, reject) => {
                    resolve({
                        status: -1,
                        reason: 'Could not find step definition'
                    })
                });
            }

        } else if (target === 'Api') {
            const api_method = stepObj.get('api_method');
            const endpoint = stepObj.get('endpoint');
            const request_body = stepObj.get('request_body');
            const expected_response = stepObj.get('expected_response');
        }
    }

    /**Suit level inputs
     * {
     *     inputs: [
     *         [  // Flow level inputs
     *             [
     *                 {} // Step one inputs
     *             ]
     *         ]
     *     ]
     * }
     */
    /**
     * {
     *    [// Flow from report
     *        [ // Step one in the flow
     *            step_ref: {},
     *            inputs: {},
     *            tilte: ''
     *        ]
     *    ]
     * }
     */

    async runUsecase(_context = new Context(), reportObj, Ip) {
        const caseFlow = await getSequenceFromReport(fromJS(reportObj));
        // Suite variables need to be resolved before the suite runs.
        const suitVariable = resolveVariables(getMap(reportObj.suit ? reportObj.suit.variables : []));
        let { flowresults } = reportObj.result;
        let report = [];
        // console.log(JSON.stringify(usecase.toJSON(), null, '    '))
        // console.log(caseFlow);

        await _asyncForEach(caseFlow, async (item, itemPos) => {
            const isLast = caseFlow.size === (itemPos + 1);
            // console.log(item.toJS())
            if (item.get('step_ref')) {
                const startTime = performance.now();
                const usecaseStepInputs = item.get('inputs') ? item.get('inputs').toJS() : {};
                const stepInputs = getStepInputs({}, usecaseStepInputs, item.get('step_ref'));
                console.log('Running Step: ' + (item.get('title') || item.getIn(['step_ref', 'name'])));
                const stepResult = await this.runStep(item, stepInputs, _context);

                const stepRep = {
                    step: item.toJS(),
                    result: stepResult,
                    time: performance.now() - startTime,
                };
                report.push(stepRep);
                flowresults[itemPos] = stepRep;
            } else if (item.get('flow_ref')) {
                const startTime = performance.now();
                let stepReports = [];
                const steps = item.getIn(['flow_ref', 'steps']);
                // suiteFlowInputs has suite level inputs for this flow for each steps
                const suiteFlowInputs = item.get('inputs') ? item.get('inputs').toJS() : [];

                console.log('Running Flow: ' + item.getIn(['flow_ref', 'name']));
                if (steps && steps.size) {
                    await _asyncForEach(steps, async (step, stepPos) => {
                        const stepStartTime = performance.now();

                        // Patch the suit level step inputs with the suite level global variables.
                        let suiteLevelStepInput = await patchVariables(suiteFlowInputs[stepPos] || {}, suitVariable);

                        let finalStepInputs = getStepInputs(
                                suiteLevelStepInput, step.get('inputs') ? step.get('inputs').toJS() : {}, step.get('step_ref'));

                        console.log('Running Step: ' + (step.get('title') || step.getIn(['step_ref', 'query'])));
                        const  stepResult = await this.runStep(step, finalStepInputs, _context);

                        stepReports.push({
                            step_id: step.getIn(['step_ref', 'id']),
                            stepresult: stepResult,
                            time: performance.now() - stepStartTime,
                        })
                    });
                }
                let flowResult = true;
                (<any>Object).values(stepReports).forEach(report => {
                    if (flowResult) {
                        flowResult = report.stepresult.status;
                    }
                })

                const flowRep = {
                    flow: item.toJS(),
                    flowresults: stepReports,
                    status: flowResult,
                    time: performance.now() - startTime,
                };
                report.push(flowRep);
                flowresults[itemPos] = flowRep;
            }
            if (isLast) {
                reportObj.status = 'Completed';
            }
            reportObj.result.flowresults = flowresults;
            await this.updateReport(reportObj, Ip);
        });
        return reportObj;
    }

    async run(report, Ip) {
        report.status = 'Running';
        try {
            if (report.type === 'usecase') {
                await this.runUsecase(new Context(), report, Ip);
            } else if (report.type === 'feature') {
                const startTime = performance.now();
                let hasError = false;

                await asyncForEach(report.result, async (reportId, idx) => {
                    const report = await ReportsModel.getById(reportId);
                    const usecaseResult = await this.runUsecase(new Context(), report.toJSON(), Ip);
                    if (usecaseResult.status != 'Completed' && !hasError) {
                        hasError = true;
                    }
                });
                report.time = performance.now() - startTime
                report.status = hasError ? 'Error' : 'Completed';
                await this.updateReport(report, Ip);
            }
        } catch(e) {
            console.error(e);
        }
        return report;
    }

    async updateReport(report, Ip) {
        return await Request.put('http://localhost:3001/reports', {...report}, {})
    }
}
