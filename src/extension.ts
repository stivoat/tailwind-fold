import * as vscode from "vscode"
import { Command } from "./commands"
import { Decorator } from "./decorator"
import { Settings } from "./configuration"

export function activate({ subscriptions }: vscode.ExtensionContext) {
    const decorator = new Decorator()
    decorator.loadConfig()
    decorator.setActiveEditor(vscode.window.activeTextEditor)

    //
    // Register event handlers
    //
    const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(() => {
        decorator.setActiveEditor(vscode.window.activeTextEditor)
    })

    const changeTextEditorSelection = vscode.window.onDidChangeTextEditorSelection(() => {
        decorator.updateDecorations()
    })

    const changeConfiguration = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration(Settings.Identifier)) {
            decorator.loadConfig()
        }
    })

    //
    // Register commands
    //
    const toggleCommand = vscode.commands.registerCommand(Command.ToggleFold, () => {
        decorator.toggleAutoFold()
    })

    subscriptions.push(changeActiveTextEditor)
    subscriptions.push(changeTextEditorSelection)
    subscriptions.push(changeConfiguration)
    subscriptions.push(toggleCommand)
}

export function deactivate({ subscriptions }: vscode.ExtensionContext) {
    subscriptions.forEach((subscription) => subscription.dispose())
}
