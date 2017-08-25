'use strict';

var childProcess = require('child_process'),
    execSync = childProcess.execSync,
    osCommands = ['df -kl', 'df'],
    driveDataRegEx = [
        /([\w\/\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([^$]+)/i,
        /([\w\/\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([^$]+)/i
    ],
    driveDataMap = [
        ['all', 'drive', 'blocks', 'used', 'available', 'capacity', 'iused', 'ifree', 'iusedPercent', 'mountpoint'],
        ['all', 'drive', 'blocks', 'used', 'available', 'iusedPercent', 'mountpoint']
    ],
    osRegEx = require('os').platform().toLowerCase() === 'darwin' ? 0 : 1,
    numeral = require('numeral'),
    driveData = [];

/**
 * Execute a command to retrieve disks list and all disk data.
 *
 * @param filterTotalMinimum - Filters drives by a minimum total of bytes on the drive.
 * @param flagOutputObjectOnSingleReturn - Boolean - If true, will output just the drive object if the array length is 1 (one).
 */
exports.drives = function (filterTotalMinimum, flagOutputObjectOnSingleReturn) {
    var childProcess = execSync(osCommands[osRegEx]).toString(),
        drives = childProcess.split('\n'),
        i,
        results;

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

        results.available = parseInt(results.available) * 1024;
        results.used = parseInt(results.used) * 1024;
        results.total = results.used + results.available;

        results.percentFree = numeral(results.available / (results.used + results.available) * 100).format('0')
        results.percentUsed = numeral(results.used / (results.used + results.available) * 100).format('0')
        
        results.humanReadableTotal = numeral(results.total).format('0.00 b');
        results.humanReadableUsed = numeral(results.used).format('0.00 b');
        results.humanReadableAvailable = numeral(results.available).format('0.00 b');

        if (!filterTotalMinimum || results.total > filterTotalMinimum) {
            driveData.push(results);
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
    var regExResults = data.match(driveDataRegEx[osRegEx]),
        regExMap = driveDataMap[osRegEx],
        returnValue = {},
        i;

    for (i = 1; i < regExMap.length; i++) {
        returnValue[regExMap[i]] = regExResults[i];
    }
    return returnValue;
}