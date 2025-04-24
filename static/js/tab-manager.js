// In a file called tab-manager.js
const TabManager = {
    editor: null,
    sessionFiles: new Map(),
    currentFilename: 'demo.py',
    
    initialize(editor) {
        this.editor = editor;
        this.sessionFiles.set(this.currentFilename, {
            content: '# Write your Python code here\n\nprint("Hello, World!")\n',
            lastModified: new Date()
        });
        this.editor.setValue(this.sessionFiles.get(this.currentFilename).content);
        this.updateFileTabs();
    },
    
    saveCurrentFile() {
        if (this.sessionFiles.has(this.currentFilename)) {
            this.sessionFiles.set(this.currentFilename, {
                content: this.editor.getValue(),
                lastModified: new Date()
            });
        }
    },
    
    loadFile(filename) {
        if (!this.sessionFiles.has(filename)) return;
        
        // Save current file before switching
        this.saveCurrentFile();
        
        // Load the selected file
        this.currentFilename = filename;
        this.editor.setValue(this.sessionFiles.get(filename).content);
        
        // Update tabs UI
        this.updateFileTabs();
    },
    
    // Additional methods (createNewFile, closeFile, etc.)
    
    updateFileTabs() {
        const fileTabs = document.getElementById('file-tabs');
        const newFileButton = document.getElementById('new-file-button');
        
        // Clear existing tabs (except the new file button)
        const tabsToRemove = fileTabs.querySelectorAll('.file-tab');
        tabsToRemove.forEach(tab => tab.remove());
        
        // Add tabs for each file
        for (const [filename, fileData] of this.sessionFiles) {
            const tabButton = document.createElement('button');
            tabButton.className = 'file-tab' + (filename === this.currentFilename ? ' active' : '');
            tabButton.setAttribute('data-filename', filename);
            
            // Create the tab content with filename and close button
            tabButton.innerHTML = `
                ${filename}
                <span class="file-tab-close">×</span>
            `;
            
            // Add event listener to switch files
            tabButton.addEventListener('click', (e) => {
                // Ignore if clicked on the close button
                if (e.target.classList.contains('file-tab-close')) return;
                
                const filename = tabButton.getAttribute('data-filename');
                this.loadFile(filename);
            });
            
            // Add event listener to close button
            const closeBtn = tabButton.querySelector('.file-tab-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the tab click event
                const filename = tabButton.getAttribute('data-filename');
                this.closeFile(filename);
            });
            
            // Insert tab before the new file button
            fileTabs.insertBefore(tabButton, newFileButton);
        }
    }
};
