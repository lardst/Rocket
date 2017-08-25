var mocha = require("mocha");
var should  = require("should");

var disk = require("../");


describe("Rocket basic interface.", function(){

	it("The 'drives' method should be a function.", function(done){
		disk.drives.should.be.Function
		done();
	});

	it("The 'driveDetail' method should be a function.", function(done){
		disk.driveDetail.should.be.Function
		done();
	});

	it("Mount point should not be empty.", function(done){
		var diskResults = disk.drives();
		diskResults.should.be.Array;
		diskResults[0].mountpoint.should.not.containEql("\n");
		done();
	});
	
	it("mount free percentage should be a number.", function(done){
		var diskResults = disk.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].percentFree).should.be.Number;
		done();
	});
	
	it("mount used percentage should be a number.", function(done){
		var diskResults = disk.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].percentUsed).should.be.Number;
		done();
	});


	it("mount total space should be a number.", function(done){
		var diskResults = disk.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].total).should.be.Number;
		done();
	});
	
	it("mount used space should be a number.", function(done){
		var diskResults = disk.drives();
		diskResults.should.be.Array;
		parseInt(diskResults[0].used).should.be.Number;
		done();
	});
});