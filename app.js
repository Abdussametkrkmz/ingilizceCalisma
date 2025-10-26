let currentFlashcard = 0;
let flashcards = [];

// Dersleri ve flashcard'ları JSON'dan yükle
async function loadData() {
  const lessonResp = await fetch('lessons.json');
  const lessons = await lessonResp.json();
  document.getElementById('lesson-content').innerHTML = `
    <h3>${lessons[0].day} - Vocabulary</h3>
    <ul>
      ${lessons[0].vocabulary.map(v => `<li>${v.word} - ${v.meaning} <br>Example: ${v.example}</li>`).join('')}
    </ul>
  `;

  const flashResp = await fetch('flashcards.json');
  flashcards = await flashResp.json();
  showFlashcard();
}

function showFlashcard() {
  if(currentFlashcard >= flashcards.length) currentFlashcard = 0;
  const card = flashcards[currentFlashcard];
  document.getElementById('word').textContent = card.word;
  document.getElementById('meaning').textContent = card.meaning;
  document.getElementById('example').textContent = card.example;
}

document.getElementById('know-btn').addEventListener('click', () => {
  flashcards[currentFlashcard].status = 'known';
  currentFlashcard++;
  showFlashcard();
});

document.getElementById('dont-know-btn').addEventListener('click', () => {
  flashcards[currentFlashcard].status = 'unknown';
  currentFlashcard++;
  showFlashcard();
});

// Günlük ders “done” butonu
document.getElementById('mark-done').addEventListener('click', () => {
  alert("Lesson marked as done!");
});

loadData();
