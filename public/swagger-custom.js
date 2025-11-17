
window.addEventListener('load', function() {
  // Function to clear pre-filled values and set placeholders
  function setPlaceholders() {
    // Wait for Swagger UI to render
    setTimeout(() => {
      const textareas = document.querySelectorAll('.body-param__text');
      const inputs = document.querySelectorAll('.parameters input[type="text"]');

      // Handle textarea (request body)
      textareas.forEach(textarea => {
        if (textarea.value && textarea.value.trim() !== '') {
          try {
            const jsonValue = JSON.parse(textarea.value);
            // Clear the textarea
            textarea.value = '';
            // Set placeholder with formatted JSON
            textarea.placeholder = JSON.stringify(jsonValue, null, 2);
          } catch (e) {
            // If not JSON, just set as placeholder
            const originalValue = textarea.value;
            textarea.value = '';
            textarea.placeholder = originalValue;
          }
        }
      });

      // Handle input fields (query parameters)
      inputs.forEach(input => {
        if (input.value && input.value.trim() !== '') {
          const originalValue = input.value;
          input.value = '';
          input.placeholder = originalValue;
        }
      });
    }, 500);
  }

  // Run on initial load
  setPlaceholders();

  // Re-run when "Try it out" is clicked
  const observer = new MutationObserver(setPlaceholders);
  observer.observe(document.body, { childList: true, subtree: true });
});
