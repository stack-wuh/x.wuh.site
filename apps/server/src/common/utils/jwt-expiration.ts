/**
 * 解析 JWT_EXPIRATION 配置。
 *
 * jsonwebtoken 对 string 值按 ms 语义解释（裸数字串 '86400' = 86.4 秒），
 * 对 number 值按秒解释；'24h' 这类带单位串只有 string 才能表达。
 * 约定：纯数字 → 秒数 number；带单位 → 原样透传 string。
 * （审计 #568 P1-4：此前 parseInt('24h') === 24，会话 24 秒过期）
 *
 * 返回类型用模板字面量对齐 @nestjs/jwt 的 `number | StringValue`（ms 包类型），
 * 支持本仓实际使用的 d/h/m/s 后缀；其余值视为配置错误在运行时透传、由
 * jsonwebtoken 自行拒绝。
 */
export type JwtExpiration = number | `${number}` | `${number}d` | `${number}h` | `${number}m` | `${number}s`;

export function resolveJwtExpiration(raw: string | undefined): JwtExpiration {
  const value = raw || '86400';
  if (/^\d+$/.test(value)) {
    return Number(value);
  }
  return value as JwtExpiration;
}
