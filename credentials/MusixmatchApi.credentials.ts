/* eslint-disable @n8n/community-nodes/icon-validation */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MusixmatchApi implements ICredentialType {
	name = 'musixmatchApi';

	icon = {
		light: 'file:musixmatch.svg' as const,
		dark: 'file:musixmatch.dark.svg' as const,
	};

	displayName = 'Musixmatch API';

	documentationUrl = 'https://developer.musixmatch.com/documentation';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for authenticating with Musixmatch API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.musixmatch.com',
			url: '/ws/1.1/chart.tracks.get',
			qs: {
				page: 1,
				page_size: 1,
				country: 'us',
				chart_name: 'top',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'message.header.status_code',
					value: 401,
					message: 'Authentication failed. Please check your API key.',
				},
			},
		],
	};
}
