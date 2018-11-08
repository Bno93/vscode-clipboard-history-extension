import { window, workspace, TextEditor, TextDocument, Range, Position, QuickPickOptions, QuickPickItem } from "vscode";
import { Logger } from "./logger";

export class Commands {

  clipboardArray: string[]
  clipboardSize: Number
  logger: Logger

  constructor(log: Logger) {
    let config = workspace.getConfiguration('clipboard');
    this.clipboardSize = config.get('clipboard.size');
    this.clipboardArray = [];
    this.logger = log;
  }

  addClipboardItem(editor: TextEditor) {

    let doc: TextDocument = editor.document;
    let sels = editor.selections;

    for (var i = 0; i < sels.length; i++) {
      let line = sels[i].active.line;
      let text = doc.getText(new Range(sels[i].start, sels[i].end));
      if (sels[i].isEmpty) { // Get full line if no selection highlighted
        let lineStart = new Position(line, 0);
        let lineEnd = new Position(line, doc.lineAt(line).range.end.character)
        text = doc.getText(new Range(lineStart, lineEnd));
      }

      this.logger.addMessage("clipboard history length " + this.clipboardArray.length);
      this.logger.addMessage("clipboard history size " + this.clipboardSize);
      this.logger.addMessage("clipboard history added text [" + text + "]");

      if (this.clipboardArray.indexOf(text) === -1) {
        this.clipboardArray.push(text);
        if (this.clipboardArray.length > this.clipboardSize) {
          this.clipboardArray.shift();
        }
      }
    }
  }

  makeQuickPick(clipboardArray, toBeRemoved?: boolean) {
    this.logger.addMessage("make QuickPick Clipboard History")
    // Create quick pick clipboard items
    // var options: QuickPickOptions = { placeHolder: "Clipboard", matchOnDescription: true, matchOnDetail: true };
    var copiedItems: QuickPickItem[] = [];
    // Add clear all history option if making removal quick pick
    if (toBeRemoved && clipboardArray.length > 0) {
      copiedItems.push({ label: "", description: "Clear All History" });
    }
    // List clipboard items in order of recency
    for (var i = 0; i < clipboardArray.length; i++) {
      copiedItems.unshift({ label: "", description: clipboardArray[i] });
    }
    return copiedItems;
  }

  removeQuickPickItem(clipboardArray, item: QuickPickItem) {
    this.logger.addMessage("remove Item from Clipboard History QuickPick")
    let index = clipboardArray.indexOf(item.description)
    if (index > -1) {
      clipboardArray.splice(index, 1);
    }
    return clipboardArray;
  }

  editQuickPickItem(clipboardArray, item: QuickPickItem, text: string) {
    this.logger.addMessage("edit Item from Clipboard History QuickPick")
    if (item) {
      let description = item.description;
      let index = clipboardArray.indexOf(description);
      if (index > -1) {
        clipboardArray[index] = text;
      }
      return clipboardArray;
    }
    else {
      this.logger.addMessage("item was undefined");
    }
  }

  pasteSelected(item: QuickPickItem) {
    this.logger.addMessage("past from Clipboard History QuickPick")
    let activeEditor = window.activeTextEditor;
    // Don't run if no active text editor instance available
    if (activeEditor) {
      // Don't run if item is undefinded
      if(item) {
        let text = item.description;
        activeEditor.edit(function (textInserter) {
          // Delete anything currently selected
          textInserter.delete(activeEditor.selection);
        }).then(function () {
          // Insert text from list
          activeEditor.edit(function (textInserter) {
            textInserter.insert(activeEditor.selection.start, text)
          });
        });
      }
      else {
        this.logger.addMessage("QuickPick probably was exit with no selection");
      }
    }
  }


  pasteFromClipboard() {
    this.logger.addMessage("past from Clipboard")
    if (this.clipboardArray.length == 0) {
      window.setStatusBarMessage("No items in clipboard");
      window.showQuickPick(this.makeQuickPick(this.clipboardArray));
      return;
    } else {
      window.showQuickPick(this.makeQuickPick(this.clipboardArray)).then((item) => { this.pasteSelected(item); });
    }
  }

  editClipboard() {
    this.logger.addMessage("edit Clipboard")
    if (this.clipboardArray.length == 0) {
      window.setStatusBarMessage("No items in clipboard");
      return;
    } else {
      let currentQuickPick = this.makeQuickPick(this.clipboardArray);
      window.showQuickPick(currentQuickPick).then((item) => {
        let text = item.description;
        window.showInputBox({ value: item.description.toString() })
          .then(val => {
            let editedQuickPick = this.makeQuickPick(this.editQuickPickItem(this.clipboardArray, item, val));
            window.setStatusBarMessage("Edited clipboard item");
          });
      })
    }
  }

  removeFromClipboard() {
    this.logger.addMessage("remove Clipboard")
    if (this.clipboardArray.length == 0) {
      window.setStatusBarMessage("No items in clipboard");
      window.showQuickPick(this.makeQuickPick(this.clipboardArray));
      return;
    } else {
      let currentQuickPick = this.makeQuickPick(this.clipboardArray, true);
      window.showQuickPick(currentQuickPick).then((item) => {
        if (item.description === "Clear All History") {
          this.clipboardArray = [];    // Clear clipboard history if selected
          window.setStatusBarMessage("Clipboard history cleared");
          return;
        } else {
          let removedQuickPick = this.makeQuickPick(this.removeQuickPickItem(this.clipboardArray, item), true);
          window.setStatusBarMessage("Removed from clipboard");
        }
      });
    }
  }
}