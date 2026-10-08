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