'use strict';

var childProcess = require('child_process'),
    numeral = require('numeral'),
    os = require('os').platform().toLowerCase(),
    execSync = childProcess.execSync,
    driveConfig = {
        'darwin': {
            "cmd": "df -kl",
            "map": ['all', 'drive', 'blocks', 'used', 'available', 'capacity', 'iused', 'ifree', 'iusedPercent', 'mountpoint'],
            "regEx": /([\w\/\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([^$]+)/i,
        },
        'linux': {
            "cmd": "df",
            "map": ['all', 'drive', 'blocks', 'used', 'available', 'iusedPercent', 'mountpoint'],
            "regEx": /([\w\/\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([^$]+)/i
        }
    },
    osDriveConfig = typeof(driveConfig[os]) !== 'undefined' ? driveConfig[os] : null,
    driveData = [];

/**
 * Execute a command to retrieve disks list and all disk data.
 *
 * @param filterTotalMinimum - Filters drives by a minimum total of bytes on the drive.
 * @param flagOutputObjectOnSingleReturn - Boolean - If true, will output just the drive object if the array length is 1 (one).
 */
exports.drives = function (filterTotalMinimum, flagOutputObjectOnSingleReturn) {
    if (!osDriveConfig) {
        return;
    }
    var childProcess = execSync(osDriveConfig.cmd).toString(),
        drives = childProcess.split('\n'),
        i,
        results,
        resultForUse;

    driveData = [];

    if (filterTotalMinimum && filterTotalMinimum.constructor === Boolean) {
        flagOutputObjectOnSingleReturn = filterTotalMinimum;
        filterTotalMinimum = null;
    }

    drives.splice(0, 1);
    drives.splice(-1, 1);

    drives.filter(function(item){ return item != "none"});

    for (i = 0; i < drives.length; i++) {
        results = getMappedDataFromRegEx(drives[i]);
        resultForUse = {};

        resultForUse.available = parseInt(results.available) * 1024;
        resultForUse.used = parseInt(results.used) * 1024;
        resultForUse.total = results.used + results.available;

        resultForUse.drive = results.drive;
        resultForUse.mountpoint = results.mountpoint;

        resultForUse.percentFree = numeral(resultForUse.available / (resultForUse.used + resultForUse.available) * 100).format('0')
        resultForUse.percentUsed = numeral(resultForUse.used / (resultForUse.used + resultForUse.available) * 100).format('0')
        
        resultForUse.humanReadableTotal = numeral(resultForUse.total).format('0.00 b');
        resultForUse.humanReadableUsed = numeral(resultForUse.used).format('0.00 b');
        resultForUse.humanReadableAvailable = numeral(resultForUse.available).format('0.00 b');

        if (!filterTotalMinimum || resultForUse.total > filterTotalMinimum) {
            driveData.push(resultForUse);
        }
    }

    if (flagOutputObjectOnSingleReturn && driveData.length === 1) {
        driveData = driveData[0];
    }

    return driveData;
}

/**
 * Retrieve space information about the specified drive.
 *
 * @param drive
 */
exports.driveDetail = function(drive) {
    var i;

    for (i = 0; i < driveData.length; i++) {
        if (driveData[i].drive === drive) {
            return driveData[i];
        }
    }
}

function getMappedDataFromRegEx(data) {
    var regExResults = data.match(osDriveConfig.regEx),
        regExMap = osDriveConfig.map,
        returnValue = {},
        i;

    for (i = 1; i < regExMap.length; i++) {
        returnValue[regExMap[i]] = regExResults[i];
    }
    return returnValue;
}