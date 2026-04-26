import { Injectable } from '@nestjs/common';
import { ApiEndpoint, ApiVersion } from './dto/api.dto';

@Injectable()
export class ApiV2Service {
  getApiVersion(): ApiVersion {
    return {
      version: 'v2',
      baseUrl: '/v2',
      metadata: {
        title: 'wuh.site API',
        description: 'x.wuh.site 后端 API，提供博客内容、评论、RSS 等功能',
        contact: {
          name: '吴尒红',
          email: 'wuh131420@foxmail.com',
        },
        license: {
          name: 'ISC',
          url: 'https://opensource.org/licenses/ISC',
        },
      },
      endpoints: this.getAllEndpoints(),
    };
  }

  private getAllEndpoints(): ApiEndpoint[] {
    return [
      // Health Check
      {
        path: '/v2/health',
        method: 'GET',
        description: '健康检查接口',
        tags: ['system'],
        responses: [
          {
            status: 200,
            description: '服务正常',
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', format: 'date-time' },
                version: { type: 'string' },
              },
            },
          },
        ],
      },

      // Content APIs
      {
        path: '/v2/content/posts',
        method: 'GET',
        description: '获取博客文章列表',
        tags: ['content'],
        parameters: [
          {
            name: 'page',
            type: 'number',
            required: false,
            description: '页码',
            location: 'query',
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: '每页数量',
            location: 'query',
          },
          {
            name: 'labels',
            type: 'array',
            required: false,
            description: '标签过滤',
            location: 'query',
          },
          {
            name: 'state',
            type: 'string',
            required: false,
            description: '状态过滤',
            location: 'query',
          },
        ],
        responses: [
          {
            status: 200,
            description: '文章列表',
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Content' },
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
              },
            },
          },
        ],
      },
      {
        path: '/v2/content/posts/{slugOrNumber}',
        method: 'GET',
        description: '获取单篇文章详情',
        tags: ['content'],
        parameters: [
          {
            name: 'slugOrNumber',
            type: 'string',
            required: true,
            description: '文章 slug 或编号',
            location: 'path',
          },
        ],
        responses: [
          {
            status: 200,
            description: '文章详情',
            schema: { $ref: '#/components/schemas/Content' },
          },
          {
            status: 404,
            description: '文章不存在',
          },
        ],
      },
      {
        path: '/v2/content/projects',
        method: 'GET',
        description: '获取项目列表',
        tags: ['content'],
        parameters: [
          {
            name: 'page',
            type: 'number',
            required: false,
            description: '页码',
            location: 'query',
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: '每页数量',
            location: 'query',
          },
        ],
        responses: [
          {
            status: 200,
            description: '项目列表',
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Content' },
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
              },
            },
          },
        ],
      },

      // Comment APIs
      {
        path: '/v2/comments',
        method: 'GET',
        description: '获取评论列表',
        tags: ['comment'],
        parameters: [
          {
            name: 'page',
            type: 'number',
            required: false,
            description: '页码',
            location: 'query',
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: '每页数量',
            location: 'query',
          },
          {
            name: 'issueNumber',
            type: 'number',
            required: false,
            description: 'Issue 编号',
            location: 'query',
          },
        ],
        responses: [
          {
            status: 200,
            description: '评论列表',
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Comment' },
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
              },
            },
          },
        ],
      },
      {
        path: '/v2/comments',
        method: 'POST',
        description: '创建匿名评论',
        tags: ['comment'],
        parameters: [
          {
            name: 'body',
            type: 'object',
            required: true,
            description: '评论数据',
            location: 'body',
            schema: {
              type: 'object',
              required: ['nickname', 'content'],
              properties: {
                nickname: { type: 'string', description: '昵称' },
                content: { type: 'string', description: '评论内容' },
                email: { type: 'string', description: '邮箱（可选）' },
                website: { type: 'string', description: '网站（可选）' },
              },
            },
          },
        ],
        responses: [
          {
            status: 201,
            description: '评论创建成功',
            schema: { $ref: '#/components/schemas/Comment' },
          },
          {
            status: 400,
            description: '请求参数错误',
          },
          {
            status: 429,
            description: '请求过于频繁',
          },
        ],
      },

      // RSS API
      {
        path: '/v2/rss.xml',
        method: 'GET',
        description: '获取 RSS 订阅',
        tags: ['rss'],
        responses: [
          {
            status: 200,
            description: 'RSS XML 内容',
            schema: {
              type: 'string',
              format: 'xml',
            },
          },
        ],
      },

      // Webhook API
      {
        path: '/v2/webhook/github',
        method: 'POST',
        description: 'GitHub Webhook 处理',
        tags: ['webhook'],
        parameters: [
          {
            name: 'X-GitHub-Event',
            type: 'string',
            required: true,
            description: 'GitHub 事件类型',
            location: 'header',
          },
          {
            name: 'X-GitHub-Delivery',
            type: 'string',
            required: true,
            description: 'GitHub 交付 ID',
            location: 'header',
          },
          {
            name: 'X-Hub-Signature-256',
            type: 'string',
            required: true,
            description: 'GitHub 签名',
            location: 'header',
          },
          {
            name: 'body',
            type: 'object',
            required: true,
            description: 'Webhook 负载',
            location: 'body',
          },
        ],
        responses: [
          {
            status: 200,
            description: 'Webhook 处理成功',
          },
          {
            status: 400,
            description: '无效的签名或负载',
          },
        ],
      },

      // Admin APIs
      {
        path: '/v2/admin/content/{id}/metadata',
        method: 'PATCH',
        description: '更新内容元数据（管理员）',
        tags: ['admin'],
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: '内容 ID',
            location: 'path',
          },
          {
            name: 'Authorization',
            type: 'string',
            required: true,
            description: 'JWT 令牌',
            location: 'header',
          },
          {
            name: 'body',
            type: 'object',
            required: true,
            description: '元数据更新',
            location: 'body',
          },
        ],
        responses: [
          {
            status: 200,
            description: '元数据更新成功',
            schema: { $ref: '#/components/schemas/Content' },
          },
          {
            status: 401,
            description: '未授权',
          },
          {
            status: 404,
            description: '内容不存在',
          },
        ],
      },
    ];
  }
}