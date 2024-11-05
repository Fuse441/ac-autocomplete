// @ts-nocheck

const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */


function activate(context) {
    const hoverProvider = vscode.languages.registerHoverProvider('json', {
        provideHover(document, position) {
            var Nesting = "";
            const range = document.getWordRangeAtPosition(position, /"([^"]+)"\s*:/);

            if (!range) return;

            const key = document.getText(range);
            const jsonText = document.getText();
            const jsonObj = JSON.parse(jsonText);

            const nestedStructure = getNestedStructure(jsonObj, key);
            console.log("Nesting Log: " + Nesting);

            return new vscode.Hover(`Nested structure: ${JSON.stringify(nestedStructure)}`);
        }
    });

    context.subscriptions.push(hoverProvider);
}

function getNestedStructure(obj, targetKey, currentPath = '', NestingJSON = '') {
    let didEnterLoop = false;

    for (const [key, value] of Object.entries(obj)) {
        console.log("start loop");
        console.log(`Key: ${key}, Value: ${value}, Type: ${typeof value}`);
        didEnterLoop = true;

        if (typeof value === 'object') {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            console.log(`Descending into object: ${newPath}`);
            
            
            NestingJSON = getNestedStructure(value, targetKey, newPath, NestingJSON);
        }
    }

    if (!didEnterLoop) {
        console.log("Descending into object Nest: " + currentPath);
        console.log("Did not enter loop: No object properties found");
        return currentPath; 
    }

    return NestingJSON; 
}




function deactivate() {}

module.exports = {
	activate,
	deactivate
}
