import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { CatalogProperties } from '../types/musixmatch';
import { catalogFetch, CatalogResponse } from './utils';

interface MatcherTrackGetParams {
	qArtist?: string;
	qTrack?: string;
	trackIsrc?: string;
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
		description: 'The song title. Required if the track_isrc is not indicated.',
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
		description: 'The song artist. Required if the track_isrc is not indicated.',
	},
	{
		displayName: 'Track ISRC',
		name: 'trackIsrc',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['matcherTrackGet'],
			},
		},
		default: '',
		description:
			'A valid ISRC identifier. If you have an ISRC ID in your catalogue you can query using this ID only.',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ qArtist, qTrack, trackIsrc }: MatcherTrackGetParams,
): Promise<MatcherTrackGetTransformed> {
	if (!trackIsrc && (!qArtist || !qTrack)) {
		throw new Error('Either track_isrc or both q_track and q_artist are required');
	}

	const response: CatalogResponse<MatcherTrackGetResponse> = await catalogFetch.call(this, {
		url: '/ws/1.1/matcher.track.get',
		qs: {
			...(qArtist ? { q_artist: qArtist } : {}),
			...(qTrack ? { q_track: qTrack } : {}),
			...(trackIsrc ? { track_isrc: trackIsrc } : {}),
		},
	});

	return response.message.body.track;
}
