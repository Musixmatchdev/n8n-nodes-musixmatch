import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { router } from './router';
import * as catalog from './catalog';

export class Musixmatch implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Musixmatch',
		name: 'musixmatch',
		icon: { light: 'file:musixmatch.svg', dark: 'file:musixmatch.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with Musixmatch API to access music metadata, lyrics, and more',
		defaults: {
			name: 'Musixmatch',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'musixmatchApi',
				required: true,
			},
		],
		properties: [...catalog.properties],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await router.call(this);
	}
}
