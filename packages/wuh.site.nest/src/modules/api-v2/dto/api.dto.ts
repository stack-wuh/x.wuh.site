export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: ApiParameter[];
  responses?: ApiResponse[];
  tags?: string[];
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  location: 'query' | 'path' | 'body' | 'header';
  schema?: any;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: any;
}

export interface ApiVersion {
  version: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  metadata: {
    title: string;
    description: string;
    contact: {
      name: string;
      email: string;
    };
    license: {
      name: string;
      url: string;
    };
  };
}