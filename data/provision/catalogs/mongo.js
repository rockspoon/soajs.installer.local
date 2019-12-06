'use strict';

let doc = {
	"name": "Mongo Recipe",
	"type": "cluster",
	"subtype": "mongo",
	"description": "This recipe allows you to deploy a mongo server",
	"locked": true,
	"restriction": {
		"deployment": [
			"container"
		]
	},
	"recipe": {
		"deployOptions": {
			"image": {
				"prefix": "",
				"name": "mongo",
				"tag": "3.6.16",
				"pullPolicy": "Always",
				"repositoryType": "public",
				"override": true
			},
			"sourceCode": {},
			"readinessProbe": {
				"exec": {
					"command": ["mongo"],
					"args": ["--eval \"db.adminCommand('ping')\""]
				},
				"initialDelaySeconds": 5,
				"timeoutSeconds": 2,
				"periodSeconds": 5,
				"successThreshold": 1,
				"failureThreshold": 3
			},
			"restartPolicy": {
				"condition": "any",
				"maxAttempts": 5
			},
			"container": {
				"network": "soajsnet",
				"workingDir": ""
			},
			"voluming": [
				{
					docker: {
						volume: {
							"Type": "volume",
							"Source": "custom-mongo-volume",
							"Target": "/data/db/"
						}
					},
					kubernetes: {
						volume: {
							"name": "custom-mongo-volume",
							"hostPath": {
								"path": "/var/data/custom/db/"
							}
						},
						volumeMount: {
							"mountPath": "/var/data/db/",
							"name": "custom-mongo-volume"
						}
					}
				}
			],
			"ports": [
				{
					"name": "mongoport",
					"containerPort": 27017
				}
			],
			"certificates": "none"
		},
		"buildOptions": {
			"env": {},
			"cmd": {
				"deploy": {
					"command": [
						"mongod"
					],
					"args": [
						"--bind_ip", "0.0.0.0"
					]
				}
			}
		}
	}
};
module.exports = doc;