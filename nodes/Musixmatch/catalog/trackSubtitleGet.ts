import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { CatalogProperties } from '../types/musixmatch';
import { catalogFetch, CatalogResponse } from './utils';

interface TrackSubtitleGetParams {
	commonTrackId?: string;
	trackId?: string;
}

interface TrackSubtitleGetResponse {
	subtitle: unknown;
}

type TrackSubtitleGetTransformed = unknown;

export const options: INodePropertyOptions = {
	name: 'Track Subtitle Get',
	value: 'trackSubtitleGet',
	description: 'Get track subtitles',
	action: 'Get track subtitles',
};

export const properties: CatalogProperties = [
	{
		displayName: 'Identifier Type',
		name: 'subtitleIdType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackSubtitleGet'],
			},
		},
		options: [
			{ name: 'Common Track ID', value: 'commonTrackId' },
			{ name: 'Track ID', value: 'trackId' },
		],
		default: 'commonTrackId',
		required: true,
		description: 'Type of identifier to use',
	},
	{
		displayName: 'Common Track ID',
		name: 'commonTrackId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['trackSubtitleGet'],
				subtitleIdType: ['commonTrackId'],
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
				operation: ['trackSubtitleGet'],
				subtitleIdType: ['trackId'],
			},
		},
		default: '',
		required: true,
		description: 'Musixmatch track ID',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ commonTrackId, trackId }: TrackSubtitleGetParams,
): Promise<TrackSubtitleGetTransformed> {
	const response: CatalogResponse<TrackSubtitleGetResponse> = await catalogFetch.call(this, {
		url: '/ws/1.1/track.subtitle.get',
		qs: {
			commontrack_id: commonTrackId,
			track_id: trackId,
		},
	});

	return response.message.body.subtitle;
}
