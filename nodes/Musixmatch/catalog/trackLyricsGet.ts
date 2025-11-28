import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { catalogFetch, CatalogResponse } from './utils';
import { CatalogProperties } from '../types/musixmatch';

interface TrackLyricsGetParams {
	commonTrackId?: string;
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
		displayName: 'Common Track ID',
		name: 'commonTrackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackLyricsGet'],
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
				operation: ['trackLyricsGet'],
			},
		},
		default: '',
		description: 'Musixmatch track ID',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ commonTrackId, trackId }: TrackLyricsGetParams,
): Promise<TrackLyricsGetTransformed> {
	if (!commonTrackId && !trackId) {
		throw new Error('Either "Common Track ID" or "Track ID" must be provided.');
	}

	const response: CatalogResponse<TrackLyricsGetResponse> = await catalogFetch.call(this, {
		url: '/ws/1.1/track.lyrics.get',
		qs: {
			...(commonTrackId ? { commontrack_id: commonTrackId } : {}),
			...(trackId ? { track_id: trackId } : {}),
		},
	});

	return response.message.body.lyrics;
}
