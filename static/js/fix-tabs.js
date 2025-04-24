// Create this as a new file named fixed-tabs.js

document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for all other scripts to initialize
    setTimeout(function() {
        console.log('Applying final tab switching fix');
        
        // Get CodeMirror editor directly
        const editorElement = document.querySelector('.CodeMirror');
        if (!editorElement || !editorElement.CodeMirror) {
            console.error('Could not find CodeMirror editor');
            return;
        }
        
        const editor = editorElement.CodeMirror;
        console.log('Found CodeMirror editor');
        
        // Track processed tabs to avoid duplicate handlers
        const processedTabs = new Set();
        
        // Function to add handlers to a tab
        function addTabHandler(tab) {
            const tabId = tab.getAttribute('data-filename') + '-' + Math.random().toString(36).substring(2, 8);
            
            // Skip if already processed
            if (processedTabs.has(tab)) {
                return;
            }
            
            // Mark as processed
            processedTabs.add(tab);
            
            const filename = tab.getAttribute('data-filename');
            console.log('Adding handler to tab:', filename);
            
            // Add click handler
            tab.addEventListener('click', function tabClickHandler(e) {
                // Skip if clicked on close button
                if (e.target.classList.contains('file-tab-close')) {
                    return;
                }
                
                console.log('Tab clicked:', filename);
                
                // Get files from global variables
                const filesMap = window.sessionFiles || new Map();
                
                // Check if file exists
                if (!filesMap.has(filename)) {
                    console.error('File not found:', filename);
                    return;
                }
                
                // Get current file name
                const currentFile = window.currentFilename || 'demo.py';
                
                // Save current content
                if (filesMap.has(currentFile)) {
                    const currentContent = editor.getValue();
                    filesMap.set(currentFile, {
                        content: currentContent,
                        lastModified: new Date()
                    });
                    console.log('Saved current file:', currentFile);
                }
                
                // Get content of clicked file
                const fileData = filesMap.get(filename);
                
                // Force editor update
                editor.setValue(fileData.content);
                editor.refresh();
                
                // Update current filename variable
                window.currentFilename = filename;
                
                // Update tab UI
                const tabs = document.querySelectorAll('.file-tab');
                tabs.forEach(t => {
                    if (t.getAttribute('data-filename') === filename) {
                        t.classList.add('active');
                    } else {
                        t.classList.remove('active');
                    }
                });
                
                console.log('Switched to file:', filename);
            });
            
            // Handle close button
            const closeBtn = tab.querySelector('.file-tab-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering tab click
                    
                    console.log('Close button clicked for:', filename);
                    
                    // Get files from global variables
                    const filesMap = window.sessionFiles || new Map();
                    
                    // Don't allow closing the last file
                    if (filesMap.size <= 1) {
                        alert("Cannot close the last file. At least one file must remain open.");
                        return;
                    }
                    
                    // Get current filename
                    const currentFile = window.currentFilename || 'demo.py';
                    
                    // If closing current file, switch to another first
                    if (filename === currentFile) {
                        for (const [name, _] of filesMap) {
                            if (name !== filename) {
                                // Load new file content
                                editor.setValue(filesMap.get(name).content);
                                
                                // Update current filename
                                window.currentFilename = name;
                                
                                break;
                            }
                        }
                    }
                    
                    // Remove file from storage
                    filesMap.delete(filename);
                    
                    // Remove tab from DOM
                    tab.remove();
                    
                    // Update tab UI
                    const newCurrentFile = window.currentFilename;
                    const tabs = document.querySelectorAll('.file-tab');
                    tabs.forEach(t => {
                        if (t.getAttribute('data-filename') === newCurrentFile) {
                            t.classList.add('active');
                        } else {
                            t.classList.remove('active');
                        }
                    });
                    
                    // Remove from processed tabs set
                    processedTabs.delete(tab);
                    
                    console.log('Closed file:', filename, 'Current file now:', newCurrentFile);
                });
            }
        }
        
        // Process existing tabs
        const tabs = document.querySelectorAll('.file-tab');
        tabs.forEach(addTabHandler);
        console.log('Processed', tabs.length, 'existing tabs');
        
        // Set up a lightweight mutation observer that only processes new tabs
        const tabsContainer = document.getElementById('file-tabs');
        if (tabsContainer && window.MutationObserver) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1 && node.classList.contains('file-tab')) {
                                addTabHandler(node);
                            }
                        });
                    }
                });
            });
            
            observer.observe(tabsContainer, { 
                childList: true,    // Watch for changes to child elements
                subtree: false      // Don't watch entire subtree to avoid excessive triggers
            });
            
            console.log('Set up mutation observer for new tabs');
        }
        
        console.log('Final tab switching fix applied');
    }, 500);
});
