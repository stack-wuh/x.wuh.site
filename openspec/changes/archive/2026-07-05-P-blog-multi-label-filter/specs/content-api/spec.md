# Spec: 内容 API

## ADDED

### Requirement: 多 labels 查询使用 AND 语义
- **GIVEN** 内容列表接口收到多个 `labels` 查询条件
- **WHEN** 服务端构造数据库查询条件
- **THEN** 查询条件使用数组全部匹配语义
- **AND** 返回结果中的每篇文章都同时包含全部指定 labels

---

## MODIFIED

### Requirement: Labels comma-separated
- **GIVEN** 客户端请求内容列表接口
- **WHEN** `labels` 以逗号分隔字符串或重复查询参数传入
- **THEN** 服务端将其规范化为 label 数组
- **AND** 多个 label 按 AND 语义过滤内容

---

## REMOVED

### Requirement: 无
- 本次不移除既有需求。
