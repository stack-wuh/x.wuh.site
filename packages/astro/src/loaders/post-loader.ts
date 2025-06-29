import { z } from 'astro:content';
import type { Loader } from "astro/loaders"
import { fetcher } from '@https/fetcher.ts'

export interface PostLoaderConfig {
	url: string;
}

export function loader(config:PostLoaderConfig): Loader {
	return {
		name: "post-loader",
		load: async ({
			store, meta, logger
		}) => {
			logger.info('Loading posts');

			const lastSynced = meta.get('lastSynced');

			// Don't sync more than once a minute
			if (lastSynced && (Date.now() - Number(lastSynced) < 1000 * 60)) {
					logger.info('Skipping sync');
					return;
			}

			const posts = await fetcher(config.url)

			store.clear();

			for (const data of posts.hits) {
				store.set({ id: data.title, data: { title: data.title } });
			}
			meta.set('lastSynced', String(Date.now()));
		},
		schema: async () => {
			// Simulate a delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return z.object({
				title: z.string()
			});
		}
	};
}