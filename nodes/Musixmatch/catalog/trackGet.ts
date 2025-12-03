import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { CatalogProperties } from '../types/musixmatch';
import { catalogFetch, CatalogResponse } from './utils';

interface TrackGetParams {
	appleMusicId?: string;
	commonTrackId?: string;
	spotifyId?: string;
	trackIsrc?: string;
}

interface TrackGetResponse {
	track: unknown;
}

type TrackGetTransformed = unknown;

export const options: INodePropertyOptions = {
	name: 'Track Get',
	value: 'trackGet',
	description: 'Get track information',
	action: 'Get track information',
};

export const properties: CatalogProperties = [
	{
		displayName: 'Common Track ID',
		name: 'commonTrackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackGet'],
			},
		},
		default: '',
		description: 'Musixmatch common track ID',
	},
	{
		displayName: 'Apple Music ID',
		name: 'appleMusicId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackGet'],
			},
		},
		default: '',
		description: 'ITunes/Apple Music track ID',
	},
	{
		displayName: 'Spotify ID',
		name: 'spotifyId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackGet'],
			},
		},
		default: '',
		description: 'Spotify track ID',
	},
	{
		displayName: 'ISRC',
		name: 'trackIsrc',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackGet'],
			},
		},
		default: '',
		description: 'International Standard Recording Code',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ appleMusicId, commonTrackId, spotifyId, trackIsrc }: TrackGetParams,
): Promise<TrackGetTransformed> {
	if (!commonTrackId && !trackIsrc && !appleMusicId && !spotifyId) {
		throw new Error(
			'At least one identifier must be provided: Common Track ID, ISRC, Apple Music ID, or Spotify ID.',
		);
	}

	const response: CatalogResponse<TrackGetResponse> = await catalogFetch.call(this, {
		url: '/ws/1.1/track.get',
		qs: {
			...(commonTrackId ? { commontrack_id: commonTrackId } : {}),
			...(trackIsrc ? { track_isrc: trackIsrc } : {}),
			...(appleMusicId ? { track_itunes_id: appleMusicId } : {}),
			...(spotifyId ? { track_spotify_id: spotifyId } : {}),
		},
	});

	return response.message.body.track;
}
