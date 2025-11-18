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
		displayName: 'Track Identifier Type',
		name: 'trackIdType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackGet'],
			},
		},
		options: [
			{ name: 'Common Track ID', value: 'commonTrackId' },
			{ name: 'Apple Music ID', value: 'appleMusicId' },
			{ name: 'Spotify ID', value: 'spotifyId' },
			{ name: 'ISRC', value: 'trackIsrc' },
		],
		default: 'commonTrackId',
		required: true,
		description: 'Type of identifier to use for track lookup',
	},
	{
		displayName: 'Common Track ID',
		name: 'commonTrackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackGet'],
				trackIdType: ['commonTrackId'],
			},
		},
		default: '',
		required: true,
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
				trackIdType: ['appleMusicId'],
			},
		},
		default: '',
		required: true,
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
				trackIdType: ['spotifyId'],
			},
		},
		default: '',
		required: true,
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
				trackIdType: ['trackIsrc'],
			},
		},
		default: '',
		required: true,
		description: 'International Standard Recording Code',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ appleMusicId, commonTrackId, spotifyId, trackIsrc }: TrackGetParams,
): Promise<TrackGetTransformed> {
	const response: CatalogResponse<TrackGetResponse> = await catalogFetch.call(this, {
		url: '/ws/1.1/track.get',
		qs: {
			commontrack_id: commonTrackId,
			track_isrc: trackIsrc,
			track_itunes_id: appleMusicId,
			track_spotify_id: spotifyId,
		},
	});

	return response.message.body.track;
}
