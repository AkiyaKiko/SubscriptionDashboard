## 代理订阅系统（Next.js + Prisma + SQLite）

---

这是一个基于 Next.js 的代理订阅管理系统，实现订阅配置的管理与导出（或展示）。项目使用 Prisma 与 SQLite 做为开发/轻量级生产数据库，客户端通过生成的 Prisma Client 与数据库交互。  

> PS: 其实原理很简单，只是想要用 NextJS 练练手

**技术栈概览**
- 前端/后端：Next.js（App Router）
- ORM：Prisma
- 数据库：SQLite（默认）
- 包管理：pnpm

**快速开始**

1. 在项目根目录创建或编辑 `.env`，设置 SQLite 数据库文件位置和 JWT 的密钥，例如：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

2. 安装依赖：

```bash
pnpm install
```

3. 初始化/部署数据库迁移并生成 Prisma Client：

```bash
pnpx prisma migrate deploy
```

（开发时也可以使用 `pnpx prisma migrate dev` 来创建与应用迁移并启动本地数据库）

4. 构建（生产）：

```bash
pnpx build
# 或者如果你在 package.json 中定义了脚本，使用 pnpm
pnpm build
```

5. 启动（生产）：

```bash
pnpx start
# 或者
pnpm start
```

（开发模式下，若存在 `dev` 脚本，可使用 `pnpm dev` 运行本地开发服务器）

6. 后续：  
 - 记得配置 Nginx 和 TLS. 
 - 第一次及启动访问根目录会要求进行注册，然后会跳转登录。JWT有效期一年。
 - 配置订阅地址，默认base64编码所有的订阅。

**环境与配置**
- 更改数据库保存位置只需修改 `.env` 中的 `DATABASE_URL`（例如 `file:./data/dev.db`）。
- 如需重置数据库（仅限开发），可以删除 SQLite 文件并重新运行迁移：

```bash
rm ./dev.db
pnpx prisma migrate deploy
```

**项目结构（简要）**
- `app/`：Next.js App Router 页面与路由（含增删改的 dialog/route 等）。
- `components/`：UI 组件与样式相关组件（按钮、对话框、表格等）。
- `generated/prisma/`：Prisma 自动生成的客户端与类型（不要手动修改）。
- `prisma/`：Prisma schema 与迁移文件。
- `lib/`：项目级工具函数（如 `prisma.ts` 用于实例化 Prisma Client）。
- `public/`：静态资源。
- `types/`：自定义 TypeScript 类型定义。

**URL路径**
 - `/`：根路径为面板（保护）
 - `/auth/login`：登录界面
 - `/auth/register`：注册界面
 - `/s/[path]`：订阅链接

**常见命令汇总**

```bash
# 安装依赖
pnpm install

# 生成/应用迁移
pnpx prisma migrate deploy

# 开发（若 package.json 提供）
pnpm dev

# 构建并启动生产
pnpm build
pnpm start
```

**故障排查**
- Prisma Client 找不到或报错：确保已执行 `pnpx prisma generate`（通常在迁移步骤会自动生成）。
- 数据库连接错误：检查 `.env` 中的 `DATABASE_URL` 路径与文件权限。
- 端口占用或启动失败：查看启动日志，确认 `pnpm start` 的脚本内容与环境变量。

**贡献与许可**
欢迎提交 issue 或 PR。请在贡献前先打开 issue 讨论大的改动。

---

