var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var proxyquire = require('proxyquire');
var expect = require('expect.js');

describe(__filename, function(){
	var repo = 'test_repo_url';
	var db;

	before(function(done){
		mockgoose(mongoose);
		db = proxyquire('../module/db.js', { 'mongoose': mongoose });
		db.open(done);
	});

	/*after(function(done) {
		db.close(done);
	});*/

	it('db.projects.save', function(done){
		var project = {
			repo: repo,
			development: {
				web: '//qa.developer.test.com/'
			},
			production: {
				web: '//img1.cache.test.com/f2e/'
			},
			version: '3bc6453'
		};
		db.projects.save(project, done);		
	});
	
	it('db.projects.find', function(done) {
		db.projects.find(repo, function(err, ret){
			expect(err).to.be(null);
			expect(ret).to.be.ok();
			done();
		});
	});

	it('db.projects.remove', function(done) {
		var conditions = {
			repo: repo
		};
		db.projects.remove(conditions, done);
	});

	it('db.versions.save', function(done){
		var data = {
			repo: repo,
			type: 'development',
			src: '9bfb77f',
			dest: 'yuk0573'
		};
		db.versions.save(data, done);
	});

	it('db.versions.find', function(done) {
		db.versions.find({src: '9bfb77f', repo: repo}, function(err, doc) {
			expect(err).to.be(null);
			// expect(doc).to.be.ok();
			done();
		});
	});

	it('db.versions.remove', function(done) {
		db.versions.remove({src: '9bfb77f', repo: repo}, done);
	});
	
	var resource = {
		repo: repo,
		src: ['style/common.css', 'style/list.css'],
		dest: '//img1.cahce.febucdn.com/xxx/list.123456.group.css',
		rel: ['list.shtml']
	};

	it('db.resources.save', function(done) {
		db.resources.save(resource, done);
	});

	it('db.resources.find', function(done) {
		db.resources.find(resource, function(err, ret) {
			expect(err).to.be(null);
			expect(ret).to.have.length(1);
			expect(ret[0]).to.eql(resource);
			done();
		});
	});

	it('db.resources.remove', function(done) {
		db.resources.remove(resource, done);
	});

});