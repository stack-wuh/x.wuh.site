# 代码风格约定

## 文件长度
- 单文件不超过 300 行，超过时拆分
- 拆分方式：样式拆到 styles/index.ts，子组件拆到 components/ 目录

## 注释
- 所有导出函数、组件必须加 JSDoc（描述用途、参数、返回值）
- 复杂/反直觉的逻辑处加行内注释解释"为什么"
- 自解释代码不加注释

## 样式
- styled-components 统一定义在独立的 styles/index.ts 文件中
- 组件文件通过 `import * as S from './styles'` 命名空间导入
