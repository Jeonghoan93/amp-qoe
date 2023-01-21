const telemetryPlugin = require('../telemetry-plugin/telemetry-plugin.js');
const qoeDetectionService = require('../server/qoe-detection-service.js');

describe('Telemetry plugin and QoE detection service integration tests', () => {
    beforeEach(() => {
        // reset telemetry data before each test
        telemetryPlugin.resetTelemetryData();
    });

    test('calculates highest bitrate index correctly', () => {
        expect(qoeDetectionService.calculateHighestBitrate(telemetryPlugin.getTelemetryData())).toEqual({
          index: 'HIGHEST_BITRATE_POSSIBLE',
          value: 2000,
          warning: true,
        });
      });
    
      test('calculates bitrate switches index correctly', () => {
        expect(qoeDetectionService.calculateBitrateSwitches(telemetryPlugin.getTelemetryData())).toEqual({
          index: 'TOO_MANY_BITRATE_SWITCHES',
          value: 3,
          warning: true,
        });
      });
    
      test('calculates buffering index correctly', () => {
        expect(qoeDetectionService.calculateBuffering(telemetryPlugin.getTelemetryData())).toEqual({
          index: 'TOO_MANY_BUFFERING',
          value: 3,
          warning: true,
        });
      });

    test('Telemetry plugin correctly collects video frame size', () => {
        // load video in the player
        telemetryPlugin.loadVideo('https://media-players.hivestreaming.com/reference/test_amp/test.html');

        // check if telemetry data contains correct frame size
        expect(telemetryPlugin.getTelemetryData().frameSize).toBe('640x400');
    });

    test('Telemetry plugin correctly collects available video bitrates', () => {
        // load video in the player
        telemetryPlugin.loadVideo('https://media-players.hivestreaming.com/reference/test_amp/test.html');

        // check if telemetry data contains correct bitrates
        expect(telemetryPlugin.getTelemetryData().bitrates).toEqual([500000, 800000, 1200000, 2000000]);
    });

    test('Telemetry plugin correctly tracks bitrate switches', () => {
        // load video in the player
        telemetryPlugin.loadVideo('https://media-players.hivestreaming.com/reference/test_amp/test.html');

        // simulate bitrate switch
        telemetryPlugin.simulateBitrateSwitch();

        // check if telemetry data contains correct number of bitrate switches
        expect(telemetryPlugin.getTelemetryData().bitrateSwitches).toBe(1);
    });

    test('Telemetry plugin correctly tracks buffering events', () => {
        // load video in the player
        telemetryPlugin.loadVideo('https://media-players.hivestreaming.com/reference/test_amp/test.html');

        // simulate buffering event
        telemetryPlugin.simulateBufferingEvent();

        // check if telemetry data contains correct number of buffering events
        expect(telemetryPlugin.getTelemetryData().bufferingEvents).toBe(1);
    });

    test('QoE detection service correctly calculates highest bitrate index', () => {
        // load video in the player
        telemetryPlugin.loadVideo('https://media-players.hivestreaming.com/reference/test_amp/test.html');

        // simulate high bitrate
        telemetryPlugin.simulateHighBitrate();

        // calculate highest bitrate index
        var highestBitrateIndex = qoeDetectionService.calculateHighestBitrate(telemetryPlugin.getTelemetryData());

        // check if highest bitrate index is correct
        expect(highestBitrateIndex.index).toBe('HIGHEST_BITRATE_POSSIBLE');
        expect(highestBitrateIndex.value).toBeGreaterThan(telemetryPlugin.getTelemetryData().frameSize);
        expect(highestBitrateIndex.warning).toBe(true);
    });

    test('QoE detection service correctly calculates bitrate switches index', () => {
        // load video in the player
        telemetryPlugin.loadVideo('https://media-players.hivestreaming.com/reference/test_amp/test.html');

        // simulate multiple bitrate switches
        telemetryPlugin.simulateBitrateSwitch();
        telemetryPlugin.simulateBitrateSwitch();
        telemetryPlugin.simulateBitrateSwitch();

        // calculate bitrate switches index
        var bitrateSwitchesIndex = qoeDetectionService.calculateBitrateSwitches(telemetryPlugin.getTelemetryData());

        // check if bitrate switches index is correct
        expect(bitrateSwitchesIndex.index).toBe('TOO_MANY_BITRATE_SWITCHES');
        expect(bitrateSwitchesIndex.value).toBe(3);
        expect(bitrateSwitchesIndex.warning).toBe(true);
    });

    test('QoE detection service correctly calculates buffering index', () => {
        // load video in the player
        telemetryPlugin.loadVideo('https://media-players.hivestreaming.com/reference/test_amp/test.html');

        // simulate multiple buffering events
        telemetryPlugin.simulateBufferingEvent();
        telemetryPlugin.simulateBufferingEvent();
        telemetryPlugin.simulateBufferingEvent();

        // calculate buffering index
        var bufferingIndex = qoeDetectionService.calculateBuffering(telemetryPlugin.getTelemetryData());

        // check if buffering index is correct
        expect(bufferingIndex.index).toBe('TOO_MANY_BUFFERING');
        expect(bufferingIndex.value).toBe(3);
        expect(bufferingIndex.warning).toBe(true);
    });
});


