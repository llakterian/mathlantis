// Game state
let blocks = 0;
let buildingsBuilt = 0;
let currentEquation = { num1: 0, num2: 0, operation: '+', answer: 0 };
let isDaytime = true;
let currentDifficulty = 0;
let correctAnswersCount = 0;
let buildingHistory = [];
const MAX_HISTORY_STEPS = 7;
let draggedBlock = null;
let offsetX, offsetY;
let currentWorld = 0;
let blockStorage = []; // Persistent storage for blocks

// Game difficulty levels
const difficultyLevels = [
    { 
        name: "Beginner", 
        operations: ['+'], 
        maxNumber: 5,
        blocksPerPoint: 1,
        specialBlockChance: 0.05,
        minBuildings: 0
    },
    { 
        name: "Easy", 
        operations: ['+', '-'], 
        maxNumber: 10,
        blocksPerPoint: 1.2,
        specialBlockChance: 0.07,
        minBuildings: 5
    },
    { 
        name: "Medium", 
        operations: ['+', '-'], 
        maxNumber: 15,
        blocksPerPoint: 1.5,
        specialBlockChance: 0.1,
        minBuildings: 15
    },
    { 
        name: "Hard", 
        operations: ['+', '-', '×'], 
        maxNumber: 20,
        blocksPerPoint: 1.8,
        specialBlockChance: 0.15,
        minBuildings: 30
    },
    { 
        name: "Expert", 
        operations: ['+', '-', '×', '÷'], 
        maxNumber: 30,
        blocksPerPoint: 2,
        specialBlockChance: 0.2,
        minBuildings: 50
    }
];

// Colors and special blocks
const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];
const specialBlocks = {
    rainbow: { 
        color: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)', 
        points: 10,
        emoji: '🌈'
    },
    gold: { 
        color: 'gold', 
        points: 5,
        emoji: '🌟'
    },
    diamond: { 
        color: 'cyan', 
        points: 3,
        emoji: '💎'
    }
};

// Themed Worlds
const worlds = [
    { 
        name: "Modern City", 
        minBuildings: 0, 
        unlocked: true,
        templates: [
            { shape: "house", blocks: 10, icon: "fas fa-home" },
            { shape: "tower", blocks: 15, icon: "fas fa-building" },
            { shape: "castle", blocks: 20, icon: "fas fa-chess-rook" }
        ]
    },
    { 
        name: "Ancient Egypt", 
        minBuildings: 100, 
        unlocked: false,
        templates: [
            { shape: "pyramid", blocks: 25, icon: "fas fa-landmark" },
            { shape: "sphinx", blocks: 30, icon: "fas fa-monument" }
        ]
    },
    { 
        name: "Medieval Kingdom", 
        minBuildings: 250, 
        unlocked: false,
        templates: [
            { shape: "cathedral", blocks: 35, icon: "fas fa-church" },
            { shape: "fortress", blocks: 40, icon: "fas fa-fort-awesome" }
        ]
    },
    {
        name: "Futuristic City",
        minBuildings: 500,
        unlocked: false,
        templates: [
            { shape: "skyscraper", blocks: 50, icon: "fas fa-rocket" },
            { shape: "biodome", blocks: 60, icon: "fas fa-globe" }
        ]
    }
];

// Unlockable characters
const characters = [
    { name: "Color Fairy", unlocked: true, emoji: "🧚", desc: "Helps with colors!" },
    { name: "Math Wizard", unlocked: false, emoji: "🧙", requirement: 50, desc: "Makes math easier!" },
    { name: "Block Robot", unlocked: false, emoji: "🤖", requirement: 100, desc: "Builds faster!" },
    { name: "Rainbow Unicorn", unlocked: false, emoji: "🦄", requirement: 200, desc: "Magical builder!" }
];

// DOM elements
const equationEl = document.getElementById('equation');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const blockCountEl = document.getElementById('block-count');
const blocksContainer = document.getElementById('blocks-container');
const cityCanvas = document.getElementById('city-canvas');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const difficultyLevelEl = document.getElementById('difficulty-level');
const minigameBtn = document.getElementById('minigame-btn');
const unlockedCharactersEl = document.getElementById('unlocked-characters');
const professorImg = document.getElementById('professor');
const speechBubble = document.getElementById('speech-bubble');
const undoBtn = document.getElementById('undo-btn');

// Sound functions with fallback
function playSound(soundId) {
    try {
        const sound = document.getElementById(soundId);
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Sound playback prevented:", e));
    } catch (e) {
        console.log("Sound error:", e);
    }
}

function playCorrectSound() {
    playSound('correct-sound');
}

function playBuildSound() {
    playSound('build-sound');
}

function playUnlockSound() {
    playSound('unlock-sound');
}

function playCelebrationSound() {
    playSound('celebration-sound');
}

// Initialize game
function initGame() {
    generateNewEquation();
    setupEventListeners();
    updateProgress();
    startDayNightCycle();
    showMessage("Welcome to Mathlantis! Solve math problems to build your city!");
    updateDifficultyDisplay();
    updateUnlockedCharacters();
}

// Update difficulty display
function updateDifficultyDisplay() {
    difficultyLevelEl.textContent = `Level: ${difficultyLevels[currentDifficulty].name}`;
}

// Generate random math problem based on current difficulty
function generateNewEquation() {
    const difficulty = difficultyLevels[currentDifficulty];
    const operation = difficulty.operations[
        Math.floor(Math.random() * difficulty.operations.length)
    ];
    
    let num1, num2, answer;
    
    // Scale numbers based on buildings built for progressive difficulty
    const difficultyScale = Math.min(2, 1 + (buildingsBuilt / 100));
    
    switch(operation) {
        case '+':
            num1 = Math.floor(Math.random() * difficulty.maxNumber * difficultyScale) + 1;
            num2 = Math.floor(Math.random() * difficulty.maxNumber * difficultyScale) + 1;
            answer = num1 + num2;
            break;
        case '-':
            // Ensure subtraction problems always result in positive numbers
            num1 = Math.floor(Math.random() * difficulty.maxNumber * difficultyScale) + 1;
            num2 = Math.floor(Math.random() * num1) + 1;
            answer = num1 - num2;
            break;
        case '×':
            num1 = Math.floor(Math.random() * 10 * difficultyScale) + 1;
            num2 = Math.floor(Math.random() * 10 * difficultyScale) + 1;
            answer = num1 * num2;
            break;
        case '÷':
            // Ensure division problems result in whole numbers
            answer = Math.floor(Math.random() * 10 * difficultyScale) + 1;
            num2 = Math.floor(Math.random() * 5 * difficultyScale) + 1;
            num1 = answer * num2;
            break;
    }
    
    currentEquation = { num1, num2, operation, answer };
    
    // Display the equation with proper symbol
    const displayOperation = operation === '×' ? '×' : 
                           operation === '÷' ? '÷' : operation;
    equationEl.textContent = `${num1} ${displayOperation} ${num2} = ?`;
    answerInput.value = '';
    answerInput.focus();
}

// Check player's answer
function checkAnswer() {
    const playerAnswer = parseInt(answerInput.value);
    
    if (isNaN(playerAnswer)) {
        showMessage("Please enter a number!");
        return;
    }
    
    if (playerAnswer === currentEquation.answer) {
        // Correct answer
        playCorrectSound();
        correctAnswersCount++;
        
        // Calculate blocks based on difficulty
        const difficulty = difficultyLevels[currentDifficulty];
        const blocksEarned = Math.max(1, 
            Math.floor(currentEquation.answer * difficulty.blocksPerPoint)
        );
        
        blocks += blocksEarned;
        blockCountEl.textContent = blocks;
        
        // Create proportional blocks (limited to 10 visual blocks)
        createNewBlocks(blocksEarned);
        
        // Check for difficulty increase based on both correct answers and buildings built
        if ((correctAnswersCount >= 5 || buildingsBuilt >= difficultyLevels[currentDifficulty].minBuildings) && 
            currentDifficulty < difficultyLevels.length - 1) {
            currentDifficulty++;
            correctAnswersCount = 0;
            showMessage(`Level up! Now at ${difficultyLevels[currentDifficulty].name} difficulty!`);
            updateDifficultyDisplay();
        }
        
        celebrate();
        generateNewEquation();
        checkUnlocks();
        updateProgress();
        
        // Random professor comment
        const comments = [
            "Great job!",
            `You earned ${blocksEarned} blocks!`,
            "Math genius!",
            "Keep it up!"
        ];
        showMessage(comments[Math.floor(Math.random() * comments.length)]);
    } else {
        // Wrong answer
        showMessage("Oops! Try again!");
        answerInput.value = '';
        answerInput.focus();
    }
}

// Create visual blocks as rewards (arranged neatly in a grid)
function createNewBlocks(count) {
    const difficulty = difficultyLevels[currentDifficulty];
    
    // Add blocks to persistent storage
    for (let i = 0; i < count; i++) {
        const blockData = {
            id: Date.now() + i,
            color: colors[Math.floor(Math.random() * colors.length)],
            value: 1,
            emoji: '⬜'
        };
        
        // Determine if this is a special block
        if (Math.random() < difficulty.specialBlockChance) {
            const specialTypes = Object.keys(specialBlocks);
            const specialType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
            blockData.color = specialBlocks[specialType].color;
            blockData.value = Math.ceil(specialBlocks[specialType].points * (currentDifficulty + 1));
            blockData.emoji = specialBlocks[specialType].emoji;
        }
        
        blockStorage.push(blockData);
    }
    
    renderBlockStorage();
}

// Render blocks from storage
function renderBlockStorage() {
    blocksContainer.innerHTML = '';
    
    if (blockStorage.length === 0) {
        blocksContainer.style.display = 'none';
        return;
    }
    
    // Calculate grid dimensions for all blocks in storage
    const cols = Math.ceil(Math.sqrt(blockStorage.length));
    
    // Set container dimensions based on block count
    blocksContainer.style.display = 'grid';
    blocksContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    blocksContainer.style.gap = '5px';
    blocksContainer.style.justifyItems = 'center';
    blocksContainer.style.padding = '5px';
    
    // Render all blocks in storage
    for (let i = 0; i < blockStorage.length; i++) {
        const blockData = blockStorage[i];
        const block = document.createElement('div');
        block.className = 'block';
        block.style.background = blockData.color;
        block.dataset.value = blockData.value;
        block.dataset.blockId = blockData.id;
        block.textContent = blockData.emoji;
        block.style.opacity = '1';
        
        // Add drag events (both mouse and touch)
        block.draggable = true;
        
        // Use closure to preserve blockData for each block
        (function(currentBlockData) {
            // Standard drag events
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', currentBlockData.color);
                e.dataTransfer.setData('value', currentBlockData.value.toString());
                e.dataTransfer.setData('emoji', currentBlockData.emoji);
                e.dataTransfer.setData('blockId', currentBlockData.id.toString());
                e.dataTransfer.effectAllowed = 'move';
                block.style.opacity = '0.3';
            });
            
            block.addEventListener('dragend', (e) => {
                block.style.opacity = '1';
            });
            
            // Touch events for mobile/tablet support
            let touchStartX, touchStartY;
            let isDragging = false;
            let originalParent = block.parentElement;
            
            block.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isDragging = true;
                block.style.opacity = '0.3';
                block.style.zIndex = '1000';
                block.style.transform = 'scale(1.1)';
            });
            
            block.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                
                const touch = e.touches[0];
                const rect = block.getBoundingClientRect();
                
                // Move the block with touch
                block.style.position = 'fixed';
                block.style.left = (touch.clientX - rect.width / 2) + 'px';
                block.style.top = (touch.clientY - rect.height / 2) + 'px';
                block.style.pointerEvents = 'none';
                
                // Visual feedback for drop zone
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                if (elementBelow && (elementBelow.id === 'city-canvas' || elementBelow.closest('#city-canvas'))) {
                    cityCanvas.style.backgroundColor = '#d5f5e3';
                } else {
                    cityCanvas.style.backgroundColor = isDaytime ? '#ecf0f1' : '#2c3e50';
                }
            });
            
            block.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                
                isDragging = false;
                block.style.opacity = '1';
                block.style.zIndex = 'auto';
                block.style.transform = 'scale(1)';
                block.style.position = 'static';
                block.style.pointerEvents = 'auto';
                cityCanvas.style.backgroundColor = isDaytime ? '#ecf0f1' : '#2c3e50';
                
                // Check if dropped on building area
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                
                if (elementBelow && (elementBelow.id === 'city-canvas' || elementBelow.closest('#city-canvas'))) {
                    // Simulate a drop on the building area
                    const fakeDropEvent = {
                        preventDefault: () => {},
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        dataTransfer: {
                            getData: (type) => {
                                switch(type) {
                                    case 'text/plain': return currentBlockData.color;
                                    case 'value': return currentBlockData.value.toString();
                                    case 'emoji': return currentBlockData.emoji;
                                    case 'blockId': return currentBlockData.id.toString();
                                    default: return '';
                                }
                            }
                        }
                    };
                    
                    // Call the drop handler
                    handleCityCanvasDrop(fakeDropEvent);
                }
            });
        })(blockData);
        
        blocksContainer.appendChild(block);
    }
}

// Undo last building action
function undoLastAction() {
    if (buildingHistory.length === 0) {
        showMessage("Nothing to undo!");
        return;
    }
    
    const lastAction = buildingHistory.pop();
    const blocksToRestore = lastAction.value;
    
    // Remove the last placed block from city canvas
    if (lastAction.element && lastAction.element.parentNode === cityCanvas) {
        cityCanvas.removeChild(lastAction.element);
    }
    
    // Restore blocks to inventory
    blocks += blocksToRestore;
    blockCountEl.textContent = blocks;
    buildingsBuilt = Math.max(0, buildingsBuilt - blocksToRestore);
    updateProgress();
    
    showMessage(`Undo successful! ${blocksToRestore} blocks restored.`);
    playBuildSound();
}

// Update progress bar
function updateProgress() {
    const progress = Math.min(100, buildingsBuilt / 2);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.floor(progress)}% Built`;
}

// Show message in speech bubble
function showMessage(message) {
    speechBubble.textContent = message;
    speechBubble.style.animation = 'none';
    setTimeout(() => {
        speechBubble.style.animation = '';
    }, 10);
}

// Celebrate correct answer
function celebrate() {
    playCelebrationSound();
    
    // Create confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}

// Check for character and world unlocks
function checkUnlocks() {
    let unlockedNew = false;
    
    // Check for character unlocks
    for (const character of characters) {
        if (!character.unlocked && buildingsBuilt >= character.requirement) {
            character.unlocked = true;
            unlockedNew = true;
            
            const unlockDiv = document.createElement('div');
            unlockDiv.className = 'unlock-message';
            unlockDiv.textContent = `Unlocked: ${character.emoji} ${character.name}! ${character.desc}`;
            document.body.appendChild(unlockDiv);
            
            playUnlockSound();
        }
    }
    
    // Check for world unlocks
    for (let i = 0; i < worlds.length; i++) {
        if (!worlds[i].unlocked && buildingsBuilt >= worlds[i].minBuildings) {
            worlds[i].unlocked = true;
            currentWorld = i;
            unlockedNew = true;
            
            const unlockDiv = document.createElement('div');
            unlockDiv.className = 'unlock-message';
            unlockDiv.textContent = `Unlocked World: ${worlds[i].name}!`;
            document.body.appendChild(unlockDiv);
            
            playUnlockSound();
            updateBuildingTemplates();
        }
    }
    
    if (unlockedNew) {
        updateUnlockedCharacters();
    }
}

// Update unlocked characters display
function updateUnlockedCharacters() {
    unlockedCharactersEl.innerHTML = '';
    
    for (const character of characters) {
        if (character.unlocked) {
            const charDiv = document.createElement('div');
            charDiv.textContent = `${character.emoji} ${character.name}`;
            charDiv.style.margin = '5px';
            charDiv.style.fontSize = '14px';
            unlockedCharactersEl.appendChild(charDiv);
        }
    }
}

// Day/night cycle
function startDayNightCycle() {
    setInterval(() => {
        isDaytime = !isDaytime;
        document.body.classList.toggle('night-mode', !isDaytime);
        cityCanvas.style.backgroundColor = isDaytime ? '#ecf0f1' : '#2c3e50';
    }, 30000); // Change every 30 seconds
}

// Mini-game implementation
function startMiniGame() {
    const world = worlds[currentWorld];
    
    // Create mini-game modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    content.innerHTML = `
        <h2><i class="fas fa-gamepad"></i> ${world.name} Mini-Game</h2>
        <p>Quick Math Challenge!</p>
        <div style="margin: 20px 0;">
            <div id="mini-equation" style="font-size: 24px; margin: 10px 0;"></div>
            <input type="number" id="mini-answer" placeholder="Answer" style="padding: 10px; font-size: 18px; width: 100px; text-align: center;">
        </div>
        <div>
            <button id="mini-submit" style="padding: 10px 20px; margin: 5px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Submit</button>
            <button id="mini-close" style="padding: 10px 20px; margin: 5px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </div>
        <div id="mini-result" style="margin-top: 15px; font-weight: bold;"></div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Generate mini-game equation
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    const answer = operation === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2);
    
    document.getElementById('mini-equation').textContent = `${Math.max(num1, num2)} ${operation} ${Math.min(num1, num2)} = ?`;
    
    document.getElementById('mini-submit').addEventListener('click', () => {
        const userAnswer = parseInt(document.getElementById('mini-answer').value);
        const result = document.getElementById('mini-result');
        
        if (userAnswer === answer) {
            result.style.color = 'green';
            result.textContent = 'Correct! +2 bonus blocks!';
            blocks += 2;
            blockCountEl.textContent = blocks;
            createNewBlocks(2);
            playCorrectSound();
        } else {
            result.style.color = 'red';
            result.textContent = `Wrong! The answer was ${answer}`;
        }
    });
    
    document.getElementById('mini-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('mini-answer').focus();
}

// Leaderboard functionality
function showLeaderboard() {
    const modal = createModal();
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <h2><i class="fas fa-trophy"></i> Leaderboard</h2>
        <div style="text-align: left; margin: 20px 0;">
            <h3>Your Stats:</h3>
            <p><i class="fas fa-building"></i> Buildings Built: ${buildingsBuilt}</p>
            <p><i class="fas fa-cubes"></i> Blocks Earned: ${blocks}</p>
            <p><i class="fas fa-star"></i> Difficulty: ${difficultyLevels[currentDifficulty].name}</p>
            <p><i class="fas fa-globe"></i> Current World: ${worlds[currentWorld].name}</p>
        </div>
        <div style="text-align: left; margin: 20px 0;">
            <h3>Achievements:</h3>
            <div id="achievements-list"></div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    
    // Add achievements
    const achievementsList = content.querySelector('#achievements-list');
    const achievements = [
        { name: "First Steps", condition: buildingsBuilt >= 1, icon: "🏠" },
        { name: "City Builder", condition: buildingsBuilt >= 25, icon: "🏙️" },
        { name: "Master Builder", condition: buildingsBuilt >= 100, icon: "🏗️" },
        { name: "Math Genius", condition: currentDifficulty >= 3, icon: "🧠" },
        { name: "World Explorer", condition: currentWorld >= 1, icon: "🌍" }
    ];
    
    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.style.cssText = `margin: 5px 0; padding: 5px; background: ${achievement.condition ? '#d4edda' : '#f8d7da'}; border-radius: 3px;`;
        div.innerHTML = `${achievement.icon} ${achievement.name} ${achievement.condition ? '✅' : '❌'}`;
        achievementsList.appendChild(div);
    });
    
    document.body.appendChild(modal);
}

// City showcase functionality
function showCityShowcase() {
    const modal = createModal();
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <h2><i class="fas fa-camera"></i> City Showcase</h2>
        <div style="margin: 20px 0;">
            <div style="border: 2px solid #ddd; padding: 20px; border-radius: 10px; background: #f9f9f9;">
                <h3>Your ${worlds[currentWorld].name} City</h3>
                <p><i class="fas fa-building"></i> Buildings: ${buildingsBuilt}</p>
                <p><i class="fas fa-star"></i> City Rating: ${Math.min(5, Math.floor(buildingsBuilt / 30) + 1)}/5 ⭐</p>
                <p><i class="fas fa-users"></i> Population: ${buildingsBuilt * 10}</p>
                <p><i class="fas fa-coins"></i> City Value: ${buildingsBuilt * 100} coins</p>
            </div>
            <div style="margin: 15px 0;">
                <button onclick="shareCity()" style="padding: 10px 15px; margin: 5px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-share"></i> Share City</button>
                <button onclick="saveCity()" style="padding: 10px 15px; margin: 5px; background: #f39c12; color: white; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-save"></i> Save Progress</button>
            </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    
    document.body.appendChild(modal);
}

// Customization functionality
function showCustomization() {
    const modal = createModal();
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <h2><i class="fas fa-paint-brush"></i> Customize Your Game</h2>
        <div style="text-align: left; margin: 20px 0;">
            <h3>Color Themes:</h3>
            <div style="margin: 10px 0;">
                <button onclick="changeTheme('default')" style="padding: 8px 15px; margin: 5px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Default Blue</button>
                <button onclick="changeTheme('green')" style="padding: 8px 15px; margin: 5px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">Nature Green</button>
                <button onclick="changeTheme('purple')" style="padding: 8px 15px; margin: 5px; background: #9b59b6; color: white; border: none; border-radius: 5px; cursor: pointer;">Royal Purple</button>
                <button onclick="changeTheme('orange')" style="padding: 8px 15px; margin: 5px; background: #f39c12; color: white; border: none; border-radius: 5px; cursor: pointer;">Sunset Orange</button>
            </div>
            <h3>Game Settings:</h3>
            <div style="margin: 10px 0;">
                <label><input type="checkbox" id="sound-toggle" ${true ? 'checked' : ''}> Enable Sound Effects</label><br>
                <label><input type="checkbox" id="animation-toggle" ${true ? 'checked' : ''}> Enable Animations</label><br>
                <label><input type="checkbox" id="auto-save" ${true ? 'checked' : ''}> Auto-save Progress</label>
            </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    
    document.body.appendChild(modal);
}

// Helper function to create modal
function createModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    modal.appendChild(content);
    return modal;
}

// Helper functions for customization
function shareCity() {
    showMessage(`City shared! Your ${worlds[currentWorld].name} city with ${buildingsBuilt} buildings is amazing!`);
}

function saveCity() {
    localStorage.setItem('mathlantis-save', JSON.stringify({
        blocks,
        buildingsBuilt,
        currentDifficulty,
        currentWorld,
        blockStorage
    }));
    showMessage("Progress saved successfully!");
}

function changeTheme(theme) {
    const root = document.documentElement;
    switch(theme) {
        case 'green':
            root.style.setProperty('--primary-color', '#2ecc71');
            break;
        case 'purple':
            root.style.setProperty('--primary-color', '#9b59b6');
            break;
        case 'orange':
            root.style.setProperty('--primary-color', '#f39c12');
            break;
        default:
            root.style.setProperty('--primary-color', '#3498db');
    }
    showMessage(`Theme changed to ${theme}!`);
}

// Update building templates based on current world
function updateBuildingTemplates() {
    const templatesContainer = document.getElementById('building-templates');
    templatesContainer.innerHTML = '';
    
    const world = worlds[currentWorld];
    
    for (const template of world.templates) {
        const templateDiv = document.createElement('div');
        templateDiv.className = 'template';
        templateDiv.dataset.shape = template.shape;
        templateDiv.dataset.blocks = template.blocks;
        templateDiv.innerHTML = `<i class="${template.icon}"></i> ${template.shape} (${template.blocks})`;
        templatesContainer.appendChild(templateDiv);
    }
    
    // Re-add event listeners for new templates
    document.querySelectorAll('.template').forEach(template => {
        template.addEventListener('click', () => {
            const requiredBlocks = parseInt(template.dataset.blocks);
            if (blocks >= requiredBlocks) {
                blocks -= requiredBlocks;
                blockCountEl.textContent = blocks;
                showMessage(`Building a ${template.dataset.shape}...`);
                setTimeout(() => {
                    playBuildSound();
                    buildingsBuilt += requiredBlocks;
                    
                    // Add to history for undo functionality
                    buildingHistory.push({ value: requiredBlocks });
                    if (buildingHistory.length > MAX_HISTORY_STEPS) {
                        buildingHistory.shift();
                    }
                    
                    updateProgress();
                }, 1000);
            } else {
                showMessage(`You need ${requiredBlocks - blocks} more blocks!`);
            }
        });
    });
}

// Handle drop events on city canvas (both mouse and touch)
function handleCityCanvasDrop(e) {
    e.preventDefault();
    cityCanvas.style.backgroundColor = isDaytime ? '#ecf0f1' : '#2c3e50';
    
    const color = e.dataTransfer.getData('text/plain');
    const value = parseInt(e.dataTransfer.getData('value'));
    const emoji = e.dataTransfer.getData('emoji');
    const blockId = e.dataTransfer.getData('blockId');
    
    // Validate the drop data
    if (!color || isNaN(value) || !emoji) {
        showMessage("Invalid block data!");
        return;
    }
    
    if (blocks < value) {
        showMessage(`You need ${value} blocks to place this!`);
        return;
    }
    
    // Remove block from storage if it's from storage
    if (blockId) {
        const blockIndex = blockStorage.findIndex(b => b.id.toString() === blockId);
        if (blockIndex !== -1) {
            blockStorage.splice(blockIndex, 1);
            // Re-render storage to update the display
            setTimeout(() => renderBlockStorage(), 10);
        }
    }
    
    blocks -= value;
    blockCountEl.textContent = blocks;
    
    const block = document.createElement('div');
    block.className = 'city-block';
    block.style.background = color;
    block.style.position = 'absolute';
    block.style.width = '50px';
    block.style.height = '50px';
    block.style.border = '2px solid #333';
    block.style.borderRadius = '5px';
    block.style.display = 'flex';
    block.style.alignItems = 'center';
    block.style.justifyContent = 'center';
    block.style.fontSize = '20px';
    block.style.cursor = 'move';
    
    // Calculate position to drop the block
    const rect = cityCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 25; // Center the block on cursor
    const y = e.clientY - rect.top - 25;
    
    // Snap to grid for better placement
    const snapSize = 10;
    const snappedX = Math.round(x / snapSize) * snapSize;
    const snappedY = Math.round(y / snapSize) * snapSize;
    
    block.style.left = `${Math.max(0, Math.min(snappedX, rect.width - 50))}px`;
    block.style.top = `${Math.max(0, Math.min(snappedY, rect.height - 50))}px`;
    block.textContent = emoji;
    block.draggable = true;
    block.dataset.value = value;
    
    // Add drag events for placed blocks
    block.addEventListener('dragstart', (e) => {
        draggedBlock = block;
        const rect = block.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        block.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
    });
    
    block.addEventListener('dragend', () => {
        block.style.opacity = '1';
        draggedBlock = null;
    });
    
    cityCanvas.appendChild(block);
    playBuildSound();
    buildingsBuilt += value;
    
    // Add to history for undo functionality
    buildingHistory.push({ element: block, value: value });
    if (buildingHistory.length > MAX_HISTORY_STEPS) {
        buildingHistory.shift(); // Remove oldest action if we exceed max steps
    }
    
    updateProgress();
}

// Enhanced drag and drop setup for building area
function setupEventListeners() {
    // Math answer submission
    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // Social and customization buttons
    document.getElementById('leaderboard-btn').addEventListener('click', showLeaderboard);
    document.getElementById('city-showcase-btn').addEventListener('click', showCityShowcase);
    document.getElementById('customize-btn').addEventListener('click', showCustomization);
    
    // Building area drop zone
    cityCanvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        cityCanvas.style.backgroundColor = '#d5f5e3';
    });
    
    cityCanvas.addEventListener('dragleave', () => {
        cityCanvas.style.backgroundColor = isDaytime ? '#ecf0f1' : '#2c3e50';
    });
    
    cityCanvas.addEventListener('drop', handleCityCanvasDrop);
    
    // Enable dragging placed blocks around the canvas
    cityCanvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedBlock) {
            const rect = cityCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left - offsetX;
            const y = e.clientY - rect.top - offsetY;
            
            // Snap to grid while dragging
            const snapSize = 10;
            const snappedX = Math.round(x / snapSize) * snapSize;
            const snappedY = Math.round(y / snapSize) * snapSize;
            
            draggedBlock.style.left = `${Math.max(0, Math.min(snappedX, rect.width - 50))}px`;
            draggedBlock.style.top = `${Math.max(0, Math.min(snappedY, rect.height - 50))}px`;
        }
    });
    
    // Mini-game button
    minigameBtn.addEventListener('click', startMiniGame);
    
    // Undo button
    undoBtn.addEventListener('click', undoLastAction);
    
// Initial template setup
    updateBuildingTemplates();
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);