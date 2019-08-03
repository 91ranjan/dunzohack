import { List, Map } from 'immutable';

export const getSequence = (usecaseObj, includeWrapper) => {
    let seq = List();
    if (usecaseObj) {
        let flowMap = Map();
        let stepMap = Map();

        if (false && includeWrapper && usecaseObj.get('preparations')) {
            seq = seq.push(
                Map({
                    flow_ref: usecaseObj.get('preparations'),
                })
            );
        }

        usecaseObj.get('flows').forEach(flow => {
            flowMap = flowMap.set(flow.getIn(['flow_ref', 'id']), flow);
        });

        usecaseObj.get('steps').forEach(step => {
            stepMap = stepMap.set(step.getIn(['step_ref', 'id']), step);
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
        if (false && includeWrapper && usecaseObj.get('cleanup')) {
            seq = seq.push(
                Map({
                    flow_ref: usecaseObj.get('cleanup'),
                })
            );
        }
    }
    return seq;
};
