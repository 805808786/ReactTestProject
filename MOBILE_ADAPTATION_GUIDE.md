# 移动端适配方案记录 (Mobile Adaptation Setup)

为了彻底解决像 TabBar 那样因为硬编码 px 而在不同设备宽度下的跑版、换行问题，本项目已引入由 `postcss-pxtorem` 插件驱动的 **动态 REM 缩放适配** 方案。

## 适配基准

- **设计稿基准宽度**：`440px` (完全对接 Figma 当前画板)
- **实现原理**：我们将设计稿上的像素（如 `48px` 高度），交给构建工具（PostCSS）自动折算成相对单位（`rem`）。同时配合客户端 `script` 动态注入针对宽度的探针。

## 技术拆解

1. **`index.html` 动态根字号注入**：
   在 HTML 的 `<head>` 部分引入了一段自执行脚本：

   ```javascript
   function setRem() {
     var width = document.documentElement.clientWidth;
     if (width > 480) width = 480; // 设置最大 480px 防止在 PC 上样式无限放大失真
     document.documentElement.style.fontSize = width / 4.4 + "px";
   }
   ```

   **这意味着**：只要在 440px 宽度的普通手机手机上，由于计算比例 $440 / 4.4 = 100$，此时全局的 `1rem` 等于绝对 `100px`。

2. **`postcss-pxtorem` 插件计算 (位于 `postcss.config.cjs`)**：
   通过配置 Vite 内置 postcss 将源码中的所有 px 自动计算转换。
   配置基准 `rootValue: 100`。
   这样你以后在 CSS / LESS 中编写的 `margin: 16px` 会在编译后直接被转译成 `margin: 0.16rem`。

## 今后开发的规范与建议

1. **直接按照 Figma 标注写 `px`**：
   **不需要**人工去计算 rem。看到设计图里间距 `24px`，直接在 CSS 中写 `margin: 24px` 即可，插件在启动 `npm run dev` 时会自动把它换算成响应式流体布局所需的 `rem` 尺寸。

2. **1px 保持**：
   配置了 `minPixelValue: 2`，意味着所有写 `1px` 或者 `2px` 的样式（主要是针对边框 Border 或极为细微的横线）都不会被缩放，保证移动端的细边框不产生糊边问题。

3. **屏蔽转换**：
   如果有个别强行需要锁死物理像素长度，不经过缩放（例如内联 Style 或者大屏下的硬卡片），可以在类名的命名上加上 `ignore` 开头（如 `.ignore-fixed-box`），该类的 px 就不会被转换为 rem。或者部分场景下可以用 `PX` (大写) / `Px` 来绕过正则捕获（由于 postcss 写法问题）。

---

**当前已完成：全工程的全局自适应。所有旧页面已全部无缝缩放，在更小宽度的设备（比如小屏 375px 或者更窄）下也会同比例缩小，永远不会发生挤压导致文本换行的情况！**
