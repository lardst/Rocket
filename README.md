# Rocket
[![NPM](https://www.npmjs.com/package/rocket-nodejs.png?downloads=true&stars=true)](https://www.npmjs.com/package/rocket-nodejs)

## Description

Node JS module to get drive information on the application's host machine asynchronously.

This library is supposed to only work on darwin and linux based systems.

### Installation

	npm install rocket-nodejs

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

	/**
	 * Return a single, specified, drive with the drive data as a JSON object.
	 */
	rocket.drive('/dev/disk1');	 

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

## License

>The License (MIT)
>
>Copyright &copy; 2017 Lawrence Burnett
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
>of this software and associated documentation files (the "Software"), to deal
>in the Software without restriction, including without limitation the rights
>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
>copies of the Software, and to permit persons to whom the Software is
>furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in
>all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
>THE SOFTWARE.
>
>Further details see [LICENSE](LICENSE) file.