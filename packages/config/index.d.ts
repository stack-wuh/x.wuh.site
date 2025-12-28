import 'styled-components';
import { Tokens } from '@wuh.site/components/themes/tokens';

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'styled-components' {
  // 添加一些辅助类型导出
  export interface DefaultTheme extends Tokens {} // eslint-disable-line @typescript-eslint/no-empty-object-type
}