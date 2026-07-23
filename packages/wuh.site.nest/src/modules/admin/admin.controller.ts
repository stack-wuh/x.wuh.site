import {
  Controller,
  Patch,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Get,
  Query,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContentService } from '../content/content.service';
import { QueryContentDto, UpdateContentMetadataDto } from '../content/dto/content.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RootGuard } from '../auth/root.guard';
import { CommentService } from '../comment/comment.service';
import { QueryCommentDto } from '../comment/dto/comment.dto';
import { UserService } from '../user/user.service';
import type { AdminPermission, AdminUserDto } from '@wuh.site/shared-contracts';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly contentService: ContentService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get admin overview counters' })
  async getOverview() {
    const [posts, guestbook, pendingPostComments] = await Promise.all([
      this.contentService.findAll(1, 1, {}),
      this.commentService.findAll(1, 1, { repo: 'guestbook' }),
      this.commentService.findAll(1, 1, { repo: 'blog', status: 'pending' }),
    ]);

    return {
      posts: posts.pagination.total,
      guestbookComments: guestbook.pagination.total,
      pendingPostComments: pendingPostComments.pagination.total,
    };
  }

  @Get('users')
  @ApiOperation({ summary: 'List console users' })
  async getUsers(): Promise<AdminUserDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => this.toAdminUser(user));
  }

  @Get('content/posts')
  @ApiOperation({ summary: 'Get admin paginated blog posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'labels', required: false, type: [String] })
  @ApiQuery({ name: 'state', required: false, enum: ['open', 'closed'] })
  async getPosts(@Query() query: QueryContentDto) {
    const { page = 1, limit = 20, labels, state } = query;
    const dbQuery: Record<string, any> = {};

    if (state) dbQuery.state = state;
    if (labels && labels.length > 0) dbQuery.labels = { $all: labels };

    return this.contentService.findAll(page, limit, dbQuery);
  }

  @Get('content/posts/:number')
  @ApiOperation({ summary: 'Get admin post detail by issue number' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getPost(@Param('number') number: string) {
    const result = await this.contentService.findByNumber(Number(number));
    if (!result) {
      throw new NotFoundException(`Content not found: ${number}`);
    }
    return result;
  }

  @Patch('content/posts/:number/metadata')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Update content metadata by issue number' })
  @ApiResponse({ status: 200, description: 'Metadata updated' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async updatePostMetadata(
    @Param('number') number: string,
    @Body() metadata: UpdateContentMetadataDto,
  ) {
    const content = await this.contentService.findByNumber(Number(number));
    if (!content) {
      throw new NotFoundException(`Content not found: ${number}`);
    }

    return this.updateContentMetadata(String(content.externalId), metadata);
  }

  @Patch('content/:id/metadata')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Update content metadata by external id' })
  @ApiResponse({ status: 200, description: 'Metadata updated' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async updateContentMetadata(
    @Param('id') id: string,
    @Body() metadata: UpdateContentMetadataDto,
  ) {
    const result = await this.contentService.updateMetadata(Number(id), metadata);
    if (!result) {
      throw new NotFoundException(`Content not found: ${id}`);
    }
    return result;
  }

  @Post('content/posts/:number/sync')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Trigger post sync placeholder' })
  async syncPost(@Param('number') number: string) {
    return { ok: true, message: `Post ${number} sync is queued or handled by sync module` };
  }

  @Get('guestbook/comments')
  @ApiOperation({ summary: 'Get guestbook comments' })
  async getGuestbookComments(@Query() query: QueryCommentDto & { status?: string }) {
    const { page = 1, limit = 20, status } = query;
    const dbQuery: Record<string, any> = { repo: 'guestbook' };
    if (status) dbQuery.status = status;
    return this.commentService.findAll(page, limit, dbQuery);
  }

  @Patch('guestbook/comments/:id/status')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Update guestbook comment status' })
  async updateGuestbookCommentStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'approved' | 'rejected',
  ) {
    const result = await this.commentService.updateStatus(id, status);
    if (!result) throw new NotFoundException('Comment not found');
    return result;
  }

  @Delete('guestbook/comments/:id')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Delete guestbook comment' })
  async deleteGuestbookComment(@Param('id') id: string) {
    const result = await this.commentService.delete(id);
    if (!result) throw new NotFoundException('Comment not found');
    return result;
  }

  @Get('post-comments')
  @ApiOperation({ summary: 'Get blog post comments' })
  async getPostComments(@Query() query: QueryCommentDto & { status?: string }) {
    const { page = 1, limit = 20, status, issueNumber } = query;
    const dbQuery: Record<string, any> = { repo: 'blog' };
    if (status) dbQuery.status = status;
    if (issueNumber) dbQuery.issueNumber = issueNumber;
    return this.commentService.findAll(page, limit, dbQuery);
  }

  @Post('post-comments/:id/approve')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Approve and post comment to GitHub Issue' })
  async approvePostComment(@Param('id') id: string) {
    const result = await this.commentService.approveAndPostToGitHub(id);
    if (!result) throw new NotFoundException('Comment not found');
    return result;
  }

  @Post('post-comments/:id/reject')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Reject post comment' })
  async rejectPostComment(@Param('id') id: string) {
    const result = await this.commentService.updateStatus(id, 'rejected');
    if (!result) throw new NotFoundException('Comment not found');
    return result;
  }

  @Post('post-comments/:id/retry-sync')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Retry syncing post comment to GitHub Issue' })
  async retrySyncPostComment(@Param('id') id: string) {
    return this.approvePostComment(id);
  }

  @Delete('post-comments/:id')
  @UseGuards(RootGuard)
  @ApiOperation({ summary: 'Delete post comment' })
  async deletePostComment(@Param('id') id: string) {
    const result = await this.commentService.delete(id);
    if (!result) throw new NotFoundException('Comment not found');
    return result;
  }
  private toAdminUser(user: {
    githubId: number;
    login: string;
    email?: string | null;
    avatarUrl?: string | null;
    profileUrl?: string | null;
    role?: string;
    lastLoginAt?: Date | null;
  }): AdminUserDto {
    const role = user.login === 'stack-wuh' ? 'root' : 'reader';
    return {
      githubId: user.githubId,
      login: user.login,
      email: user.email ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      profileUrl: user.profileUrl ?? undefined,
      role,
      permissions: this.permissionsFor(role),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };
  }

  private permissionsFor(role: 'root' | 'reader'): AdminPermission[] {
    return role === 'root'
      ? [
          'admin:read',
          'admin:write',
          'content:read',
          'content:write',
          'guestbook:read',
          'guestbook:write',
          'comment:read',
          'comment:write',
        ]
      : ['admin:read', 'content:read', 'guestbook:read', 'comment:read'];
  }
}
