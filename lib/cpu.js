/* global exports, require */

(function (exports) {
    'use strict';

    var childProcess = require('child_process'),
        os = require('os').platform().toLowerCase(),
        execSync = childProcess.execSync;

    exports.temperature = function () {
        var temperatureJSON = {},
            cpuChildProcess,
            osxTemperatureSensor;

        if (os === 'linux') {
            cpuChildProcess = execSync('/opt/vc/bin/vcgencmd measure_temp|cut -c6-9').toString().split('\n');
            return parseFloat(cpuChildProcess[0]);
        } else if (os === 'darwin') {
            try {
                osxTemperatureSensor = require('osx-temperature-sensor');
                return osxTemperatureSensor.cpuTemperature().main;
            } catch (e) {
                return -1;
            }
        } else if (os === 'win32') {
            cpuChildProcess = execSync(
                'wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get ' +
                'CriticalTripPoint,CurrentTemperature /value'
            ).toString().split('\n');
        } else {
            return temperatureJSON;
        }
    };

})(exports);
