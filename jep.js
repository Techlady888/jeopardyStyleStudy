document.addEventListener('DOMContentLoaded', function () {
    let score = 0; // Initialize score variable
    let fetchingQuestions = false; // Flag to track if questions are being fetched

    function fetchTriviaQuestions() {
        if (fetchingQuestions) return; // Prevent multiple rapid requests
        fetchingQuestions = true; // Set flag to true to indicate that questions are being fetched

        const apiUrl = 'https://opentdb.com/api.php?amount=25&category=18'; // URL for fetching trivia questions
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Data received successfully, handle it here
                console.log('Trivia questions:', data); // Log the fetched trivia questions to the console
                // Display the first question
                displayQuestion(data.results[0]); // Display the first question when fetched
                fetchingQuestions = false; // Reset flag to false after questions are fetched
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching trivia questions:', error);
                fetchingQuestions = false; // Reset flag to false if an error occurs
            });
    }

    function displayQuestion(question) {
        const questionDisplay = document.getElementById('question-display');
        questionDisplay.innerHTML = `
            <div class="question-text">${question.question}</div>
            <div class="answer-options">
                ${question.incorrect_answers.map(answer => `<div class="option">${answer}</div>`).join('')}
                <div class="option correct">${question.correct_answer}</div> <!-- Add class 'correct' to correct answer option -->
            </div>
        `;
        questionDisplay.classList.add('fullscreen'); // Add fullscreen class
        
        // Add event listener to answer options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function () {
                if (option.classList.contains('correct')) { // Check if clicked option is correct
                    alert('Correct!');
                    score += 100; // Increase score if correct
                } else {
                    alert('Incorrect! The correct answer is: ' + question.correct_answer);
                }
                // Update score display
                updateScoreDisplay();
                
                // Hide fullscreen question display when user clicks OK in the alert dialog
                questionDisplay.style.display = 'none';
                
                // Re-enable event listeners for clicking on questions after a brief delay
                setTimeout(enableQuestionClickListeners, 1000);
            });
        });
    }
    
    // Function to enable event listeners for clicking on questions
    function enableQuestionClickListeners() {
        document.querySelectorAll('.question').forEach(question => {
            question.addEventListener('click', throttledFetchQuestions);
        });
    }

    // Throttle function to limit the rate of requests
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    const throttledFetchQuestions = throttle(fetchTriviaQuestions, 1000);

    // Call the enableQuestionClickListeners function when the DOM content is loaded
    enableQuestionClickListeners(); // Call the function to enable event listeners for clicking on questions

    // Add console log to verify that the function is called
    console.log('enableQuestionClickListeners function called.');

    // Function to update score display
    function updateScoreDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.textContent = 'Score: ' + score;
    }
});









