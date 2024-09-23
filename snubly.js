(function () {
    var formSelector = 'input[type="email"]'; // Select email input field
    var submitButtonSelector = 'button[type="submit"]'; // Select submit button
    var feedbackSelector = '.email-feedback'; // Placeholder for visual feedback (green checkmark or red error)

    // Retrieve API config from the script embedded in the HTML page
    var api_url = window.emailValidation.api_url; // Bubble API endpoint
    var appToken = window.emailValidation.app_token; // App token for authentication

    // Disable the submit button initially
    function disableSubmitButton() {
        var submitButton = document.querySelector(submitButtonSelector);
        if (submitButton) {
            submitButton.disabled = true;
        }
    }

    // Enable the submit button if email is valid
    function enableSubmitButton() {
        var submitButton = document.querySelector(submitButtonSelector);
        if (submitButton) {
            submitButton.disabled = false;
        }
    }

    // Display validation result (valid or invalid) with visual feedback
    function showValidationResult(isValid) {
        var emailField = document.querySelector(formSelector);
        var feedbackElement = document.querySelector(feedbackSelector);

        if (isValid) {
            emailField.classList.add("valid-email");
            emailField.classList.remove("invalid-email");

            // Show green checkmark
            feedbackElement.innerHTML = '<span style="color: green;">&#10004; Valid email</span>';
        } else {
            emailField.classList.add("invalid-email");
            emailField.classList.remove("valid-email");

            // Show red error
            feedbackElement.innerHTML = '<span style="color: red;">&#10006; Invalid email</span>';
        }
    }

    // Function to validate email using API call
    function validateEmail(email) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", api_url, true); // Make an API call to the Bubble API endpoint
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // Parse the response from the Bubble API
                var response = JSON.parse(xhr.responseText);
                if (response && response.valid) {
                    // If the email is valid, allow submission
                    showValidationResult(true);
                    enableSubmitButton();
                } else {
                    // If the email is invalid, block submission
                    showValidationResult(false);
                    disableSubmitButton();
                }
            }
        };

        // Send the email and app token to the Bubble API for validation
        xhr.send(JSON.stringify({
            email: email,
            app_token: appToken
        }));
    }

    // Listen for input changes in the email field
    document.addEventListener("input", function () {
        var emailField = document.querySelector(formSelector);
        if (emailField && emailField.value) {
            var email = emailField.value;
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern check
            if (emailPattern.test(email)) {
                validateEmail(email); // Validate the email via API if the pattern is correct
            } else {
                showValidationResult(false); // Mark email as invalid if pattern doesn't match
                disableSubmitButton(); // Disable submission
            }
        }
    });

    disableSubmitButton(); // Initially disable submit button until validation is done
})();


