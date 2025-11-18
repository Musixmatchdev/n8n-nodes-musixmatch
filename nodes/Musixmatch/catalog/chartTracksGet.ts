import type { IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';
import { catalogFetch, CatalogResponse } from './utils';
import { CatalogProperties } from '../types/musixmatch';

export type ChartName = 'top' | 'hot' | 'mxmweekly' | 'mxmweekly_new';

interface ChartTracksGetParams {
	chartName: ChartName;
	country?: string;
	fHasLyrics?: boolean;
	page: number;
	pageSize: number;
}

interface ChartTracksGetResponse {
	track_list: unknown[];
}

type ChartTracksGetTransformed = unknown[];

export const options: INodePropertyOptions = {
	name: 'Chart Tracks Get',
	value: 'chartTracksGet',
	description: 'Retrieve track charts',
	action: 'Get chart tracks',
};

export const properties: CatalogProperties = [
	{
		displayName: 'Chart Name',
		name: 'chartName',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['chartTracksGet'],
			},
		},
		options: [
			{ name: 'Top', value: 'top' },
			{ name: 'Hot', value: 'hot' },
			{ name: 'MXM Weekly', value: 'mxmweekly' },
			{ name: 'MXM Weekly New', value: 'mxmweekly_new' },
		],
		default: 'top',
		required: true,
		description: 'The chart type to retrieve',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['chartTracksGet'],
			},
		},
		default: 1,
		description: 'Page number for pagination',
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['chartTracksGet'],
			},
		},
		default: 10,
		description: 'Number of items per page',
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['chartTracksGet'],
			},
		},
		default: 'US',
		description: 'ISO country code',
	},
	{
		displayName: 'Has Lyrics',
		name: 'fHasLyrics',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['chartTracksGet'],
			},
		},
		default: false,
		description: 'Whether to filter tracks with lyrics',
	},
];

export async function handler(
	this: IExecuteFunctions,
	{ chartName, page, pageSize, country, fHasLyrics }: ChartTracksGetParams,
): Promise<ChartTracksGetTransformed> {
	const response: CatalogResponse<ChartTracksGetResponse> = await catalogFetch.call(this, {
		url: '/ws/1.1/chart.tracks.get',
		qs: {
			chart_name: chartName,
			country: country,
			page: page,
			page_size: pageSize,
			f_has_lyrics: fHasLyrics,
		},
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const tracks = response.message.body.track_list.map((track: any) => track.track);

	return tracks;
}
