# Components — 组件包

## MODIFIED

### Requirement: 组件包使用 exports map 导出
- **GIVEN** 消费者导入 `@wuh.site/components/flex`
- **WHEN** 构建工具解析模块路径
- **THEN** 通过 `exports` map 直接映射到对应子路径，无需桶文件
