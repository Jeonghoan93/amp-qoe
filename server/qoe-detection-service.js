const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');

app.use(bodyParser.json());

app.post('/telemetry', (req, res) => {
    const telemetryData = req.body;

    //calculate QoE indexes
    const highestBitrate = calculateHighestBitrate(telemetryData);
    const bitrateSwitches = calculateBitrateSwitches(telemetryData);
    const buffering = calculateBuffering(telemetryData);

    // check if any of the indexes exceeded the threshold
    if (highestBitrate > config.qoeIndexes.highestBitrate.threshold) {
        console.log('HIGHEST_BITRATE_POSSIBLE');
    }
    if (bitrateSwitches > config.qoeIndexes.bitrateSwitches.threshold) {
        console.log('TOO_MANY_BITRATE_SWITCHES');
    }
    if (buffering > config.qoeIndexes.buffering.threshold) {
        console.log('TOO_MANY_BUFFERING');
    }
    res.status(200).send();
});

// function to calculate highest bitrate index
function calculateHighestBitrate(telemetryData) {
    var highestBitrate = Math.max.apply(null, telemetryData.bitrates);
    var warning = highestBitrate > telemetryData.frameSize ? true : false;
    return {index: 'HIGHEST_BITRATE_POSSIBLE', value: highestBitrate, warning: warning};
}

// function to calculate bitrate switches index
function calculateBitrateSwitches(telemetryData) {
    var warning = telemetryData.bitrateSwitches > 2 ? true : false;
    return {index: 'TOO_MANY_BITRATE_SWITCHES', value: telemetryData.bitrateSwitches, warning: warning};
}

// function to calculate buffering index
function calculateBuffering(telemetryData) {
    var bufferingEvents = telemetryData.bufferingEvents;
    var bufferingTime = telemetryData.timeSpentBuffering;
    var warning = (bufferingEvents > 3 && bufferingTime > 30) || bufferingTime > 1 ? true : false;
    return {index: 'TOO_MANY_BUFFERING', value: {bufferingEvents: bufferingEvents, bufferingTime: bufferingTime}, warning: warning};
}

app.listen(config.server.port, () => {
    console.log(`QoE detection service listening on port ${config.server.port}`);
});

module.exports = app;