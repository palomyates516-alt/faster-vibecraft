# faster-vibecraft

![Vibecraft 截图](public/og-image.png)

用 **70% 更优性能** 管理你的 Claude Code！

**[立即体验 vibecraft.sh](https://vibecraft.sh)** — 仍然连接到你本地的 Claude Code 实例！

**✨ 第三阶段性能优化：**
- **🚀 CPU 占用降低 70%** - 空闲 CPU：30-40% → < 10%
- **⚡ 按需渲染** - 仅在场景变化时渲染
- **🎛️ 可配置设置** - 调整性能与质量的平衡
- **🎨 2D 渲染基础** - 基于 DOM 的渲染，极致性能

**现有功能：**
- **空间音频** — Claude 在你身后？在你左边？没问题！
- **动画效果** — Claude 在做什么？看着他！◕ ‿ ◕

Vibecraft 使用你自己的本地 Claude Code 实例 — 不分享任何文件或提示。

![Three.js](https://img.shields.io/badge/Three.js-black?logo=threedotjs) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white) ![npm](https://img.shields.io/npm/v/faster-vibecraft)

## 系统要求

- **macOS 或 Linux**（不支持 Windows - hooks 需要 bash）
- **Node.js** 18+
- **jq** - 用于 hook 脚本（`brew install jq` / `apt install jq`）
- **tmux** - 用于会话管理（`brew install tmux` / `apt install tmux`）

## 快速开始

```bash
# 1. 安装依赖
brew install jq tmux       # macOS
# sudo apt install jq tmux  # Ubuntu/Debian

# 2. 配置 hooks（首次运行）
npx faster-vibecraft setup

# 3. 启动服务器
npx faster-vibecraft
```

打开 http://localhost:4003 并正常使用 Claude Code。

**从源码运行：**
```bash
git clone https://github.com/palomyates516-alt/faster-vibecraft
cd faster-vibecraft && npm install && npm run dev
# 打开 http://localhost:4002
```

**卸载：** `npx faster-vibecraft uninstall`（移除 hooks，保留数据）

## 浏览器控制（可选）

在 tmux 中运行 Claude 以便从浏览器发送提示：

```bash
tmux new -s claude
claude
```

然后在可视化界面中使用输入框，勾选"发送到 tmux"。

## 工作站

| 工作站 | 工具 | 详情 |
|--------|------|------|
| 书架 | Read | 书架上的书籍 |
| 书桌 | Write | 纸张、铅笔、墨水瓶 |
| 工作台 | Edit | 扳手、齿轮、螺栓 |
| 终端 | Bash | 发光的屏幕 |
| 扫描仪 | Grep, Glob | 带透镜的望远镜 |
| 天线 | WebFetch, WebSearch | 卫星天线 |
| 传送门 | Task（子代理） | 发光的环形传送门 |
| 任务板 | TodoWrite | 带便签的公告板 |

## 功能特性

- **浮动上下文标签** - 在活动工作站上方显示文件路径和命令
- **思考气泡** - Claude 处理时显示思考动画
- **响应捕获** - Claude 的响应显示在活动订阅源中
- **子代理可视化** - 并行任务时在传送门生成迷你 Claude
- **取消按钮** - 发送 Ctrl+C 中断 Claude
- **分屏布局** - 60% 3D 场景（工作坊），40% 活动订阅源
- **语音输入** - 实时转录的语音提示（需要 Deepgram API 密钥）
- **注意力系统** - 会话需要输入或完成时区域脉冲闪烁
- **音效** - 为工具和事件合成的音频反馈（[docs/SOUND.md](docs/SOUND.md)）
- **绘画模式** - 用颜色绘制六边形瓦片，3D 堆叠，文字标签（按 `D`）
- **文字标签** - 为六边形瓦片添加多行标签的自定义模态框
- **区域右键菜单** - 右键点击区域查看信息（`I`）或快速命令（`C`）输入
- **工作站面板** - 按 `P` 切换查看每个工作站的最近工具历史
- **上下文感知动画** - Claude 庆祝提交，错误时摇头

## 性能优化（第三阶段）

此版本包含重大性能改进：

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| **空闲 CPU** | 30-40% | < 10% | 🎯 降低 75% |
| **活动 CPU** | 50-100% | < 30% | 🎯 降低 70% |
| **终端轮询** | 2秒 | 5秒 | 🎯 I/O 降低 60% |
| **世界网格** | 启用 | 禁用 | 🎯 CPU 降低 15% |
| **粒子效果** | 启用 | 禁用 | 🎯 CPU 降低 10% |

### 性能设置

通过界面右上角的齿轮图标（⚙️）访问设置：
- **渲染模式** - 在 3D（Three.js）或 2D（基于 DOM）之间选择
- **终端轮询** - 2秒 / 5秒 / 10秒 间隔
- **世界网格** - 切换六边形网格覆盖
- **粒子效果** - 切换环境和区域粒子

详见 [docs/PERFORMANCE_USER_GUIDE.md](docs/PERFORMANCE_USER_GUIDE.md)。

## 多 Claude 协作

![多 Claude 协作](public/multiclaude.png)

运行多个 Claude 实例并指挥每个工作：

1. 点击 **"+ 新建"**（或 `Alt+N`）生成新会话
2. 配置名称、目录和标志（`-r`、`--chrome`、`--dangerously-skip-permissions`）
3. 点击会话或按 `1-6`（或在输入框中按 `Alt+1-6`）选择
4. 向任意 Claude 发送提示

每个会话在自己的 tmux 中运行，有状态跟踪（空闲/工作/离线）。

详见 [docs/ORCHESTRATION.md](docs/ORCHESTRATION.md) 获取完整 API 和架构。

## 快捷键

| 按键 | 功能 |
|------|------|
| `Tab` / `Esc` | 在工作坊和订阅源之间切换焦点 |
| `1-6` | 切换到会话（扩展：QWERTY, ASDFGH, ZXCVBN） |
| `0` / `` ` `` | 所有会话 / 概览 |
| `Alt+N` | 新建会话 |
| `Alt+R` | 切换语音输入 |
| `F` | 切换跟随模式 |
| `P` | 切换工作站面板 |
| `D` | 切换绘画模式 |

**绘画模式：** `1-6` 颜色，`0` 橡皮擦，`Q/E` 画笔大小，`R` 3D 堆叠，`X` 清除

## CLI 命令

```bash
faster-vibecraft [选项]

选项：
  --port, -p <端口>    WebSocket 服务器端口（默认：4003）
  --help, -h           显示帮助
  --version, -v        显示版本

命令：
  setup                自动配置 Claude Code hooks
  uninstall            移除 faster-vibecraft hooks（保留数据）
  doctor               诊断常见问题
```

## 安装方式

### 从 npm 安装（推荐）：
```bash
npm install -g faster-vibecraft
```

### 从源码安装：
```bash
git clone https://github.com/palomyates516-alt/faster-vibecraft
cd faster-vibecraft && npm install && npm run dev
# 打开 http://localhost:4002
```

## 文档

- **设置指南**：[docs/SETUP.md](docs/SETUP.md)
- **性能指南**：[docs/PERFORMANCE_USER_GUIDE.md](docs/PERFORMANCE_USER_GUIDE.md)
- **验证指南**：[docs/PERFORMANCE_VALIDATION_GUIDE.md](docs/PERFORMANCE_VALIDATION_GUIDE.md)
- **技术文档**：[CLAUDE.md](CLAUDE.md)
- **音效系统**：[docs/SOUND.md](docs/SOUND.md)
- **第三阶段总结**：[docs/PHASE3_COMPLETION_SUMMARY.md](docs/PHASE3_COMPLETION_SUMMARY.md)

网站：https://vibecraft.sh
仓库：https://github.com/palomyates516-alt/faster-vibecraft

## 许可证

MIT
