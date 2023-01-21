module.exports = {
    server: {
        port: 8001,
        endpoint: 'http://localhost:8000', // the endpoint where the plugin will send the telemetry data
        timeout: 5000, // timeout for requests
    },
    qoeIndexes: {
        highestBitrate: {
            threshold: 0.8,
        },
        bitrateSwitches: {
            threshold: 2, // number of switches per 10 secs
            interval: 10000,
        },
        buffering: {
            threshold: {
                count: 3, // number of buffering events per 30 secs
                duration: 500 // buffering duration threshold
            },
            interval: 30000,
        },
    }
}
