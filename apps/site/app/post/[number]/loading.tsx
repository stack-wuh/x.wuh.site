'use client'

import styled from 'styled-components'
import Skeleton from '@wuh.site/components/skeleton'
import Divider from '@wuh.site/components/divider'
import {
  Container,
  ContentGrid,
  MainColumn,
  PostLead,
  Header,
  TopRow,
  MetaLine,
  TagGroup,
  Title,
  HeadRule,
  CoverFrame,
  TocAside,
  TocTitle,
  TocTools,
  TocPrevNext,
  TocInfo,
  TocMobile,
  RelatedPostsSection,
  RelatedPostsHeader,
  ArticleColophon,
  ColophonLicense,
  ColophonMeta,
  ColophonShareRow,
  ShareIconButton,
  ColophonTools,
  Toolbar,
  ToolbarMeta,
  Spread,
  SpreadDivider,
  SpreadSide,
} from '../styles'

/** 骨架本地辅助块：只补 styles 桶未导出的纵向节奏，不定义断点与网格 */
const Stack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.$gap ?? 10}px;
`

const Row = styled.div<{ $gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.$gap ?? 8}px;
`

/** 正文段落组：镜像 markdown 正文 p 的 1.15em 段距节奏 */
const Paragraph = styled(Stack)`
  margin: 1.15em 0;
`

/** 章节块：镜像 h2/h3 的 2.6em/0.8em 外边距节奏 */
const Section = styled(Stack)`
  margin: 2.6em 0 0.8em;
`

/** 眉线记号占位：镜像 .sec-eyebrow 的行高与 stub 间距 */
const Eyebrow = styled(Row)`
  margin-bottom: 12px;
`

/** 移动端目录折叠条占位行：镜像 summary 的 10px 上下内边距 */
const MobileTocSummary = styled(Row)`
  justify-content: space-between;
  padding: 10px 2px;
`

/** 评论区：PostComments 自持样式未进 styles 桶，此处近似其纵向节奏 */
const CommentsSection = styled(Stack)`
  margin-top: var(--space-xl);
`

const CommentItem = styled(Row)`
  align-items: flex-start;
  padding: var(--space-md) 0;
`

const lines = (widths: Array<number | string>, height = 14) =>
  widths.map((width, i) => (
    <Skeleton key={i} variant='text' height={height} width={width} />
  ))

export default function Loading() {
  return (
    <Container aria-hidden='true'>
      <ContentGrid>
        <MainColumn>
          <PostLead>
            <Header as='div'>
              <TopRow as='div'>
                <MetaLine as='div'>
                  <Row $gap={8}>
                    <Skeleton variant='text' height={13} width={92} />
                    <Skeleton variant='text' height={13} width={128} />
                    <Skeleton variant='text' height={13} width={84} />
                  </Row>
                </MetaLine>
                <TagGroup as='div'>
                  <Skeleton variant='rect' height={26} width={52} radius={3} />
                </TagGroup>
              </TopRow>
              <Title as='div'>
                <Skeleton variant='text' height={38} width='58%' />
              </Title>
              <HeadRule />
            </Header>
            <CoverFrame as='div'>
              <Skeleton variant='rect' width='100%' height='100%' radius={0} />
            </CoverFrame>
          </PostLead>

          <TocMobile as='div'>
            <MobileTocSummary>
              <Skeleton variant='text' height={15} width={112} />
              <Skeleton variant='circle' width={28} height={28} />
            </MobileTocSummary>
          </TocMobile>

          <Section $gap={0}>
            <Eyebrow $gap={12}>
              <Skeleton variant='text' height={12} width={64} />
              <Skeleton variant='rect' height={1} width={44} shimmer={false} />
            </Eyebrow>
            <Paragraph>{lines(['96%', '92%', '88%', '70%'])}</Paragraph>
            <Paragraph>{lines(['94%', '90%', '85%', '92%', '64%'])}</Paragraph>
          </Section>

          <Section $gap={0}>
            <Eyebrow $gap={12}>
              <Skeleton variant='text' height={12} width={52} />
              <Skeleton variant='rect' height={1} width={44} shimmer={false} />
            </Eyebrow>
            <Paragraph>{lines(['95%', '91%', '87%', '78%'])}</Paragraph>
            <Paragraph>{lines(['93%', '89%', '58%'])}</Paragraph>
          </Section>

          <RelatedPostsSection as='div'>
            <RelatedPostsHeader as='div'>
              <Skeleton variant='text' height={20} width={96} />
              <Skeleton variant='text' height={12} width={64} />
            </RelatedPostsHeader>
            <Stack $gap={14}>
              {[0, 1, 2].map((i) => (
                <Row key={i} $gap={10}>
                  <Skeleton variant='text' height={14} width={16} />
                  <Stack $gap={6} style={{ flex: 1 }}>
                    <Skeleton variant='text' height={15} width={`${72 - i * 9}%`} />
                    <Skeleton variant='text' height={12} width={88} />
                  </Stack>
                  <Skeleton variant='text' height={14} width={14} />
                </Row>
              ))}
            </Stack>
          </RelatedPostsSection>

          <ArticleColophon as='div'>
            <Divider variant='ornament' />
            <ColophonLicense as='div'>
              <Skeleton variant='text' height={12} width='82%' />
            </ColophonLicense>
            <ColophonMeta as='div'>
              <Skeleton variant='text' height={12} width={220} />
            </ColophonMeta>
            <ColophonShareRow as='div'>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <ShareIconButton as='div' key={i}>
                  <Skeleton variant='circle' width={18} height={18} shimmer={false} />
                </ShareIconButton>
              ))}
            </ColophonShareRow>
            <ColophonTools as='div'>
              <Skeleton variant='rect' height={40} width={168} radius={999} />
            </ColophonTools>
          </ArticleColophon>

          <CommentsSection $gap={12}>
            <Row $gap={8}>
              <Skeleton variant='text' height={18} width={72} />
              <Skeleton variant='text' height={14} width={28} />
            </Row>
            <Divider />
            <CommentItem $gap={12}>
              <Skeleton variant='circle' width={36} height={36} />
              <Stack $gap={8} style={{ flex: 1 }}>
                <Skeleton variant='text' height={13} width={140} />
                <Skeleton variant='text' height={14} width='86%' />
                <Skeleton variant='text' height={14} width='62%' />
              </Stack>
            </CommentItem>
            <Stack $gap={10}>
              <Skeleton variant='rect' height={40} width={160} radius={8} />
              <Skeleton variant='rect' height={96} radius={8} />
              <Skeleton variant='rect' height={36} width={96} radius={8} />
            </Stack>
          </CommentsSection>

          <Toolbar as='div'>
            <ToolbarMeta as='div'>
              <Skeleton variant='text' height={12} width={72} />
              <Skeleton variant='text' height={12} width={64} />
            </ToolbarMeta>
            <Spread as='div'>
              <SpreadSide as='div'>
                <Skeleton variant='text' height={14} width={120} />
              </SpreadSide>
              <SpreadDivider />
              <SpreadSide as='div' $next>
                <Skeleton variant='text' height={14} width={132} />
              </SpreadSide>
            </Spread>
          </Toolbar>
        </MainColumn>

        <TocAside as='div'>
          <TocTitle>
            <Skeleton variant='text' height={13} width={64} />
          </TocTitle>
          <Stack $gap={12} style={{ padding: '20px 2px' }}>
            <Skeleton variant='text' height={12} width='86%' />
            <Skeleton variant='text' height={12} width='72%' />
            <Skeleton variant='text' height={12} width='80%' />
          </Stack>
          <TocTools as='div'>
            <Skeleton variant='rect' height={40} width={148} radius={999} />
          </TocTools>
          <TocPrevNext as='div'>
            <Stack $gap={3}>
              <Skeleton variant='text' height={11} width={64} />
              <Skeleton variant='text' height={14} width='82%' />
            </Stack>
            <Stack $gap={3}>
              <Skeleton variant='text' height={11} width={64} />
              <Skeleton variant='text' height={14} width='74%' />
            </Stack>
          </TocPrevNext>
          <TocInfo as='div'>
            <Skeleton variant='text' height={12} width={80} />
            <Skeleton variant='text' height={12} width={104} />
            <Skeleton variant='text' height={12} width={92} />
          </TocInfo>
        </TocAside>
      </ContentGrid>
    </Container>
  )
}
