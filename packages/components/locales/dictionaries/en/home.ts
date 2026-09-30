import type { DeepPartial, Dict } from '../zh'

export const home: DeepPartial<Dict['home']> = {
  heroTitle: 'Ever-mindful days',
  heroTagline: 'Mist veils the towers, moonlight blurs the ford',
  viewBlog: 'View blog',
  aboutMe: 'About me',
  featured: 'Featured posts',
  allPosts: 'All posts',
  yearly: 'Yearly reviews',
  projectsTitle: 'Featured projects',
  wereadTitle: 'WeRead',
  myShelf: 'My shelf',
  views: '{count} views',
  bookFinished: 'Finished',
  bookReading: 'Reading',
  empty: {
    posts: 'No posts yet',
    postsDesc: 'Failed to fetch Issues data, please try again later',
    yearly: 'No yearly reviews yet',
    yearlyDesc: 'No yearly review posts so far',
    projects: 'No projects yet',
    projectsDesc: 'Failed to fetch GitHub data, please try again later',
    shelf: 'Shelf is empty',
    shelfDesc: 'Books will show up after WeRead syncs',
    shelfAction: 'Go to my shelf',
  },
}
