// Create this as minimal-fix.js

(function() {
    // Wait for everything to be loaded
    setTimeout(function() {
        console.log('Applying minimal fix');
        
        // Function to add click handler to a tab
        function setupTab(tab) {
            const filename = tab.getAttribute('data-filename');
            
            // Get a reference to the actual file content from sessionFiles
            const content = window.sessionFiles.get(filename)?.content || '';
            
            // Store the content directly on the tab element
            tab.setAttribute('data-content', content);
            
            // Add a direct click handler
            tab.onclick = function(e) {
                // Skip if clicked on close button
                if (e.target.classList.contains('file-tab-close')) {
                    return;
                }
                
                console.log('Direct tab click:', filename);
                
                // Get current content from editor and save it
                const currentFilename = window.currentFilename;
                if (currentFilename && window.sessionFiles.has(currentFilename)) {
                    const editorContent = document.querySelector('.CodeMirror').CodeMirror.getValue();
                    window.sessionFiles.set(currentFilename, {
                        content: editorContent,
                        lastModified: new Date()
                    });
                    
                    // Update content attribute on the current tab
                    document.querySelector(`.file-tab[data-filename="${currentFilename}"]`)?.setAttribute(
                        'data-content', 
                        editorContent
                    );
                }
                
                // Get content from clicked tab
                const newContent = window.sessionFiles.get(filename)?.content || '';
                
                // DIRECT update of the editor - bypassing all other code
                const cmEditor = document.querySelector('.CodeMirror').CodeMirror;
                
                // Force a complete editor reset
                setTimeout(() => {
                    cmEditor.setValue('');  // Clear first
                    setTimeout(() => {
                        cmEditor.setValue(newContent);  // Then set new content
                        cmEditor.clearHistory();  // Clear undo history
                        cmEditor.refresh();  // Force refresh
                    }, 5);
                }, 5);
                
                // Update the current filename
                window.currentFilename = filename;
                
                // Update tab UI
                document.querySelectorAll('.file-tab').forEach(t => {
                    if (t.getAttribute('data-filename') === filename) {
                        t.classList.add('active');
                    } else {
                        t.classList.remove('active');
                    }
                });
                
                console.log('Direct tab switched to:', filename);
            };
            
            console.log('Set up direct handler for tab:', filename);
        }
        
        // Setup all tabs on page load
        document.querySelectorAll('.file-tab').forEach(setupTab);
        
        // Also setup tabs when they're added
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type !== 'childList') return;
                
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('file-tab')) {
                        // Wait a moment for the tab to be fully initialized
                        setTimeout(() => setupTab(node), 50);
                    }
                });
            });
        });
        
        observer.observe(document.getElementById('file-tabs'), {
            childList: true,
            subtree: false
        });
        
        console.log('Minimal fix applied');
    }, 1000);
})();
