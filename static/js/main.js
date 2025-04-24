// main.js

document.addEventListener('DOMContentLoaded', () => {
  const runBtn      = document.getElementById('run-button');
  const downloadBtn = document.getElementById('download-button');
  const outputEl    = document.getElementById('output');

  runBtn.addEventListener('click', () => {
    // grab the editor instance and file state already set up by your inline script + editor.js
    const editor        = window.editorInstance?.editor || window.editor;
    const sessionFiles  = window.editorInstance?.sessionFiles || window.sessionFiles;
    const currentFile   = window.editorInstance?.currentFilename || window.currentFilename;
    const sessionImages = window.editorInstance?.sessionImages || window.sessionImages || [];

    // save & run
    window.saveCurrentFile(editor, sessionFiles, currentFile);
    outputEl.textContent = 'Running…';
    window.runCode(editor, outputEl, sessionFiles, currentFile, sessionImages);
  });

  downloadBtn.addEventListener('click', () => {
    const editor      = window.editorInstance?.editor || window.editor;
    const sessionFiles = window.editorInstance?.sessionFiles || window.sessionFiles;
    const currentFile  = window.editorInstance?.currentFilename || window.currentFilename;

    window.saveCurrentFile(editor, sessionFiles, currentFile);

    const blob = new Blob([editor.getValue()], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = currentFile;
    a.click();
    URL.revokeObjectURL(url);
  });
});

