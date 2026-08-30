const question = document.querySelector("#question");
const askButton = document.querySelector("#askButton");
const answerCard = document.querySelector("#answerCard");
const answer = document.querySelector("#answer");
let mode = "explain";
let urduMode = false;

const urduButton = document.querySelector("#urduButton");
urduButton.addEventListener("click", () => {
  urduMode = !urduMode;
  urduButton.classList.toggle("active", urduMode);
  urduButton.textContent = urduMode ? "Urdu answer: ON" : "Urdu answer";
});

document.querySelectorAll(".mode").forEach((button) => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    document.querySelectorAll(".mode").forEach((item) => item.classList.toggle("active", item === button));
  });
});

askButton.addEventListener("click", async () => {
  const text = question.value.trim();
  if (!text) {
    question.focus();
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Thinking…";
  answerCard.hidden = false;
  answer.textContent = "";

  try {
    const response = await fetch("/api/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  question: urduMode ? `${text}\n\nPlease reply in Urdu.` : text,
  mode
})
    });
    const data = await response.json();
    answer.textContent = data.answer || data.error || "Something went wrong. Please try again.";
    showSpeakButton();
    if (copyBtn) copyBtn.style.display = 'inline-block';
  } catch {
    answer.textContent = "Could not reach the server. Please try again.";
  } finally {
    askButton.disabled = false;
    askButton.innerHTML = "Ask AI <span>→</span>";
  }
});

// Voice Feature: Text-to-Speech logic
const speakBtn = document.getElementById('speakBtn');

// Jab AI ka response aaye to button show karne ke liye logic
function showSpeakButton() {
  if (speakBtn) {
    speakBtn.style.display = 'inline-block';
  }
}

// Button click par answer bol kar sunane ka event
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    // Agar pehle se kuch bol raha ho to stop karein
    window.speechSynthesis.cancel();

    // Answer container se text uthana
    const answerElement = document.getElementById('answer') || document.querySelector('.answer-box');
    const textToSpeak = answerElement ? answerElement.innerText : '';

    if (textToSpeak.trim() !== '') {
      const speech = new SpeechSynthesisUtterance(textToSpeak);
      speech.rate = 0.9; // Normal bolne ki speed
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    }
  });
}
// Copy to Clipboard Feature
const copyBtn = document.getElementById('copyBtn');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const answerElement = document.getElementById('answer');
    const textToCopy = answerElement ? answerElement.innerText : '';

    if (textToCopy.trim() !== '') {
      try {
        await navigator.clipboard.writeText(textToCopy);
        copyBtn.innerText = '✅ Copied!';
        setTimeout(() => {
          copyBtn.innerText = '📋 Copy Answer';
        }, 2000);
      } catch (err) {
        console.error('Copy karne mein masla aaya: ', err);
      }
    }
  });
}
