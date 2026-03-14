# Performance Validation Guide
# 性能验证指南

本文档指导如何验证 Vibecraft Phase 1+2 性能优化的实际效果。

## 准备工作

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 打开浏览器开发者工具

**Chrome/Edge**:
- 按 `F12` 或 `Ctrl+Shift+I`
- 切换到 **Performance** 标签
- 或者使用 **Performance Monitor** (`Ctrl+Shift+P` → 搜索 "Performance Monitor")

## 测试场景

### 场景 1: 空闲状态 CPU 使用率

**目标**: < 10% CPU

**步骤**:
1. 打开 Vibecast 应用
2. 等待页面完全加载（3D 渲染完成）
3. 不进行任何操作，观察 30 秒
4. 记录 CPU 使用率

**预期结果**:
- ✅ CPU 使用率保持在 5-10% 之间
- ✅ 帧率稳定（不渲染时 FPS 计数器不跳动）
- ✅ 无内存泄漏（内存曲线平稳）

**对比**: 优化前空闲时 CPU 使用率约为 30-40%

---

### 场景 2: 活跃状态 CPU 使用率

**目标**: < 30% CPU

**步骤**:
1. 发送一个 prompt（例如："帮我读取 package.json"）
2. 观察 Claude 活动时的 CPU 使用率
3. 等待工具完成（Read、编辑等）
4. 返回空闲状态

**预期结果**:
- ✅ Claude 移动时 CPU 峰值 < 50%
- ✅ 工作完成后 CPU 迅回 < 10%
- ✅ 不会持续保持在 30% 以上

**对比**: 优化前活跃时 CPU 使用率持续 50-100%

---

### 场景 3: 多 session 并发

**目标**: 可扩展性

**步骤**:
1. 创建 3 个不同的 sessions
2. 同时向每个 session 发送 prompts
3. 观察 CPU 和内存使用

**预期结果**:
- ✅ CPU 使用率线性增长，而非指数增长
- ✅ 内存稳定，无泄漏
- ✅ 各 zone 独立渲染，互不影响

---

### 场景 4: 性能设置验证

#### 4.1 渲染模式切换

**步骤**:
1. 点击 Settings 按钮（齿轮图标）
2. 在 "Performance" 部分：
   - 选择 "2D (DOM)" 模式
   - 点击 "Save" 或关闭模态框
3. 观察页面重新加载

**预期结果**:
- ✅ 页面自动重新加载
- ✅ 显示 toast 提示 "2D mode is experimental. Using 3D renderer."
- ✅ localStorage 中保存了 `vibecraft-render-mode: 2d`
- ✅ 重新打开 Settings，模式选择保持为 "2D"

#### 4.2 终端轮询频率验证

**步骤**:
1. 打开浏览器控制台（Console）
2. 输入：`localStorage.getItem('vibecraft-terminal-poll')`
3. 验证返回值是否为 `"5000"`（5秒）

**预期结果**:
- ✅ 默认值为 5000（优化前为 2000）
- ✅ 终端输出每 5 秒更新一次，而非 2 秒

#### 4.3 世界网格验证

**步骤**:
1. 打开浏览器控制台
2. 输入：`localStorage.getItem('vibecraft-world-grid')`
3. 验证返回值是否为 `null` 或 `"false"`

**预期结果**:
- ✅ 默认禁用（不显示世界六边形网格）
- ✅ 地板上没有大的六边形网格覆盖

---

## 性能指标对比

| 指标 | 优化前 | 优化后（目标） | 实际测量 |
|------|--------|---------------|---------|
| 空闲 CPU | 30-40% | < 10% | ___ |
| 活跃 CPU | 50-100% | < 30% | ___ |
| 内存（5分钟） | 增长 50MB+ | 稳定 | ___ |
| 终端轮询 | 2 秒 | 5 秒 | ✅ |
| 世界网格 | 启用 | 禁用 | ✅ |
| 粒子系统 | 启用 | 禁用 | ✅ |

## 故障排除

### 问题 1: CPU 使用率仍然很高

**可能原因**:
- Dirty flag 未正确实现
- 动画计数器泄漏
- 粒子系统仍然启用

**检查方法**:
```javascript
// 在浏览器控制台中运行
// 检查粒子是否启用
localStorage.getItem('vibecraft-particles')
localStorage.getItem('vibecraft-zone-particles')

// 检查轮询间隔
localStorage.getItem('vibecraft-terminal-poll')
```

### 问题 2: 页面无响应

**可能原因**:
- 渲染循环中的竞态条件
- 无限递归

**检查方法**:
- 打开控制台查看错误信息
- 检查 FPS 计数器是否仍在更新

### 问题 3: 设置不保存

**可能原因**:
- localStorage 被禁用
- 隐私模式阻止存储

**检查方法**:
```javascript
// 测试 localStorage
try {
  localStorage.setItem('test', '1')
  localStorage.removeItem('test')
  console.log('localStorage 工作正常')
} catch (e) {
  console.error('localStorage 不可用:', e)
}
```

## 收集结果

完成验证后，请记录以下数据：

```
=== 性能验证结果 ===
日期: ___________
浏览器: ___________

空闲 CPU 使用率: _____ %
活跃 CPU 使用率: _____ %
内存使用（初始）: _____ MB
内存使用（5分钟后）: _____ MB

渲染模式切换: ✅ / ❌
设置持久化: ✅ / ❌

总体评价: ___________
```

## 下一步

验证完成后：
1. 如果效果显著 → 创建 PR 合并到主分支
2. 如果需要进一步优化 → 处理代码审查中发现的中优先级问题
3. 创建用户文档 → 指导用户如何根据设备调整性能设置
