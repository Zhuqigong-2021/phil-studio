# 免费数据库每日检查

每天 UTC 14:17 调用 `/api/cron/database-health`，使用现有服务器密钥读取 tools 表最多一条 ID；只返回成功或失败，不返回业务数据。Vercel Hobby 的执行时间可能在该小时内延迟。

## 云端启用

1. 在 Vercel 的 phil-studio 项目 Production 环境变量中添加随机生成的 `CRON_SECRET`（至少 32 个随机字节）。不要提交密钥到 Git。
2. 保留已有 `SUPABASE_URL`、`SUPABASE_SECRET_KEY`。
3. 将本次变更部署到 Production。仅保存在本地或 Preview 部署不会启用定时任务。
4. 在项目 Settings → Cron Jobs 中确认 `/api/cron/database-health` 已出现，用 Run 手动执行一次并在 Logs 检查 HTTP 200。

未带正确认证的请求应返回 401；未配置 CRON_SECRET 返回 503；数据库请求失败或超时返回 502。每次数据库请求最长 15 秒。任务不写入或删除数据。

保持 Supabase Free 和 Vercel Hobby，无需升级套餐。每日轻量访问用于降低闲置暂停概率，不保证 Supabase 永不暂停。Vercel 调度失败也不会自动重试或恢复已暂停项目；应检查 Cron Logs，必要时在 Supabase 恢复项目。

停用方法：删除 vercel.json 中此 crons 条目并重新部署。
