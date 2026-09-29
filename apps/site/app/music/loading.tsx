'use client'

import styled from 'styled-components'
import Skeleton from '@wuh.site/components/skeleton'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import {
  Chronicle,
  Content,
  ContentInner,
  FavSlot,
  Identity,
  IndexNum,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PanelCopy,
  PanelHead,
  PlayingDot,
  Rail,
  Section,
  TitleGroup,
  TrackDuration,
  TrackIndex,
  TrackList,
  TrackPlays,
  TrackRow,
  TrackSide
} from './styles'

/* 骨架微布局：只补真容容器承担不了的间距/网格位（button 类容器不可复用，改用非交互位） */
const RailSlot = styled.span`
  display: block;
  padding: 2px 0 2px 18px;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex: 0 0 auto;
    padding: 4px 0 7px;
  }
`

const NameSlot = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-column: 2;
    grid-row: 1 / 3;
    flex-direction: column;
    align-items: stretch;
    gap: 1px;
  }
`

const IntroSkeleton = styled.div`
  margin: 0 0 var(--space-xs);
  max-width: 56ch;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SkeletonRow = styled(TrackRow)`
  cursor: default;

  &:hover {
    background: transparent;
  }
`

const RAIL_WIDTHS = [52, 44, 58, 48, 46, 50]
const NAME_WIDTHS = ['46%', '58%', '38%', '52%', '44%', '61%', '40%', '55%']

export default function Loading() {
  return (
    <Section aria-busy="true">
      {/* 标题/副题是静态常量直接出真容，骨架只盖数据未知区域 */}
      <PageHeader>
        <TitleGroup>
          <PageTitle>音乐</PageTitle>
          <PageSubtitle>网易云年度歌单 · 一年一卷编年</PageSubtitle>
        </TitleGroup>
        <Identity>
          <Skeleton variant="circle" width={34} height={34} />
          <Skeleton width={72} height={16} />
        </Identity>
      </PageHeader>

      <Chronicle>
        <Rail>
          {RAIL_WIDTHS.map((width) => (
            <RailSlot key={width}>
              <Skeleton width={width} height={22} />
            </RailSlot>
          ))}
        </Rail>

        <Content>
          <ContentInner>
            <PanelHead>
              <Skeleton variant="circle" width={64} height={64} />
              <PanelCopy>
                <Skeleton width={180} height={24} />
                <Skeleton width={120} height={13} />
              </PanelCopy>
            </PanelHead>

            <IntroSkeleton>
              <Skeleton height={13} />
              <Skeleton width="62%" height={13} />
            </IntroSkeleton>

            <TrackList>
              {NAME_WIDTHS.map((width, index) => (
                <SkeletonRow key={width}>
                  <TrackIndex>
                    <IndexNum>
                      <Skeleton width={18} height={10} />
                    </IndexNum>
                  </TrackIndex>
                  <PlayingDot $playing={false} aria-hidden="true" />
                  <NameSlot>
                    <Skeleton width={width} height={18} />
                    <Skeleton width={88} height={12} />
                  </NameSlot>
                  <TrackSide>
                    <TrackPlays>
                      <Skeleton width={40} height={12} />
                    </TrackPlays>
                    <TrackDuration>
                      <Skeleton width={34} height={12} />
                    </TrackDuration>
                    <FavSlot>{index === 0 ? <Skeleton width={32} height={14} /> : null}</FavSlot>
                  </TrackSide>
                </SkeletonRow>
              ))}
            </TrackList>
          </ContentInner>
        </Content>
      </Chronicle>
    </Section>
  )
}
