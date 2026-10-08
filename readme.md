---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：＿415730406　　姓名：＿丁鈺芳

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習1截圖]![image](https://hackmd.io/_uploads/rkqc83Vizl.png)
![image](https://hackmd.io/_uploads/rk1VwnEjGe.png)


### 第一次問 AI

```tex!
使用p5.js撰寫一個選擇題測驗系統，我已經產生一個p5.js專案，請把程式碼寫到sketch.js檔案內，每條指令都需要加上中文註解。測驗系統題目設定為五題，測驗題目的內容為程式設計p5.js簡易指令練習測驗，系統採用全螢幕畫布，使用者答錯時系統會在正確答案選項上，加上b5e48c背景顏色，該選項要上下跳動，答錯的選項採用e26d5c背景顏色，選項左右移動。選擇題選項共有四個選項，當五題結束後，需顯示答對的題數，每次顯示一個題目，需要有下一題的按鈕。
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript=
// 宣告測驗題目資料陣列。
const questions = [
  // 設定第一題的題目、選項與正確答案索引。
  {
    question: "在 p5.js 中，哪一個指令可以建立畫布？",
    options: ["createCanvas()", "drawCanvas()", "makeCanvas()", "newCanvas()"],
    answer: 0
  },

  // 設定第二題的題目、選項與正確答案索引。
  {
    question: "在 p5.js 中，哪一個指令可以畫出圓形？",
    options: ["circle()", "round()", "drawCircle()", "ellipseCircle()"],
    answer: 0
  },

  // 設定第三題的題目、選項與正確答案索引。
  {
    question: "在 p5.js 中，哪一個函式只會在程式開始時執行一次？",
    options: ["start()", "setup()", "begin()", "once()"],
    answer: 1
  },

  // 設定第四題的題目、選項與正確答案索引。
  {
    question: "在 p5.js 中，哪一個函式會持續重複執行？",
    options: ["loop()", "draw()", "repeat()", "run()"],
    answer: 1
  },

  // 設定第五題的題目、選項與正確答案索引。
  {
    question: "在 p5.js 中，哪一個指令可以設定填滿顏色？",
    options: ["color()", "paint()", "fill()", "backgroundColor()"],
    answer: 2
  }
];

// 宣告目前顯示的題目索引。
let currentQuestion = 0;

// 宣告使用者選擇的選項索引。
let selectedOption = -1;

// 宣告目前題目是否已經作答。
let hasAnswered = false;

// 宣告使用者答對的題數。
let score = 0;

// 宣告測驗是否已經結束。
let quizFinished = false;

// 宣告選項區域的起始位置。
let optionStartY = 0;

// 宣告選項區域的寬度。
let optionWidth = 0;

// 宣告選項區域的高度。
let optionHeight = 0;

// 宣告選項之間的垂直間距。
let optionGap = 0;

// 宣告按鈕的寬度。
let buttonWidth = 0;

// 宣告按鈕的高度。
let buttonHeight = 0;

// 宣告按鈕的垂直位置。
let buttonY = 0;

// 宣告動畫時間。
let animationTime = 0;

// 建立 p5.js 畫布。
function setup() {
  // 建立符合視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 設定文字使用無襯線字體。
  textFont("sans-serif");

  // 設定文字水平置中對齊。
  textAlign(CENTER, CENTER);

  // 設定矩形繪製模式為從左上角開始。
  rectMode(CORNER);

  // 設定初始畫面配置。
  responsiveLayout();
}

// p5.js 每一幀都會執行的函式。
function draw() {
  // 增加動畫時間，讓錯誤選項產生移動效果。
  animationTime += 0.08;

  // 設定背景顏色。
  background("#f7f9fc");

  // 判斷測驗是否已經結束。
  if (quizFinished) {
    // 繪製測驗結果畫面。
    drawResultScreen();

    // 結束本次 draw 函式。
    return;
  }

  // 繪製測驗標題。
  drawHeader();

  // 繪製目前題目。
  drawQuestion();

  // 繪製四個選項。
  drawOptions();

  // 繪製操作按鈕。
  drawButton();
}

// 根據視窗大小重新計算介面配置。
function responsiveLayout() {
  // 計算選項區域寬度，並限制最大寬度。
  optionWidth = min(width * 0.86, 760);

  // 計算每個選項的高度。
  optionHeight = constrain(height * 0.075, 48, 68);

  // 計算選項之間的距離。
  optionGap = constrain(height * 0.018, 10, 18);

  // 計算選項區域的起始水平位置。
  optionStartY = height * 0.38;

  // 計算按鈕寬度。
  buttonWidth = constrain(width * 0.34, 150, 250);

  // 計算按鈕高度。
  buttonHeight = constrain(height * 0.07, 48, 64);

  // 計算按鈕垂直位置。
  buttonY = optionStartY + (optionHeight + optionGap) * 4 + height * 0.04;
}

// 當瀏覽器視窗大小改變時執行。
function windowResized() {
  // 重新設定畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算介面配置。
  responsiveLayout();
}

// 繪製測驗標題與進度。
function drawHeader() {
  // 設定標題文字大小。
  textSize(constrain(width * 0.045, 24, 42));

  // 設定標題文字顏色。
  fill("#1d3557");

  // 繪製測驗標題。
  text("p5.js 程式設計簡易指令測驗", width / 2, height * 0.08);

  // 設定進度文字大小。
  textSize(constrain(width * 0.022, 16, 22));

  // 設定進度文字顏色。
  fill("#457b9d");

  // 繪製目前題數與總題數。
  text(
    "第 " + (currentQuestion + 1) + " 題 / 共 " + questions.length + " 題",
    width / 2,
    height * 0.15
  );
}

// 繪製目前題目文字。
function drawQuestion() {
  // 取得目前題目的資料。
  const questionData = questions[currentQuestion];

  // 設定題目文字大小。
  textSize(constrain(width * 0.027, 18, 28));

  // 設定題目文字顏色。
  fill("#22223b");

  // 繪製題目文字。
  text(questionData.question, width / 2, height * 0.25);
}

// 取得選項的矩形區域。
function getOptionRect(index) {
  // 計算選項的垂直位置。
  const baseY = optionStartY + index * (optionHeight + optionGap);

  // 初始化水平偏移量。
  let offsetX = 0;

  // 判斷是否已經作答且目前選項是答錯選項。
  if (hasAnswered && index === selectedOption && selectedOption !== questions[currentQuestion].answer) {
    // 讓答錯選項左右移動。
    offsetX = sin(animationTime * 3) * 12;
  }

  // 判斷是否已經作答且目前選項是正確答案。
  if (hasAnswered && index === questions[currentQuestion].answer) {
    // 讓正確答案上下跳動。
    const offsetY = sin(animationTime * 4) * 10;

    // 回傳包含上下位移的選項區域。
    return {
      x: (width - optionWidth) / 2 + offsetX,
      y: baseY + offsetY,
      width: optionWidth,
      height: optionHeight
    };
  }

  // 回傳一般選項區域。
  return {
    x: (width - optionWidth) / 2 + offsetX,
    y: baseY,
    width: optionWidth,
    height: optionHeight
  };
}

// 取得選項背景顏色。
function getOptionColor(index) {
  // 判斷目前是否尚未作答。
  if (!hasAnswered) {
    // 回傳一般選項背景色。
    return "#ffffff";
  }

  // 判斷目前選項是否為正確答案。
  if (index === questions[currentQuestion].answer) {
    // 回傳指定的正確答案背景色。
    return "#b5e48c";
  }

  // 判斷目前選項是否為使用者選錯的選項。
  if (index === selectedOption) {
    // 回傳指定的錯誤答案背景色。
    return "#e26d5c";
  }

  // 回傳其他選項的背景色。
  return "#e9ecef";
}

// 繪製所有選項。
function drawOptions() {
  // 取得目前題目的資料。
  const questionData = questions[currentQuestion];

  // 逐一繪製四個選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得目前選項的矩形區域。
    const optionRect = getOptionRect(index);

    // 設定目前選項的背景顏色。
    fill(getOptionColor(index));

    // 設定選項外框顏色。
    stroke("#457b9d");

    // 設定選項外框粗細。
    strokeWeight(2);

    // 繪製選項矩形。
    rect(optionRect.x, optionRect.y, optionRect.width, optionRect.height, 12);

    // 設定選項文字大小。
    textSize(constrain(width * 0.022, 16, 23));

    // 設定選項文字顏色。
    fill("#1d3557");

    // 移除文字繪製外框。
    noStroke();

    // 組合選項編號與選項內容。
    const optionText = String.fromCharCode(65 + index) + ". " + questionData.options[index];

    // 繪製選項文字。
    text(optionText, width / 2, optionRect.y + optionRect.height / 2);
  }
}

// 繪製下一題或重新開始按鈕。
function drawButton() {
  // 設定按鈕背景顏色。
  fill(hasAnswered ? "#457b9d" : "#adb5bd");

  // 設定按鈕外框顏色。
  stroke("#1d3557");

  // 設定按鈕外框粗細。
  strokeWeight(2);

  // 繪製按鈕。
  rect((width - buttonWidth) / 2, buttonY, buttonWidth, buttonHeight, 12);

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(constrain(width * 0.022, 16, 22));

  // 設定按鈕文字內容。
  const buttonText = currentQuestion === questions.length - 1 ? "查看結果" : "下一題";

  // 繪製按鈕文字。
  text(buttonText, width / 2, buttonY + buttonHeight / 2);
}

// 繪製測驗結果畫面。
function drawResultScreen() {
  // 設定結果標題文字大小。
  textSize(constrain(width * 0.06, 30, 58));

  // 設定結果標題文字顏色。
  fill("#1d3557");

  // 繪製結果標題。
  text("測驗完成！", width / 2, height * 0.28);

  // 設定分數文字大小。
  textSize(constrain(width * 0.04, 24, 40));

  // 設定分數文字顏色。
  fill("#457b9d");

  // 繪製答對題數。
  text("你答對了 " + score + " / " + questions.length + " 題", width / 2, height * 0.42);

  // 設定鼓勵文字大小。
  textSize(constrain(width * 0.025, 18, 26));

  // 設定鼓勵文字顏色。
  fill("#2a9d8f");

  // 判斷分數是否達到一半以上。
  if (score >= questions.length / 2) {
    // 繪製鼓勵文字。
    text("表現不錯，繼續練習 p5.js！", width / 2, height * 0.52);
  } else {
    // 繪製鼓勵文字。
    text("再接再厲，多練習就會進步！", width / 2, height * 0.52);
  }

  // 設定重新開始按鈕位置。
  const resultButtonY = height * 0.65;

  // 設定重新開始按鈕背景色。
  fill("#457b9d");

  // 設定重新開始按鈕外框色。
  stroke("#1d3557");

  // 設定重新開始按鈕外框粗細。
  strokeWeight(2);

  // 繪製重新開始按鈕。
  rect((width - buttonWidth) / 2, resultButtonY, buttonWidth, buttonHeight, 12);

  // 設定重新開始文字顏色。
  fill("#ffffff");

  // 設定重新開始文字大小。
  textSize(constrain(width * 0.022, 16, 22));

  // 繪製重新開始文字。
  text("重新開始", width / 2, resultButtonY + buttonHeight / 2);

  // 儲存結果按鈕的垂直位置。
  buttonY = resultButtonY;
}

// 處理滑鼠點擊與觸控點擊。
function mousePressed() {
  // 判斷測驗是否已經結束。
  if (quizFinished) {
    // 處理結果畫面的重新開始按鈕。
    handleRestartClick();

    // 結束本次滑鼠事件。
    return false;
  }

  // 判斷目前是否尚未作答。
  if (!hasAnswered) {
    // 處理選項點擊。
    handleOptionClick();

    // 結束本次滑鼠事件。
    return false;
  }

  // 處理下一題按鈕點擊。
  handleNextClick();

  // 結束本次滑鼠事件。
  return false;
}

// 處理選項點擊。
function handleOptionClick() {
  // 取得目前題目的資料。
  const questionData = questions[currentQuestion];

  // 逐一檢查四個選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得目前選項區域。
    const optionRect = getOptionRect(index);

    // 判斷滑鼠是否位於目前選項內。
    const isInside =
      mouseX >= optionRect.x &&
      mouseX <= optionRect.x + optionRect.width &&
      mouseY >= optionRect.y &&
      mouseY <= optionRect.y + optionRect.height;

    // 判斷滑鼠是否點擊了目前選項。
    if (isInside) {
      // 記錄使用者選擇的選項。
      selectedOption = index;

      // 設定目前題目已完成作答。
      hasAnswered = true;

      // 判斷使用者是否答對。
      if (selectedOption === questionData.answer) {
        // 答對題數增加一題。
        score++;
      }

      // 結束選項檢查迴圈。
      break;
    }
  }
}

// 處理下一題按鈕點擊。
function handleNextClick() {
  // 判斷滑鼠是否點擊按鈕範圍。
  const isInsideButton =
    mouseX >= (width - buttonWidth) / 2 &&
    mouseX <= (width + buttonWidth) / 2 &&
    mouseY >= buttonY &&
    mouseY <= buttonY + buttonHeight;

  // 判斷按鈕是否被點擊。
  if (!isInsideButton) {
    // 若沒有點擊按鈕，直接結束函式。
    return;
  }

  // 判斷目前是否為最後一題。
  if (currentQuestion === questions.length - 1) {
    // 將測驗設定為結束狀態。
    quizFinished = true;

    // 結束目前函式。
    return;
  }

  // 顯示下一題。
  currentQuestion++;

  // 清除使用者上一題的選擇。
  selectedOption = -1;

  // 將作答狀態重設為尚未作答。
  hasAnswered = false;

  // 將動畫時間歸零。
  animationTime = 0;
}

// 處理重新開始按鈕點擊。
function handleRestartClick() {
  // 設定結果畫面的重新開始按鈕位置。
  const resultButtonY = height * 0.65;

  // 判斷滑鼠是否點擊重新開始按鈕。
  const isInsideButton =
    mouseX >= (width - buttonWidth) / 2 &&
    mouseX <= (width + buttonWidth) / 2 &&
    mouseY >= resultButtonY &&
    mouseY <= resultButtonY + buttonHeight;

  // 判斷重新開始按鈕是否被點擊。
  if (!isInsideButton) {
    // 若沒有點擊按鈕，直接結束函式。
    return;
  }

  // 將目前題目重設為第一題。
  currentQuestion = 0;

  // 清除使用者選項。
  selectedOption = -1;

  // 將作答狀態重設為尚未作答。
  hasAnswered = false;

  // 將分數歸零。
  score = 0;

  // 將測驗結束狀態關閉。
  quizFinished = false;

  // 將動畫時間歸零。
  animationTime = 0;
}
```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習2截圖]![image](https://hackmd.io/_uploads/HJJwnhVsMe.png)


### 第一次問 AI

```tex!
讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
//// 宣告測驗題目資料。
const questions = [
  // 設定第一題。
  {
    // 設定題目文字。
    question: "在 p5.js 中，哪一個指令可以建立畫布？",
    // 設定四個選項。
    options: ["createCanvas()", "drawCanvas()", "makeCanvas()", "newCanvas()"],
    // 設定正確答案索引。
    answer: 0
  },

  // 設定第二題。
  {
    // 設定題目文字。
    question: "在 p5.js 中，哪一個指令可以畫出圓形？",
    // 設定四個選項。
    options: ["circle()", "round()", "drawCircle()", "ellipseCircle()"],
    // 設定正確答案索引。
    answer: 0
  },

  // 設定第三題。
  {
    // 設定題目文字。
    question: "哪一個函式只會在程式開始時執行一次？",
    // 設定四個選項。
    options: ["start()", "setup()", "begin()", "once()"],
    // 設定正確答案索引。
    answer: 1
  },

  // 設定第四題。
  {
    // 設定題目文字。
    question: "哪一個函式會持續重複執行？",
    // 設定四個選項。
    options: ["loop()", "draw()", "repeat()", "run()"],
    // 設定正確答案索引。
    answer: 1
  },

  // 設定第五題。
  {
    // 設定題目文字。
    question: "哪一個指令可以設定填滿顏色？",
    // 設定四個選項。
    options: ["color()", "paint()", "fill()", "backgroundColor()"],
    // 設定正確答案索引。
    answer: 2
  }
];

// 宣告目前題目索引。
let currentQuestion = 0;

// 宣告使用者選擇的選項索引。
let selectedOption = -1;

// 宣告是否已經作答。
let hasAnswered = false;

// 宣告答對題數。
let score = 0;

// 宣告測驗是否結束。
let quizFinished = false;

// 宣告目前動畫時間。
let animationTime = 0;

// 宣告介面尺寸資料。
let layout = {};

// 宣告畫布的實際寬度。
let canvasWidth = 0;

// 宣告畫布的實際高度。
let canvasHeight = 0;

// 建立 p5.js 畫布。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 設定畫布顯示為區塊元素，避免底部出現空白。
  canvas.style("display", "block");

  // 設定文字使用無襯線字體。
  textFont("sans-serif");

  // 設定文字水平置中。
  textAlign(CENTER, CENTER);

  // 設定矩形從左上角開始繪製。
  rectMode(CORNER);

  // 設定畫布大小與版面資料。
  updateLayout();
}

// 每一幀都會重複執行。
function draw() {
  // 增加動畫時間。
  animationTime += 0.08;

  // 確保畫布尺寸與視窗尺寸同步。
  keepCanvasSizeUpdated();

  // 設定頁面背景顏色。
  background("#f7f9fc");

  // 判斷測驗是否已結束。
  if (quizFinished) {
    // 繪製結果畫面。
    drawResultScreen();

    // 結束本次繪圖。
    return;
  }

  // 繪製測驗標題。
  drawHeader();

  // 繪製題目。
  drawQuestion();

  // 繪製選項。
  drawOptions();

  // 繪製按鈕。
  drawButton();
}

// 確保畫布大小持續符合瀏覽器視窗。
function keepCanvasSizeUpdated() {
  // 判斷視窗尺寸是否發生變化。
  if (width !== windowWidth || height !== windowHeight) {
    // 重新設定畫布大小。
    resizeCanvas(windowWidth, windowHeight);

    // 重新計算版面配置。
    updateLayout();
  }
}

// 當瀏覽器視窗大小改變時執行。
function windowResized() {
  // 重新設定畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算版面配置。
  updateLayout();
}

// 根據不同裝置與方向計算響應式版面。
function updateLayout() {
  // 儲存目前畫布寬度。
  canvasWidth = width;

  // 儲存目前畫布高度。
  canvasHeight = height;

  // 計算左右邊界。
  const horizontalPadding = constrain(width * 0.06, 16, 80);

  // 計算內容最大寬度，避免電腦螢幕上的內容過寬。
  const contentMaxWidth = min(width - horizontalPadding * 2, 900);

  // 判斷目前是否為手機窄版面。
  const isSmallScreen = width < 480;

  // 判斷目前是否為橫向畫面。
  const isLandscape = width > height;

  // 設定標題文字大小。
  const titleSize = isSmallScreen
    ? constrain(width * 0.052, 20, 28)
    : constrain(width * 0.042, 24, 42);

  // 設定進度文字大小。
  const progressSize = isSmallScreen
    ? constrain(width * 0.035, 14, 18)
    : constrain(width * 0.022, 16, 22);

  // 設定題目文字大小。
  const questionSize = isSmallScreen
    ? constrain(width * 0.042, 17, 22)
    : constrain(width * 0.027, 18, 28);

  // 設定選項文字大小。
  const optionTextSize = isSmallScreen
    ? constrain(width * 0.038, 15, 19)
    : constrain(width * 0.022, 16, 23);

  // 設定按鈕文字大小。
  const buttonTextSize = isSmallScreen
    ? constrain(width * 0.038, 15, 19)
    : constrain(width * 0.022, 16, 22);

  // 設定選項高度。
  const optionHeight = isSmallScreen
    ? constrain(height * 0.07, 48, 60)
    : constrain(height * 0.075, 50, 70);

  // 設定選項間距。
  const optionGap = isSmallScreen
    ? constrain(height * 0.012, 8, 12)
    : constrain(height * 0.018, 10, 18);

  // 設定按鈕高度。
  const buttonHeight = isSmallScreen
    ? constrain(height * 0.075, 48, 60)
    : constrain(height * 0.07, 48, 64);

  // 設定內容寬度。
  const contentWidth = min(contentMaxWidth, width * 0.92);

  // 設定標題位置。
  const headerY = isLandscape ? height * 0.08 : height * 0.075;

  // 設定進度位置。
  const progressY = isLandscape ? height * 0.17 : height * 0.145;

  // 設定題目位置。
  const questionY = isLandscape ? height * 0.27 : height * 0.245;

  // 計算可用的選項起始位置。
  const optionAreaStartY = isLandscape ? height * 0.37 : height * 0.35;

  // 計算選項總高度。
  const optionsTotalHeight = optionHeight * 4 + optionGap * 3;

  // 計算按鈕與選項之間的距離。
  const buttonGap = isSmallScreen ? 18 : 26;

  // 計算按鈕位置。
  let buttonY = optionAreaStartY + optionsTotalHeight + buttonGap;

  // 判斷直向手機是否可能超出高度。
  if (!isLandscape && buttonY + buttonHeight > height * 0.94) {
    // 將選項整體往上移動。
    const correction = buttonY + buttonHeight - height * 0.94;

    // 修正選項起始位置。
    layout.optionStartY = optionAreaStartY - correction;

    // 修正按鈕位置。
    buttonY -= correction;
  } else {
    // 儲存一般選項起始位置。
    layout.optionStartY = optionAreaStartY;
  }

  // 儲存響應式版面設定。
  layout = {
    // 儲存內容寬度。
    contentWidth: contentWidth,

    // 儲存標題文字大小。
    titleSize: titleSize,

    // 儲存進度文字大小。
    progressSize: progressSize,

    // 儲存題目文字大小。
    questionSize: questionSize,

    // 儲存選項文字大小。
    optionTextSize: optionTextSize,

    // 儲存按鈕文字大小。
    buttonTextSize: buttonTextSize,

    // 儲存選項高度。
    optionHeight: optionHeight,

    // 儲存選項間距。
    optionGap: optionGap,

    // 儲存按鈕高度。
    buttonHeight: buttonHeight,

    // 儲存標題位置。
    headerY: headerY,

    // 儲存進度位置。
    progressY: progressY,

    // 儲存題目位置。
    questionY: questionY,

    // 儲存按鈕位置。
    buttonY: buttonY,

    // 儲存是否為小螢幕。
    isSmallScreen: isSmallScreen,

    // 儲存是否為橫向畫面。
    isLandscape: isLandscape
  };
}

// 繪製標題與進度。
function drawHeader() {
  // 設定標題文字大小。
  textSize(layout.titleSize);

  // 設定標題文字顏色。
  fill("#1d3557");

  // 移除文字外框。
  noStroke();

  // 繪製測驗標題。
  text("p5.js 程式設計簡易指令測驗", width / 2, layout.headerY);

  // 設定進度文字大小。
  textSize(layout.progressSize);

  // 設定進度文字顏色。
  fill("#457b9d");

  // 繪製目前題數。
  text(
    "第 " + (currentQuestion + 1) + " 題 / 共 " + questions.length + " 題",
    width / 2,
    layout.progressY
  );
}

// 繪製目前題目。
function drawQuestion() {
  // 取得目前題目資料。
  const questionData = questions[currentQuestion];

  // 設定題目文字大小。
  textSize(layout.questionSize);

  // 設定題目文字顏色。
  fill("#22223b");

  // 移除文字外框。
  noStroke();

  // 繪製題目文字。
  text(questionData.question, width / 2, layout.questionY);
}

// 取得選項的矩形位置。
function getOptionRect(index) {
  // 計算選項的基本垂直位置。
  const baseY =
    layout.optionStartY + index * (layout.optionHeight + layout.optionGap);

  // 設定水平動畫偏移量。
  let offsetX = 0;

  // 設定垂直動畫偏移量。
  let offsetY = 0;

  // 判斷目前是否答錯，並且這是使用者選錯的選項。
  if (
    hasAnswered &&
    selectedOption !== questions[currentQuestion].answer &&
    index === selectedOption
  ) {
    // 讓錯誤選項左右移動。
    offsetX = sin(animationTime * 3) * 12;
  }

  // 判斷目前是否已作答，並且這是正確答案。
  if (hasAnswered && index === questions[currentQuestion].answer) {
    // 讓正確選項上下跳動。
    offsetY = sin(animationTime * 4) * 10;
  }

  // 回傳選項矩形資料。
  return {
    // 設定選項左側位置。
    x: (width - layout.contentWidth) / 2 + offsetX,

    // 設定選項上方位置。
    y: baseY + offsetY,

    // 設定選項寬度。
    width: layout.contentWidth,

    // 設定選項高度。
    height: layout.optionHeight
  };
}

// 取得選項背景顏色。
function getOptionColor(index) {
  // 判斷目前是否尚未作答。
  if (!hasAnswered) {
    // 回傳白色背景。
    return "#ffffff";
  }

  // 判斷目前選項是否為正確答案。
  if (index === questions[currentQuestion].answer) {
    // 回傳指定的正確答案顏色。
    return "#b5e48c";
  }

  // 判斷目前選項是否為使用者選錯的答案。
  if (index === selectedOption) {
    // 回傳指定的錯誤答案顏色。
    return "#e26d5c";
  }

  // 回傳其他選項顏色。
  return "#e9ecef";
}

// 繪製所有選項。
function drawOptions() {
  // 取得目前題目資料。
  const questionData = questions[currentQuestion];

  // 逐一繪製四個選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得目前選項位置。
    const optionRect = getOptionRect(index);

    // 設定選項背景顏色。
    fill(getOptionColor(index));

    // 設定選項外框顏色。
    stroke("#457b9d");

    // 設定外框粗細。
    strokeWeight(2);

    // 繪製選項矩形。
    rect(
      optionRect.x,
      optionRect.y,
      optionRect.width,
      optionRect.height,
      12
    );

    // 設定選項文字大小。
    textSize(layout.optionTextSize);

    // 設定選項文字顏色。
    fill("#1d3557");

    // 移除文字外框。
    noStroke();

    // 建立選項文字。
    const optionText =
      String.fromCharCode(65 + index) + ". " + questionData.options[index];

    // 繪製選項文字。
    text(
      optionText,
      optionRect.x + optionRect.width / 2,
      optionRect.y + optionRect.height / 2
    );
  }
}

// 繪製下一題按鈕。
function drawButton() {
  // 設定按鈕背景顏色。
  fill(hasAnswered ? "#457b9d" : "#adb5bd");

  // 設定按鈕外框顏色。
  stroke("#1d3557");

  // 設定外框粗細。
  strokeWeight(2);

  // 繪製按鈕。
  rect(
    (width - layout.contentWidth * 0.34) / 2,
    layout.buttonY,
    layout.contentWidth * 0.34,
    layout.buttonHeight,
    12
  );

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(layout.buttonTextSize);

  // 設定按鈕文字。
  const buttonText =
    currentQuestion === questions.length - 1 ? "查看結果" : "下一題";

  // 繪製按鈕文字。
  text(
    buttonText,
    width / 2,
    layout.buttonY + layout.buttonHeight / 2
  );
}

// 繪製測驗結果畫面。
function drawResultScreen() {
  // 設定結果標題文字大小。
  textSize(constrain(width * 0.06, 30, 58));

  // 設定文字顏色。
  fill("#1d3557");

  // 移除文字外框。
  noStroke();

  // 繪製結果標題。
  text("測驗完成！", width / 2, height * 0.25);

  // 設定分數文字大小。
  textSize(constrain(width * 0.042, 24, 42));

  // 設定分數文字顏色。
  fill("#457b9d");

  // 繪製答對題數。
  text("你答對了 " + score + " / " + questions.length + " 題", width / 2, height * 0.4);

  // 設定鼓勵文字大小。
  textSize(constrain(width * 0.026, 17, 26));

  // 設定鼓勵文字顏色。
  fill("#2a9d8f");

  // 判斷分數是否達到一半以上。
  if (score >= questions.length / 2) {
    // 顯示鼓勵訊息。
    text("表現不錯，繼續練習 p5.js！", width / 2, height * 0.5);
  } else {
    // 顯示鼓勵訊息。
    text("再接再厲，多練習就會進步！", width / 2, height * 0.5);
  }

  // 設定結果按鈕寬度。
  const resultButtonWidth = min(layout.contentWidth * 0.42, 260);

  // 設定結果按鈕高度。
  const resultButtonHeight = layout.buttonHeight;

  // 設定結果按鈕位置。
  const resultButtonY = height * 0.65;

  // 設定按鈕背景顏色。
  fill("#457b9d");

  // 設定按鈕外框顏色。
  stroke("#1d3557");

  // 設定外框粗細。
  strokeWeight(2);

  // 繪製重新開始按鈕。
  rect(
    (width - resultButtonWidth) / 2,
    resultButtonY,
    resultButtonWidth,
    resultButtonHeight,
    12
  );

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(layout.buttonTextSize);

  // 繪製重新開始文字。
  text("重新開始", width / 2, resultButtonY + resultButtonHeight / 2);

  // 儲存結果按鈕相關尺寸。
  layout.resultButtonWidth = resultButtonWidth;

  // 儲存結果按鈕高度。
  layout.resultButtonHeight = resultButtonHeight;

  // 儲存結果按鈕位置。
  layout.resultButtonY = resultButtonY;
}

// 處理滑鼠與觸控點擊。
function mousePressed() {
  // 判斷測驗是否已經結束。
  if (quizFinished) {
    // 處理重新開始按鈕。
    handleRestartClick();

    // 阻止瀏覽器預設行為。
    return false;
  }

  // 判斷目前是否尚未作答。
  if (!hasAnswered) {
    // 處理選項點擊。
    handleOptionClick();

    // 阻止瀏覽器預設行為。
    return false;
  }

  // 處理下一題按鈕。
  handleNextClick();

  // 阻止瀏覽器預設行為。
  return false;
}

// 處理選項點擊。
function handleOptionClick() {
  // 取得目前題目資料。
  const questionData = questions[currentQuestion];

  // 逐一檢查四個選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得目前選項的實際位置。
    const optionRect = getOptionRect(index);

    // 判斷滑鼠是否在選項範圍內。
    const isInside =
      mouseX >= optionRect.x &&
      mouseX <= optionRect.x + optionRect.width &&
      mouseY >= optionRect.y &&
      mouseY <= optionRect.y + optionRect.height;

    // 判斷使用者是否點擊此選項。
    if (isInside) {
      // 記錄使用者選擇的選項。
      selectedOption = index;

      // 設定已完成作答。
      hasAnswered = true;

      // 判斷答案是否正確。
      if (selectedOption === questionData.answer) {
        // 答對題數增加一題。
        score++;
      }

      // 重設動畫時間。
      animationTime = 0;

      // 結束選項判斷迴圈。
      break;
    }
  }
}

// 處理下一題按鈕。
function handleNextClick() {
  // 計算按鈕寬度。
  const currentButtonWidth = layout.contentWidth * 0.34;

  // 判斷滑鼠是否位於按鈕範圍內。
  const isInsideButton =
    mouseX >= (width - currentButtonWidth) / 2 &&
    mouseX <= (width + currentButtonWidth) / 2 &&
    mouseY >= layout.buttonY &&
    mouseY <= layout.buttonY + layout.buttonHeight;

  // 判斷是否沒有點擊按鈕。
  if (!isInsideButton) {
    // 結束函式。
    return;
  }

  // 判斷目前是否為最後一題。
  if (currentQuestion === questions.length - 1) {
    // 將測驗設定為結束。
    quizFinished = true;

    // 結束函式。
    return;
  }

  // 顯示下一題。
  currentQuestion++;

  // 清除選項選擇。
  selectedOption = -1;

  // 設定為尚未作答。
  hasAnswered = false;

  // 重設動畫時間。
  animationTime = 0;
}

// 處理重新開始按鈕。
function handleRestartClick() {
  // 判斷滑鼠是否位於重新開始按鈕內。
  const isInsideButton =
    mouseX >= (width - layout.resultButtonWidth) / 2 &&
    mouseX <= (width + layout.resultButtonWidth) / 2 &&
    mouseY >= layout.resultButtonY &&
    mouseY <= layout.resultButtonY + layout.resultButtonHeight;

  // 判斷是否沒有點擊按鈕。
  if (!isInsideButton) {
    // 結束函式。
    return;
  }

  // 回到第一題。
  currentQuestion = 0;

  // 清除選項選擇。
  selectedOption = -1;

  // 設定為尚未作答。
  hasAnswered = false;

  // 將分數歸零。
  score = 0;

  // 將測驗設為未結束。
  quizFinished = false;

  // 重設動畫時間。
  animationTime = 0;

  // 重新計算版面。
  updateLayout();
}

```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習3截圖](請貼上截圖)

### 第一次問 AI

```tex!
從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
// 宣告測驗題目資料。
const questions = [
  // 設定第一題資料。
  {
    // 設定第一題題目。
    question: "在 p5.js 中，哪一個指令可以建立畫布？",
    // 設定第一題選項。
    options: ["createCanvas()", "drawCanvas()", "makeCanvas()", "newCanvas()"],
    // 設定第一題正確答案索引。
    answer: 0
  },

  // 設定第二題資料。
  {
    // 設定第二題題目。
    question: "在 p5.js 中，哪一個指令可以畫出圓形？",
    // 設定第二題選項。
    options: ["circle()", "round()", "drawCircle()", "ellipseCircle()"],
    // 設定第二題正確答案索引。
    answer: 0
  },

  // 設定第三題資料。
  {
    // 設定第三題題目。
    question: "哪一個函式只會在程式開始時執行一次？",
    // 設定第三題選項。
    options: ["start()", "setup()", "begin()", "once()"],
    // 設定第三題正確答案索引。
    answer: 1
  },

  // 設定第四題資料。
  {
    // 設定第四題題目。
    question: "哪一個函式會持續重複執行？",
    // 設定第四題選項。
    options: ["loop()", "draw()", "repeat()", "run()"],
    // 設定第四題正確答案索引。
    answer: 1
  },

  // 設定第五題資料。
  {
    // 設定第五題題目。
    question: "哪一個指令可以設定填滿顏色？",
    // 設定第五題選項。
    options: ["color()", "paint()", "fill()", "backgroundColor()"],
    // 設定第五題正確答案索引。
    answer: 2
  }
];

// 設定 Google Fonts 的 Noto Sans TC 繁體中文字型網址。
const GOOGLE_FONT_URL =
  "https://fonts.gstatic.com/s/notosanstc/v40/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz76Cy_Co.ttf";

// 設定 Google Fonts 載入失敗時使用的備用字型。
const FALLBACK_FONT = "sans-serif";

// 宣告目前使用的字型物件。
let quizFont = null;

// 宣告字型載入狀態。
let fontStatus = "loading";

// 宣告 Google Fonts 載入請求物件。
let fontLoadRequest = null;

// 宣告目前題目索引。
let currentQuestion = 0;

// 宣告使用者選擇的選項索引。
let selectedOption = -1;

// 宣告目前題目是否已經作答。
let hasAnswered = false;

// 宣告答對題數。
let score = 0;

// 宣告測驗是否已經結束。
let quizFinished = false;

// 宣告動畫時間。
let animationTime = 0;

// 宣告響應式版面資料。
let layout = {};

// 建立 p5.js 畫布。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 將畫布設定為區塊元素，避免底部產生空白。
  canvas.style("display", "block");

  // 設定文字水平置中。
  textAlign(CENTER, CENTER);

  // 設定矩形從左上角開始繪製。
  rectMode(CORNER);

  // 先使用備用字型，避免字型載入期間文字消失。
  textFont(FALLBACK_FONT);

  // 開始載入 Google Fonts 的繁體中文字型。
  fontLoadRequest = loadFont(
    GOOGLE_FONT_URL,
    handleGoogleFontLoaded,
    handleGoogleFontError
  );

  // 計算響應式版面配置。
  updateLayout();
}

// Google Fonts 載入成功時執行。
function handleGoogleFontLoaded(loadedFont) {
  // 儲存成功載入的字型物件。
  quizFont = loadedFont;

  // 更新字型載入狀態。
  fontStatus = "loaded";

  // 將畫布文字切換為 Google Fonts 字型。
  textFont(quizFont);
}

// Google Fonts 載入失敗時執行。
function handleGoogleFontError(error) {
  // 設定字型載入狀態為失敗。
  fontStatus = "error";

  // 清除字型物件。
  quizFont = null;

  // 使用備用無襯線字型。
  textFont(FALLBACK_FONT);

  // 在瀏覽器主控台顯示錯誤資訊。
  console.warn("Google Fonts 載入失敗，改用備用字型。", error);
}

// 套用目前應使用的字型。
function applyQuizFont() {
  // 判斷 Google Fonts 是否已經成功載入。
  if (fontStatus === "loaded" && quizFont !== null) {
    // 使用 Google Fonts 的 Noto Sans TC。
    textFont(quizFont);
  } else {
    // Google Fonts 尚未載入或載入失敗時使用備用字型。
    textFont(FALLBACK_FONT);
  }
}

// 每一幀都會執行的繪圖函式。
function draw() {
  // 套用目前的繁體中文字型。
  applyQuizFont();

  // 增加動畫時間。
  animationTime += 0.08;

  // 確保畫布尺寸與視窗同步。
  keepCanvasSizeUpdated();

  // 設定背景顏色。
  background("#f7f9fc");

  // 判斷測驗是否結束。
  if (quizFinished) {
    // 繪製測驗結果畫面。
    drawResultScreen();

    // 結束本次繪圖。
    return;
  }

  // 繪製測驗標題。
  drawHeader();

  // 繪製目前題目。
  drawQuestion();

  // 繪製四個選項。
  drawOptions();

  // 繪製下一題按鈕。
  drawButton();
}

// 確保畫布尺寸符合目前視窗大小。
function keepCanvasSizeUpdated() {
  // 判斷畫布尺寸是否與視窗尺寸不同。
  if (width !== windowWidth || height !== windowHeight) {
    // 重新設定畫布尺寸。
    resizeCanvas(windowWidth, windowHeight);

    // 重新計算版面配置。
    updateLayout();
  }
}

// 當瀏覽器視窗大小改變時執行。
function windowResized() {
  // 重新設定畫布尺寸。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算版面配置。
  updateLayout();
}

// 計算響應式版面配置。
function updateLayout() {
  // 設定目前是否為手機窄螢幕。
  const isSmallScreen = width < 480;

  // 設定目前是否為橫向畫面。
  const isLandscape = width > height;

  // 計算左右邊界。
  const horizontalPadding = constrain(width * 0.06, 16, 80);

  // 計算內容最大寬度。
  const contentWidth = min(width - horizontalPadding * 2, 900);

  // 計算標題文字大小。
  const titleSize = isSmallScreen
    ? constrain(width * 0.052, 20, 28)
    : constrain(width * 0.042, 24, 42);

  // 計算進度文字大小。
  const progressSize = isSmallScreen
    ? constrain(width * 0.035, 14, 18)
    : constrain(width * 0.022, 16, 22);

  // 計算題目文字大小。
  const questionSize = isSmallScreen
    ? constrain(width * 0.042, 17, 22)
    : constrain(width * 0.027, 18, 28);

  // 計算選項文字大小。
  const optionTextSize = isSmallScreen
    ? constrain(width * 0.038, 15, 19)
    : constrain(width * 0.022, 16, 23);

  // 計算按鈕文字大小。
  const buttonTextSize = isSmallScreen
    ? constrain(width * 0.038, 15, 19)
    : constrain(width * 0.022, 16, 22);

  // 計算選項高度。
  const optionHeight = isSmallScreen
    ? constrain(height * 0.07, 48, 60)
    : constrain(height * 0.075, 50, 70);

  // 計算選項間距。
  const optionGap = isSmallScreen
    ? constrain(height * 0.012, 8, 12)
    : constrain(height * 0.018, 10, 18);

  // 計算按鈕高度。
  const buttonHeight = isSmallScreen
    ? constrain(height * 0.075, 48, 60)
    : constrain(height * 0.07, 48, 64);

  // 計算標題垂直位置。
  const headerY = isLandscape ? height * 0.08 : height * 0.075;

  // 計算進度垂直位置。
  const progressY = isLandscape ? height * 0.17 : height * 0.145;

  // 計算題目垂直位置。
  const questionY = isLandscape ? height * 0.27 : height * 0.245;

  // 計算選項起始位置。
  let optionStartY = isLandscape ? height * 0.37 : height * 0.35;

  // 計算四個選項的總高度。
  const optionsTotalHeight = optionHeight * 4 + optionGap * 3;

  // 計算按鈕與選項之間的距離。
  const buttonGap = isSmallScreen ? 18 : 26;

  // 計算按鈕垂直位置。
  let buttonY = optionStartY + optionsTotalHeight + buttonGap;

  // 判斷直向手機版面是否超出畫面高度。
  if (!isLandscape && buttonY + buttonHeight > height * 0.94) {
    // 計算需要向上移動的距離。
    const correction = buttonY + buttonHeight - height * 0.94;

    // 將選項區域往上移動。
    optionStartY -= correction;

    // 將按鈕往上移動。
    buttonY -= correction;
  }

  // 儲存所有響應式版面資料。
  layout = {
    // 儲存內容寬度。
    contentWidth: contentWidth,

    // 儲存標題文字大小。
    titleSize: titleSize,

    // 儲存進度文字大小。
    progressSize: progressSize,

    // 儲存題目文字大小。
    questionSize: questionSize,

    // 儲存選項文字大小。
    optionTextSize: optionTextSize,

    // 儲存按鈕文字大小。
    buttonTextSize: buttonTextSize,

    // 儲存選項高度。
    optionHeight: optionHeight,

    // 儲存選項間距。
    optionGap: optionGap,

    // 儲存按鈕高度。
    buttonHeight: buttonHeight,

    // 儲存標題位置。
    headerY: headerY,

    // 儲存進度位置。
    progressY: progressY,

    // 儲存題目位置。
    questionY: questionY,

    // 儲存選項起始位置。
    optionStartY: optionStartY,

    // 儲存按鈕位置。
    buttonY: buttonY,

    // 儲存目前是否為小螢幕。
    isSmallScreen: isSmallScreen,

    // 儲存目前是否為橫向畫面。
    isLandscape: isLandscape
  };
}

// 繪製測驗標題。
function drawHeader() {
  // 設定標題文字大小。
  textSize(layout.titleSize);

  // 設定標題文字顏色。
  fill("#1d3557");

  // 移除文字外框。
  noStroke();

  // 繪製標題。
  text("p5.js 程式設計簡易指令測驗", width / 2, layout.headerY);

  // 設定進度文字大小。
  textSize(layout.progressSize);

  // 設定進度文字顏色。
  fill("#457b9d");

  // 繪製答題進度。
  text(
    "第 " + (currentQuestion + 1) + " 題 / 共 " + questions.length + " 題",
    width / 2,
    layout.progressY
  );
}

// 繪製目前題目。
function drawQuestion() {
  // 取得目前題目資料。
  const questionData = questions[currentQuestion];

  // 設定題目文字大小。
  textSize(layout.questionSize);

  // 設定題目文字顏色。
  fill("#22223b");

  // 移除文字外框。
  noStroke();

  // 繪製題目文字。
  text(questionData.question, width / 2, layout.questionY);
}

// 取得選項矩形位置。
function getOptionRect(index) {
  // 計算選項基本垂直位置。
  const baseY =
    layout.optionStartY + index * (layout.optionHeight + layout.optionGap);

  // 宣告水平動畫偏移量。
  let offsetX = 0;

  // 宣告垂直動畫偏移量。
  let offsetY = 0;

  // 判斷目前是否為答錯的選項。
  if (
    hasAnswered &&
    selectedOption !== questions[currentQuestion].answer &&
    index === selectedOption
  ) {
    // 讓答錯選項左右移動。
    offsetX = sin(animationTime * 3) * 12;
  }

  // 判斷目前是否為正確答案選項。
  if (hasAnswered && index === questions[currentQuestion].answer) {
    // 讓正確答案上下移動。
    offsetY = sin(animationTime * 4) * 10;
  }

  // 回傳選項矩形資料。
  return {
    // 設定選項水平位置。
    x: (width - layout.contentWidth) / 2 + offsetX,

    // 設定選項垂直位置。
    y: baseY + offsetY,

    // 設定選項寬度。
    width: layout.contentWidth,

    // 設定選項高度。
    height: layout.optionHeight
  };
}

// 取得選項背景顏色。
function getOptionColor(index) {
  // 判斷目前是否尚未作答。
  if (!hasAnswered) {
    // 回傳一般白色。
    return "#ffffff";
  }

  // 判斷目前選項是否為正確答案。
  if (index === questions[currentQuestion].answer) {
    // 回傳指定的正確答案顏色。
    return "#b5e48c";
  }

  // 判斷目前選項是否為使用者選錯的選項。
  if (index === selectedOption) {
    // 回傳指定的錯誤答案顏色。
    return "#e26d5c";
  }

  // 回傳其他選項背景色。
  return "#e9ecef";
}

// 繪製四個選項。
function drawOptions() {
  // 取得目前題目資料。
  const questionData = questions[currentQuestion];

  // 逐一繪製四個選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得目前選項位置。
    const optionRect = getOptionRect(index);

    // 設定選項背景顏色。
    fill(getOptionColor(index));

    // 設定選項外框顏色。
    stroke("#457b9d");

    // 設定外框粗細。
    strokeWeight(2);

    // 繪製選項矩形。
    rect(
      optionRect.x,
      optionRect.y,
      optionRect.width,
      optionRect.height,
      12
    );

    // 設定選項文字大小。
    textSize(layout.optionTextSize);

    // 設定選項文字顏色。
    fill("#1d3557");

    // 移除文字外框。
    noStroke();

    // 組合選項文字。
    const optionText =
      String.fromCharCode(65 + index) + ". " + questionData.options[index];

    // 繪製選項文字。
    text(
      optionText,
      optionRect.x + optionRect.width / 2,
      optionRect.y + optionRect.height / 2
    );
  }
}

// 繪製下一題按鈕。
function drawButton() {
  // 計算按鈕寬度。
  const buttonWidth = min(layout.contentWidth * 0.42, 280);

  // 設定按鈕背景顏色。
  fill(hasAnswered ? "#457b9d" : "#adb5bd");

  // 設定按鈕外框顏色。
  stroke("#1d3557");

  // 設定外框粗細。
  strokeWeight(2);

  // 繪製按鈕。
  rect(
    (width - buttonWidth) / 2,
    layout.buttonY,
    buttonWidth,
    layout.buttonHeight,
    12
  );

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(layout.buttonTextSize);

  // 判斷是否為最後一題。
  const buttonText =
    currentQuestion === questions.length - 1 ? "查看結果" : "下一題";

  // 繪製按鈕文字。
  text(
    buttonText,
    width / 2,
    layout.buttonY + layout.buttonHeight / 2
  );
}

// 繪製結果畫面。
function drawResultScreen() {
  // 設定結果標題大小。
  textSize(constrain(width * 0.06, 30, 58));

  // 設定標題文字顏色。
  fill("#1d3557");

  // 移除文字外框。
  noStroke();

  // 繪製結果標題。
  text("測驗完成！", width / 2, height * 0.25);

  // 設定分數文字大小。
  textSize(constrain(width * 0.042, 24, 42));

  // 設定分數文字顏色。
  fill("#457b9d");

  // 繪製分數。
  text(
    "你答對了 " + score + " / " + questions.length + " 題",
    width / 2,
    height * 0.4
  );

  // 設定鼓勵文字大小。
  textSize(constrain(width * 0.026, 17, 26));

  // 設定鼓勵文字顏色。
  fill("#2a9d8f");

  // 判斷分數是否達到一半以上。
  if (score >= questions.length / 2) {
    // 顯示正向鼓勵文字。
    text("表現不錯，繼續練習 p5.js！", width / 2, height * 0.5);
  } else {
    // 顯示鼓勵文字。
    text("再接再厲，多練習就會進步！", width / 2, height * 0.5);
  }

  // 設定重新開始按鈕寬度。
  const resultButtonWidth = min(layout.contentWidth * 0.5, 280);

  // 設定重新開始按鈕垂直位置。
  const resultButtonY = height * 0.65;

  // 設定按鈕背景顏色。
  fill("#457b9d");

  // 設定按鈕外框顏色。
  stroke("#1d3557");

  // 設定外框粗細。
  strokeWeight(2);

  // 繪製重新開始按鈕。
  rect(
    (width - resultButtonWidth) / 2,
    resultButtonY,
    resultButtonWidth,
    layout.buttonHeight,
    12
  );

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(layout.buttonTextSize);

  // 繪製重新開始文字。
  text("重新開始", width / 2, resultButtonY + layout.buttonHeight / 2);

  // 儲存結果按鈕寬度。
  layout.resultButtonWidth = resultButtonWidth;

  // 儲存結果按鈕位置。
  layout.resultButtonY = resultButtonY;
}

// 處理滑鼠與觸控點擊。
function mousePressed() {
  // 判斷測驗是否已結束。
  if (quizFinished) {
    // 處理重新開始按鈕。
    handleRestartClick();

    // 阻止瀏覽器預設行為。
    return false;
  }

  // 判斷是否尚未作答。
  if (!hasAnswered) {
    // 處理選項點擊。
    handleOptionClick();

    // 阻止瀏覽器預設行為。
    return false;
  }

  // 處理下一題按鈕。
  handleNextClick();

  // 阻止瀏覽器預設行為。
  return false;
}

// 處理選項點擊。
function handleOptionClick() {
  // 取得目前題目資料。
  const questionData = questions[currentQuestion];

  // 逐一檢查所有選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得目前選項區域。
    const optionRect = getOptionRect(index);

    // 判斷滑鼠是否位於選項內。
    const isInside =
      mouseX >= optionRect.x &&
      mouseX <= optionRect.x + optionRect.width &&
      mouseY >= optionRect.y &&
      mouseY <= optionRect.y + optionRect.height;

    // 判斷是否點擊目前選項。
    if (isInside) {
      // 儲存使用者選擇的選項。
      selectedOption = index;

      // 設定目前題目已作答。
      hasAnswered = true;

      // 判斷答案是否正確。
      if (selectedOption === questionData.answer) {
        // 答對題數增加。
        score++;
      }

      // 重設動畫時間。
      animationTime = 0;

      // 結束選項檢查。
      break;
    }
  }
}

// 處理下一題按鈕。
function handleNextClick() {
  // 計算下一題按鈕寬度。
  const buttonWidth = min(layout.contentWidth * 0.42, 280);

  // 判斷滑鼠是否位於下一題按鈕內。
  const isInsideButton =
    mouseX >= (width - buttonWidth) / 2 &&
    mouseX <= (width + buttonWidth) / 2 &&
    mouseY >= layout.buttonY &&
    mouseY <= layout.buttonY + layout.buttonHeight;

  // 判斷是否沒有點擊按鈕。
  if (!isInsideButton) {
    // 結束函式。
    return;
  }

  // 判斷是否為最後一題。
  if (currentQuestion === questions.length - 1) {
    // 設定測驗完成。
    quizFinished = true;

    // 結束函式。
    return;
  }

  // 顯示下一題。
  currentQuestion++;

  // 清除選項選擇。
  selectedOption = -1;

  // 設定為尚未作答。
  hasAnswered = false;

  // 重設動畫時間。
  animationTime = 0;
}

// 處理重新開始按鈕。
function handleRestartClick() {
  // 取得重新開始按鈕寬度。
  const resultButtonWidth = min(layout.contentWidth * 0.5, 280);

  // 判斷滑鼠是否位於重新開始按鈕內。
  const isInsideButton =
    mouseX >= (width - resultButtonWidth) / 2 &&
    mouseX <= (width + resultButtonWidth) / 2 &&
    mouseY >= layout.resultButtonY &&
    mouseY <= layout.resultButtonY + layout.buttonHeight;

  // 判斷是否沒有點擊按鈕。
  if (!isInsideButton) {
    // 結束函式。
    return;
  }

  // 回到第一題。
  currentQuestion = 0;

  // 清除選項選擇。
  selectedOption = -1;

  // 設定為尚未作答。
  hasAnswered = false;

  // 將分數歸零。
  score = 0;

  // 設定測驗尚未結束。
  quizFinished = false;

  // 重設動畫時間。
  animationTime = 0;

  // 重新計算版面配置。
  updateLayout();
}

```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)

### 第一次問 AI

```tex!
設定題庫並抽題顯示題目網頁（CSV 檔案）這個階段的目標： 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
// 設定每次測驗需要抽出的題目數量。
const QUIZ_SIZE = 5;

// 設定 Google Fonts 的繁體中文字型網址。
const GOOGLE_FONT_URL =
  "https://fonts.gstatic.com/s/notosanstc/v40/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz76Cy_Co.ttf";

// 設定字型載入失敗時使用的備用字型。
const FALLBACK_FONT = "sans-serif";

// 宣告 CSV 題庫資料。
let questionBank = [];

// 宣告隨機抽出的測驗題目。
let quizQuestions = [];

// 宣告 CSV 是否載入完成。
let csvLoaded = false;

// 宣告 CSV 是否載入失敗。
let csvLoadFailed = false;

// 宣告 CSV 錯誤訊息。
let csvErrorMessage = "";

// 宣告目前題目索引。
let currentQuestion = 0;

// 宣告使用者選擇的選項索引。
let selectedOption = -1;

// 宣告目前題目是否已作答。
let hasAnswered = false;

// 宣告目前測驗是否結束。
let quizFinished = false;

// 宣告目前答對題數。
let score = 0;

// 宣告動畫時間。
let animationTime = 0;

// 宣告目前使用的字型。
let quizFont = null;

// 宣告字型載入狀態。
let fontStatus = "loading";

// 宣告響應式版面設定。
let layout = {};

// 建立 p5.js 畫布。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 將畫布設定為區塊元素。
  canvas.style("display", "block");

  // 設定文字水平與垂直置中。
  textAlign(CENTER, CENTER);

  // 設定矩形從左上角開始繪製。
  rectMode(CORNER);

  // 先使用備用字型。
  textFont(FALLBACK_FONT);

  // 載入 Google Fonts 繁體中文字型。
  loadFont(GOOGLE_FONT_URL, handleFontLoaded, handleFontError);

  // 載入 questions.csv 題庫。
  loadTable(
    "questions.csv",
    "csv",
    "header",
    handleQuestionsLoaded,
    handleQuestionsLoadError
  );

  // 設定響應式版面。
  updateLayout();
}

// 當 Google Fonts 載入成功時執行。
function handleFontLoaded(loadedFont) {
  // 儲存載入完成的字型。
  quizFont = loadedFont;

  // 更新字型載入狀態。
  fontStatus = "loaded";

  // 套用 Google Fonts 字型。
  textFont(quizFont);
}

// 當 Google Fonts 載入失敗時執行。
function handleFontError(error) {
  // 設定字型載入失敗狀態。
  fontStatus = "error";

  // 使用備用字型。
  textFont(FALLBACK_FONT);

  // 將錯誤資訊顯示在瀏覽器主控台。
  console.warn("Google Fonts 載入失敗，改用備用字型。", error);
}

// 載入 CSV 題庫成功時執行。
function handleQuestionsLoaded(table) {
  // 取得 CSV 所有欄位名稱。
  const columns = table.columns;

  // 設定必要欄位名稱。
  const requiredColumns = [
    "question",
    "optionA",
    "optionB",
    "optionC",
    "optionD",
    "answer"
  ];

  // 檢查每一個必要欄位。
  for (let index = 0; index < requiredColumns.length; index++) {
    // 取得目前欄位名稱。
    const columnName = requiredColumns[index];

    // 判斷目前欄位是否不存在。
    if (!columns.includes(columnName)) {
      // 設定 CSV 錯誤狀態。
      csvLoadFailed = true;

      // 設定 CSV 錯誤訊息。
      csvErrorMessage = "CSV 缺少必要欄位：" + columnName;

      // 結束函式。
      return;
    }
  }

  // 建立暫存的有效題目陣列。
  const validQuestions = [];

  // 逐列讀取 CSV 題目。
  for (let rowIndex = 0; rowIndex < table.getRowCount(); rowIndex++) {
    // 取得目前資料列。
    const row = table.getRow(rowIndex);

    // 取得題目文字。
    const questionText = row.getString("question").trim();

    // 取得第一個選項。
    const optionA = row.getString("optionA").trim();

    // 取得第二個選項。
    const optionB = row.getString("optionB").trim();

    // 取得第三個選項。
    const optionC = row.getString("optionC").trim();

    // 取得第四個選項。
    const optionD = row.getString("optionD").trim();

    // 取得答案字母並轉成大寫。
    const answerLetter = row.getString("answer").trim().toUpperCase();

    // 判斷題目或選項是否有空值。
    if (
      questionText === "" ||
      optionA === "" ||
      optionB === "" ||
      optionC === "" ||
      optionD === ""
    ) {
      // 略過無效資料列。
      continue;
    }

    // 將答案字母轉換成選項索引。
    const answerIndex = "ABCD".indexOf(answerLetter);

    // 判斷答案格式是否正確。
    if (answerIndex < 0) {
      // 略過答案格式錯誤的資料列。
      continue;
    }

    // 將有效題目加入題庫。
    validQuestions.push({
      question: questionText,
      options: [optionA, optionB, optionC, optionD],
      answer: answerIndex
    });
  }

  // 判斷有效題目是否少於五題。
  if (validQuestions.length < QUIZ_SIZE) {
    // 設定 CSV 錯誤狀態。
    csvLoadFailed = true;

    // 設定資料不足的錯誤訊息。
    csvErrorMessage =
      "題庫有效題目只有 " +
      validQuestions.length +
      " 題，至少需要 " +
      QUIZ_SIZE +
      " 題。";

    // 結束函式。
    return;
  }

  // 儲存有效題庫。
  questionBank = validQuestions;

  // 設定 CSV 載入完成。
  csvLoaded = true;

  // 開始第一次隨機測驗。
  startNewQuiz();
}

// 當 CSV 題庫載入失敗時執行。
function handleQuestionsLoadError(error) {
  // 設定 CSV 載入失敗狀態。
  csvLoadFailed = true;

  // 設定錯誤訊息。
  csvErrorMessage =
    "無法載入 questions.csv，請確認檔案與 sketch.js 位於同一個資料夾。";

  // 將錯誤資訊顯示在瀏覽器主控台。
  console.error("CSV 載入失敗。", error);
}

// 開始新的測驗。
function startNewQuiz() {
  // 使用 shuffle 複製並隨機排列題庫。
  const shuffledQuestions = shuffle(questionBank, true);

  // 從隨機題庫中抽出五題。
  quizQuestions = shuffledQuestions.slice(0, QUIZ_SIZE);

  // 回到第一題。
  currentQuestion = 0;

  // 清除選項選擇。
  selectedOption = -1;

  // 設定為尚未作答。
  hasAnswered = false;

  // 將分數歸零。
  score = 0;

  // 設定測驗尚未結束。
  quizFinished = false;

  // 將動畫時間歸零。
  animationTime = 0;
}

// 每一幀執行一次。
function draw() {
  // 套用目前的字型。
  applyQuizFont();

  // 增加動畫時間。
  animationTime += 0.08;

  // 確保畫布大小符合視窗。
  keepCanvasSizeUpdated();

  // 設定背景顏色。
  background("#f7f9fc");

  // 判斷 CSV 是否正在載入。
  if (!csvLoaded && !csvLoadFailed) {
    // 繪製載入畫面。
    drawLoadingScreen();

    // 結束本次繪圖。
    return;
  }

  // 判斷 CSV 是否載入失敗。
  if (csvLoadFailed) {
    // 繪製錯誤畫面。
    drawErrorScreen();

    // 結束本次繪圖。
    return;
  }

  // 判斷測驗是否結束。
  if (quizFinished) {
    // 繪製結果畫面。
    drawResultScreen();

    // 結束本次繪圖。
    return;
  }

  // 繪製標題。
  drawHeader();

  // 繪製題目。
  drawQuestion();

  // 繪製選項。
  drawOptions();

  // 繪製下一題按鈕。
  drawButton();
}

// 套用目前使用的字型。
function applyQuizFont() {
  // 判斷 Google Fonts 是否載入成功。
  if (fontStatus === "loaded" && quizFont !== null) {
    // 使用 Google Fonts 字型。
    textFont(quizFont);
  } else {
    // 使用備用字型。
    textFont(FALLBACK_FONT);
  }
}

// 繪製題庫載入畫面。
function drawLoadingScreen() {
  // 設定標題文字大小。
  textSize(constrain(width * 0.06, 26, 48));

  // 設定文字顏色。
  fill("#1d3557");

  // 移除文字外框。
  noStroke();

  // 顯示載入文字。
  text("正在載入題庫，請稍候……", width / 2, height * 0.42);
}

// 繪製錯誤畫面。
function drawErrorScreen() {
  // 設定錯誤標題文字大小。
  textSize(constrain(width * 0.06, 26, 48));

  // 設定錯誤標題顏色。
  fill("#c1121f");

  // 移除文字外框。
  noStroke();

  // 顯示錯誤標題。
  text("題庫載入失敗", width / 2, height * 0.32);

  // 設定錯誤內容文字大小。
  textSize(constrain(width * 0.035, 16, 25));

  // 設定錯誤內容顏色。
  fill("#495057");

  // 顯示錯誤訊息。
  text(csvErrorMessage, width / 2, height * 0.48);

  // 設定提示文字大小。
  textSize(constrain(width * 0.028, 15, 22));

  // 顯示檔案位置提示。
  text(
    "請確認 questions.csv 與 sketch.js 位於同一個專案資料夾。",
    width / 2,
    height * 0.58
  );
}

// 繪製測驗標題。
function drawHeader() {
  // 設定標題文字大小。
  textSize(layout.titleSize);

  // 設定文字顏色。
  fill("#1d3557");

  // 移除文字外框。
  noStroke();

  // 繪製標題。
  text("p5.js 程式設計簡易指令測驗", width / 2, layout.headerY);

  // 設定進度文字大小。
  textSize(layout.progressSize);

  // 設定進度文字顏色。
  fill("#457b9d");

  // 繪製目前進度。
  text(
    "第 " + (currentQuestion + 1) + " 題 / 共 " + QUIZ_SIZE + " 題",
    width / 2,
    layout.progressY
  );
}

// 繪製目前題目。
function drawQuestion() {
  // 取得目前題目資料。
  const questionData = quizQuestions[currentQuestion];

  // 設定題目文字大小。
  textSize(layout.questionSize);

  // 設定題目文字顏色。
  fill("#22223b");

  // 移除文字外框。
  noStroke();

  // 繪製題目。
  text(questionData.question, width / 2, layout.questionY);
}

// 取得選項位置。
function getOptionRect(index) {
  // 計算選項基本垂直位置。
  const baseY =
    layout.optionStartY + index * (layout.optionHeight + layout.optionGap);

  // 宣告水平位移量。
  let offsetX = 0;

  // 宣告垂直位移量。
  let offsetY = 0;

  // 判斷是否為使用者選錯的選項。
  if (
    hasAnswered &&
    selectedOption !== quizQuestions[currentQuestion].answer &&
    index === selectedOption
  ) {
    // 讓答錯選項左右移動。
    offsetX = sin(animationTime * 3) * 12;
  }

  // 判斷是否為正確答案。
  if (hasAnswered && index === quizQuestions[currentQuestion].answer) {
    // 讓正確答案上下跳動。
    offsetY = sin(animationTime * 4) * 10;
  }

  // 回傳選項區域。
  return {
    x: (width - layout.contentWidth) / 2 + offsetX,
    y: baseY + offsetY,
    width: layout.contentWidth,
    height: layout.optionHeight
  };
}

// 取得選項背景顏色。
function getOptionColor(index) {
  // 判斷是否尚未作答。
  if (!hasAnswered) {
    // 回傳一般背景色。
    return "#ffffff";
  }

  // 判斷是否為正確答案。
  if (index === quizQuestions[currentQuestion].answer) {
    // 回傳正確答案背景色。
    return "#b5e48c";
  }

  // 判斷是否為使用者選錯的選項。
  if (index === selectedOption) {
    // 回傳錯誤答案背景色。
    return "#e26d5c";
  }

  // 回傳其他選項背景色。
  return "#e9ecef";
}

// 繪製四個選項。
function drawOptions() {
  // 取得目前題目資料。
  const questionData = quizQuestions[currentQuestion];

  // 逐一繪製四個選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得選項位置。
    const optionRect = getOptionRect(index);

    // 設定選項背景顏色。
    fill(getOptionColor(index));

    // 設定選項外框。
    stroke("#457b9d");

    // 設定外框粗細。
    strokeWeight(2);

    // 繪製選項矩形。
    rect(
      optionRect.x,
      optionRect.y,
      optionRect.width,
      optionRect.height,
      12
    );

    // 設定選項文字大小。
    textSize(layout.optionTextSize);

    // 設定文字顏色。
    fill("#1d3557");

    // 移除文字外框。
    noStroke();

    // 組合選項文字。
    const optionText =
      String.fromCharCode(65 + index) + ". " + questionData.options[index];

    // 繪製選項文字。
    text(
      optionText,
      optionRect.x + optionRect.width / 2,
      optionRect.y + optionRect.height / 2
    );
  }
}

// 繪製下一題按鈕。
function drawButton() {
  // 計算按鈕寬度。
  const buttonWidth = min(layout.contentWidth * 0.42, 280);

  // 設定按鈕背景顏色。
  fill(hasAnswered ? "#457b9d" : "#adb5bd");

  // 設定按鈕外框。
  stroke("#1d3557");

  // 設定外框粗細。
  strokeWeight(2);

  // 繪製按鈕。
  rect(
    (width - buttonWidth) / 2,
    layout.buttonY,
    buttonWidth,
    layout.buttonHeight,
    12
  );

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(layout.buttonTextSize);

  // 設定按鈕文字內容。
  const buttonText =
    currentQuestion === QUIZ_SIZE - 1 ? "查看結果" : "下一題";

  // 繪製按鈕文字。
  text(
    buttonText,
    width / 2,
    layout.buttonY + layout.buttonHeight / 2
  );
}

// 繪製測驗結果畫面。
function drawResultScreen() {
  // 設定標題文字大小。
  textSize(constrain(width * 0.06, 30, 58));

  // 設定文字顏色。
  fill("#1d3557");

  // 移除文字外框。
  noStroke();

  // 繪製結果標題。
  text("測驗完成！", width / 2, height * 0.25);

  // 設定分數文字大小。
  textSize(constrain(width * 0.042, 24, 42));

  // 設定分數文字顏色。
  fill("#457b9d");

  // 顯示答對題數。
  text(
    "你答對了 " + score + " / " + QUIZ_SIZE + " 題",
    width / 2,
    height * 0.4
  );

  // 設定鼓勵文字大小。
  textSize(constrain(width * 0.026, 17, 26));

  // 設定鼓勵文字顏色。
  fill("#2a9d8f");

  // 判斷分數是否達到一半以上。
  if (score >= QUIZ_SIZE / 2) {
    // 顯示正向鼓勵文字。
    text("表現不錯，繼續練習 p5.js！", width / 2, height * 0.5);
  } else {
    // 顯示鼓勵文字。
    text("再接再厲，多練習就會進步！", width / 2, height * 0.5);
  }

  // 設定結果按鈕寬度。
  const resultButtonWidth = min(layout.contentWidth * 0.5, 280);

  // 設定結果按鈕垂直位置。
  const resultButtonY = height * 0.65;

  // 設定按鈕背景色。
  fill("#457b9d");

  // 設定按鈕外框色。
  stroke("#1d3557");

  // 設定外框粗細。
  strokeWeight(2);

  // 繪製重新開始按鈕。
  rect(
    (width - resultButtonWidth) / 2,
    resultButtonY,
    resultButtonWidth,
    layout.buttonHeight,
    12
  );

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(layout.buttonTextSize);

  // 繪製重新開始文字。
  text("重新開始", width / 2, resultButtonY + layout.buttonHeight / 2);

  // 儲存結果按鈕寬度。
  layout.resultButtonWidth = resultButtonWidth;

  // 儲存結果按鈕位置。
  layout.resultButtonY = resultButtonY;
}

// 當瀏覽器視窗大小改變時執行。
function windowResized() {
  // 重新設定畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算響應式版面。
  updateLayout();
}

// 計算響應式版面。
function updateLayout() {
  // 判斷是否為小螢幕。
  const isSmallScreen = width < 480;

  // 判斷是否為橫向畫面。
  const isLandscape = width > height;

  // 計算左右邊界。
  const horizontalPadding = constrain(width * 0.06, 16, 80);

  // 計算內容寬度。
  const contentWidth = min(width - horizontalPadding * 2, 900);

  // 計算標題文字大小。
  const titleSize = isSmallScreen
    ? constrain(width * 0.052, 20, 28)
    : constrain(width * 0.042, 24, 42);

  // 計算進度文字大小。
  const progressSize = isSmallScreen
    ? constrain(width * 0.035, 14, 18)
    : constrain(width * 0.022, 16, 22);

  // 計算題目文字大小。
  const questionSize = isSmallScreen
    ? constrain(width * 0.042, 17, 22)
    : constrain(width * 0.027, 18, 28);

  // 計算選項文字大小。
  const optionTextSize = isSmallScreen
    ? constrain(width * 0.038, 15, 19)
    : constrain(width * 0.022, 16, 23);

  // 計算按鈕文字大小。
  const buttonTextSize = isSmallScreen
    ? constrain(width * 0.038, 15, 19)
    : constrain(width * 0.022, 16, 22);

  // 計算選項高度。
  const optionHeight = isSmallScreen
    ? constrain(height * 0.07, 48, 60)
    : constrain(height * 0.075, 50, 70);

  // 計算選項間距。
  const optionGap = isSmallScreen
    ? constrain(height * 0.012, 8, 12)
    : constrain(height * 0.018, 10, 18);

  // 計算按鈕高度。
  const buttonHeight = isSmallScreen
    ? constrain(height * 0.075, 48, 60)
    : constrain(height * 0.07, 48, 64);

  // 計算標題位置。
  const headerY = isLandscape ? height * 0.08 : height * 0.075;

  // 計算進度位置。
  const progressY = isLandscape ? height * 0.17 : height * 0.145;

  // 計算題目位置。
  const questionY = isLandscape ? height * 0.27 : height * 0.245;

  // 計算選項起始位置。
  let optionStartY = isLandscape ? height * 0.37 : height * 0.35;

  // 計算四個選項的總高度。
  const optionsTotalHeight = optionHeight * 4 + optionGap * 3;

  // 計算按鈕與選項的距離。
  const buttonGap = isSmallScreen ? 18 : 26;

  // 計算按鈕位置。
  let buttonY = optionStartY + optionsTotalHeight + buttonGap;

  // 判斷直向手機是否超出高度。
  if (!isLandscape && buttonY + buttonHeight > height * 0.94) {
    // 計算需要上移的距離。
    const correction = buttonY + buttonHeight - height * 0.94;

    // 將選項區域往上移動。
    optionStartY -= correction;

    // 將按鈕往上移動。
    buttonY -= correction;
  }

  // 儲存所有版面資料。
  layout = {
    contentWidth: contentWidth,
    titleSize: titleSize,
    progressSize: progressSize,
    questionSize: questionSize,
    optionTextSize: optionTextSize,
    buttonTextSize: buttonTextSize,
    optionHeight: optionHeight,
    optionGap: optionGap,
    buttonHeight: buttonHeight,
    headerY: headerY,
    progressY: progressY,
    questionY: questionY,
    optionStartY: optionStartY,
    buttonY: buttonY
  };
}

// 處理滑鼠與觸控點擊。
function mousePressed() {
  // 判斷題庫是否尚未載入。
  if (!csvLoaded) {
    // 不處理點擊事件。
    return false;
  }

  // 判斷測驗是否結束。
  if (quizFinished) {
    // 處理重新開始按鈕。
    handleRestartClick();

    // 阻止瀏覽器預設行為。
    return false;
  }

  // 判斷目前是否尚未作答。
  if (!hasAnswered) {
    // 處理選項點擊。
    handleOptionClick();

    // 阻止瀏覽器預設行為。
    return false;
  }

  // 處理下一題按鈕。
  handleNextClick();

  // 阻止瀏覽器預設行為。
  return false;
}

// 處理選項點擊。
function handleOptionClick() {
  // 取得目前題目資料。
  const questionData = quizQuestions[currentQuestion];

  // 逐一檢查所有選項。
  for (let index = 0; index < questionData.options.length; index++) {
    // 取得選項區域。
    const optionRect = getOptionRect(index);

    // 判斷滑鼠是否在選項範圍內。
    const isInside =
      mouseX >= optionRect.x &&
      mouseX <= optionRect.x + optionRect.width &&
      mouseY >= optionRect.y &&
      mouseY <= optionRect.y + optionRect.height;

    // 判斷是否點擊目前選項。
    if (isInside) {
      // 記錄使用者選項。
      selectedOption = index;

      // 設定題目已作答。
      hasAnswered = true;

      // 判斷答案是否正確。
      if (selectedOption === questionData.answer) {
        // 增加答對題數。
        score++;
      }

      // 重設動畫時間。
      animationTime = 0;

      // 結束迴圈。
      break;
    }
  }
}

// 處理下一題按鈕。
function handleNextClick() {
  // 計算按鈕寬度。
  const buttonWidth = min(layout.contentWidth * 0.42, 280);

  // 判斷是否點擊按鈕。
  const isInsideButton =
    mouseX >= (width - buttonWidth) / 2 &&
    mouseX <= (width + buttonWidth) / 2 &&
    mouseY >= layout.buttonY &&
    mouseY <= layout.buttonY + layout.buttonHeight;

  // 判斷沒有點擊按鈕。
  if (!isInsideButton) {
    // 結束函式。
    return;
  }

  // 判斷是否為最後一題。
  if (currentQuestion === QUIZ_SIZE - 1) {
    // 設定測驗結束。
    quizFinished = true;

    // 結束函式。
    return;
  }

  // 前往下一題。
  currentQuestion++;

  // 清除選項。
  selectedOption = -1;

  // 設定為尚未作答。
  hasAnswered = false;

  // 重設動畫時間。
  animationTime = 0;
}

// 處理重新開始按鈕。
function handleRestartClick() {
  // 計算結果按鈕寬度。
  const resultButtonWidth = min(layout.contentWidth * 0.5, 280);

  // 判斷是否點擊重新開始按鈕。
  const isInsideButton =
    mouseX >= (width - resultButtonWidth) / 2 &&
    mouseX <= (width + resultButtonWidth) / 2 &&
    mouseY >= layout.resultButtonY &&
    mouseY <= layout.resultButtonY + layout.buttonHeight;

  // 判斷沒有點擊按鈕。
  if (!isInsideButton) {
    // 結束函式。
    return;
  }

  // 重新隨機抽出五題。
  startNewQuiz();

  // 重新計算版面。
  updateLayout();
}

```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
