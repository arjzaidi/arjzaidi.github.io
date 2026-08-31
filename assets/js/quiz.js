/* ==========================================================================
   quiz.js — interactive quiz handler for lecture pages
   Usage: <script src="../assets/js/quiz.js" defer></script>
   Markup: see lecture HTML (data-quiz, data-question, data-correct, ...)
   ========================================================================== */
(function () {
  "use strict";

  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var questions = quiz.querySelectorAll("[data-question]");
    var checkBtn = quiz.querySelector("[data-check]");
    var resetBtn = quiz.querySelector("[data-reset]");
    var scoreEl = quiz.querySelector("[data-score]");
    var totalEl = quiz.querySelector("[data-total]");
    var banner = quiz.querySelector("[data-score-banner]");
    var total = questions.length;
    if (totalEl) totalEl.textContent = total;

    // Select an option (before checking)
    questions.forEach(function (q) {
      q.querySelectorAll(".quiz-option").forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (quiz.dataset.locked === "true") return;
          q.querySelectorAll(".quiz-option").forEach(function (o) {
            o.classList.remove("selected");
          });
          opt.classList.add("selected");
        });
      });
    });

    // Check answers: reveal key + score
    checkBtn.addEventListener("click", function () {
      if (quiz.dataset.locked === "true") return;
      quiz.dataset.locked = "true";
      var score = 0;

      questions.forEach(function (q) {
        var selected = q.querySelector(".quiz-option.selected");
        var correctOpt = q.querySelector('.quiz-option[data-correct="true"]');
        var feedback = q.querySelector(".quiz-feedback");

        if (selected && selected.dataset.correct === "true") {
          score++;
          selected.classList.add("correct");
          feedback.textContent = q.dataset.feedbackCorrect || "Correct!";
          feedback.className = "quiz-feedback show correct";
        } else if (selected) {
          selected.classList.add("incorrect");
          correctOpt.classList.add("correct");
          feedback.textContent = q.dataset.feedbackIncorrect || "Not quite — the correct answer is highlighted.";
          feedback.className = "quiz-feedback show incorrect";
        } else {
          correctOpt.classList.add("correct");
          feedback.textContent = q.dataset.feedbackUnanswered || "No answer selected — the correct answer is highlighted.";
          feedback.className = "quiz-feedback show incorrect";
        }

        q.querySelectorAll(".quiz-option").forEach(function (o) { o.disabled = true; });
      });

      scoreEl.textContent = score;
      banner.hidden = false;
      checkBtn.disabled = true;
      banner.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // Reset quiz
    resetBtn.addEventListener("click", function () {
      quiz.dataset.locked = "false";
      questions.forEach(function (q) {
        q.querySelectorAll(".quiz-option").forEach(function (o) {
          o.classList.remove("selected", "correct", "incorrect");
          o.disabled = false;
        });
        var feedback = q.querySelector(".quiz-feedback");
        feedback.className = "quiz-feedback";
        feedback.textContent = "";
      });
      banner.hidden = true;
      checkBtn.disabled = false;
    });
  });
})();