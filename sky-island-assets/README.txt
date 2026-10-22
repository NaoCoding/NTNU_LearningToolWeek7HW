Sky Island 素材｜Week 7 作業
==============================

這些是「空中之島」範例用到的 2D 圖片，給你做作業時使用。

  textures/16px/    方塊材質，原始大小 16×16 像素（遊戲裡用這一份）
  textures/256px/   同一批材質放大 16 倍，方便看清楚
  atlas.png         所有材質排在一張 64×64 的圖上（4×4 格，每格 16×16）
  icons/            方塊欄的小立方體圖示，64×64，背景透明
  cracks.png        挖方塊的裂痕，10 張排成一排（160×16，背景透明）

挖方塊的裂痕（textures/16px/destroy_stage_0.png ～ destroy_stage_9.png）：
  0 是剛開始挖，9 是快挖掉了。按住左鍵時，在那一格外面蓋一個大一點點的透明方塊，
  貼上裂痕，挖得越久換越後面那一張；放開左鍵就拿掉。

atlas.png 的位置（左到右、上到下，從 0 開始數）：
   0 grass_top    1 grass_side   2 dirt     3 stone
   4 log_side     5 log_top      6 leaves   7 planks
   8 sand         9 brick

每種方塊的六個面：
  Grass：上面 grass_top，側面 grass_side，底面 dirt
  Log：上下兩面 log_top，側面 log_side
  其他方塊：六個面都一樣

小提醒：
  - 像素圖要保持銳利：three.js 的材質請設 magFilter 和 minFilter 為 THREE.NearestFilter。
  - 範例天空的顏色是 #bfe0f4。

使用範圍：這些圖片是本課程自己畫的，可以自由用在這門課的作業。
Copyright © 2026 JUNHAO CHEN．授權：CC BY-NC-SA 4.0（https://creativecommons.org/licenses/by-nc-sa/4.0/）


Sky Island assets | Week 7 homework
===================================

These are the 2D images used by the Sky Island example. Use them for your homework.

  textures/16px/    block textures at their real size, 16×16 pixels (use these in the game)
  textures/256px/   the same textures enlarged 16 times, easier to look at
  atlas.png         all textures on one 64×64 image (4×4 cells of 16×16)
  icons/            the small cube icons of the block bar, 64×64, transparent background
  cracks.png        the cracks shown while breaking a block, 10 stages in a row (160×16, transparent)

Cracks while breaking a block (textures/16px/destroy_stage_0.png to destroy_stage_9.png):
  0 is just starting, 9 is about to break. While the left button is held, put a slightly bigger
  transparent cube over that block with the crack texture, and move on to a later stage the longer
  it is held; take it away when the button is released.

Cells in atlas.png (left to right, top to bottom, counting from 0):
   0 grass_top    1 grass_side   2 dirt     3 stone
   4 log_side     5 log_top      6 leaves   7 planks
   8 sand         9 brick

Faces of each block:
  Grass: top grass_top, sides grass_side, bottom dirt
  Log: top and bottom log_top, sides log_side
  Other blocks: the same texture on all six faces

Tips:
  - Keep pixel art sharp: in three.js set the texture's magFilter and minFilter to THREE.NearestFilter.
  - The example's sky colour is #bfe0f4.

You may use these images freely for this course's homework. They were drawn for this course.
Copyright © 2026 JUNHAO CHEN. License: CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
