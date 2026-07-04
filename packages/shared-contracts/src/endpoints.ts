import { defineService, configureService } from '../../hooks/useFetch/createService'

// ---- Global error handling (call once at client entry) ----
configureService({
  onError: (error) => {
    console.error('[API]', error.message, error.status)
  },
})

// ---- Endpoint definitions ----

export const contentService = defineService({
  getPosts:    { url: '/content/posts',       method: 'GET' },
  getPost:     { url: '/content/posts/:slug', method: 'GET' },
  getProjects: { url: '/content/projects',    method: 'GET' },
  likePost:    { url: '/content/posts/:number/like', method: 'POST' },
})

export const reposService = defineService({
  getAll:     { url: '/repos',         method: 'GET' },
  getProfile: { url: '/repos/profile', method: 'GET' },
})

export const commentsService = defineService({
  getByIssue: { url: '/comments', method: 'GET' },
})

export const wereadService = defineService({
  getBooks: { url: '/weread/books', method: 'GET' },
})
