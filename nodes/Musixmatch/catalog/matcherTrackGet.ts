import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { CatalogProperties } from '../types/musixmatch';
import { catalogFetch, CatalogResponse } from './utils';

interface MatcherTrackGetParams {
	qAlbum?: string;
	qArtist?: string;
	qTrack: string;
}

interface MatcherTrackGetResponse {
	track: unknown;
}

type MatcherTrackGetTransformed = unknown;

export const options: INodePropertyOptions = {
	name: 'Matcher Track Get',
	value: 'matcherTrackGet',
	description: 'Match track by metadata',
	action: 'Match track by metadata',
};

export const properties: CatalogProperties = [
	{
		displayName: 'Track Name',
		name: 'qTrack',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['matcherTrackGet'],
			},
		},
		default: '',
		required: true,
		description: 'Track name to search for',
	},
	{
		displayName: 'Artist Name',
		name: 'qArtist',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['matcherTrackGet'],
			},
		},
		default: '',
		description: 'Artist name (optional)',
	},
	{
		displayName: 'Album Name',
		name: 'qAlbum',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['matcherTrackGet'],
			},
		},
		default: '',
		description: 'Album name (optional)',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ qAlbum, qArtist, qTrack }: MatcherTrackGetParams,
): Promise<MatcherTrackGetTransformed> {
	const response: CatalogResponse<MatcherTrackGetResponse> = await catalogFetch.call(this, {
		url: '/ws/1.1/matcher.track.get',
		qs: {
			q_album: qAlbum,
			q_artist: qArtist,
			q_track: qTrack,
		},
	});

	return response.message.body.track;
}
