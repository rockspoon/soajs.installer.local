'use strict';

let integration = {
	"_id": "5de641418fbdcb4d57c8144c",
	"type": "product",
	"code": "INTE",
	"name": "Integration Tenant",
	"console": true,
	"description": "This is an Integration Tenant to help you change SOAJS Configuration Programmatically via API",
	"oauth": {
		"secret": "this is a secret",
		"redirectURI": "http://domain.com",
		"grants": [
			"password",
			"refresh_token"
		],
		"disabled": 0,
		"type": 2,
		"loginMode": "oauth"
	},
	"applications": [
		{
			"product": "DSBRD",
			"package": "DSBRD_INTG",
			"appId": "5de650c3af78152c3304f750",
			"description": "Dashboard application for DSBRD_INTG package",
			"_TTL": 604800000,
			"keys": [
				{
					"key": "946e69347238b44d4f74a4b7994cf9f3",
					"extKeys": [
					],
					"config": {
					
					}
				}
			]
		}
	],
	"profile": {},
	"tag": "Integration"
};

module.exports = integration;
