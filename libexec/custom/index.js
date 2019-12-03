'use strict';
const fs = require("fs");
const async = require("async");
let Mongo = require("soajs").mongo;


let lib = {
	
	basic: (config, dataPath, mongoConnection, cb) => {
		let colName = config.colName;
		let condAnchor = config.condAnchor;
		let objId = config.objId;
		let records = [];
		fs.readdirSync(dataPath).forEach(function (file) {
			let rec = require(dataPath + file);
			if (Array.isArray(rec)) {
				records = records.concat(rec);
			} else {
				records.push(rec);
			}
		});
		if (records && Array.isArray(records) && records.length > 0) {
			async.eachSeries(
				records,
				(e, cb) => {
					let condition = {[condAnchor]: e[condAnchor]};
					if (e[objId]) {
						e[objId] = mongoConnection.ObjectId(e[objId]);
					}
					let update = () => {
						if (mongoConnection.updateOne) {
							e = {$set: e};
							mongoConnection.updateOne(colName, condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log(colName, error);
								}
								return cb();
							});
						} else {
							mongoConnection.update(colName, condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log(colName, error);
								}
								return cb();
							});
						}
					};
					if (config.docManipulation && typeof config.docManipulation === 'function') {
						config.docManipulation(e);
					}
					if (config.delete) {
						mongoConnection.remove(colName, condition, (error) => {
							if (error) {
								console.log(colName, error);
								return cb();
							} else {
								update();
							}
						});
					} else {
						update();
					}
				},
				() => {
					return cb();
				});
		}
		else {
			return cb();
		}
	},
	oauth: (config, dataPath, mongoConnection, cb) => {
		let records = [];
		fs.readdirSync(dataPath).forEach(function (file) {
			let rec = require(dataPath + file);
			if (Array.isArray(rec)) {
				records = records.concat(rec);
			} else {
				records.push(rec);
			}
		});
		if (records && Array.isArray(records) && records.length > 0) {
			async.eachSeries(
				records,
				(e, cb) => {
					let condition = {token: e.token};
					
					if (e._id) {
						e._id = mongoConnection.ObjectId(e._id);
					}
					if (e && e.user && e.user._id) {
						e.user._id = mongoConnection.ObjectId(e.user._id);
					}
					let update = () => {
						if (mongoConnection.updateOne) {
							e = {$set: e};
							mongoConnection.updateOne("oauth_token", condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log("oauth_token", error);
								}
								return cb();
							});
						} else {
							mongoConnection.update("oauth_token", condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log("oauth_token", error);
								}
								return cb();
							});
						}
					};
					
					if (config.delete) {
						mongoConnection.remove("oauth_token", condition, (error) => {
							if (error) {
								console.log("oauth_token", error);
								return cb();
							} else {
								update();
							}
						});
					} else {
						update();
					}
				},
				() => {
					return cb();
				});
		}
		else
			return cb();
	},
	users: (config, dataPath, profile, cb) => {
		let records = [];
		fs.readdirSync(dataPath).forEach(function (file) {
			let rec = require(dataPath + file);
			if (Array.isArray(rec)) {
				records = records.concat(rec);
			} else {
				records.push(rec);
			}
		});
		if (records && Array.isArray(records) && records.length > 0) {
			async.eachSeries(
				records,
				(e, cb) => {
					profile.name = e.tenant.code + "_urac";
					let mongoConnection = new Mongo(profile);
					let condition = {email: e.email};
					if (e._id) {
						e._id = mongoConnection.ObjectId(e._id);
					}
					let update = () => {
						if (mongoConnection.updateOne) {
							e = {$set: e};
							mongoConnection.updateOne("users", condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log("users", error);
								}
								return cb();
							});
						} else {
							mongoConnection.update("users", condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log("users", error);
								}
								return cb();
							});
						}
					};
					
					if (config.delete) {
						mongoConnection.remove("users", condition, (error) => {
							if (error) {
								console.log("users", error);
								return cb();
							} else {
								update();
							}
						});
					} else {
						update();
					}
				},
				() => {
					return cb();
				});
		}
		else
			return cb();
	},
	groups: (config, dataPath, profile, cb) => {
		let records = [];
		fs.readdirSync(dataPath).forEach(function (file) {
			let rec = require(dataPath + file);
			if (Array.isArray(rec)) {
				records = records.concat(rec);
			} else {
				records.push(rec);
			}
		});
		if (records && Array.isArray(records) && records.length > 0) {
			async.eachSeries(
				records,
				(e, cb) => {
					profile.name = e.tenant.code + "_urac";
					let mongoConnection = new Mongo(profile);
					let condition = {code: e.code};
					if (e._id) {
						e._id = mongoConnection.ObjectId(e._id);
					}
					let update = () => {
						if (mongoConnection.updateOne) {
							e = {$set: e};
							mongoConnection.updateOne("groups", condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log("groups", error);
								}
								return cb();
							});
						} else {
							mongoConnection.update("groups", condition, e, {'upsert': true}, (error) => {
								if (error) {
									console.log("groups", error);
								}
								return cb();
							});
						}
					};
					
					if (config.delete) {
						mongoConnection.remove("groups", condition, (error) => {
							if (error) {
								console.log("groups", error);
								return cb();
							} else {
								update();
							}
						});
					} else {
						update();
					}
				},
				() => {
					return cb();
				});
		}
		else
			return cb();
	}
};

let custom = {
	"runPath": (profilePath, dataPath, cleanDataBefore, templates, callback) => {
		if (!callback && templates) {
			if (typeof templates === "function") {
				callback = templates;
				templates = null;
			}
		}
		let profile;
		//check if profile is found
		fs.stat(profilePath, (error) => {
			if (error) {
				return callback(null, 'Profile not found!');
			}
			
			//read  mongo profile file
			profile = require(profilePath);
			custom.runProfile(profile, dataPath, cleanDataBefore, templates, callback);
		})
	},
	"runProfile": (profile, dataPath, cleanDataBefore, templates, callback) => {
		
		//NOTE: templates is an object with keys as collections and value a function to be called as "docManipulation" to manipulate the record before inserting it into mongo
		//use soajs.core.modules to create a connection to core_provision database
		let mongoConnection = new Mongo(profile);
		async.waterfall([
				function (cb) {
					//check for products data
					if (fs.existsSync(dataPath + "catalogs/")) {
						let config = {
							"colName": "catalogs",
							"condAnchor": "name",
							"objId": "_id"
						};
						return lib.basic(config, dataPath + "catalogs/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for custom registry data
					if (fs.existsSync(dataPath + "customRegistry/")) {
						let config = {
							"colName": "custom_registry",
							"condAnchor": "name",
							"objId": "_id",
							"delete": cleanDataBefore
						};
						return lib.basic(config, dataPath + "customRegistry/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for environment data
					let doImport = (path) => {
						let config = {
							"colName": "environment",
							"condAnchor": "code",
							"objId": "_id",
							"delete": cleanDataBefore
						};
						return lib.basic(config, dataPath + path, mongoConnection, cb);
					};
					if (fs.existsSync(dataPath + "environments/")) {
						doImport("environments/");
					} else {
						if (fs.existsSync(dataPath + "environment/")) {
							doImport("environment/");
						} else {
							return cb(null);
						}
					}
				},
				function (cb) {
					//check for environment data
					if (fs.existsSync(dataPath + "gitAccounts/")) {
						let config = {
							"colName": "git_accounts",
							"condAnchor": "owner",
							"objId": "_id",
							"delete": cleanDataBefore
						};
						return lib.basic(config, dataPath + "gitAccounts/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for environment data
					if (fs.existsSync(dataPath + "infra/")) {
						let config = {
							"colName": "infra",
							"condAnchor": "label",
							"objId": "_id",
							"delete": cleanDataBefore
						};
						return lib.basic(config, dataPath + "infra/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for products data
					if (fs.existsSync(dataPath + "products/")) {
						let config = {
							"colName": "products",
							"condAnchor": "code",
							"objId": "_id",
							"delete": cleanDataBefore
						};
						return lib.basic(config, dataPath + "products/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for products data
					if (fs.existsSync(dataPath + "resources/")) {
						let config = {
							"colName": "resources",
							"condAnchor": "name",
							"objId": "_id"
						};
						return lib.basic(config, dataPath + "resources/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for products data
					if (fs.existsSync(dataPath + "services/")) {
						let config = {
							"colName": "services",
							"condAnchor": "name",
							"objId": "_id"
						};
						return lib.basic(config, dataPath + "services/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for products data
					if (fs.existsSync(dataPath + "templates/")) {
						let config = {
							"colName": "templates",
							"condAnchor": "name",
							"objId": "_id"
						};
						return lib.basic(config, dataPath + "templates/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for tenants data
					if (fs.existsSync(dataPath + "tenants/")) {
						let config = {
							"colName": "tenants",
							"condAnchor": "code",
							"objId": "_id",
							"delete": cleanDataBefore,
							"docManipulation": (doc) => {
								if (doc && doc.applications && Array.isArray(doc.applications) && doc.applications.length > 0) {
									for (let appIndex = 0; appIndex < doc.applications.length; appIndex++) {
										if (doc.applications[appIndex].appId) {
											doc.applications[appIndex].appId = mongoConnection.ObjectId(doc.applications[appIndex].appId);
										}
									}
								}
							}
						};
						return lib.basic(config, dataPath + "tenants/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				
				function (cb) {
					//check for tenants data
					if (fs.existsSync(dataPath + "oauth/")) {
						let config = {
							"delete": cleanDataBefore
						};
						return lib.oauth(config, dataPath + "oauth/", mongoConnection, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for users data
					if (fs.existsSync(dataPath + "urac/users/")) {
						let config = {
							"delete": cleanDataBefore
						};
						return lib.users(config, dataPath + "urac/users/", profile, cb);
					} else {
						return cb(null);
					}
				},
				function (cb) {
					//check for groups data
					if (fs.existsSync(dataPath + "urac/groups/")) {
						let config = {
							"delete": cleanDataBefore
						};
						return lib.groups(config, dataPath + "urac/groups/", profile, cb);
					} else {
						return cb(null);
					}
				}
			],
			() => {
				mongoConnection.closeDb();
				return callback(null, "MongoDb Soajs Data custom done!");
			});
	}
};
module.exports = custom;