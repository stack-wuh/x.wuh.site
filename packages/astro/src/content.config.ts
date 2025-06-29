// 1. 从 `astro:content` 导入工具函数
import { defineCollection, z } from 'astro:content'
import { loader as postLoader } from './loaders/post-loader.ts'

// 2. 导入加载器
// import { glob } from 'astro/loaders'

// 3. 定义你的集合
const blog = defineCollection({ 
  loader: postLoader({ url: 'https://api.wuh.site/v2/article/?s=200' }),
  // loader: glob({ pattern: '**/*.md', base: './src/pages' }),
  // loader: async () => {
  //   return [
  //     {
  //       id: 'asd',
  //       data: '## Hello, asd!!!',
  //       rendered: {
  //         html: '<h2>Hello, asd!!!</h2>'
  //       }
  //     }
  //   ]
  // },
  schema: z.object({})
})

// 4. 导出一个 `collections` 对象来注册你的集合
export const collections = { blog }