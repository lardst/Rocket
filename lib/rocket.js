/* global exports, require */
(function (exports) {
    'use strict';

    var childProcess = require('child_process'),
        numeral = require('numeral'),
        os = require('os').platform().toLowerCase(),
        cpu = require('./cpu'),
        execSync = childProcess.execSync,
        driveConfig = {
            'darwin': {
                "cmd": "df -kl",
                "map": [
                    "all",
                    "drive",
                    "blocks",
                    "used",
                    "available",
                    "capacity",
                    "iused",
                    "ifree",
                    "iusedPercent",
                    "mountpoint"
                ],
                "regEx": "([\\w\\/\\d]+)\\s{1,}([\\d]+)\\s{1,}([\\d]+)\\s{1,}([\\d]+)\\s{1,}(\\d{1,3})\\%\\s{1,}" +
                        "([\\d]+)\\s{1,}([\\d]+)\\s{1,}(\\d{1,3})\\%\\s{1,}([^$]+)"
            },
            'linux': {
                "cmd": "df",
                "map": [
                    ["all", "drive", "blocks", "used", "available", "iusedPercent", "mountpoint"],
                    ["all", "drive", "blocks", "used", "available", "iusedPercent", "mountpoint"]
                ],
                "regEx": [
                    "([\w\/\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([^$]+)",
                    "([\w\/\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}([\d]+)\s{1,}(\d{1,3})\%\s{1,}([^$]+)"
                ]
            },
            'win32': {
                "cmd": "wmic logicaldisk get Caption,FileSystem,FreeSpace,Size",
                "map": ["all", "drive", "type", "available", "total"],
                "regEx": "([\w\:\/]+)\s{1,}([\w\/\d]+)\s{1,}([\d]+)\s{1,}([\d]+)"
            }
        },
        osDriveConfig = typeof (driveConfig[os]) !== 'undefined' ? driveConfig[os] : null,
        driveData = [];

    /**
     * Execute a command to retrieve disks list and all disk data.
     *
     * @param filterTotalMinimum - Filters drives by a minimum total of bytes on the drive.
     * @param flagOutputObjectOnSingleReturn - Boolean - If true, will output just the drive object if the array
     *          length is 1 (one).
     */
    exports.drives = function (filterTotalMinimum, flagOutputObjectOnSingleReturn) {
        return getDrives(filterTotalMinimum, flagOutputObjectOnSingleReturn);
    };

    /**
     * Retrieve space information about a single, specified, drive.
     *
     * @param drive - String
     */
    exports.drive = function (drive) {
        var i;

        if (!driveData.length) {
            driveData = getDrives();
        }

        for (i = 0; i < driveData.length; i++) {
            if (driveData[i].drive === drive.trim()) {
                return driveData[i];
            }
        }
    };

    /**
     * Execute a command to retrieve disks list and all disk data.
     *
     * @param filterTotalMinimum - Filters drives by a minimum total of bytes on the drive.
     * @param flagOutputObjectOnSingleReturn - Boolean - If true, will output just the drive object if the array
     *          length is 1 (one).
     */
    function getDrives(filterTotalMinimum, flagOutputObjectOnSingleReturn) {
        var childProcess,
            drives,
            i,
            results,
            resultForUse;

        if (!osDriveConfig) {
            return;
        }

        childProcess = execSync(osDriveConfig.cmd).toString();
        drives = childProcess.split('\n');

        driveData = [];

        if (filterTotalMinimum && filterTotalMinimum.constructor === Boolean) {
            flagOutputObjectOnSingleReturn = filterTotalMinimum;
            filterTotalMinimum = null;
        }

        drives.splice(0, 1);
        drives.splice(-1, 1);

        for (i = 0; i < drives.length; i++) {
            results = getMappedDataFromRegEx(drives[i]);
            if (results) {
                resultForUse = {};

                if (os === 'win32') {
                    resultForUse.available = parseInt(results.available);
                    resultForUse.used = (parseInt(results.total) - parseInt(results.available));
                    resultForUse.total = parseInt(results.total);
                } else {
                    resultForUse.available = parseInt(results.available) * 1024;
                    resultForUse.used = parseInt(results.used) * 1024;
                    resultForUse.total = (parseInt(results.used) + parseInt(results.available)) * 1024;
                }

                resultForUse.drive = results.drive;
                resultForUse.mountpoint = results.mountpoint ? results.mountpoint : results.drive;

                resultForUse.percentFree = numeral(
                    resultForUse.available / (resultForUse.used + resultForUse.available) * 100
                ).format('0');
                resultForUse.percentUsed = numeral(
                    resultForUse.used / (resultForUse.used + resultForUse.available) * 100
                ).format('0');

                resultForUse.humanReadableTotal = numeral(resultForUse.total).format('0.00 b');
                resultForUse.humanReadableUsed = numeral(resultForUse.used).format('0.00 b');
                resultForUse.humanReadableAvailable = numeral(resultForUse.available).format('0.00 b');

                if (!filterTotalMinimum || resultForUse.total > filterTotalMinimum) {
                    driveData.push(resultForUse);
                }
            }
        }

        driveData.filter(function (_drive) {
            if (!filterTotalMinimum) {
                return _drive.total > filterTotalMinimum;
            } else {
                return true;
            }
        });

        if (flagOutputObjectOnSingleReturn && driveData.length === 1) {
            driveData = driveData[0];
        }

        return driveData;
    }

    /**
     * Perform a regular expression match on the data and return a valid JSOPN object.
     *
     * @param filterTotalMinimum - Filters drives by a minimum total of bytes on the drive.
     */
    function getMappedDataFromRegEx(data) {
        var regExpObject,
            regExResults,
            regExMap = osDriveConfig.map,
            returnValue = {},
            i;

        if (Array.isArray(osDriveConfig.regEx)) {
            for (i = 0; i < osDriveConfig.regEx.length; i++) {
                regExpObject = new RegEx(osDriveConfig.regEx[i], 'i');
                regExResults = data.match(regExpObject);
                if (regExResults) {
                    if (Array.isArray(regExMap)) {
                        regExMap = regExMap[i];
                    }
                    break;
                }
            }
        } else {
            regExResults = data.match(osDriveConfig.regEx);
        }

        if (regExResults) {
            for (i = 1; i < regExMap.length; i++) {
                returnValue[regExMap[i]] = regExResults[i];
            }
            return returnValue;
        } else {
            return null;
        }

    }

    exports.cpu = cpu;

})(exports);
