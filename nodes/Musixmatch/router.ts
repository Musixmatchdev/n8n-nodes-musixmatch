import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
	NodeParameterValueType,
	INodeProperties,
} from 'n8n-workflow';
import { MusixmatchAllEntities, MusixmatchMap } from './types/musixmatch';
import { catalog } from './catalog';

const config = {
	catalog,
};

export async function router(this: IExecuteFunctions) {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const resource = this.getNodeParameter<MusixmatchAllEntities>('resource', itemIndex);
			const operationName = this.getNodeParameter(
				'operation',
				itemIndex,
			) as MusixmatchMap[typeof resource];
			const operation = config[resource][operationName];

			const properties = operation.properties
				.map((property: INodeProperties) => {
					const name = property.name;

					let paramValue: object | NodeParameterValueType | undefined;

					try {
						paramValue = this.getNodeParameter(property.name, itemIndex, undefined);
					} catch {
						paramValue = undefined;
					}

					let coercedValue = paramValue;

					if (property.type === 'string' && typeof paramValue !== 'string') {
						coercedValue = String(paramValue);
					}

					if (property.type === 'json' && typeof paramValue === 'string') {
						coercedValue = JSON.parse(paramValue);
					}

					return {
						name,
						value: coercedValue,
					};
				})
				.reduce(
					(
						acc: Record<string, object | NodeParameterValueType>,
						curr: { name: string; value: object | NodeParameterValueType },
					) => {
						acc[curr.name] = curr.value;
						return acc;
					},
					{} as Record<string, object | NodeParameterValueType>,
				);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result = await operation.handler.call(this, properties as any);

			if (Array.isArray(result)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const results = result.map((r) => ({ json: r as any })) as INodeExecutionData[];

				returnData.push(...results);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				returnData.push({ json: result as any });
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: this.getInputData(itemIndex)[0].json,
					error,
					pairedItem: itemIndex,
				});
			} else {
				if (error.context) {
					error.context.itemIndex = itemIndex;
					throw error;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex,
				});
			}
		}
	}

	return [returnData];
}
