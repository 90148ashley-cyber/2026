// sketch.js
// p5.js Quiz System：從 questions.csv 載入 15 題，每次隨機抽出 5 題。
// 中文使用 Noto Sans TC；英文與數字使用 Isometra。

// -----------------------------
// 全域變數：題庫與測驗狀態
// -----------------------------

// preload() 載入的 CSV Table 物件。
let questionTable;

// 從 CSV 轉換完成的完整題庫，共預期 15 題。
let questions = [];

// 本次測驗實際抽出的題目，共 5 題。
let quizQuestions = [];

// 每次測驗要抽出的題數。
const QUIZ_SIZE = 5;

// 目前顯示的是本次測驗的第幾題，0 代表第一題。
let currentQuestion = 0;

// 目前答對的題數。
let score = 0;

// 使用者選擇的選項索引，-1 代表尚未作答。
let selectedAnswer = -1;

// 目前題目是否已經作答。
let answered = false;

// 本次測驗是否已完成。
let quizFinished = false;

// 題庫是否已準備完成。
let quizReady = false;

// 如果 CSV 載入或格式檢查失敗，將錯誤訊息放在這裡。
let dataLoadError = "";

// 答錯選項震動動畫的開始時間。
let answerAnimationStart = 0;

// 下一題按鈕動畫的開始時間。
let nextButtonAnimationStart = 0;

// 記錄最後一次觸控時間，避免觸控與滑鼠事件重複觸發。
let lastTouchTime = 0;

// 集中管理畫面顏色，方便日後修改。
const COLORS = {
  background: "#F5F7FA",
  panel: "#FFFFFF",
  primary: "#243B53",
  secondary: "#486581",
  border: "#D9E2EC",
  option: "#F0F4F8",
  optionHover: "#E1EAF2",
  correct: "#D8F3DC",
  correctText: "#237A3B",
  wrong: "#FFE0E0",
  wrongText: "#B42318",
  button: "#2F80ED",
  buttonHover: "#1769D1",
  white: "#FFFFFF"
};


// -----------------------------
// 載入與整理 CSV 題庫
// -----------------------------

// preload() 會在 setup() 前執行，適合載入外部檔案。
function preload() {
  // 檔名必須是 questions.csv，且要和 index.html 放在同一層資料夾。
  // header 表示 CSV 第一列是欄位名稱，而不是題目資料。
  questionTable = loadTable("questions.csv", "csv", "header");
}

// setup() 只會在程式開始時執行一次。
function setup() {
  // 建立符合瀏覽器視窗大小的 p5.js 畫布。
  const canvas = createCanvas(windowWidth, windowHeight);

  // 將畫布加入網頁 body。
  canvas.parent(document.body);

  // 讓 canvas 以區塊方式顯示，避免下方出現多餘空白。
  canvas.elt.style.display = "block";

  // 停止手機瀏覽器對 canvas 的預設滑動或縮放行為。
  canvas.elt.style.touchAction = "none";

  // 設定網頁基本樣式，讓畫布填滿畫面。
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  document.body.style.backgroundColor = COLORS.background;

  // 設定 p5.js 文字預設使用中文字型。
  textFont("Noto Sans TC");
  textAlign(CENTER, CENTER);
  rectMode(CORNER);
  textWrap(CHAR);

  // 將 Table 內容轉成程式容易使用的題目物件。
  prepareQuestions();

  // 題庫檢查成功後，開始第一次隨機抽題。
  if (quizReady) {
    startQuiz();
  }
}

// 將 CSV 每一列轉成 { question, options, answer } 格式。
function prepareQuestions() {
  // preload 載入失敗時，questionTable 可能不存在。
  if (!questionTable) {
    dataLoadError = "找不到 questions.csv，請確認檔案名稱與檔案位置。";
    return;
  }

  // CSV 必須包含這六個欄位，名稱大小寫也要完全相同。
  const requiredColumns = [
    "question",
    "option1",
    "option2",
    "option3",
    "option4",
    "answer"
  ];

  // 檢查 CSV 標題列是否缺少必要欄位。
  const missingColumns = requiredColumns.filter((column) => {
    return !questionTable.columns.includes(column);
  });

  if (missingColumns.length > 0) {
    dataLoadError = `CSV 缺少欄位：${missingColumns.join(", ")}`;
    return;
  }

  // 暫存檢查完成的題目。
  const parsedQuestions = [];

  // 逐列讀取 CSV 題庫。
  for (let rowIndex = 0; rowIndex < questionTable.getRowCount(); rowIndex++) {
    const row = questionTable.getRow(rowIndex);

    // 讀取題目、四個選項與答案索引。
    const question = row.getString("question").trim();
    const options = [
      row.getString("option1").trim(),
      row.getString("option2").trim(),
      row.getString("option3").trim(),
      row.getString("option4").trim()
    ];
    const answer = Number(row.getString("answer").trim());

    // 檢查題目與選項是否為空白。
    if (question === "" || options.some((option) => option === "")) {
      dataLoadError = `第 ${rowIndex + 2} 列有空白題目或選項。`;
      return;
    }

    // answer 必須是 0、1、2、3 的整數，代表四個選項的索引。
    if (!Number.isInteger(answer) || answer < 0 || answer > 3) {
      dataLoadError = `第 ${rowIndex + 2} 列的 answer 必須是 0 到 3。`;
      return;
    }

    // 將整理後的資料放入題庫陣列。
    parsedQuestions.push({
      question,
      options,
      answer
    });
  }

  // 依需求確認完整題庫正好有 15 題。
  if (parsedQuestions.length !== 15) {
    dataLoadError = `目前讀到 ${parsedQuestions.length} 題，題庫必須正好有 15 題。`;
    return;
  }

  // 檢查成功後才正式替換題庫資料。
  questions = parsedQuestions;
  quizReady = true;

  // 在瀏覽器 Console 顯示成功訊息，方便確認 CSV 是否載入。
  console.log(`題庫載入成功：共 ${questions.length} 題。`);
}

// 開始一次新的測驗，從完整題庫中不重複抽出 5 題。
function startQuiz() {
  // 使用 spread 複製陣列，再用 p5.js shuffle 隨機排序。
  // 因為每次都是從完整 15 題重新洗牌，所以同一次測驗不會重複。
  quizQuestions = shuffle([...questions]).slice(0, QUIZ_SIZE);

  // 重設所有測驗狀態。
  currentQuestion = 0;
  score = 0;
  selectedAnswer = -1;
  answered = false;
  quizFinished = false;
  answerAnimationStart = 0;
  nextButtonAnimationStart = 0;

  // 方便在 Console 確認本次抽出的題數。
  console.log(`本次測驗已隨機抽出 ${quizQuestions.length} 題。`);
}


// -----------------------------
// 畫面繪製
// -----------------------------

// draw() 會由 p5.js 持續重複執行。
function draw() {
  // 每一幀先清除舊畫面。
  background(COLORS.background);

  // 題庫尚未完成或發生錯誤時，顯示對應提示。
  if (!quizReady) {
    drawDataStatus();
    return;
  }

  // 測驗完成後改畫結果頁。
  if (quizFinished) {
    drawResultScreen();
    return;
  }

  // 取得目前畫面需要使用的版面座標。
  const layout = getLayout();

  // 依序繪製標題、題目與選項。
  drawHeader(layout);
  drawQuestion(layout);
  drawOptions(layout);

  // 作答後才顯示下一題按鈕。
  if (answered) {
    drawNextButton(layout);
  }
}

// 顯示題庫讀取狀態或錯誤訊息。
function drawDataStatus() {
  fill(COLORS.primary);
  noStroke();
  textFont("Noto Sans TC");
  textSize(width < 600 ? 20 : 26);

  if (dataLoadError === "") {
    text("正在載入題庫……", width / 2, height / 2);
  } else {
    text("題庫載入失敗", width / 2, height / 2 - 42);
    textSize(width < 600 ? 14 : 18);
    text(dataLoadError, width / 2, height / 2 + 8, width - 40, 100);
    textSize(width < 600 ? 13 : 16);
    fill(COLORS.secondary);
    text("請開啟瀏覽器 Console 查看詳細錯誤。", width / 2, height / 2 + 70);
  }
}

// 視窗尺寸改變時，重新調整畫布大小。
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 計算響應式版面，讓桌面與手機都能使用。
function getLayout() {
  const isMobile = width < 600;
  const margin = isMobile ? 18 : 60;
  const contentWidth = min(width - margin * 2, 900);
  const headerHeight = isMobile ? 82 : 112;
  const questionY = headerHeight + 16;
  const questionHeight = isMobile
    ? constrain(height * 0.20, 112, 150)
    : 165;
  const optionGap = isMobile ? 9 : 16;
  const nextWidth = isMobile ? 180 : 220;
  const nextHeight = isMobile ? 54 : 62;
  const bottomMargin = isMobile ? 18 : 34;
  const nextY = height - nextHeight - bottomMargin;
  const optionsY = questionY + questionHeight + (isMobile ? 14 : 22);

  // 手機為單欄，電腦為兩欄；高度會依視窗自動縮放。
  const optionHeight = isMobile
    ? constrain((nextY - 14 - optionsY - optionGap * 3) / 4, 40, 64)
    : 72;

  return {
    isMobile,
    margin,
    contentWidth,
    headerHeight,
    question: {
      x: (width - contentWidth) / 2,
      y: questionY,
      width: contentWidth,
      height: questionHeight
    },
    options: quizQuestions[currentQuestion].options.map((option, index) => {
      const column = isMobile ? 0 : index % 2;
      const row = isMobile ? index : floor(index / 2);
      const columnWidth = isMobile
        ? contentWidth
        : (contentWidth - optionGap) / 2;

      return {
        x: (width - contentWidth) / 2 + column * (columnWidth + optionGap),
        y: optionsY + row * (optionHeight + optionGap),
        width: columnWidth,
        height: optionHeight
      };
    }),
    nextButton: {
      x: (width - nextWidth) / 2,
      y: nextY,
      width: nextWidth,
      height: nextHeight
    }
  };
}

// 繪製頁面標題與目前題數。
function drawHeader(layout) {
  fill(COLORS.primary);
  noStroke();
  textFont("Isometra");
  textSize(layout.isMobile ? 26 : 34);
  text("QUIZ SYSTEM", width / 2, 28);

  fill(COLORS.secondary);
  textFont("Noto Sans TC");
  textSize(layout.isMobile ? 14 : 17);
  text(`第 ${currentQuestion + 1} 題 / 共 ${quizQuestions.length} 題`, width / 2, layout.isMobile ? 62 : 78);
}

// 繪製目前題目的面板與題目文字。
function drawQuestion(layout) {
  const box = layout.question;
  const question = quizQuestions[currentQuestion].question;

  drawRoundedPanel(box.x, box.y, box.width, box.height);
  fill(COLORS.primary);
  textFont("Noto Sans TC");
  textSize(layout.isMobile ? 18 : 24);
  textLeading(layout.isMobile ? 27 : 36);
  text(question, box.x + 22, box.y + 14, box.width - 44, box.height - 28);
}

// 繪製四個選項，並依作答結果套用顏色。
function drawOptions(layout) {
  const options = quizQuestions[currentQuestion].options;

  options.forEach((option, index) => {
    const box = layout.options[index];
    const isSelected = selectedAnswer === index;
    const isCorrect = index === quizQuestions[currentQuestion].answer;
    let fillColor = COLORS.option;
    let textColor = COLORS.primary;

    // 作答後，正確選項固定顯示綠色。
    if (answered && isCorrect) {
      fillColor = COLORS.correct;
      textColor = COLORS.correctText;
    }

    // 使用者選錯的選項顯示紅色。
    if (answered && isSelected && !isCorrect) {
      fillColor = COLORS.wrong;
      textColor = COLORS.wrongText;
    }

    // 尚未作答時，滑鼠移過選項會變色。
    if (!answered && isPointInside(mouseX, mouseY, box)) {
      fillColor = COLORS.optionHover;
    }

    // 答錯的選項加入短暫左右震動效果。
    let offsetX = 0;
    if (answered && isSelected && !isCorrect) {
      const elapsed = millis() - answerAnimationStart;
      offsetX = sin(elapsed * 0.04) * max(0, 8 - elapsed / 100);
    }

    drawOption(box, option, fillColor, textColor, offsetX, layout.isMobile);
  });
}

// 繪製單一選項方框與文字。
function drawOption(box, option, fillColor, textColor, offsetX, isMobile) {
  push();
  translate(offsetX, 0);
  fill(fillColor);
  stroke(COLORS.border);
  strokeWeight(2);
  roundedRect(box.x, box.y, box.width, box.height, 14);

  fill(textColor);
  noStroke();
  textFont("Noto Sans TC");
  textSize(isMobile ? 14 : box.width < 350 ? 16 : 19);
  textLeading(isMobile ? 20 : 26);
  text(option, box.x + 18, box.y + 5, box.width - 36, box.height - 10);
  pop();
}

// 繪製作答後出現的下一題或查看結果按鈕。
function drawNextButton(layout) {
  const button = layout.nextButton;
  const buttonColor = isPointInside(mouseX, mouseY, button)
    ? COLORS.buttonHover
    : COLORS.button;
  const elapsed = millis() - nextButtonAnimationStart;
  const scaleValue = 1 + min(0.03, max(0, elapsed / 1000) * 0.03);

  push();
  translate(button.x + button.width / 2, button.y + button.height / 2);
  scale(scaleValue);
  fill(buttonColor);
  noStroke();
  roundedRect(-button.width / 2, -button.height / 2, button.width, button.height, 14);
  fill(COLORS.white);
  textFont("Noto Sans TC");
  textSize(layout.isMobile ? 17 : 20);
  text(currentQuestion === quizQuestions.length - 1 ? "查看結果" : "下一題", 0, 0);
  pop();
}

// 繪製測驗完成後的結果頁。
function drawResultScreen() {
  const resultLayout = getResultLayout();
  const isMobile = resultLayout.isMobile;

  drawRoundedPanel(
    resultLayout.panel.x,
    resultLayout.panel.y,
    resultLayout.panel.width,
    resultLayout.panel.height
  );

  fill(COLORS.primary);
  textFont("Isometra");
  textSize(isMobile ? 34 : 48);
  text("RESULT", width / 2, resultLayout.panel.y + 68);

  fill(COLORS.secondary);
  textFont("Noto Sans TC");
  textSize(isMobile ? 20 : 25);
  text("測驗完成！", width / 2, resultLayout.panel.y + 132);

  fill(COLORS.button);
  textFont("Isometra");
  textSize(isMobile ? 48 : 64);
  text(`${score} / ${quizQuestions.length}`, width / 2, resultLayout.panel.y + 210);

  fill(COLORS.secondary);
  textFont("Noto Sans TC");
  textSize(isMobile ? 16 : 19);
  text(`答對 ${score} 題`, width / 2, resultLayout.panel.y + 265);

  const button = resultLayout.restartButton;
  fill(isPointInside(mouseX, mouseY, button) ? COLORS.buttonHover : COLORS.button);
  noStroke();
  roundedRect(button.x, button.y, button.width, button.height, 14);
  fill(COLORS.white);
  textFont("Noto Sans TC");
  textSize(18);
  text("重新開始", width / 2, button.y + button.height / 2);
}

// 統一計算結果頁面板與重新開始按鈕的位置。
function getResultLayout() {
  const isMobile = width < 600;
  const panelWidth = min(width - 40, 620);
  const panelHeight = isMobile ? 390 : 430;
  const panelX = (width - panelWidth) / 2;
  const panelY = (height - panelHeight) / 2;
  const buttonWidth = isMobile ? 180 : 220;
  const buttonHeight = 58;

  return {
    isMobile,
    panel: {
      x: panelX,
      y: panelY,
      width: panelWidth,
      height: panelHeight
    },
    restartButton: {
      x: (width - buttonWidth) / 2,
      y: panelY + panelHeight - 90,
      width: buttonWidth,
      height: buttonHeight
    }
  };
}


// -----------------------------
// 滑鼠、觸控與測驗流程
// -----------------------------

// 滑鼠按下時執行。
function mousePressed() {
  // 某些手機瀏覽器會在 touchStarted 後再觸發 mousePressed，這裡略過重複事件。
  if (lastTouchTime > 0 && millis() - lastTouchTime < 500) {
    return false;
  }

  handleInput(mouseX, mouseY);
  return false;
}

// 手機或平板觸控時執行。
function touchStarted() {
  lastTouchTime = millis();

  if (touches.length > 0) {
    handleInput(touches[0].x, touches[0].y);
  }

  return false;
}

// 統一處理滑鼠與觸控座標。
function handleInput(x, y) {
  if (!quizReady) {
    return;
  }

  if (quizFinished) {
    handleResultInput(x, y);
    return;
  }

  // 已作答時，只接受下一題按鈕，不再接受其他選項。
  if (answered) {
    const layout = getLayout();
    if (isPointInside(x, y, layout.nextButton)) {
      goToNextQuestion();
    }
    return;
  }

  // 尚未作答時，檢查使用者點擊了哪個選項。
  const layout = getLayout();
  for (let i = 0; i < layout.options.length; i++) {
    if (isPointInside(x, y, layout.options[i])) {
      selectAnswer(i);
      return;
    }
  }
}

// 記錄使用者的答案，並立即顯示正確或錯誤回饋。
function selectAnswer(index) {
  if (answered) {
    return;
  }

  selectedAnswer = index;
  answered = true;
  answerAnimationStart = millis();
  nextButtonAnimationStart = millis();

  if (index === quizQuestions[currentQuestion].answer) {
    score++;
  }
}

// 前往下一題；最後一題後切換到結果頁。
function goToNextQuestion() {
  if (currentQuestion >= quizQuestions.length - 1) {
    quizFinished = true;
    return;
  }

  currentQuestion++;
  selectedAnswer = -1;
  answered = false;
  answerAnimationStart = 0;
  nextButtonAnimationStart = 0;
}

// 處理結果頁的重新開始按鈕。
function handleResultInput(x, y) {
  const resultLayout = getResultLayout();
  if (isPointInside(x, y, resultLayout.restartButton)) {
    // 重新開始時再次洗牌，因此會重新抽出不同的 5 題組合。
    startQuiz();
  }
}

// 判斷某個座標是否位於指定方框內。
function isPointInside(x, y, box) {
  return (
    x >= box.x &&
    x <= box.x + box.width &&
    y >= box.y &&
    y <= box.y + box.height
  );
}

// 繪製白色圓角面板。
function drawRoundedPanel(x, y, w, h) {
  fill(COLORS.panel);
  stroke(COLORS.border);
  strokeWeight(2);
  roundedRect(x, y, w, h, 18);
}

// 封裝圓角矩形，讓程式閱讀更容易。
function roundedRect(x, y, w, h, radius) {
  rect(x, y, w, h, radius);
}
