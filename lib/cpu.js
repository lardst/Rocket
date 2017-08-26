'use strict';

var childProcess = require('child_process'),
    os = require('os').platform().toLowerCase(),
    execSync = childProcess.execSync;

exports.temperature = function() {
	var temperatureJSON = {};

	if (os === 'linux') {
		var cpuChildProcess = execSync('/opt/vc/bin/vcgencmd measure_temp|cut -c6-9').toString().split('\n');
		return parseFloat(cpuChildProcess[0]);
	} else if (os === 'darwin') {
		var osxTemperatureSensor;

		try {
			osxTemperatureSensor = require('osx-temperature-sensor');
			return osxTemperatureSensor.cpuTemperature().main;
		} catch(e) {
			temeratureReading.main = -1;
		}
	} else {
		return temperatureJSON;
	}
}