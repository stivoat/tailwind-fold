import * as vscode from "vscode"

export enum Settings {
    Identifier = "tailwind-fold",

    // Functionality
    AutoFold = "autoFold",
    UnfoldIfLineSelected = "unfoldIfLineSelected",
    SupportedLanguages = "supportedLanguages",

    // Visuals
    FoldStyle = "foldStyle",
    ShowTailwindImage = "showTailwindImage",
    FoldedText = "foldedText",
    FoldedTextColor = "foldedTextColor",
    FoldedTextBackgroundColor = "foldedTextBackgroundColor",
    UnfoldedTextOpacity = "unfoldedTextOpacity",
}

export function set(key: Settings, value: any) {
    vscode.workspace.getConfiguration(Settings.Identifier).update(key, value, true)
}

export function get<T>(key: Settings): T {
    return vscode.workspace.getConfiguration(Settings.Identifier).get<T>(key) as T
}
