import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { catalogFetch, CatalogResponse } from './utils';
import { CatalogProperties } from '../types/musixmatch';

interface TrackLyricsGetParams {
	commonTrackId?: string;
	lyricsId?: string;
	part?: string;
	trackId?: string;
}

interface TrackLyricsGetResponse {
	lyrics: unknown;
}

type TrackLyricsGetTransformed = unknown;

export const options: INodePropertyOptions = {
	name: 'Track Lyrics Get',
	value: 'trackLyricsGet',
	description: 'Get track lyrics',
	action: 'Get track lyrics',
};

export const properties: CatalogProperties = [
	{
		displayName: 'Identifier Type',
		name: 'lyricsIdType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsGet'],
			},
		},
		options: [
			{ name: 'Lyrics ID', value: 'lyricsId' },
			{ name: 'Common Track ID', value: 'commonTrackId' },
			{ name: 'Track ID', value: 'trackId' },
		],
		default: 'commonTrackId',
		required: true,
		description: 'Type of identifier to use',
	},
	{
		displayName: 'Lyrics ID',
		name: 'lyricsId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsGet'],
				lyricsIdType: ['lyricsId'],
			},
		},
		default: '',
		required: true,
		description: 'Direct lyrics ID',
	},
	{
		displayName: 'Common Track ID',
		name: 'commonTrackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsGet'],
				lyricsIdType: ['commonTrackId'],
			},
		},
		default: '',
		required: true,
		description: 'Musixmatch common track ID',
	},
	{
		displayName: 'Track ID',
		name: 'trackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsGet'],
				lyricsIdType: ['trackId'],
			},
		},
		default: '',
		required: true,
		description: 'Musixmatch track ID',
	},
	{
		displayName: 'Part',
		name: 'part',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsGet'],
			},
		},
		default: '',
		description: 'Additional parts to include (comma-separated)',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ commonTrackId, part, trackId, lyricsId }: TrackLyricsGetParams,
): Promise<TrackLyricsGetTransformed> {
	let response: CatalogResponse<TrackLyricsGetResponse>;

	if (lyricsId) {
		response = await catalogFetch.call(this, {
			url: '/ws/1.1/catalogue.lyrics.get',
			qs: {
				lyrics_id: lyricsId,
			},
		});
	} else {
		response = await catalogFetch.call(this, {
			url: '/ws/1.1/track.lyrics.get',
			qs: {
				commontrack_id: commonTrackId,
				part,
				track_id: trackId,
			},
		});
	}

	return response.message.body.lyrics;
}
