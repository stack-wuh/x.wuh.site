"use client";

import styled from "@wuh.site/components/styled";
import Button from "@wuh.site/components/button";

export const Root = styled.div`
  padding: 48px;
  max-width: 960px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
`;

export const H2 = styled.h2`
  margin-top: 32px;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
`;

export const SwatchRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: 0;
  margin: 8px 0 16px;

  & > div {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    font-family: var(--font-mono);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      height: 92px;
      margin-top: -12px;
    }
  }
`;

export const ToggleBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0 32px;
`;

export const ThemeChip = styled(Button)`
  padding: 6px 16px;
  border: 1px solid
    ${(p) => (p.$active ? "var(--primary-color)" : "var(--normal-300)")};
  background: ${(p) =>
    p.$active
      ? "color-mix(in srgb, var(--primary-color) 12%, transparent)"
      : "var(--background-100)"};
  color: ${(p) =>
    p.$active ? "var(--primary-color)" : "var(--text-secondary)"};
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
  }
`;

export const ActiveThemeText = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: 24px;
`;

export const SemanticGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px 16px;
`;

export const SemanticItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SemanticColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--normal-300);
  flex-shrink: 0;
`;

export const SemanticName = styled.span`
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  word-break: break-all;
`;

export const MutedText = styled.p`
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`;

export const LabelRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  margin-bottom: 16px;
`;

export const Label = styled.span`
  display: inline-block;
  width: 140px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`;
