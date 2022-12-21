import { DecorationRangeBehavior, window } from "vscode"
import path = require("path")
import { Settings } from "./configuration"
import * as Config from "./configuration"

export function UnfoldedDecorationType() {
    return window.createTextEditorDecorationType({
        rangeBehavior: DecorationRangeBehavior.ClosedOpen,
        opacity: Config.get<number>(Settings.UnfoldedTextOpacity).toString() ?? "1",
    })
}

export function FoldedDecorationType() {
    return window.createTextEditorDecorationType({
        before: {
            contentIconPath:
                Config.get<boolean>(Settings.ShowTailwindImage) === true
                    ? path.resolve(__dirname, "../images/tailwindicon.png")
                    : undefined,
            backgroundColor: Config.get<string>(Settings.FoldedTextBackgroundColor) ?? "transparent",
            margin: "0 0 0 -5px",
        },
        after: {
            contentText: Config.get<string>(Settings.FoldedText) ?? "class",
            backgroundColor: Config.get<string>(Settings.FoldedTextBackgroundColor) ?? "transparent",
            color: Config.get<string>(Settings.FoldedTextColor) ?? "#7cdbfe7e",
        },
        textDecoration: "none; display: none;",
    })
}
