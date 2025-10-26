// script.js

let loadedProgramData = {};

// Dosyayı okuma fonksiyonu
function loadFile() {
    const fileInput = document.getElementById('programFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Lütfen bir program dosyası yükleyin.");
        return;
    }

    // Dosya adını (örneğin Day1.txt'den Day 1) alıp başlığa yazar
    const dayName = file.name.replace('.txt', '').replace('Day', 'Gün');
    document.getElementById('day-title').textContent = `${dayName} Çalışma Programı`;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const fileContent = e.target.result;
        
        // İçeriği ayrıştırma fonksiyonunu çağır
        parseProgramFile(fileContent);
        
        // İçerik alanını görünür yap
        document.getElementById('content-area').style.display = 'block';
        alert(`Program (${file.name}) başarıyla yüklendi!`);
    };
    
    reader.onerror = function() {
        alert('Dosya okuma hatası!');
    };
    
    reader.readAsText(file, 'UTF-8');
}

// Metin dosyasını işleme fonksiyonu (Parser)
function parseProgramFile(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentSection = null;
    let quizData = [];
    let flashcardData = [];
    
    lines.forEach(line => {
        if (line === '[QUIZ]') {
            currentSection = 'QUIZ';
            return;
        }
        if (line === '[FLASHCARDS]') {
            currentSection = 'FLASHCARDS';
            return;
        }

        if (currentSection === 'QUIZ') {
            // Örnek: 1. I always [___]... | commute
            const parts = line.split('|').map(p => p.trim());
            if (parts.length === 2) {
                quizData.push({ text: parts[0], answer: parts[1] });
            }
        } else if (currentSection === 'FLASHCARDS') {
            // Örnek: commute, işe gidip gelmek, verb, I commute...
            const parts = line.split(',').map(p => p.trim());
            if (parts.length >= 4) {
                flashcardData.push({
                    word: parts[0],
                    meaning: parts[1],
                    pos: parts[2],
                    sentence: parts[3]
                });
            }
        }
    });

    loadedProgramData.quiz = quizData;
    loadedProgramData.flashcards = flashcardData;

    // Veriler yüklendikten sonra arayüzü oluştur
    renderQuiz(loadedProgramData.quiz);
    renderFlashcards(loadedProgramData.flashcards);
}

// Quiz sorularını arayüze yerleştirme
function renderQuiz(quizQuestions) {
    const container = document.getElementById('quiz-questions');
    container.innerHTML = ''; 
    
    quizQuestions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-item';
        
        // Cevap alanı yerine [___] ifadesini göstermek için regex kullanılır
        const displayQuestion = q.text.replace(/\[\s*\_+\s*\]/g, '***<input type="text" id="quiz-input-' + index + '" placeholder="Cevap" size="10">***');

        qDiv.innerHTML = `
            <p>${index + 1}. ${displayQuestion}</p>
            <button onclick="checkAnswer(${index}, '${q.answer}')">Kontrol Et</button>
            <span id="quiz-result-${index}" class="result-span"></span>
        `;
        container.appendChild(qDiv);
    });
}

// Quiz cevabını kontrol etme
function checkAnswer(id, correct) {
    const input = document.getElementById(`quiz-input-${id}`);
    const resultSpan = document.getElementById(`quiz-result-${id}`);
    
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = correct.trim().toLowerCase();
    
    if (userAnswer === correctAnswer) {
        resultSpan.textContent = '✅ Doğru!';
        resultSpan.style.color = 'green';
    } else {
        resultSpan.textContent = `❌ Yanlış. Doğru cevap: ${correct}`;
        resultSpan.style.color = 'red';
    }
}

// Flashcard'ları arayüze yerleştirme
function renderFlashcards(cards) {
    const container = document.getElementById('flashcard-container');
    container.innerHTML = ''; 
    
    cards.forEach((card, index) => { 
        const cardElement = document.createElement('div');
        cardElement.className = 'flashcard'; 
        cardElement.onclick = function() { flipCard(this); };
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <h4>${index + 1}. ${card.word} (${card.pos})</h4>
                    <p class="sentence-text">${card.sentence}</p>
                    <p class="flip-hint">Tıkla: Anlamı Gör</p>
                </div>
                <div class="card-back">
                    <h4>${card.word}</h4>
                    <p class="meaning-text">${card.meaning}</p>
                    <p class="flip-hint">Tıkla: Kelimeyi Gör</p>
                </div>
            </div>
        `;
        container.appendChild(cardElement);
    });
}

// Kartı çevirme efekti
function flipCard(cardElement) {
    const inner = cardElement.querySelector('.card-inner');
    // Eğer kart 0 derecede ise (ön yüz görünür) 180 derece çevir
    if (inner.style.transform === 'rotateY(180deg)') {
        inner.style.transform = 'rotateY(0deg)';
    } else {
        // Eğer kart çevrilmemişse (veya başka bir açıda ise) 180 derece çevir
        inner.style.transform = 'rotateY(180deg)';
    }
}
