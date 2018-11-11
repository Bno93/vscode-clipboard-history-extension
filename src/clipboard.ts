'use strict';
import {ExtensionContext, window, commands} from 'vscode';
import { Logger } from './components/logger';
import { Commands } from './components/commands';

export function activate(context: ExtensionContext) {


    let logger = new Logger();
    let extCommands = new Commands(logger);
    var disposableArray = [];
    console.log('clipboard History activated');

    logger.addInfoMessage('clipboard History activated');

    disposableArray.push(commands.registerCommand('clipboard.copy', () => {
        try {
            extCommands.addClipboardItem(window.activeTextEditor);
        } catch(error) {
            logger.addErrorMessage("clipboard.copy => addClipboardItem() " + error.message);
        }
        commands.executeCommand("editor.action.clipboardCopyAction");
    }));

    disposableArray.push(commands.registerCommand('clipboard.cut', () => {
        try {
            extCommands.addClipboardItem(window.activeTextEditor);
        } catch (error) {
            logger.addErrorMessage("clipboard.cut => addClipboardItem() " + error.message);
        }
        commands.executeCommand("editor.action.clipboardCutAction");
    }));

    disposableArray.push(commands.registerCommand('clipboard.paste', () => {
        try {
            commands.executeCommand("editor.action.clipboardPasteAction");
        } catch (error) {
            logger.addErrorMessage("clipboard.paste => clipboardPasteAction() " + error.message);
        }
    }));

    disposableArray.push(commands.registerCommand('clipboard.pasteFromClipboard', () => {
        try {
            extCommands.pasteFromClipboard();

        } catch (error) {
            logger.addErrorMessage("clipboard.pasteFromClipboard => pasteFromClipboard() " + error.message);
        }
    }));

    disposableArray.push(commands.registerCommand('clipboard.removeFromClipboard', () => {
        try {
            extCommands.removeFromClipboard();
        } catch (error) {
            logger.addErrorMessage("clipboard.removeFromClipboard => removeFromClipboard() " + error.message);
        }
    }));

    disposableArray.push(commands.registerCommand('clipboard.editClipboard', () => {
        try {
            extCommands.editClipboard();
        } catch (error) {
            logger.addErrorMessage("[clipboard.editClipboard => editClipboard() " + error.message);
        }
    }));

    context.subscriptions.concat(disposableArray);
}

// Called when extension is deactivated
export function deactivate() {
    console.log("deactivate clipboard History");

}
