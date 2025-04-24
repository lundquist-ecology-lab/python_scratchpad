// Run Python code
function runCode(editor, outputElement, sessionFiles, currentFilename, sessionImages) {
    // Save the current file before running
    if (sessionFiles && currentFilename) {
        if (typeof saveCurrentFile === 'function') {
            saveCurrentFile(editor, sessionFiles, currentFilename);
        } else if (sessionFiles.has(currentFilename)) {
            sessionFiles.set(currentFilename, {
                content: editor.getValue(),
                lastModified: new Date()
            });
        }
    }

    outputElement.textContent = "Running...";
    const code = editor.getValue();

    fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
    })
    .then(response => response.json())
    .then(data => handleExecutionResult(data))
    .catch(error => {
        outputElement.innerHTML = `<span class="error-text">Error: ${error.message}</span>`;
    });
}

// Handle the execution result
function handleExecutionResult(data) {
    const outputEl = document.getElementById('output');
    const gallery = document.getElementById('image-gallery');

    // Reset output and image gallery
    outputEl.textContent = '';
    gallery.innerHTML = '';

    // Show output text
    if (data.output) {
        outputEl.textContent = data.output;
    }

    // Show error if any
    if (data.error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-text';
        errorDiv.innerText = data.error;
        outputEl.appendChild(errorDiv);
    }

    // Display images if any
    if (data.images && data.images.length > 0) {
        const placeholder = document.querySelector('.image-placeholder');
        if (placeholder) placeholder.style.display = 'none';

        data.images.forEach(img => {
            console.log('Rendering image:', img.url || img.data_url);
            const src = img.url || img.data_url;
            if (src) {
                const imgEl = document.createElement('img');
                imgEl.src = src;
                imgEl.alt = img.filename || 'Generated Image';
                imgEl.style.maxWidth = '100%';
                imgEl.style.marginBottom = '10px';
                gallery.appendChild(imgEl);
            }
        });

        // Auto-switch to Images tab
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelector('[data-tab="images"]').classList.add('active');
        document.getElementById('images-tab').classList.add('active');
    }
}

// Tab switching logic
function initializeTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;

            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
}

// Initialize tabs on load
window.addEventListener('DOMContentLoaded', initializeTabs);

// Expose globally
window.runCode = runCode;
window.handleExecutionResult = handleExecutionResult;
