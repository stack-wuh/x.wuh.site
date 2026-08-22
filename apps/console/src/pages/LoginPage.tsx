import { githubLoginUrl } from '@/api/client';

export function LoginPage() {
  return (
    <div className="login-page">
      <section className="login-card">
        <p className="eyebrow">wuh.site Console</p>
        <h1>使用 GitHub 登录后台</h1>
        <p>登录后 stack-wuh 拥有 Root 权限，其他账号自动获得 Read 只读权限。</p>
        <a className="primary-action" href={githubLoginUrl()}>GitHub 登录</a>
      </section>
    </div>
  );
}
