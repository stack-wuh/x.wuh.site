import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Octokit } from '@octokit/rest'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionWeek {
  days: ContributionDay[]
}

export interface ContributionsData {
  year: number
  total: number
  weeks: ContributionWeek[]
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name)
  private readonly octokit: Octokit
  private cache: { data: ContributionsData; timestamp: number } | null = null
  private readonly CACHE_TTL = 30 * 60 * 1000 // 30 minutes

  constructor(private configService: ConfigService) {
    this.octokit = new Octokit({
      auth: this.configService.get<string>('GITHUB_PERSONAL_TOKEN'),
    })
  }

  async getContributions(username: string): Promise<ContributionsData> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.data
    }

    try {
      const result = await this.octokit.graphql<{
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number
              weeks: {
                contributionDays: {
                  contributionCount: number
                  date: string
                  color: string
                }[]
              }[]
            }
          }
        }
      }>(
        `query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    color
                  }
                }
              }
            }
          }
        }`,
        { username }
      )

      const calendar = result.user.contributionsCollection.contributionCalendar
      const year = new Date().getFullYear()

      const weeks: ContributionWeek[] = calendar.weeks.map((week) => ({
        days: week.contributionDays.map((day) => {
          let level = 0
          const count = day.contributionCount
          if (count >= 1) level = 1
          if (count >= 5) level = 2
          if (count >= 10) level = 3
          if (count >= 20) level = 4

          return {
            date: day.date,
            count,
            level,
          }
        }),
      }))

      const data: ContributionsData = {
        year,
        total: calendar.totalContributions,
        weeks,
      }

      this.cache = { data, timestamp: Date.now() }
      return data
    } catch (error) {
      this.logger.error('Failed to fetch GitHub contributions', error)
      throw error
    }
  }
}
