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
  } catch {
    answer.textContent = "Could not reach the server. Please try again.";
  } finally {
    askButton.disabled = false;
    askButton.innerHTML = "Ask AI <span>→</span>";
  }
});
