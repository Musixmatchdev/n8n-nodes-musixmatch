import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { CatalogProperties } from '../types/musixmatch';
import { catalogFetch, CatalogResponse } from './utils';

interface TrackLyricsTranslationGetParams {
	commonTrackId?: string;
	selectedLanguage: string;
	trackId?: string;
}

interface TrackLyricsTranslationGetResponse {
	lyrics: unknown;
}

type TrackLyricsTranslationGetTransformed = unknown;

export const options: INodePropertyOptions = {
	name: 'Track Lyrics Translation Get',
	value: 'trackLyricsTranslationGet',
	description: 'Get translated lyrics',
	action: 'Get translated lyrics',
};

export const properties: CatalogProperties = [
	{
		displayName: 'Selected Language',
		name: 'selectedLanguage',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsTranslationGet'],
			},
		},
		default: 'en',
		required: true,
		description: 'Target language code (ISO 639-1)',
	},
	{
		displayName: 'Identifier Type',
		name: 'translationIdType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsTranslationGet'],
			},
		},
		options: [
			{ name: 'Common Track ID', value: 'commonTrackId' },
			{ name: 'Track ID', value: 'trackId' },
		],
		default: 'commonTrackId',
		description: 'Type of identifier to use',
	},
	{
		displayName: 'Common Track ID',
		name: 'commonTrackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsTranslationGet'],
				translationIdType: ['commonTrackId'],
			},
		},
		default: '',
		description: 'Musixmatch common track ID',
	},
	{
		displayName: 'Track ID',
		name: 'trackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsTranslationGet'],
				translationIdType: ['trackId'],
			},
		},
		default: '',
		description: 'Musixmatch track ID',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ commonTrackId, selectedLanguage, trackId }: TrackLyricsTranslationGetParams,
): Promise<TrackLyricsTranslationGetTransformed> {
	const response: CatalogResponse<TrackLyricsTranslationGetResponse> = await catalogFetch.call(
		this,
		{
			url: '/ws/1.1/track.lyrics.translation.get',
			qs: {
				commontrack_id: commonTrackId,
				selected_language: selectedLanguage,
				track_id: trackId,
			},
		},
	);

	return response.message.body.lyrics;
}
