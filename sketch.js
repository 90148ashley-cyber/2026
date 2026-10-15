// sketch.js
// 這是目前的 JavaScript 程式檔案名稱。

// p5.js Quiz System
// 這是一個使用 p5.js 製作的選擇題測驗系統。

// 中文：Noto Sans TC
// 中文文字預計使用 Noto Sans TC 字型。

// 英文與數字：Isometra
// 英文文字與數字預計使用 Isometra 字型。


// 建立題目陣列，用來儲存所有測驗題目。
let questions = [
  {
    // 第一題的題目文字。
    question: "下列哪一項是 p5.js 的主要用途？",

    // 第一題的四個選項。
    options: [
      "製作互動式視覺作品",
      "建立資料庫",
      "編輯文字檔案",
      "管理作業系統"
    ],

    // 正確答案的索引值。
    // 索引從 0 開始，所以 0 代表第一個選項。
    answer: 0
  },

  {
    // 第二題的題目文字。
    question: "p5.js 中負責初始化程式的函式是哪一個？",

    // 第二題的四個選項。
    options: [
      "draw()",
      "setup()",
      "start()",
      "init()"
    ],

    // 正確答案是第二個選項。
    // 因為陣列索引從 0 開始，所以第二個選項是 1。
    answer: 1
  },

  {
    // 第三題的題目文字。
    question: "p5.js 中會持續重複執行的函式是哪一個？",

    // 第三題的四個選項。
    options: [
      "loop()",
      "repeat()",
      "draw()",
      "update()"
    ],

    // 正確答案是第三個選項。
    // 第三個選項的索引值是 2。
    answer: 2
  }
];


// currentQuestion 用來記錄目前顯示第幾題。
// 0 代表第一題。
let currentQuestion = 0;

// score 用來記錄使用者目前答對的題數。
let score = 0;

// selectedAnswer 用來記錄使用者選擇的答案索引。
// -1 表示目前尚未選擇答案。
let selectedAnswer = -1;

// answered 用來判斷目前題目是否已經作答。
// false 表示尚未作答，true 表示已經作答。
let answered = false;

// quizFinished 用來判斷測驗是否已經結束。
let quizFinished = false;


// 記錄答題動畫開始的時間。
let answerAnimationStart = 0;

// 記錄下一題按鈕動畫開始的時間。
let nextButtonAnimationStart = 0;

// 記錄上一次觸控事件的時間。
// 用來避免手機同時觸發 touchStarted() 與 mousePressed()。
let lastTouchTime = 0;


// 建立顏色常數物件，集中管理整個測驗系統的顏色。
const COLORS = {
  // 網頁背景顏色。
  background: "#F5F7FA",

  // 題目與結果面板的背景顏色。
  panel: "#FFFFFF",

  // 主要文字顏色。
  primary: "#243B53",

  // 次要文字顏色。
  secondary: "#486581",

  // 邊框顏色。
  border: "#D9E2EC",

  // 尚未選擇答案時的選項背景顏色。
  option: "#F0F4F8",

  // 滑鼠移到選項上方時的背景顏色。
  optionHover: "#E1EAF2",

  // 答對時的背景顏色。
  correct: "#D8F3DC",

  // 答對時的文字顏色。
  correctText: "#237A3B",

  // 答錯時的背景顏色。
  wrong: "#FFE0E0",

  // 答錯時的文字顏色。
  wrongText: "#B42318",

  // 按鈕的基本顏色。
  button: "#2F80ED",

  // 滑鼠移到按鈕上方時的顏色。
  buttonHover: "#1769D1",

  // 白色。
  white: "#FFFFFF"
};


// setup() 只會在程式開始時執行一次。
function setup() {
  // 建立一個與瀏覽器視窗一樣大的畫布。
  const canvas = createCanvas(windowWidth, windowHeight);

  // 將畫布放入網頁的 body 元素中。
  canvas.parent(document.body);

  // 讓 canvas 以區塊元素顯示。
  canvas.elt.style.display = "block";

  // 停止瀏覽器預設的觸控滑動行為。
  canvas.elt.style.touchAction = "none";

  // 設定 body 的外距為 0。
  document.body.style.margin = "0";

  // 設定 body 的內距為 0。
  document.body.style.padding = "0";

  // 隱藏瀏覽器捲軸，避免畫面出現捲動。
  document.body.style.overflow = "hidden";

  // 設定網頁 body 的背景顏色。
  document.body.style.backgroundColor = COLORS.background;

  // 設定預設字型為 Noto Sans TC。
  // 中文內容會使用這個字型。
  textFont("Noto Sans TC");

  // 設定文字的水平與垂直對齊方式皆為置中。
  textAlign(CENTER, CENTER);

  // 設定矩形的繪製方式從左上角開始計算。
  rectMode(CORNER);
}


// draw() 會在 p5.js 中持續重複執行。
function draw() {
  // 使用背景色清除上一個畫面。
  background(COLORS.background);

  // 如果測驗已經結束，就繪製結果畫面。
  if (quizFinished) {
    drawResultScreen();

    // 結束本次 draw()，避免繼續繪製題目畫面。
    return;
  }

  // 取得目前畫面的版面配置。
  const layout = getLayout();

  // 繪製頁面標題與題數資訊。
  drawHeader(layout);

  // 繪製目前的題目。
  drawQuestion(layout);

  // 繪製目前題目的選項。
  drawOptions(layout);

  // 只有作答完成後，才顯示下一題按鈕。
  if (answered) {
    drawNextButton(layout);
  }
}


// 當瀏覽器視窗尺寸改變時會執行。
function windowResized() {
  // 重新調整畫布大小，使畫布符合新的視窗尺寸。
  resizeCanvas(windowWidth, windowHeight);
}


// 計算所有畫面元件的位置與尺寸。
function getLayout() {
  // 如果畫面寬度小於 600px，就視為手機版面。
  const isMobile = width < 600;

  // 設定畫面左右邊界的距離。
  // 手機使用較小邊距，電腦使用較大邊距。
  const margin = isMobile ? 20 : 60;

  // 計算主要內容區域的寬度。
  // 最大寬度限制為 900px。
  const contentWidth = min(width - margin * 2, 900);

  // 設定標題區域的高度。
  const headerHeight = isMobile ? 90 : 120;

  // 計算題目方框的 Y 座標。
  const questionY = headerHeight + 20;

  // 設定題目方框的高度。
  const questionHeight = isMobile ? 150 : 170;

  // 設定選項之間的間距。
  const optionGap = isMobile ? 12 : 18;

  // 設定每一個選項的高度。
  const optionHeight = isMobile ? 62 : 72;

  // 計算選項區域的起始 Y 座標。
  const optionsY = questionY + questionHeight + 24;

  // 設定下一題按鈕的寬度。
  const nextWidth = isMobile ? 180 : 220;

  // 設定下一題按鈕的高度。
  const nextHeight = isMobile ? 54 : 62;

  // 計算下一題按鈕的 Y 座標。
  const nextY = height - nextHeight - (isMobile ? 24 : 40);

  // 回傳整個版面的資料。
  return {
    // 回傳目前是否為手機版。
    isMobile,

    // 回傳畫面邊界距離。
    margin,

    // 回傳內容區域寬度。
    contentWidth,

    // 回傳標題區域高度。
    headerHeight,

    // 設定題目方框的位置與大小。
    question: {
      // 讓題目方框水平置中。
      x: (width - contentWidth) / 2,

      // 題目方框的垂直位置。
      y: questionY,

      // 題目方框的寬度。
      width: contentWidth,

      // 題目方框的高度。
      height: questionHeight
    },

    // 根據每個選項建立選項版面資料。
    options: questions[currentQuestion].options.map((option, index) => {
      // 計算選項所在的欄位。
      // index % 2 的結果會是 0 或 1。
      const column = index % 2;

      // 計算選項所在的列。
      const row = floor(index / 2);

      // 如果是手機版，所有選項改為單欄排列。
      if (isMobile) {
        // 回傳手機版選項的座標與大小。
        return {
          // 選項水平置中。
          x: (width - contentWidth) / 2,

          // 根據選項索引計算垂直位置。
          y: optionsY + index * (optionHeight + optionGap),

          // 選項寬度等於內容區域寬度。
          width: contentWidth,

          // 選項高度。
          height: optionHeight
        };
      }

      // 電腦版將內容分成兩欄。
      const columnWidth = (contentWidth - optionGap) / 2;

      // 回傳電腦版選項的座標與大小。
      return {
        // 根據欄位位置計算選項的 X 座標。
        x:
          (width - contentWidth) / 2 +
          column * (columnWidth + optionGap),

        // 根據列的位置計算選項的 Y 座標。
        y: optionsY + row * (optionHeight + optionGap),

        // 設定選項寬度。
        width: columnWidth,

        // 設定選項高度。
        height: optionHeight
      };
    }),

    // 設定下一題按鈕的位置與大小。
    nextButton: {
      // 讓按鈕水平置中。
      x: (width - nextWidth) / 2,

      // 設定按鈕的垂直位置。
      y: nextY,

      // 設定按鈕寬度。
      width: nextWidth,

      // 設定按鈕高度。
      height: nextHeight
    }
  };
}


// 繪製頁面上方的標題與題數資訊。
function drawHeader(layout) {
  // 設定標題的文字顏色。
  fill(COLORS.primary);

  // 關閉外框線。
  noStroke();

  // 英文標題使用 Isometra 字型。
  textFont("Isometra");

  // 根據畫面是否為手機設定標題大小。
  textSize(layout.isMobile ? 26 : 34);

  // 繪製英文標題。
  text("QUIZ SYSTEM", width / 2, 32);

  // 中文題數資訊使用 Noto Sans TC 字型。
  textFont("Noto Sans TC");

  // 設定題數文字大小。
  textSize(layout.isMobile ? 14 : 17);

  // 設定題數文字顏色。
  fill(COLORS.secondary);

  // 顯示目前題數與總題數。
  text(
    `第 ${currentQuestion + 1} 題 / 共 ${questions.length} 題`,
    width / 2,
    layout.isMobile ? 68 : 82
  );
}


// 繪製題目方框與題目文字。
function drawQuestion(layout) {
  // 取得題目方框的版面資料。
  const box = layout.question;

  // 取得目前題目的文字。
  const question = questions[currentQuestion].question;

  // 繪製圓角題目面板。
  drawRoundedPanel(box.x, box.y, box.width, box.height);

  // 設定題目文字顏色。
  fill(COLORS.primary);

  // 中文題目使用 Noto Sans TC 字型。
  textFont("Noto Sans TC");

  // 根據畫面大小設定題目文字尺寸。
  textSize(layout.isMobile ? 20 : 25);

  // 設定題目文字的行距。
  textLeading(layout.isMobile ? 32 : 38);

  // 在題目方框中繪製題目文字。
  text(
    question,
    box.x + 24,
    box.y + 20,
    box.width - 48,
    box.height - 40
  );
}


// 繪製所有選項。
function drawOptions(layout) {
  // 取得目前題目的選項陣列。
  const options = questions[currentQuestion].options;

  // 逐一處理每個選項。
  options.forEach((option, index) => {
    // 取得目前選項的版面資料。
    const box = layout.options[index];

    // 判斷目前選項是否為使用者選取的選項。
    const isSelected = selectedAnswer === index;

    // 判斷目前選項是否為正確答案。
    const isCorrect = index === questions[currentQuestion].answer;

    // 設定選項預設背景顏色。
    let fillColor = COLORS.option;

    // 設定選項預設文字顏色。
    let textColor = COLORS.primary;

    // 如果已作答且目前選項是正確答案，
    // 就使用答對的綠色樣式。
    if (answered && isCorrect) {
      fillColor = COLORS.correct;
      textColor = COLORS.correctText;
    }

    // 如果已作答、目前選項是使用者選擇的答案，
    // 且這個答案不是正確答案，就使用答錯的紅色樣式。
    if (answered && isSelected && !isCorrect) {
      fillColor = COLORS.wrong;
      textColor = COLORS.wrongText;
    }

    // 如果尚未作答，且滑鼠目前位於選項上方，
    // 就變更選項背景顏色。
    if (!answered && isPointInside(mouseX, mouseY, box)) {
      fillColor = COLORS.optionHover;
    }

    // 如果使用者答錯，讓錯誤選項產生左右震動效果。
    if (answered && isSelected && !isCorrect) {
      // 計算從答題開始到現在經過的時間。
      const elapsed = millis() - answerAnimationStart;

      // 根據時間計算水平震動距離。
      const shake = sin(elapsed * 0.04) * max(0, 8 - elapsed / 100);

      // 繪製帶有震動位移的選項。
      drawOption(box, option, fillColor, textColor, shake);
    } else {
      // 一般情況下不產生水平位移。
      drawOption(box, option, fillColor, textColor, 0);
    }
  });
}


// 繪製單一選項。
function drawOption(box, option, fillColor, textColor, offsetX) {
  // 儲存目前的繪圖狀態。
  push();

  // 將選項水平移動指定的距離。
  translate(offsetX, 0);

  // 設定選項背景顏色。
  fill(fillColor);

  // 設定選項邊框顏色。
  stroke(COLORS.border);

  // 設定邊框粗細。
  strokeWeight(2);

  // 繪製圓角選項方框。
  roundedRect(box.x, box.y, box.width, box.height, 14);

  // 設定選項文字顏色。
  fill(textColor);

  // 關閉文字外框。
  noStroke();

  // 中文選項使用 Noto Sans TC 字型。
  textFont("Noto Sans TC");

  // 根據選項寬度設定文字大小。
  textSize(box.width < 350 ? 16 : 19);

  // 繪製選項文字。
  text(option, box.x + 20, box.y, box.width - 40, box.height);

  // 還原之前儲存的繪圖狀態。
  pop();
}


// 繪製下一題按鈕。
function drawNextButton(layout) {
  // 取得下一題按鈕的版面資料。
  const button = layout.nextButton;

  // 預設使用按鈕基本顏色。
  let buttonColor = COLORS.button;

  // 如果滑鼠位於按鈕上方，就使用按鈕滑過顏色。
  if (isPointInside(mouseX, mouseY, button)) {
    buttonColor = COLORS.buttonHover;
  }

  // 計算從按鈕動畫開始到現在經過的時間。
  const elapsed = millis() - nextButtonAnimationStart;

  // 計算按鈕的縮放比例。
  const scaleValue = answered
    ? 1 + min(0.03, max(0, elapsed / 1000) * 0.03)
    : 1;

  // 儲存目前的繪圖狀態。
  push();

  // 將繪圖原點移動到按鈕中心。
  translate(
    button.x + button.width / 2,
    button.y + button.height / 2
  );

  // 依照計算出的比例放大或縮小按鈕。
  scale(scaleValue);

  // 設定按鈕背景顏色。
  fill(buttonColor);

  // 關閉按鈕外框線。
  noStroke();

  // 從中心位置繪製圓角按鈕。
  roundedRect(
    -button.width / 2,
    -button.height / 2,
    button.width,
    button.height,
    14
  );

  // 設定按鈕文字為白色。
  fill(COLORS.white);

  // 按鈕中的中文使用 Noto Sans TC 字型。
  textFont("Noto Sans TC");

  // 根據畫面大小設定按鈕文字大小。
  textSize(layout.isMobile ? 17 : 20);

  // 如果是最後一題，顯示「查看結果」，
  // 否則顯示「下一題」。
  const buttonText =
    currentQuestion === questions.length - 1
      ? "查看結果"
      : "下一題";

  // 繪製按鈕文字。
  text(buttonText, 0, 0);

  // 還原繪圖狀態。
  pop();
}


// 繪製測驗完成後的結果畫面。
function drawResultScreen() {
  // 判斷目前是否為手機版面。
  const isMobile = width < 600;

  // 設定結果面板寬度。
  const panelWidth = min(width - 40, 620);

  // 設定結果面板高度。
  const panelHeight = isMobile ? 390 : 430;

  // 計算結果面板的 X 座標，使其水平置中。
  const panelX = (width - panelWidth) / 2;

  // 計算結果面板的 Y 座標，使其垂直置中。
  const panelY = (height - panelHeight) / 2;

  // 繪製結果面板。
  drawRoundedPanel(panelX, panelY, panelWidth, panelHeight);

  // 設定英文標題顏色。
  fill(COLORS.primary);

  // 英文結果標題使用 Isometra 字型。
  textFont("Isometra");

  // 根據畫面大小設定結果標題字體大小。
  textSize(isMobile ? 34 : 48);

  // 繪製 RESULT 標題。
  text("RESULT", width / 2, panelY + 70);

  // 設定中文結果文字顏色。
  fill(COLORS.secondary);

  // 中文結果文字使用 Noto Sans TC 字型。
  textFont("Noto Sans TC");

  // 設定結果文字大小。
  textSize(isMobile ? 20 : 25);

  // 顯示測驗完成訊息。
  text("測驗完成！", width / 2, panelY + 135);

  // 設定分數文字顏色。
  fill(COLORS.button);

  // 分數中的英文與數字使用 Isometra 字型。
  textFont("Isometra");

  // 根據畫面大小設定分數文字大小。
  textSize(isMobile ? 48 : 64);

  // 顯示目前分數與總題數。
  text(`${score} / ${questions.length}`, width / 2, panelY + 215);

  // 設定答對題數文字顏色。
  fill(COLORS.secondary);

  // 中文文字使用 Noto Sans TC 字型。
  textFont("Noto Sans TC");

  // 設定答對題數文字大小。
  textSize(isMobile ? 16 : 19);

  // 顯示答對幾題。
  text(`答對 ${score} 題`, width / 2, panelY + 270);

  // 設定重新開始按鈕的寬度。
  const buttonWidth = isMobile ? 180 : 220;

  // 設定重新開始按鈕的高度。
  const buttonHeight = 58;

  // 計算重新開始按鈕的 X 座標。
  const buttonX = (width - buttonWidth) / 2;

  // 計算重新開始按鈕的 Y 座標。
  const buttonY = panelY + panelHeight - 90;

  // 設定重新開始按鈕背景顏色。
  fill(COLORS.button);

  // 關閉按鈕外框。
  noStroke();

  // 繪製重新開始按鈕。
  roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 14);

  // 設定按鈕文字顏色為白色。
  fill(COLORS.white);

  // 設定按鈕中文字型。
  textFont("Noto Sans TC");

  // 設定按鈕文字大小。
  textSize(18);

  // 繪製重新開始文字。
  text(
    "重新開始",
    width / 2,
    buttonY + buttonHeight / 2
  );
}


// 當使用者按下滑鼠時執行。
function mousePressed() {
  // 將滑鼠座標傳給統一的輸入處理函式。
  handleInput(mouseX, mouseY);

  // 回傳 false，避免瀏覽器執行預設行為。
  return false;
}


// 當使用者觸碰手機或平板螢幕時執行。
function touchStarted() {
  // 取得目前時間。
  const now = millis();

  // 如果距離上次觸控不到 500 毫秒，
  // 就忽略這次事件，避免重複觸發。
  if (now - lastTouchTime < 500) {
    return false;
  }

  // 記錄這次觸控事件的時間。
  lastTouchTime = now;

  // 如果有偵測到至少一個觸控點，就處理第一個觸控點。
  if (touches.length > 0) {
    handleInput(touches[0].x, touches[0].y);
  }

  // 阻止瀏覽器執行預設觸控行為。
  return false;
}


// 統一處理滑鼠與觸控輸入。
function handleInput(x, y) {
  // 如果測驗已結束，就處理結果畫面的操作。
  if (quizFinished) {
    handleResultInput(x, y);

    // 結束函式。
    return;
  }

  // 如果目前題目已經作答。
  if (answered) {
    // 取得目前版面配置。
    const layout = getLayout();

    // 如果使用者點擊下一題按鈕，就前往下一題。
    if (isPointInside(x, y, layout.nextButton)) {
      goToNextQuestion();
    }

    // 作答後不再處理選項點擊。
    return;
  }

  // 取得目前版面配置。
  const layout = getLayout();

  // 逐一檢查使用者點擊的是哪一個選項。
  for (let i = 0; i < layout.options.length; i++) {
    // 如果點擊位置位於目前選項內。
    if (isPointInside(x, y, layout.options[i])) {
      // 記錄使用者選擇的答案。
      selectAnswer(i);

      // 找到選項後結束迴圈與函式。
      return;
    }
  }
}


// 處理使用者選擇答案的動作。
function selectAnswer(index) {
  // 如果已經作答，就不再重複處理。
  if (answered) {
    return;
  }

  // 儲存使用者選擇的答案索引。
  selectedAnswer = index;

  // 將作答狀態設定為已完成。
  answered = true;

  // 記錄答題動畫開始時間。
  answerAnimationStart = millis();

  // 記錄下一題按鈕動畫開始時間。
  nextButtonAnimationStart = millis();

  // 如果使用者選擇的答案等於正確答案。
  if (index === questions[currentQuestion].answer) {
    // 分數加一。
    score++;
  }
}


// 前往下一題或顯示結果畫面。
function goToNextQuestion() {
  // 如果目前已經是最後一題。
  if (currentQuestion >= questions.length - 1) {
    // 將測驗完成狀態設定為 true。
    quizFinished = true;

    // 結束函式。
    return;
  }

  // 題目索引加一，前往下一題。
  currentQuestion++;

  // 清除上一題的選項選擇狀態。
  selectedAnswer = -1;

  // 將作答狀態重設為尚未作答。
  answered = false;

  // 重設答題動畫開始時間。
  answerAnimationStart = 0;

  // 重設下一題按鈕動畫開始時間。
  nextButtonAnimationStart = 0;
}


// 處理結果畫面的使用者輸入。
function handleResultInput(x, y) {
  // 判斷是否為手機版。
  const isMobile = width < 600;

  // 計算結果面板寬度。
  const panelWidth = min(width - 40, 620);

  // 計算結果面板高度。
  const panelHeight = isMobile ? 390 : 430;

  // 計算結果面板的 X 座標。
  const panelX = (width - panelWidth) / 2;

  // 計算結果面板的 Y 座標。
  const panelY = (height - panelHeight) / 2;

  // 設定重新開始按鈕寬度。
  const buttonWidth = isMobile ? 180 : 220;

  // 設定重新開始按鈕高度。
  const buttonHeight = 58;

  // 計算重新開始按鈕的 X 座標。
  const buttonX = (width - buttonWidth) / 2;

  // 計算重新開始按鈕的 Y 座標。
  const buttonY = panelY + panelHeight - 90;

  // 建立重新開始按鈕的範圍資料。
  const restartButton = {
    // 按鈕左側 X 座標。
    x: buttonX,

    // 按鈕上方 Y 座標。
    y: buttonY,

    // 按鈕寬度。
    width: buttonWidth,

    // 按鈕高度。
    height: buttonHeight
  };

  // 如果使用者點擊重新開始按鈕。
  if (isPointInside(x, y, restartButton)) {
    // 重新設定測驗。
    restartQuiz();
  }
}


// 將測驗所有狀態恢復到初始值。
function restartQuiz() {
  // 回到第一題。
  currentQuestion = 0;

  // 將分數歸零。
  score = 0;

  // 清除已選擇的答案。
  selectedAnswer = -1;

  // 設定為尚未作答。
  answered = false;

  // 設定測驗尚未結束。
  quizFinished = false;

  // 重設答題動畫時間。
  answerAnimationStart = 0;

  // 重設下一題按鈕動畫時間。
  nextButtonAnimationStart = 0;
}


// 判斷某個座標是否位於指定方框內。
function isPointInside(x, y, box) {
  // 判斷 X 座標是否在方框的左右範圍內，
  // 並且 Y 座標是否在方框的上下範圍內。
  return (
    x >= box.x &&
    x <= box.x + box.width &&
    y >= box.y &&
    y <= box.y + box.height
  );
}


// 繪製一般的圓角面板。
function drawRoundedPanel(x, y, w, h) {
  // 設定面板背景顏色。
  fill(COLORS.panel);

  // 設定面板邊框顏色。
  stroke(COLORS.border);

  // 設定面板邊框粗細。
  strokeWeight(2);

  // 繪製圓角矩形面板。
  roundedRect(x, y, w, h, 18);
}


// 繪製圓角矩形。
function roundedRect(x, y, w, h, radius) {
  // 使用 p5.js 的 rect() 函式繪製圓角矩形。
  rect(x, y, w, h, radius);
}