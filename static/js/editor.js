// Enhanced example loader with index.json support
const exampleLoader = {
    // Cache for loaded examples
    cache: {},
    
    // Map to store example metadata (name -> {id, title, description})
    exampleMeta: new Map(),
    
    // Initialize the example loader
    async initialize() {
        try {
            // Fetch the index.json file
            const response = await fetch('/static/examples/index.json');
            
            if (response.ok) {
                // Process the index file
                const indexData = await response.json();
                this.processIndexData(indexData);
            } else {
                // Fall back to manual list if index file isn't available
                this.fallbackToManualList();
            }
            
            // Populate the dropdown with discovered examples
            this.populateDropdown();
            
            return true;
        } catch (error) {
            console.error('Error initializing example loader:', error);
            // Fall back to manual list if auto-discovery fails
            this.fallbackToManualList();
            this.populateDropdown();
            return false;
        }
    },
    
    // Process the index.json data
    processIndexData(indexData) {
        if (indexData.examples && Array.isArray(indexData.examples)) {
            indexData.examples.forEach(example => {
                if (example.id) {
                    this.exampleMeta.set(example.id, {
                        id: example.id,
                        title: example.title || this.formatTitle(example.id),
                        description: example.description || ''
                    });
                }
            });
        }
    },
    
    // Fall back to a manual list of examples if auto-discovery fails
    fallbackToManualList() {
        const manualExamples = [
            'hello',
            'loops',
            'conditionals',
            'functions',
            'lists',
            'turtlegraphics'
        ];
        
        manualExamples.forEach(id => {
            this.exampleMeta.set(id, {
                id: id,
                title: this.formatTitle(id),
                description: ''
            });
        });
    },
    
    // Convert an ID like 'hello_world' to a nice title like 'Hello World'
    formatTitle(id) {
        return id
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
    
    // Populate the dropdown with the discovered examples
    populateDropdown() {
        const dropdown = document.getElementById('example-dropdown');
        
        // Clear existing options (except the first one)
        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }
        
        // Add options for each example
        for (const [id, meta] of this.exampleMeta) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = meta.title;
            
            // Add description as a title attribute for tooltip
            if (meta.description) {
                option.title = meta.description;
            }
            
            dropdown.appendChild(option);
        }
    },
    
    // Get list of available examples
    getAvailableExamples() {
        return Array.from(this.exampleMeta.keys());
    },
    
    // Load an example from file
    async loadExample(exampleName) {
        // Return from cache if available
        if (this.cache[exampleName]) {
            return this.cache[exampleName];
        }
        
        try {
            // Path to the example file
            const filePath = `/static/examples/${exampleName}.py`;
            
            // Fetch the file
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Failed to load example: ${exampleName}`);
            }
            
            // Get the content
            const content = await response.text();
            
            // Cache it
            this.cache[exampleName] = content;
            
            return content;
        } catch (error) {
            console.error(`Error loading example ${exampleName}:`, error);
            return `# Error loading example: ${exampleName}\n# ${error.message}`;
        }
    }
};

// Initialize CodeMirror editor
function initializeEditor() {
    const editor = CodeMirror(document.getElementById('editor'), {
        mode: 'python',
        theme: 'kitty',
        lineNumbers: true,
        indentWithTabs: false,
        indentUnit: 4,
        lineWrapping: true,
        tabSize: 4,
        autofocus: true,
        viewportMargin: Infinity, // Ensures CodeMirror renders all content
        extraKeys: {
            "Tab": function(cm) {
                if (cm.somethingSelected()) {
                    cm.indentSelection("add");
                } else {
                    cm.replaceSelection("    ", "end", "+input");
                }
            }
        }
    });

    // Set editor size after initialization to ensure it fills the container
    setTimeout(function() {
        editor.refresh();
    }, 100);
    
    return editor;
}

// Save current file content
function saveCurrentFile(editor, sessionFiles, currentFilename) {
    if (sessionFiles.has(currentFilename)) {
        sessionFiles.set(currentFilename, {
            content: editor.getValue(),
            lastModified: new Date()
        });
    }
}

// Load a file
function loadFile(filename, editor, sessionFiles, currentFilename) {
    if (!sessionFiles.has(filename)) return;
    
    // Save current file before switching
    saveCurrentFile(editor, sessionFiles, currentFilename);
    
    // Load the selected file
    currentFilename = filename;
    editor.setValue(sessionFiles.get(filename).content);
    
    // Return the new current filename
    return currentFilename;
}

// Create a new file
function createNewFile(filename, content, editor, sessionFiles, currentFilename) {
    // Generate a unique filename if none provided
    if (!filename) {
        let counter = 1;
        filename = `untitled-${counter}.py`;
        while (sessionFiles.has(filename)) {
            counter++;
            filename = `untitled-${counter}.py`;
        }
    } else if (sessionFiles.has(filename)) {
        // If file already exists, generate a unique name by adding a suffix
        let baseName = filename;
        let extension = '';
        
        // Extract extension if it exists
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            baseName = filename.substring(0, lastDotIndex);
            extension = filename.substring(lastDotIndex);
        }
        
        // Find a unique name
        let counter = 1;
        filename = `${baseName}-${counter}${extension}`;
        while (sessionFiles.has(filename)) {
            counter++;
            filename = `${baseName}-${counter}${extension}`;
        }
    }
    
    // Save current file before creating a new one
    saveCurrentFile(editor, sessionFiles, currentFilename);
    
    // Create the new file
    sessionFiles.set(filename, {
        content: content || '',
        lastModified: new Date()
    });
    
    // Switch to the new file
    currentFilename = filename;
    editor.setValue(content || '');
    
    // Return the new current filename
    return currentFilename;
}

// Close a file
function closeFile(filename, editor, sessionFiles, currentFilename) {
    if (!sessionFiles.has(filename)) return currentFilename;
    
    // Don't allow closing the last file
    if (sessionFiles.size <= 1) {
        alert("Cannot close the last file. At least one file must remain open.");
        return currentFilename;
    }
    
    // If closing the current file, switch to another file first
    if (filename === currentFilename) {
        // Find another file to switch to
        for (const [name, _] of sessionFiles) {
            if (name !== filename) {
                currentFilename = loadFile(name, editor, sessionFiles, currentFilename);
                break;
            }
        }
    }
    
    // Remove the file from session storage
    sessionFiles.delete(filename);
    
    // Return the current filename (which may have changed)
    return currentFilename;
}

// Update file tabs UI
function updateFileTabs(fileTabs, newFileButton, sessionFiles, currentFilename, editor) {
    // Clear existing tabs (except the new file button)
    const tabsToRemove = fileTabs.querySelectorAll('.file-tab');
    tabsToRemove.forEach(tab => tab.remove());
    
    // Add tabs for each file
    for (const [filename, fileData] of sessionFiles) {
        const tabButton = document.createElement('button');
        tabButton.className = 'file-tab' + (filename === currentFilename ? ' active' : '');
        tabButton.setAttribute('data-filename', filename);
        
        // Create the tab content with filename and close button
        tabButton.innerHTML = `
            ${filename}
            <span class="file-tab-close">×</span>
        `;
        
        // Add event listener to switch files
        tabButton.addEventListener('click', function(e) {
            // Ignore if clicked on the close button
            if (e.target.classList.contains('file-tab-close')) return;
            
            const filename = this.getAttribute('data-filename');
            currentFilename = loadFile(filename, editor, sessionFiles, currentFilename);
            updateFileTabs(fileTabs, newFileButton, sessionFiles, currentFilename, editor);
        });
        
        // Add event listener to close button
        const closeBtn = tabButton.querySelector('.file-tab-close');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the tab click event
            const filename = this.parentElement.getAttribute('data-filename');
            currentFilename = closeFile(filename, editor, sessionFiles, currentFilename);
            updateFileTabs(fileTabs, newFileButton, sessionFiles, currentFilename, editor);
        });
        
        // Insert tab before the new file button
        fileTabs.insertBefore(tabButton, newFileButton);
    }
    
    // Make sure the current file's tab is visible by scrolling to it
    const activeTab = fileTabs.querySelector('.file-tab.active');
    if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
    
    return currentFilename;
}

// Download a file
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Setup resize observer for editor
function setupResizeObserver(editor) {
    if (window.ResizeObserver) {
        const editorContent = document.querySelector('.editor-content');
        const resizeObserver = new ResizeObserver(entries => {
            editor.refresh();
        });
        
        if (editorContent) {
            resizeObserver.observe(editorContent);
        }
    }
}

// Set up the editor and all event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the editor
    const editor = initializeEditor();
    window.editor = editor; // Make the editor globally accessible

    // Initialize file storage
    const sessionFiles = new Map();
    let currentFilename = 'demo.py';
    
    // Create the initial file
    sessionFiles.set(currentFilename, {
        content: '# Welcome to the Griffy Stats Python Editor\n\nprint("Hello, World!")',
        lastModified: new Date()
    });
    editor.setValue(sessionFiles.get(currentFilename).content);
    
    // Set up file tabs
    const fileTabs = document.getElementById('file-tabs');
    const newFileButton = document.getElementById('new-file-button');
    
    // Initialize the example loader
    window.exampleLoader = exampleLoader;
    window.exampleLoader.initialize().then(() => {
        console.log('Example loader initialized successfully');
    }).catch(error => {
        console.error('Failed to initialize example loader:', error);
    });
    
    // Set up the example dropdown
    const exampleDropdown = document.getElementById('example-dropdown');
    exampleDropdown.addEventListener('change', async function() {
        const selectedExample = this.value;
        
        if (selectedExample) {
            try {
                // Load the example using our loader
                const exampleCode = await exampleLoader.loadExample(selectedExample);
                
                // Create a new file with the example code
                const filename = `${selectedExample}.py`;
                currentFilename = createNewFile(filename, exampleCode, editor, sessionFiles, currentFilename);
                updateFileTabs(fileTabs, newFileButton, sessionFiles, currentFilename, editor);
                
                // Reset the dropdown
                this.value = '';
            } catch (error) {
                console.error('Error loading example:', error);
                alert(`Failed to load example: ${error.message}`);
            }
        }
    });
    
    // Set up the new file button
    newFileButton.addEventListener('click', function() {
        const filename = prompt('Enter filename (e.g., script.py):', 'untitled.py');
        if (filename) {
            currentFilename = createNewFile(filename, '', editor, sessionFiles, currentFilename);
            updateFileTabs(fileTabs, newFileButton, sessionFiles, currentFilename, editor);
        }
    });
    
    // Set up file upload
    const fileUploadInput = document.getElementById('file-upload-input');
    const uploadedFileName = document.getElementById('uploaded-file-name');
    
    fileUploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Update the displayed filename
        uploadedFileName.textContent = file.name;
        
        // Read the file content
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            
            // Create a new file with the uploaded content
            currentFilename = createNewFile(file.name, content, editor, sessionFiles, currentFilename);
            updateFileTabs(fileTabs, newFileButton, sessionFiles, currentFilename, editor);
        };
        reader.readAsText(file);
        
        // Reset the file input
        fileUploadInput.value = '';
    });
    
    // Set up the download button
    const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', function() {
        // Make sure we're saving the latest content
        saveCurrentFile(editor, sessionFiles, currentFilename);
        
        // Get the content of the current file
        const content = sessionFiles.get(currentFilename).content;
        
        // Download the file
        downloadFile(currentFilename, content);
    });
    
    // Set up the run button
    const runButton = document.getElementById('run-button');
    runButton.addEventListener('click', function() {
        // Make sure we're saving the latest content
        saveCurrentFile(editor, sessionFiles, currentFilename);
        
        // Get the content of the current file
        const content = sessionFiles.get(currentFilename).content;
        
        // Run the code (this part will depend on how you're handling code execution)
        // For example, if you're using a Brython-based approach:
        if (window.runPythonCode) {
            window.runPythonCode(content, currentFilename);
        }
    });
    
    // Update file tabs initially
    updateFileTabs(fileTabs, newFileButton, sessionFiles, currentFilename, editor);
    
    // Set up resize observer
    setupResizeObserver(editor);
    
    // Make global for access from other scripts if needed
    window.editorInstance = {
        editor,
        sessionFiles,
        currentFilename,
        getCurrentFileName: function() {
            return currentFilename;
        },
        getCurrentContent: function() {
            return editor.getValue();
        },
        saveCurrentFile: function() {
            saveCurrentFile(editor, sessionFiles, currentFilename);
        }
    };
});
