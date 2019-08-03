let moment;
if (PRODUCTION) {
    moment = require('moment/min/moment.min');
} else {
    moment = require('moment');
}
export default moment;