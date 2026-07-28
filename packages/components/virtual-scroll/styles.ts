import styled from '@wuh.site/components/styled'

/**
 * 主题化 Y 轴滚动容器
 * - 桌面：主色渐变滑块 + 中性轨道，默认 7px，hover 仅增强对比不改宽度
 * - 深色模式：降低发光感，保持可辨识
 * - 触控设备：恢复系统覆盖式滚动条
 */
export const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  outline: none;

  /* W3C 标准（Firefox 等） */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) color-mix(in oklab, var(--normal-300) 30%, transparent);

  /* WebKit */
  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background: color-mix(in oklab, var(--normal-300) 20%, transparent);
    border-radius: 99px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      var(--primary-color),
      color-mix(in oklab, var(--primary-color) 70%, black)
    );
    border-radius: 99px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      180deg,
      color-mix(in oklab, var(--primary-color) 85%, white),
      var(--primary-color)
    );
  }

  /* 深色模式 */
  [data-color-scheme='dark'] & {
    scrollbar-color: color-mix(in oklab, var(--primary-color) 80%, black)
      color-mix(in oklab, var(--normal-600) 30%, transparent);

    &::-webkit-scrollbar-track {
      background: color-mix(in oklab, var(--normal-600) 22%, transparent);
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(
        180deg,
        color-mix(in oklab, var(--primary-color) 80%, black),
        color-mix(in oklab, var(--primary-color) 60%, black)
      );
    }

    &::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(
        180deg,
        var(--primary-color),
        color-mix(in oklab, var(--primary-color) 75%, black)
      );
    }
  }

  /* 触控设备：恢复系统覆盖式滚动条，不强制自定义样式 */
  @media (pointer: coarse) {
    scrollbar-width: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  /* 焦点环（键盘可访问性） */
  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`
