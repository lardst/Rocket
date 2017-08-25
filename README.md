# Rocket
[![NPM](https://www.npmjs.com/package/rocket-nodejs.png?downloads=true&stars=true)](https://www.npmjs.com/package/rocket-nodejs)

	npm install rocket-nodejs

Node JS module to get drive information on the application's host machine asynchronously.

# Usage

	var rocket = require('rocket-nodejs');
	
	/**
	 * Return all of the drives with the drive data in an array.
	 */
	rocket.drives();

	/**
	 * Return all of the drives whose total capacity is greater than a minimum limit with the drive data in an array.
	 * In this example only drives that are greater than a GB will be returned.
	 */
	rocket.drives(1073741824);

	/**
	 * Return all of the drives whose total capacity is greater than a minimum limit with the drive data as a JSON object
	 * if the return array length is 1(one).
	 */
	rocket.drives(1073741824, true);

	/**
	 * Return all of the drives with the drive data as a JSON object if the return array length is 1(one).
	 */
	rocket.drives(true);

# Returned Data Structure
The data for each drive will contain the following.

	drive - The filesystem identifier
	available - The number of bytes available on the drive
	used - The number of bytes being used on the drive
	total - The number of bytes that is on the drive
	humanReadableTotal - The readable value of the total bytes on the drive (i.e. 450 GB)
	humanReadableAvailable - The readable value of the bytes available (i.e. 200 GB)
	humanReadableUsed - The readable value of the bytes used (i.e. 250 GB)
	mountpoint - The mount path of the drive
	percentFree - The percent remaining on the dive as an integer
	percentUsed - The percent used on the dive as an integer