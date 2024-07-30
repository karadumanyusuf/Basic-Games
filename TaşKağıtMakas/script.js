document.addEventListener("DOMContentLoaded", () => {
    const choices = document.querySelectorAll(".choice");
    const userChoiceDisplay = document.getElementById("user-choice");
    const computerChoiceDisplay = document.getElementById("computer-choice");
    const resultMessage = document.getElementById("result-message");
    const userScoreDisplay = document.getElementById("user-score");
    const computerScoreDisplay = document.getElementById("computer-score");

    const choicesArray = ["Taş", "Kağıt", "Makas"];
    let userScore = 0;
    let computerScore = 0;

    choices.forEach(choice => {
        choice.addEventListener("click", () => {
            const userChoice = choice.textContent;
            userChoiceDisplay.textContent = `Senin Seçimin: ${userChoice}`;
            
            const computerChoice = choicesArray[Math.floor(Math.random() * choicesArray.length)];
            computerChoiceDisplay.textContent = `Bilgisayarın Seçimi: ${computerChoice}`;
            
            const result = getResult(userChoice, computerChoice);
            resultMessage.textContent = result;

            if (result === "Kazandın!") {
                userScore++;
            } else if (result === "Kaybettin!") {
                computerScore++;
            }

            userScoreDisplay.textContent = userScore;
            computerScoreDisplay.textContent = computerScore;
        });
    });

    function getResult(userChoice, computerChoice) {
        if (userChoice === computerChoice) {
            return "Berabere!";
        }

        if (
            (userChoice === "Taş" && computerChoice === "Makas") ||
            (userChoice === "Kağıt" && computerChoice === "Taş") ||
            (userChoice === "Makas" && computerChoice === "Kağıt")
        ) {
            return "Kazandın!";
        } else {
            return "Kaybettin!";
        }
    }
});
