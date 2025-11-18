import { INodeProperties } from 'n8n-workflow';

import * as chartTracksGet from './chartTracksGet';
import * as matcherTrackGet from './matcherTrackGet';
import * as trackGet from './trackGet';
import * as trackLyricsGet from './trackLyricsGet';
import * as trackLyricsTranslationGet from './trackLyricsTranslationGet';
import * as trackSubtitleGet from './trackSubtitleGet';

export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Catalog',
				value: 'catalog',
			},
		],
		default: 'catalog',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['catalog'],
			},
		},
		options: [
			chartTracksGet.options,
			trackGet.options,
			trackLyricsGet.options,
			trackLyricsTranslationGet.options,
			trackSubtitleGet.options,
			matcherTrackGet.options,
		],
		default: '',
	},
	...chartTracksGet.properties,
	...trackGet.properties,
	...trackLyricsGet.properties,
	...trackLyricsTranslationGet.properties,
	...trackSubtitleGet.properties,
	...matcherTrackGet.properties,
];

export const catalog = {
	chartTracksGet,
	trackGet,
	trackLyricsGet,
	trackLyricsTranslationGet,
	trackSubtitleGet,
	matcherTrackGet,
};
