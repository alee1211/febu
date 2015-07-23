var should = require('should');
var debug = require('debug')('febu:' + __filename);
var replace = require('frep');
var fs = require('fs');
var path = require('path');
var common = require('../module/common.js');
var db = require('../module/db.js');
var P = require('../module/production.js');
var Git = require('../module/git.js');

describe(__filename, function(){
	var project = {
		repo: 'http://github.com/holyzfy/test_repo_url',
		development: {
			web: '//qa.developer.test.com/'
		},
		production: {
			web: '//img1.cache.test.com/f2e/'
		}
	};
	
	var p = new P(project);

	before(function(done){
		p.db = db;
		db.open(done);
	});

	after(function(done) {
		db.close(done);
	});

	it('exist', function(done) {
		p.exist('_a_commit_id', function(err, data) {
			data.should.be.false;
			done();
		});
	});

	it('getBasename', function() {
		var href1 = '//img1.febucache.com/f2e/style/all.1234.group.css';
		p.getBasename(href1).should.be.equal('all.1234.group');

		var href2 = '//img1.febucache.com/f2e/images/logo.png';
		p.getBasename(href2).should.be.equal('logo');

		var href3 = '//img1.febucache.com/f2e/images/logo.123.png';
		p.getBasename(href3).should.be.equal('logo.123');
	});

	it('initManifest', function(done) {
		var resource = {
			repo: p.project.repo,
			src: ['images/p_logo.png'],
			dest: '//img1.cahce.febucdn.com/xxx/p_logo.a1b2c3d4e5.png',
			rel: ['style/p_common.css', 'detail.shtml']
		};

		db.resources.save(resource, function(err, newRes) {
			p.initManifest(function(err, docs) {
				docs.should.matchAny(function(item) {
					item.dest.should.be.equal(resource.dest);
					p.manifest.length.should.be.above(0);
					db.resources.remove(resource, done);
				});
			});
		});
	});

	it('updateManifest', function() {
		var resource = {
			src: ['images/p_logo.png'],
			dest: '//img1.cahce.febucdn.com/xxx/p_logo.a4b5c6e7e8.png',
			rel: ['style/p_common.css', 'detail.shtml']
		};
		p.updateManifest(resource);
		p.manifest.should.be.matchAny(function(item) {
			item.repo.should.be.equal(p.project.repo);
			item.dest.should.be.equal(resource.dest);
			item._status.should.be.equal('dirty');
		});
		
		resource.rel.push('list.shtml');
		p.updateManifest(resource);
		p.manifest.should.be.matchAny(function(item) {
			item.rel.pop().should.be.equal('list.shtml');
		});
	});

	it('compileStaticFiles', function(done) {
		// TODO
		done();
	});

	it('compileVmFiles', function(done) {
		// TODO
		done();
	});

});