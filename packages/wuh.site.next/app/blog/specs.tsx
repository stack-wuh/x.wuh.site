export { SITE_URL, SITE_NAME } from '@wuh.site/shared-contracts';
export const PER_PAGE = 10;

export type BlogSearchParams = {
  page?: string | string[];
  labels?: string | string[];
};
