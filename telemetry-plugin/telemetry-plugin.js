(function () {
    // register plugin
    amp.plugin('telemetry', function (options) {
        var player = this;
        var init = function () {
            // get player's current video frame size
            var frameSize = player.videoWidth() + 'x' + player.videoHeight();
            // get available video bitrates
            var bitrates = player.getBitrates();
            // initialize variables to track bitrate switches and buffering events
            var bitrateSwitches = 0;
            var bufferingEvents = 0;
            var timeSpentBuffering = 0;

            // listen for bitratechange event to track bitrate switches
            player.addEventListener('bitratechange', function () {
                bitrateSwitches++;
            });

            // listen for buffering event to track buffering events
            player.addEventListener('buffering', function () {
                bufferingEvents++;
                var currentTime = player.currentTime();
                var buffered = player.buffered();
                var bufferedEnd = buffered.end(buffered.length - 1);
                timeSpentBuffering += bufferedEnd - currentTime;
            });

            // send telemetry data to server
            setInterval(function () {
                var telemetryData = {
                    frameSize: frameSize,
                    bitrates: bitrates,
                    bitrateSwitches: bitrateSwitches,
                    bufferingEvents: bufferingEvents,
                    timeSpentBuffering: timeSpentBuffering
                };
                // send data to server
                sendTelemetry(telemetryData);
            }, 5000);
        };

        // function to send telemetry data to server
        var sendTelemetry = function (data) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', config.server.endpoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.timeout = config.server.timeout;
            xhr.send(JSON.stringify(data));
        };

        // initialize the plugin
        init();
    });
}).call(this);   