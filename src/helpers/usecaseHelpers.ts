import { List, Map } from 'immutable';

export const getSequence = async function(usecaseObj) {
    let seq = List();
    if (usecaseObj) {
        let flowMap = Map();
        let stepMap = Map();
        if (usecaseObj.get('preparations')) {
            seq = seq.push(
                Map({
                    flow_ref: usecaseObj.get('preparations'),
                })
            );
        }

        usecaseObj.get('flows').forEach(flow => {
            flowMap = flowMap.set(flow.getIn(['flow_ref', 'id']).toJSON(), flow);
        });

        usecaseObj.get('steps').forEach(step => {
            // TODO: Why is toJSON() needed.
            stepMap = stepMap.set(step.getIn(['step_ref', 'id']).toJSON(), step);
        });

        usecaseObj.get('sequence').forEach(itemId => {
            itemId = itemId.toString();
            if (flowMap.get(itemId)) {
                seq = seq.push(flowMap.get(itemId));
            }
            if (stepMap.get(itemId)) {
                seq = seq.push(stepMap.get(itemId));
            }
        });
        if (usecaseObj.get('cleanup')) {
            seq = seq.push(
                Map({
                    flow_ref: usecaseObj.get('cleanup'),
                })
            );
        }
    }
    return seq;
};

export const getSequenceFromReport = async function(reportObj) {
    let finalSeq = List();
    if (reportObj) {
        const seq = reportObj.getIn(['result', 'flowresults']);
        seq.forEach(flowObj => {
            if (flowObj.get('flow')) {
                // Flow object
                finalSeq = finalSeq.push(flowObj.get('flow'));
            } else if (flowObj.get('step')) {
                // Step object
                finalSeq = finalSeq.push(flowObj.get('step'));
            }
        });
    }
    return finalSeq;
};
