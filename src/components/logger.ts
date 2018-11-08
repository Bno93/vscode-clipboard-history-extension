import { workspace, window, OutputChannel } from "vscode";

export class Logger {
  logPanel: OutputChannel

  constructor() {
    this.logPanel = window.createOutputChannel('Clipboard History');

  }

  addMessage(message: String) {
    // let config = workspace.getConfiguration('clipboard');

      this.logPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] ${message}\n`)
  }

}