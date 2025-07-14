// --- QUOTE SECTION --- //
const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

// Using the famous-quotes4 API from RapidAPI
const QUOTE_API_URL = 'https://famous-quotes4.p.rapidapi.com/random?category=all&count=2';

async function fetchNewQuote() {
    quoteTextElement.textContent = 'Fetching a new quote...';
    quoteAuthorElement.textContent = '';
    newQuoteBtn.disabled = true; // Disable button during fetch

    try {
        const response = await fetch(QUOTE_API_URL, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com',
                'x-rapidapi-key': '59a19a2ce4msh36c5c3536c0abefp1b4204jsn800c80bf5ad7'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response data:", data);
        // The new API returns an array of quotes, each with 'quote' and 'author'
        if (data && data.length > 0) {
            // Randomly select a quote from the array
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomQuote = data[randomIndex];
            quoteTextElement.textContent = `“${randomQuote.quote}”`;
            quoteAuthorElement.textContent = `— ${randomQuote.author}`;
        } else {
            throw new Error('No quotes found in response');
        }
    } catch (error) {
        console.error("Could not fetch quote:", error);
        // Fallback quote in case of an API error
        quoteTextElement.textContent = "“The best way to predict the future is to invent it.”";
        quoteAuthorElement.textContent = "— Alan Kay";
    } finally {
        newQuoteBtn.disabled = false; // Re-enable button
    }
}

// Event listener for the "New Quote" button
newQuoteBtn.addEventListener('click', fetchNewQuote);

// Fetch an initial quote when the page loads
fetchNewQuote();


// --- QUIZ SECTION --- //
const quizQuestions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Trainer Marking Language", correct: false },
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Hyperlinks and Text Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false }
        ]
    },
    {
        question: "Which property is used to change the background color in CSS?",
        answers: [
            { text: "color", correct: false },
            { text: "bgcolor", correct: false },
            { text: "background-color", correct: true },
            { text: "background", correct: false }
        ]
    },
    {
        question: "Which JavaScript method is used to write on the browser's console?",
        answers: [
            { text: "console.write()", correct: false },
            { text: "console.output()", correct: false },
            { text: "console.log()", correct: true },
            { text: "console.print()", correct: false }
        ]
    },
    {
        question: "What is the correct syntax for referring to an external script called 'app.js'?",
        answers: [
            { text: "<script src='app.js'>", correct: true },
            { text: "<script href='app.js'>", correct: false },
            { text: "<script name='app.js'>", correct: false },
            { text: "<script link='app.js'>", correct: false }
        ]
    }
];

// Get all elements from the DOM
const quizStartScreen = document.getElementById('quiz-start-screen');
const startQuizBtn = document.getElementById('start-quiz-btn');
const questionContainer = document.getElementById('question-container');
const questionTextElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const quizControls = document.getElementById('quiz-controls');
const nextBtn = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results-container');
const scoreTextElement = document.getElementById('score-text');
const restartQuizBtn = document.getElementById('restart-quiz-btn');

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    quizStartScreen.classList.add('hide');
    resultsContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    quizControls.classList.remove('hide');

    currentQuestionIndex = 0;
    score = 0;
    nextBtn.classList.add('hide'); // Hide 'Next' button at the start of a question
    showNextQuestion();
}

function showNextQuestion() {
    resetState();
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion(quizQuestions[currentQuestionIndex]);
    } else {
        showResults();
    }
}

function showQuestion(question) {
    questionTextElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextBtn.classList.add('hide');
    // Clear previous answer buttons
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === 'true';

    if (isCorrect) {
        score++;
    }

    // Show correct/wrong colors for all buttons and disable them
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
        button.disabled = true;
    });

    // Show the 'Next' or 'Finish' button
    if (quizQuestions.length > currentQuestionIndex + 1) {
        nextBtn.innerText = "Next";
    } else {
        nextBtn.innerText = "Finish";
    }
    nextBtn.classList.remove('hide');
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResults() {
    questionContainer.classList.add('hide');
    quizControls.classList.add('hide');
    resultsContainer.classList.remove('hide');
    scoreTextElement.textContent = `${score} / ${quizQuestions.length}`;
}

// Event Listeners for Quiz
startQuizBtn.addEventListener('click', startQuiz);

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    showNextQuestion();
});

// FIX: Add event listener for the restart button
restartQuizBtn.addEventListener('click', startQuiz);