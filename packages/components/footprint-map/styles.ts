'use client';

import styled from 'styled-components';

export const MapContainer = styled.div<{ $height?: string }>`
  width: 100%;
  height: ${({ $height }) => $height || '400px'};
  border-radius: 12px;
  overflow: hidden;
`;

export const FullLayout = styled.div`
  display: flex;
  gap: 24px;
  height: calc(100vh - 120px);
  min-height: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

export const MapPanel = styled.div`
  flex: 1;
  min-width: 0;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

export const ContentPanel = styled.div`
  width: 380px;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PlaceName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

export const PlaceDate = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

export const Photo = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
`;

export const EmptyPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;
