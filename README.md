## Hive Streaming - Video Quality of Experience (QoE) Detector

This is an assignment for Hive Streaming as part of the interview process.

The goal of this assignment is to implement a small player plugin that collects information and telemetries from the Azure Media Player video player (AMP: https://amp.azure.net/libs/amp/latest/docs/index.html), sends them to a server for detecting if the viewer has a bad Quality of Experience of the stream.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

* Azure Media Player (AMP)
* JavaScript
* Node.js
* Jest (for testing)

## Installing

1. Clone the repository
git clone https://github.com/Jeonghoan93/amp-qoe.git
2. Install dependencies
npm install
3. Run the tests
npm test

## Implementation

The first goal is to implement a plugin that generates an object containing the telemetries we are interested in. You can choose the best format for your telemetry object.
The info that needs to be collected is:

1. video frame size
2. available video bitrates
3. bitrate switches
4. number of buffering
5. events time spent in buffering state

The second part of the assignment involve implementing an HTTP service that receives the data calculates indexes regarding the playback QoE. (To reproduce bad QoE, we suggest to use chrome network throttling feature.)
The indexes are:

1. HIGHEST_BITRATE_POSSIBLE: It warns out if the bitrate chosen by the player (ie. playback bitrate) is meant for a smaller player frame size.
2. TOO_MANY_BITRATE_SWITCHES: It warns out if the number of bitrate switches is higher than 2 every 10 secs.
3. TOO_MANY_BUFFERING: It warns out if the number of buffering events longer than 500ms is higher than 3 per 30 secs or if there is any buffering event longer than 1s.

## Main challenges for Task 1 and 2

* Task 1:

1. Understanding how to use the Azure Media Player (AMP) developer API to collect the necessary telemetry data.
2. Implementing the logic to track bitrate switches and buffering events using the AMP developer API.
3. Sending the telemetry data to the server in a timely and efficient manner.

* Task 2:

1. Understanding how to calculate the QoE indexes based on the telemetry data and the threshold values specified in the config.js file.
2. Implementing the logic to check if any of the indexes exceeded the threshold and generating appropriate warnings.
3. Creating a simple HTTP service that receives the telemetry data and calculates the QoE indexes.
4. Creating an HTTP endpoint to receive the telemetry data and handle the data with RESTful API.

## Author

Jimmy Hwang - Software Engineer