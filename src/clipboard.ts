'use strict';
import {ExtensionContext, window, commands} from 'vscode';
import { Logger } from './components/logger';
import { Commands } from './components/commands';

export function activate(context: ExtensionContext) {


    let logger = new Logger();
    let extCommands = new Commands(logger);
    var disposableArray = [];
    console.log('clipboard History activated');

    logger.addMessage('clipboard History activated');

    disposableArray.push(commands.registerCommand('clipboard.copy', () => {
        extCommands.addClipboardItem(window.activeTextEditor);
        commands.executeCommand("editor.action.clipboardCopyAction");
    }));

    disposableArray.push(commands.registerCommand('clipboard.cut', () => {
        extCommands.addClipboardItem(window.activeTextEditor);
        commands.executeCommand("editor.action.clipboardCutAction");
    }));

    disposableArray.push(commands.registerCommand('clipboard.paste', () => {
        commands.executeCommand("editor.action.clipboardPasteAction");
    }));

    disposableArray.push(commands.registerCommand('clipboard.pasteFromClipboard', () => {
        extCommands.pasteFromClipboard();
    }));

    disposableArray.push(commands.registerCommand('clipboard.removeFromClipboard', () => {
        extCommands.removeFromClipboard();
    }));

    disposableArray.push(commands.registerCommand('clipboard.editClipboard', () => {
        extCommands.editClipboard();
    }));

    context.subscriptions.concat(disposableArray);
}

// Called when extension is deactivated
export function deactivate() {
    console.log("deactivate clipboard History");

}
