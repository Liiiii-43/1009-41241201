// 背面圖片的路徑數組
const themes = {
    pokemon: {
        backImages: [
            "images/pokemon/pokemon1.png",
            "images/pokemon/pokemon2.png",
            "images/pokemon/pokemon3.png",
            "images/pokemon/pokemon4.png",
            "images/pokemon/pokemon5.png",
            "images/pokemon/pokemon6.png",
            "images/pokemon/pokemon7.png",
            "images/pokemon/pokemon8.png",
            "images/pokemon/pokemon9.png",
            "images/pokemon/pokemon10.png",
            "images/pokemon/pokemon11.png",
            "images/pokemon/pokemon12.png",
            "images/pokemon/pokemon13.png",
            "images/pokemon/pokemon14.png",
            "images/pokemon/pokemon15.png",
            "images/pokemon/pokemon16.png",
            "images/pokemon/pokemon17.png",
            "images/pokemon/pokemon18.png"
        ],
        frontImage: "images/pokemon/pokemon0.jpg" // 寶可夢的正面圖片
    },
    sanrio: {
        backImages: [
            "images/sanrio/sanrio1.png",
            "images/sanrio/sanrio2.png",
            "images/sanrio/sanrio3.png",
            "images/sanrio/sanrio4.png",
            "images/sanrio/sanrio5.png",
            "images/sanrio/sanrio6.png",
            "images/sanrio/sanrio7.png",
            "images/sanrio/sanrio8.png",
            "images/sanrio/sanrio9.png",
            "images/sanrio/sanrio10.png",
            "images/sanrio/sanrio11.png",
            "images/sanrio/sanrio12.png",
            "images/sanrio/sanrio13.png",
            "images/sanrio/sanrio14.png",
            "images/sanrio/sanrio15.png",
            "images/sanrio/sanrio16.png",
            "images/sanrio/sanrio17.png",
            "images/sanrio/sanrio18.png"
        ],
        frontImage: "images/sanrio/sanrio0.png" // 三麗鷗的正面圖片
    },
    genshin: {
        backImages: [
            "images/genshin/genshin1.png",
            "images/genshin/genshin2.png",
            "images/genshin/genshin3.png",
            "images/genshin/genshin4.png",
            "images/genshin/genshin5.png",
            "images/genshin/genshin6.png",
            "images/genshin/genshin7.png",
            "images/genshin/genshin8.png",
            "images/genshin/genshin9.png",
            "images/genshin/genshin10.png",
            "images/genshin/genshin11.png",
            "images/genshin/genshin12.png",
            "images/genshin/genshin13.png",
            "images/genshin/genshin14.png",
            "images/genshin/genshin15.png",
            "images/genshin/genshin16.png",
            "images/genshin/genshin17.png",
            "images/genshin/genshin18.png"
        ],
        frontImage: "images/genshin/genshin0.png" // 原神的正面圖片
    }
};

// 音效
const successSound = new Audio('radio/success.mp3'); // 更新成功音效路徑
const failureSound = new Audio('radio/fail.mp3'); // 更新失敗音效路徑

// Fisher-Yates 演算法打亂陣列
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 動態生成卡片
function createCards(theme, gridSize) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // 清空卡片容器

    const backImages = themes[theme].backImages; // 獲取主題的背面圖片
    const frontImage = themes[theme].frontImage; // 根據主題獲取正面圖片

    // 根據網格大小設定卡片數量
    const totalCards = gridSize * gridSize; // 計算總卡片數量

    // 複製背面圖片，並打亂
    const cardImages = [...backImages.slice(0, totalCards / 2), ...backImages.slice(0, totalCards / 2)]; // 確保不超過背面圖片數量
    shuffle(cardImages); // 隨機打亂

    // 動態生成卡片
    for (let i = 0; i < cardImages.length; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.image = cardImages[i]; // 儲存卡片背面圖片的路徑

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        // 正面圖片
        const imgFront = document.createElement('img');
        imgFront.src = frontImage; // 根據主題設置正面圖片
        imgFront.alt = 'Front';
        cardFront.appendChild(imgFront);

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        const imgBack = document.createElement('img');
        imgBack.src = cardImages[i]; // 初始化卡片後背面圖片按隨機順序放置
        imgBack.alt = 'Back';
        cardBack.appendChild(imgBack);

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        cardContainer.appendChild(card);
    }

    // 設置卡片容器的樣式以適應網格
    cardContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // 根據選擇的網格大小設置列數
}

// 初始化遊戲
let firstCard = null; // 儲存第一張被點擊的卡片
let secondCard = null; // 儲存第二張被點擊的卡片
let lockBoard = false; // 判斷遊戲是否處於鎖定狀態
let matchedCardsCount = 0; // 記錄已匹配的卡片數量

function startGame() {
    const themeContainer = document.getElementById('themeContainer');
    themeContainer.style.top = '20px'; // 按下開始遊戲後移到上方中間

    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value; // 獲取當前選擇的主題

    const gridSizeSelect = document.getElementById('gridSizeSelect');
    const selectedGridSize = parseInt(gridSizeSelect.value); // 獲取選擇的網格大小

    createCards(selectedTheme, selectedGridSize); // 根據主題和網格大小生成卡片

    const cards = document.querySelectorAll('.card');
    // 初始化時將所有卡片翻到背面
    cards.forEach(card => {
        card.style.transform = 'rotateY(180deg)'; // 顯示背面
    });

    // 獲取倒數秒數
    const countdownSelect = document.getElementById('countdownSelect');
    let countdown = parseInt(countdownSelect.value); // 轉換為整數
    const countdownDisplay = document.getElementById('countdown');
    countdownDisplay.style.display = 'block'; // 顯示倒數元素
    countdownDisplay.textContent = `倒數：${countdown}`; // 顯示初始倒數時間

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = `倒數：${countdown}`; // 更新倒數時間
        if (countdown <= 0) {
            clearInterval(countdownInterval); // 清除倒數計時
            countdownDisplay.style.display = 'none'; // 隱藏倒數元素

            // 倒數結束，翻轉卡片回正面
            cards.forEach(card => {
                card.style.transform = 'rotateY(0deg)'; // 翻回正面
            });

            // 為每張卡片添加點擊事件，點擊後卡片翻轉
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    if (lockBoard) return; // 如果遊戲處於鎖定狀態，則不執行
                    if (card.style.transform === 'rotateY(180deg)') {
                        return; // 如果卡片已經翻轉，則不執行
                    }

                    // 翻轉卡片
                    card.style.transform = 'rotateY(180deg)'; // 翻回背面

                    if (!firstCard) {
                        firstCard = card; // 記錄第一張卡片
                    } else {
                        secondCard = card; // 記錄第二張卡片
                        lockBoard = true; // 鎖定遊戲以避免點擊

                        // 比對圖片
                        if (firstCard.dataset.image === secondCard.dataset.image) {
                            // 如果匹配，延遲隱藏卡片
                            setTimeout(() => {
                                firstCard.style.visibility = 'hidden'; // 隱藏第一張卡片
                                secondCard.style.visibility = 'hidden'; // 隱藏第二張卡片
                                matchedCardsCount += 2; // 增加已匹配的卡片數量
                                successSound.play(); // 播放成功音效
                                resetCards();

                                // 如果所有卡片都匹配成功
                                if (matchedCardsCount === (selectedGridSize * selectedGridSize)) {
                                    setTimeout(() => {
                                        if (confirm('所有卡片匹配成功！是否要重新遊玩？')) {
                                            resetGame(); // 重新開始遊戲
                                        }
                                    }, 500); // 延遲0.5秒後提示玩家
                                }
                            }, 800); // 將延遲改為0.8秒後隱藏卡片
                        } else {
                            // 如果不匹配，稍後翻回
                            setTimeout(() => {
                                firstCard.style.transform = 'rotateY(0deg)'; // 翻回正面
                                secondCard.style.transform = 'rotateY(0deg)'; // 翻回正面
                                failureSound.play(); // 播放失敗音效
                                resetCards(); // 重置卡片狀態
                            }, 1000); // 1秒後翻回正面
                        }
                    }
                });
            });
        }
    }, 1000); // 每秒更新一次倒數
}

// 重置卡片狀態
function resetCards() {
    [firstCard, secondCard, lockBoard] = [null, null, false]; // 重置狀態
}

// 重新開始遊戲
function resetGame() {
    matchedCardsCount = 0; // 重置匹配計數
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // 清空卡片容器

    // 重置主題選擇區域的位置
    const themeContainer = document.getElementById('themeContainer');
    themeContainer.style.top = '50%'; // 重新設置為畫面中間
}

// 監聽開始遊戲按鈕
document.getElementById('startGame').addEventListener('click', startGame);