import 'styled-components';
import { Tokens } from '../components/themes/tokens';

declare module 'styled-components' {
  // 添加一些辅助类型导出
  export interface DefaultTheme extends Tokens {} // eslint-disable-line @typescript-eslint/no-empty-object-type
}