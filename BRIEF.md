# BRIEF: Sky Island

## Goal

Build a small, playable first-person voxel island as a static website. The player should be able to explore a fixed island and complete the homework's first batch: mine blocks, collect the dropped blocks, and place them back into the world.

The implementation will be original. The supplied course asset pack is the source for block textures, hotbar icons, and mining cracks.

## Player experience

- Move with WASD, jump with Space, mine by holding the left mouse button, and place a selected block with the right mouse button.
- Show a visible crosshair, selected hotbar slot, and per-block inventory counts.
- Give clear visual feedback while mining and when a block drop is collected.
- Keep the game understandable without sign-in or a network service.

## Scope

### Required first batch

1. A small island and first-person movement.
2. Hold-to-mine behavior with material-dependent mining time.
3. A mined block becomes a small, slowly rotating drop that falls onto the island.
4. Drops are collected only when the player comes close; the matching inventory count increases.
5. Right-click places the selected block and decrements inventory.

### Second batch

- Rain: press R to toggle visible falling rain. A roof shelters the player from rain.
- Day/night: the sky and world lighting transition between day and night and repeat continuously.

## Constraints

The following course requirements are fixed and must remain at the end of this file:

- Use Three.js.
- Make a static website with HTML, CSS, and JavaScript. No server-side application, accounts, or game engine.
- Target at least 30 frames per second on older school computers, including integrated graphics or CPU-only computers.
- Keep the fixed world within 32 × 32 × 32 blocks. No infinite world and no multiplayer.
- Use only the supplied `sky-island-assets/` pack for block textures, icons, and mining cracks. Render the source 16 × 16 block textures with nearest-neighbor filtering.

## 課程限制（原文照貼）

three.js

靜態網站
HTML、CSS、JS
不用伺服器、帳號
不用遊戲引擎

30 fps
舊電腦也要順
學校的舊電腦
內顯或只用 CPU
全螢幕每秒 30 格以上

32×32×32
世界大小固定
32 × 32 × 32 格以內
不做無限世界
不做多人

16×16
只用素材包
sky-island-assets.zip
方塊材質、圖示
挖方塊的裂痕
