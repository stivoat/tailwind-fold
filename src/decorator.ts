import { Range, TextEditor } from "vscode"
import { FoldedDecorationType, UnfoldedDecorationType } from "./decorations"

import * as Config from "./configuration"
import { Settings } from "./configuration"

export class Decorator {
    activeEditor: TextEditor

    autoFold: boolean = false
    unfoldIfLineSelected: boolean = false
    supportedLanguages: string[] = []

    regEx = /(class|className|tw)(?:=|:|:\s)((({\s*?.*?\()([\s\S]*?)(\)\s*?}))|(({?\s*?(['"`]))([\s\S]*?)(\8|\9\s*?})))/g
    regExGroupsAll = [0]
    regExGroupsQuotes = [5, 10]
    regExGroups = this.regExGroupsAll

    unfoldedDecorationType = UnfoldedDecorationType()
    foldedDecorationType = FoldedDecorationType()

    foldedRanges: Range[] = []
    unfoldedRanges: Range[] = []

    setActiveEditor(textEditor: TextEditor | undefined) {
        if (!textEditor) {
            return
        }
        this.activeEditor = textEditor
        this.updateDecorations()
    }

    toggleAutoFold(): boolean {
        this.autoFold = !this.autoFold
        this.updateDecorations()

        Config.set(Settings.AutoFold, this.autoFold)
        return this.autoFold
    }

    loadConfig() {
        this.autoFold = Config.get<boolean>(Settings.AutoFold) ?? false
        this.unfoldIfLineSelected = Config.get<boolean>(Settings.UnfoldIfLineSelected) ?? false
        this.supportedLanguages = Config.get<string[]>(Settings.SupportedLanguages) ?? []
        this.regExGroups =
            Config.get<string>(Settings.FoldStyle) === "ALL" ? this.regExGroupsAll : this.regExGroupsQuotes

        this.unfoldedDecorationType.dispose()
        this.foldedDecorationType.dispose()
        this.unfoldedDecorationType = UnfoldedDecorationType()
        this.foldedDecorationType = FoldedDecorationType()
        this.updateDecorations()
    }

    updateDecorations() {
        if (!this.activeEditor) {
            return
        }
        if (!this.supportedLanguages.includes(this.activeEditor.document.languageId)) {
            return
        }

        const documentText = this.activeEditor.document.getText()
        this.foldedRanges = []
        this.unfoldedRanges = []

        let match
        while ((match = this.regEx.exec(documentText))) {
            let matchedGroup

            for (const group of this.regExGroups) {
                if (match[group]) {
                    matchedGroup = group
                    break
                }
            }

            if (matchedGroup === undefined) {
                continue
            }

            const text = match[0]
            const textToFold = match[matchedGroup]
            const foldStartIndex = text.indexOf(textToFold)

            const foldStartPosition = this.activeEditor.document.positionAt(match.index + foldStartIndex)
            const foldEndPosition = this.activeEditor.document.positionAt(
                match.index + foldStartIndex + textToFold.length
            )
            const range = new Range(foldStartPosition, foldEndPosition)
            const foldLengthThreshold = Config.get<number>(Settings.FoldLengthThreshold) ?? 0
            if (
                !this.autoFold ||
                this.isRangeSelected(range) ||
                (this.unfoldIfLineSelected && this.isLineOfRangeSelected(range))
            ) {
                this.unfoldedRanges.push(range)
                continue
            }
            if (textToFold.length < foldLengthThreshold) {
                // If the length of the text to fold is less than the threshold, skip folding
                this.unfoldedRanges.push(range)
                continue
            }
            this.foldedRanges.push(range)
        }

        this.activeEditor.setDecorations(this.unfoldedDecorationType, this.unfoldedRanges)
        this.activeEditor.setDecorations(this.foldedDecorationType, this.foldedRanges)
    }

    isRangeSelected(range: Range): boolean {
        return !!(
            this.activeEditor.selection.contains(range) || this.activeEditor.selections.find((s) => range.contains(s))
        )
    }

    isLineOfRangeSelected(range: Range): boolean {
        return !!this.activeEditor.selections.find((s) => s.start.line === range.start.line)
    }
}
