'use strict';

var childProcess = require('child_process'),
    numeral = require('numeral'),
    os = require('os').platform().toLowerCase(),
    execSync = childProcess.execSync;

exports.temperature = function() {
	var temperatureJSON = {};

	if (os === 'linux') {
		var gpuChildProcess = execSync('/opt/vc/bin/vcgencmd measure_temp|cut -c6-9').toString(),
			cpuChildProcess = execSync('$((`cat /sys/class/thermal/thermal_zone0/temp|cut -c1-2`)).$((`cat /sys/class/thermal/thermal_zone0/temp|cut -c3-5`))').toString();

		temperatureJSON.gpu = gpuChildProcess;
		temperatureJSON.cpu = cpuChildProcess;
	} else if (os === 'darwin') {
		var osxTemperatureSensor = require('osx-temperature-sensor'),
			temeratureReading = osxTemperatureSensor.cpuTemperature();

		// { main: 62.5, cores: [ 62, 64, 63, 61 ], max: 64 }

		temperatureJSON.cpu = temeratureReading.main;

	} else {

	}

	return temperatureJSON;
}