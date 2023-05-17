'use strict';

const nodecg = require('./util/nodecg-api-context').get();

const statsRep = nodecg.Replicant('stats');
const axios = require('axios');

let config = nodecg.bundleConfig.slippiHudWs;

let address = 'localhost';
let port = 9091;

if (config && config.enabled) {
    if (config.key && config.key.length > 0) {
        if (config.address && config.address.length > 0) address = config.address;
        if (config.port && config.port > 0) port = config.port;

        nodecg.log.info(`Slippi Hud Network Hook initialized. Sending data to ${address} on port ${port}.`);

        let options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': config.key
            }
        }

        statsRep.on('change', (newVal) => {
            axios.post(`${address}:${port}/update-slippi`, newVal, options).then(() => {
                nodecg.log.info(`Sent new info to hook endpoint.`)
            }).catch((e) => {
                nodecg.log.error(`Slippi Hud Network Hook encountered an error. More info below.`);
                nodecg.log.error(e);
            });
        });
    }
    else {
        nodecg.log.error('Slippi Hud Network Hook config is missing \'key\' property.');
    }
}
else {
    nodecg.log.warn('Slippi Hud Network Hook disabled or not configured in bundle config.')
}

