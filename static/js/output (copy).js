// Run Python code
function runCode(editor, outputElement, sessionFiles, currentFilename, sessionImages) {
    // Save the current file before running
    if (sessionFiles && currentFilename) {
        if (typeof saveCurrentFile === 'function') {
            saveCurrentFile(editor, sessionFiles, currentFilename);
        } else {
            // Fallback if saveCurrentFile is not available
            if (sessionFiles.has(currentFilename)) {
                sessionFiles.set(currentFilename, {
                    content: editor.getValue(),
                    lastModified: new Date()
                });
            }
        }
    }
    
    outputElement.textContent = "Running...";
    
    // Get current file content
    const code = editor.getValue();
    
    // Use AJAX to send code to server for execution
    fetch('/api/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            outputElement.textContent = data.output || '';
            
            if (data.error && data.error.trim() !== '') {
                outputElement.innerHTML += '\n\n<span class="error-text">' + data.error + '</span>';
            }
            
            // Process images if any were generated
            if (data.images && data.images.length > 0) {
                // Add images to session storage
                data.images.forEach(img => {
                    sessionImages.push({
                        id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        dataUrl: img.url,
                        filename: img.filename,
                        timestamp: new Date().toLocaleTimeString()
                    });
                });
                
                // Switch to images tab to show the new images
                document.querySelector('.tab-button[data-tab="images"]').click();
                
                // Refresh the image gallery
                refreshImageGallery(document.getElementById('image-gallery'), sessionImages);
            }
        } else {
            outputElement.innerHTML = '<span class="error-text">Error: ' + (data.error || 'Unknown error') + '</span>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        outputElement.innerHTML = '<span class="error-text">Failed to execute code: ' + error.message + '</span>';
    });
}

// Refresh the image gallery
function refreshImageGallery(imageGallery, sessionImages) {
    // Clear the gallery
    imageGallery.innerHTML = '';
    
    if (sessionImages.length === 0) {
        imageGallery.innerHTML = '<div class="image-placeholder">No images generated yet in this session.</div>';
        return;
    }
    
    // Add each image to the gallery
    sessionImages.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const img = document.createElement('img');
        img.src = image.dataUrl;
        img.alt = image.filename;
        img.addEventListener('click', () => showImageModal(image));
        
        const imageName = document.createElement('div');
        imageName.className = 'image-name';
        imageName.textContent = `${image.filename} (${image.timestamp})`;
        
        const imageActions = document.createElement('div');
        imageActions.className = 'image-actions';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-button';
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', () => downloadImage(image));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            deleteImage(image.id, sessionImages);
            refreshImageGallery(imageGallery, sessionImages);
        });
        
        imageActions.appendChild(downloadBtn);
        imageActions.appendChild(deleteBtn);
        
        imageItem.appendChild(img);
        imageItem.appendChild(imageName);
        imageItem.appendChild(imageActions);
        
        imageGallery.appendChild(imageItem);
    });
}

// Show image in modal
function showImageModal(image) {
    const modalImage = document.getElementById('modal-image');
    const imageModal = document.getElementById('image-modal');
    const downloadModalImage = document.getElementById('download-modal-image');
    
    modalImage.src = image.dataUrl;
    imageModal.style.display = 'flex';
    
    // Set up download button
    downloadModalImage.onclick = function() {
        downloadImage(image);
    };
}

// Download an image
function downloadImage(image) {
    const a = document.createElement('a');
    a.href = image.dataUrl;
    a.download = image.filename;
    a.click();
}

// Delete an image
function deleteImage(imageId, sessionImages) {
    // Remove from session array
    const index = sessionImages.findIndex(img => img.id === imageId);
    if (index !== -1) {
        sessionImages.splice(index, 1);
    }
}

// Setup tab switching
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Setup modal close events
function setupModalEvents() {
    const imageModal = document.getElementById('image-modal');
    const closeModal = document.getElementById('close-modal');
    
    closeModal.addEventListener('click', function() {
        imageModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === imageModal) {
            imageModal.style.display = 'none';
        }
    });
}
