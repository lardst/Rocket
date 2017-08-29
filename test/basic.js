var mocha = require("mocha");
var should  = require("should");

var rocket = require("../");

describe("Rocket 'drives' Method Tests.", function(){

	it("The 'drives' method should be a function.", function(done){
		rocket.drives.should.be.Function
		done();
	});

	it("Mount point should not be empty.", function(done){
		var diskResults = rocket.drives();
		diskResults.should.be.Array;
		diskResults[0].mountpoint.should.not.containEql("\n");
		done();
	});

	it("Mount free percentage should be a number.", function(done){
		var diskResults = rocket.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].percentFree).should.be.Number;
		done();
	});

	it("Mount used percentage should be a number.", function(done){
		var diskResults = rocket.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].percentUsed).should.be.Number;
		done();
	});

	it("Mount total space should be a number.", function(done){
		var diskResults = rocket.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].total).should.be.Number;
		done();
	});
	
	it("Mount used space should be a number.", function(done){
		var diskResults = rocket.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].used).should.be.Number;
		done();
	});
});

describe("Rocket 'drive' Method Tests.", function(){

	it("The 'drive' method should be a function.", function(done){
		rocket.drive.should.be.Function
		done();
	});
	
	it("Mount point should not be empty.", function(done){
		var diskResults = rocket.drives(),
			diskResult = rocket.drive(diskResults[0].drive);
		diskResult.should.be.Object;
		diskResult.mountpoint.should.not.containEql("\n");
		done();
	});
	
	it("Mount free percentage should be a number.", function(done){
		var diskResults = rocket.drives(),
			diskResult = rocket.drive(diskResults[0].drive);
		diskResult.should.be.Object;
		parseInt(diskResult.percentFree).should.be.Number;
		done();
	});

	it("Mount used percentage should be a number.", function(done){
		var diskResults = rocket.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].percentUsed).should.be.Number;
		done();
	});

	it("Mount used percentage should be a number.", function(done){
		var diskResults = rocket.drives(),
			diskResult = rocket.drive(diskResults[0].drive);
		diskResult.should.be.Object;
		parseInt(diskResult.percentUsed).should.be.Number;
		done();
	});

	it("Mount total space should be a number.", function(done){
		var diskResults = rocket.drives(),
			diskResult = rocket.drive(diskResults[0].drive);
		diskResult.should.be.Object;
		parseInt(diskResult.total).should.be.Number;
		done();
	});
	
	it("Mount used space should be a number.", function(done){
		var diskResults = rocket.drives(),
			diskResult = rocket.drive(diskResults[0].drive);
		diskResult.should.be.Object;
		parseInt(diskResult.used).should.be.Number;
		done();
	});
});

describe("Rocket 'CPU' Method(s) Tests.", function(){
	it("CPU temperature should be a number.", function(done){
		var cpuTemp = rocket.cpu.temperature();
		cpuTemp.should.be.Number;
		done();
	});
});