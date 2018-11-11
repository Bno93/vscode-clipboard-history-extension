import { workspace, window, OutputChannel } from "vscode";

export class Logger {
  logPanel: OutputChannel

  constructor() {
    this.logPanel = window.createOutputChannel('Clipboard History');

  }

  /**
   * add Info log message
   * @param message info log message
   */
  addInfoMessage(message: String) {
    // let config = workspace.getConfiguration('clipboard');

      this.logPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] [INFO] ${message}\n`)
  }

  /**
   * add Error log message
   * @param message error log message
   */
  addErrorMessage(message: String) {
    this.logPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] [ERROR] ${message}\n`)
  }


}