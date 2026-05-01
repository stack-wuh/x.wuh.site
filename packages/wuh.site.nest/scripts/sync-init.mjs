import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Octokit } from '@octokit/rest'
import mongoose from 'mongoose'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env') })

const {
  MONGO_URI,
  GITHUB_PERSONAL_TOKEN,
  CONTENT_REPO_OWNER = 'stack-wuh',
  CONTENT_REPO_NAME = 'blog',
} = process.env

if (!MONGO_URI || !GITHUB_PERSONAL_TOKEN) {
  console.error('Missing MONGO_URI or GITHUB_PERSONAL_TOKEN')
  process.exit(1)
}

const octokit = new Octokit({ auth: GITHUB_PERSONAL_TOKEN })

const contentSchema = new mongoose.Schema(
  {
    externalId: { type: Number, required: true, unique: true },
    repo: { type: String, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    labels: { type: [String], default: [] },
    state: { type: String, enum: ['open', 'closed'], default: 'open' },
    body: String,
    bodyHtml: String,
    author: {
      login: String,
      avatarUrl: String,
      url: String,
    },
    comments: { type: Number, default: 0 },
    createdAtGitHub: Date,
    updatedAtGitHub: Date,
  },
  { timestamps: true, collection: 'blogs' }
)

const Content = mongoose.model('Content', contentSchema)

async function toHtml(markdown) {
  if (!markdown) return ''
  try {
    const { data } = await octokit.request('POST /markdown', {
      text: markdown,
      mode: 'gfm',
    })
    return data
  } catch (err) {
    console.error(`  markdown render error: ${err.message}`)
    return ''
  }
}

async function syncIssue(issue) {
  const bodyHtml = await toHtml(issue.body)

  const data = {
    externalId: issue.id,
    repo: CONTENT_REPO_NAME,
    number: issue.number,
    title: issue.title,
    labels: (issue.labels || []).map((l) => l.name),
    state: issue.state,
    body: issue.body,
    bodyHtml,
    author: {
      login: issue.user?.login,
      avatarUrl: issue.user?.avatar_url,
      url: issue.user?.html_url,
    },
    comments: issue.comments || 0,
    createdAtGitHub: new Date(issue.created_at),
    updatedAtGitHub: new Date(issue.updated_at),
  }

  await Content.findOneAndUpdate({ externalId: data.externalId }, data, {
    upsert: true,
    new: true,
  })
}

async function main() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  console.log('Connected. Starting sync (open issues only)...\n')

  let page = 1
  let total = 0

  while (true) {
    const { data: issues } = await octokit.issues.listForRepo({
      owner: CONTENT_REPO_OWNER,
      repo: CONTENT_REPO_NAME,
      state: 'open',
      per_page: 100,
      page,
    })

    if (issues.length === 0) break

    for (const issue of issues) {
      // listForRepo returns incomplete issue data, fetch full issue
      const { data: full } = await octokit.issues.get({
        owner: CONTENT_REPO_OWNER,
        repo: CONTENT_REPO_NAME,
        issue_number: issue.number,
      })
      await syncIssue(full)
      total++
      console.log(`  [${total}] #${full.number} ${full.title}`)
    }

    page++
  }

  console.log(`\nDone. ${total} issues synced.`)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error('Sync failed:', err)
  process.exit(1)
})
