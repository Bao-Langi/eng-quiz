const SHEET_URL = "https://script.google.com/macros/s/AKfycbykf4v3RP18SeF3plWr-HlYR_RU3_cAxo9sxOwq35PXKQBRwEHJ5TIwurUdaR3T6k8C/exec";

const form = document.getElementById("quiz");
const result = document.getElementById("result");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const cards = document.querySelectorAll(".card");
    let score = 0;
    const answers = [];

    cards.forEach((card) => {
        const checked = card.querySelector("input:checked");
        const options = card.querySelectorAll(".option");

        options.forEach((opt) => opt.classList.remove("correct", "wrong"));

        const correctOption = options[Number(card.dataset.answer)];
        correctOption.classList.add("correct");

        // записать выбранный вариант (или пусто)
        answers.push(checked ? Number(checked.value) : "");

        if (checked && checked.value === card.dataset.answer) {
            score++;
        } else if (checked) {
            checked.closest(".option").classList.add("wrong");
        }
    });

    result.textContent = `Score: ${score} / ${cards.length}`;

    // отправка результата в таблицу
    fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
            total: cards.length,
            score: score,
            answers: answers
        })
    });

    form.querySelectorAll("input").forEach((input) => {
        input.disabled = true;
    });
    form.querySelector("button").disabled = true;
});
