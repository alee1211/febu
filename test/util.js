var util = require('../module/util.js');
var fs = require('fs');
var path = require('path');
var should = require('should');

describe(__filename, function(){
	var repo = 'https://github.com/holyzfy/trygit';

	it('getPathname', function(){
		var pathname = util.getPathname(repo);
		pathname.should.equal('holyzfy_trygit');
	});

	it('getCwd', function(done){
		var local = util.getCwd(repo, 'src');
		var gitDir = path.join(local, '.git');
		fs.exists(gitDir, function(ret) {
			should.exist(ret);
			done();
		});
	});

	it('isEmpty: 文件存在', function(done) {
		var local = util.getCwd(repo, 'src');
		util.isEmpty(local, function(ret){
			ret.should.be.false;
			done();
		});
	});

	it('isEmpty: 文件不存在', function(done) {
		var fold = path.resolve(__dirname, '_not_exsited');
		util.isEmpty(fold, function(ret){
			ret.should.be.true;
			done();
		});
	});

});