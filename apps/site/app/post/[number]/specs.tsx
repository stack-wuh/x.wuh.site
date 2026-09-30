import type { AdjacentPost } from "@wuh.site/core";
import type { Issue } from "../PostView.types";

export { SITE_URL } from '@wuh.site/core';

export type PostPageParams = {
  number: string;
};

export type IssueData = {
  issue: Issue | null;
  prev: AdjacentPost | null;
  next: AdjacentPost | null;
  total: number;
  position: number;
};
