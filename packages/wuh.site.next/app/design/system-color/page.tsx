'use client'
import * as React from 'react'
import styled from '@wuh.site/components/styled'
import { generate, red, redDark, orange, orangeDark, green, greenDark } from '@ant-design/colors'

const H2 = styled.h2`
  margin-top: 24px;
`

const H3 = styled.h3`
  margin-top: 12px;
  margin-left: 12px;
`

const ColorWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;

  & > div {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    transition: all .35s ease;
    transform-origin: revert;


    &:hover {
      height: 90px;
      margin-top: -10px;
      transition: all .35s ease;
      cursor: pointer;
      transform-origin: revert;
    }
  }
`


const renderColorPanel = (colors: string[]) => {
  return <ColorWrapper>
    {
      colors.map((color, index) => {
        return <div key={color} style={{ backgroundColor: color, color: colors[9 - index]}}>{color}</div>
      })
    }
  </ColorWrapper>
}

const CHINA_RED = '#E60000' // 中国红

const PageColors: React.FC = () => {
  const defaultThemeColors = generate(CHINA_RED, { theme: 'default', backgroundColor: '#fafafa' })
  const darkThemeColors = generate(CHINA_RED, { theme: 'dark', backgroundColor: '#1a0a0a' })

  const defaultTextColors = generate('#434343', { theme: 'default' })
  const darkTextColors = generate('#e8e8e8', { theme: 'dark' })

  return (<div style={{ height: '100%', padding: '48px 48px' }}>
    <h1>博客的色彩系统（中国红）</h1>

    <H2>系统主色彩 · 中国红(#E60000) <div style={{ width: '20px', height: '20px', display:'inline-block', background: CHINA_RED }}></div></H2>
    <H3>Light</H3>
    {renderColorPanel(defaultThemeColors)}
    <H3>Dark</H3>
    {renderColorPanel(darkThemeColors)}

    <H2>危险色Danger</H2>
    <H3>Light</H3>
    {renderColorPanel(red)}
    <H3>Dark</H3>
    {renderColorPanel(redDark)}

    <H2>警告色Warning</H2>
    <H3>Light</H3>
    {renderColorPanel(orange)}
    <H3>Dark</H3>
    {renderColorPanel(orangeDark)}

    <H2>成功色Success</H2>
    <H3>Light</H3>
    {renderColorPanel(green)}
    <H3>Dark</H3>
    {renderColorPanel(greenDark)}

    <H2>中性色彩</H2>
    <H3>Light</H3>
    {renderColorPanel(defaultTextColors)}
    <H3>Dark</H3>
    {renderColorPanel(darkTextColors)}
  </div>)
}

export default PageColors
