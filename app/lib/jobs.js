const Agenda = require('agenda');
const serviceLocator = require('../config/di');

const logger = serviceLocator.get('logger');
const mongoClientInstance = serviceLocator.get('mongo');

const agenda = new Agenda({ mongo: mongoClientInstance.db('agenda-test') });


function switchDevices() {
  logger.info('Starting up user jobs');
  agenda.define('Switch devices ON/OFF', async (job) => {
    
  });
}

(async function () {
  await agenda.start();
  await agenda.schedule('in 20 minutes', 'send email report', {to: 'admin@example.com'});
})();


module.exports = Jobs;
