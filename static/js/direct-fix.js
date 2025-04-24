// Create this as direct-fix.js and add it at the end of your HTML

document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for other scripts to initialize
    setTimeout(function() {
        console.log('Applying direct editor fix');
        
        // Add direct click handlers to all tab elements
        function applyTabHandlers() {
            const tabElements = document.querySelectorAll('.file-tab');
            console.log('Found', tabElements.length, 'tab elements');
            
            tabElements.forEach(tab => {
                const filename = tab.getAttribute('data-filename');
                
                // Replace existing tab with clone to remove any previous handlers
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
                
                // Add direct click handler
                newTab.addEventListener('click', function(e) {
                    // Ignore if clicked on close button
                    if (e.target.classList.contains('file-tab-close')) return;
                    
                    // Log the click
                    console.log('DIRECT FIX: Tab clicked:', filename);
                    
                    // Get direct reference to editor and files
                    const editorElement = document.querySelector('.CodeMirror').CodeMirror;
                    
                    // Attempt to get files from multiple possible locations
                    let filesMap;
                    if (window.sessionFiles && window.sessionFiles instanceof Map) {
                        filesMap = window.sessionFiles;
                    } else if (window.editorInstance && window.editorInstance.sessionFiles instanceof Map) {
                        filesMap = window.editorInstance.sessionFiles;
                    } else {
                        console.error('Could not find sessionFiles map');
                        return;
                    }
                    
                    // Verify file exists
                    if (!filesMap.has(filename)) {
                        console.error('File not found:', filename);
                        return;
                    }
                    
                    // Get current file to save its content
                    let currentFile;
                    if (typeof window.currentFilename === 'string') {
                        currentFile = window.currentFilename;
                    } else if (window.editorInstance && typeof window.editorInstance.currentFilename === 'string') {
                        currentFile = window.editorInstance.currentFilename;
                    } else {
                        currentFile = 'demo.py';
                    }
                    
                    // Save current content
                    if (filesMap.has(currentFile)) {
                        const currentContent = editorElement.getValue();
                        console.log('DIRECT FIX: Saving current file content for', currentFile);
                        filesMap.set(currentFile, {
                            content: currentContent,
                            lastModified: new Date()
                        });
                    }
                    
                    // Get content of clicked file
                    const fileData = filesMap.get(filename);
                    console.log('DIRECT FIX: Loading content for', filename);
                    
                    // FORCE the editor to update with new content
                    setTimeout(function() {
                        // Set editor value
                        editorElement.setValue(fileData.content);
                        
                        // Set cursor at the beginning
                        editorElement.setCursor(0, 0);
                        
                        // Force refresh editor
                        editorElement.refresh();
                        
                        // Update current filename in all possible places
                        window.currentFilename = filename;
                        if (window.editorInstance) {
                            window.editorInstance.currentFilename = filename;
                        }
                        
                        console.log('DIRECT FIX: Editor updated with content for', filename);
                    }, 10);
                    
                    // Update active tab visual state
                    document.querySelectorAll('.file-tab').forEach(t => {
                        if (t.getAttribute('data-filename') === filename) {
                            t.classList.add('active');
                        } else {
                            t.classList.remove('active');
                        }
                    });
                });
                
                // Handle close button
                const closeButton = newTab.querySelector('.file-tab-close');
                if (closeButton) {
                    closeButton.addEventListener('click', function(e) {
                        e.stopPropagation(); // Prevent tab click event
                        
                        console.log('DIRECT FIX: Close button clicked for', filename);
                        
                        // Get files map
                        let filesMap;
                        if (window.sessionFiles && window.sessionFiles instanceof Map) {
                            filesMap = window.sessionFiles;
                        } else if (window.editorInstance && window.editorInstance.sessionFiles instanceof Map) {
                            filesMap = window.editorInstance.sessionFiles;
                        } else {
                            console.error('Could not find sessionFiles map');
                            return;
                        }
                        
                        // Don't allow closing the last file
                        if (filesMap.size <= 1) {
                            alert("Cannot close the last file. At least one file must remain open.");
                            return;
                        }
                        
                        // Get current filename
                        let currentFile;
                        if (typeof window.currentFilename === 'string') {
                            currentFile = window.currentFilename;
                        } else if (window.editorInstance && typeof window.editorInstance.currentFilename === 'string') {
                            currentFile = window.editorInstance.currentFilename;
                        } else {
                            currentFile = 'demo.py';
                        }
                        
                        // Get editor
                        const editorElement = document.querySelector('.CodeMirror').CodeMirror;
                        
                        // If closing current file, switch to another first
                        if (filename === currentFile) {
                            for (const [otherFilename, _] of filesMap) {
                                if (otherFilename !== filename) {
                                    // Switch to this file
                                    const otherFileData = filesMap.get(otherFilename);
                                    editorElement.setValue(otherFileData.content);
                                    
                                    // Update current filename
                                    window.currentFilename = otherFilename;
                                    if (window.editorInstance) {
                                        window.editorInstance.currentFilename = otherFilename;
                                    }
                                    
                                    console.log('DIRECT FIX: Switched to', otherFilename);
                                    break;
                                }
                            }
                        }
                        
                        // Remove file from storage
                        filesMap.delete(filename);
                        
                        // Remove tab from DOM
                        newTab.remove();
                        
                        // Update active tab visual state
                        const newCurrentFile = window.currentFilename || 
                            (window.editorInstance ? window.editorInstance.currentFilename : 'demo.py');
                            
                        document.querySelectorAll('.file-tab').forEach(t => {
                            if (t.getAttribute('data-filename') === newCurrentFile) {
                                t.classList.add('active');
                            } else {
                                t.classList.remove('active');
                            }
                        });
                    });
                }
            });
            
            console.log('DIRECT FIX: Applied tab handlers to', tabElements.length, 'tabs');
        }
        
        // Apply tab handlers immediately
        applyTabHandlers();
        
        // Also observe the file tabs container for changes to handle new tabs
        const fileTabs = document.getElementById('file-tabs');
        if (fileTabs && window.MutationObserver) {
            const observer = new MutationObserver(function(mutations) {
                // Re-apply tab handlers when tabs change
                applyTabHandlers();
            });
            
            // Watch for changes to the file tabs
            observer.observe(fileTabs, { 
                childList: true,  // Watch for changes to child elements
                subtree: true     // Watch the entire subtree
            });
            
            console.log('DIRECT FIX: Set up mutation observer for tabs');
        }
        
        console.log('Direct editor fix applied');
    }, 1000);
});
