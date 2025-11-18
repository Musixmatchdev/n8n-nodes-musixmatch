import { IExecuteFunctions } from 'n8n-workflow';
import { API_BASE_URL } from '../utils/constants';

export type CatalogResponse<T> = {
	message: {
		header: {
			status_code: number;
		};
		body: T;
	};
};

export async function catalogFetch(
	this: IExecuteFunctions,
	options: Parameters<IExecuteFunctions['helpers']['httpRequestWithAuthentication']>[1],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<CatalogResponse<any>> {
	const result = await this.helpers.httpRequestWithAuthentication.call(this, 'musixmatchApi', {
		baseURL: API_BASE_URL,
		...options,
	});

	if (result.message.header.status_code !== 200) {
		throw new Error(JSON.stringify(result));
	}

	return result;
}
