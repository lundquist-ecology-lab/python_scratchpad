// Add this as a new file: debug-tabs.js

document.addEventListener('DOMContentLoaded', function() {
    // Wait for everything else to initialize
    setTimeout(function() {
        console.log('==== TAB SWITCHING DIAGNOSTICS ====');
        
        // Check global variables
        console.log('Global variables:', {
            editor: !!window.editor, 
            sessionFiles: !!window.sessionFiles,
            currentFilename: window.currentFilename,
            editorInstance: !!window.editorInstance
        });
        
        // Display all available files
        if (window.sessionFiles) {
            console.log('Files in sessionFiles:', Array.from(window.sessionFiles.keys()));
        }
        
        if (window.editorInstance && window.editorInstance.sessionFiles) {
            console.log('Files in editorInstance:', Array.from(window.editorInstance.sessionFiles.keys()));
        }
        
        // Check file tabs in the DOM
        const fileTabs = document.getElementById('file-tabs');
        const tabs = fileTabs ? fileTabs.querySelectorAll('.file-tab') : [];
        
        console.log('File tabs in DOM:', Array.from(tabs).map(tab => ({
            filename: tab.getAttribute('data-filename'),
            isActive: tab.classList.contains('active'),
            hasClickHandler: !!tab._hasClickHandler
        })));
        
        // Add test handlers to tabs if needed
        tabs.forEach(tab => {
            if (!tab._hasClickHandler) {
                tab._hasClickHandler = true;
                
                tab.addEventListener('click', function(e) {
                    // Ignore if clicked on the close button
                    if (e.target.classList.contains('file-tab-close')) return;
                    
                    const filename = this.getAttribute('data-filename');
                    console.log('DEBUG: Tab clicked:', filename);
                    
                    // Check if the file exists in our storage
                    if (window.sessionFiles && window.sessionFiles.has(filename)) {
                        console.log('DEBUG: File found in sessionFiles');
                        
                        // Update active tab UI
                        tabs.forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Save current content
                        if (window.sessionFiles.has(window.currentFilename)) {
                            console.log('DEBUG: Saving current file content');
                            window.sessionFiles.set(window.currentFilename, {
                                content: window.editor.getValue(),
                                lastModified: new Date()
                            });
                        }
                        
                        // Load the selected file
                        console.log('DEBUG: Loading file content');
                        window.currentFilename = filename;
                        window.editor.setValue(window.sessionFiles.get(filename).content);
                    } else {
                        console.log('DEBUG: File not found in sessionFiles!');
                    }
                });
                
                console.log('Added debug click handler to tab:', tab.getAttribute('data-filename'));
            }
        });
        
        // Add a button to manually test tab switching
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Tab Switching';
        testButton.style.position = 'fixed';
        testButton.style.top = '10px';
        testButton.style.right = '10px';
        testButton.style.zIndex = '9999';
        testButton.style.backgroundColor = '#ff6b6b';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.borderRadius = '4px';
        testButton.style.padding = '8px 12px';
        
        testButton.onclick = function() {
            // Get all filenames
            const filenames = Array.from(window.sessionFiles.keys());
            
            if (filenames.length <= 1) {
                alert('Need at least 2 files to test tab switching. Please create another file.');
                return;
            }
            
            // Find a file that's not the current one
            const currentFile = window.currentFilename;
            const targetFile = filenames.find(f => f !== currentFile) || filenames[0];
            
            console.log('Testing switch from', currentFile, 'to', targetFile);
            
            // Find the tab for that file
            const targetTab = Array.from(tabs).find(tab => 
                tab.getAttribute('data-filename') === targetFile
            );
            
            if (targetTab) {
                console.log('Found target tab, clicking it');
                targetTab.click();
            } else {
                console.log('Target tab not found in DOM!');
            }
        };
        
        document.body.appendChild(testButton);
        
        console.log('==== END DIAGNOSTICS ====');
    }, 1000);
});
