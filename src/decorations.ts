import { DecorationRangeBehavior, Uri, window, workspace } from "vscode"
import * as Config from "./configuration"
import { Settings } from "./configuration"
import path = require("path")
import fs = require("fs")

const svgPath = path.resolve(__dirname, "../images/tailwindicon.svg")
const svgContent = fs.readFileSync(svgPath, "utf8")

function generateScaledSVGPath() {
    const fontSize = workspace.getConfiguration("editor").get("fontSize") as number
    const scaleFactor = 0.9
    const width = fontSize * scaleFactor
    const height = fontSize * scaleFactor

    const resizedSVGContent = svgContent
        .replace(/width=".*?"/, `width="${width}"`)
        .replace(/height=".*?"/, `height="${height}"`)

    const svgBase64 = Buffer.from(resizedSVGContent).toString("base64")
    const svgDataURI = `data:image/svg+xml;base64,${svgBase64}`

    return Uri.parse(svgDataURI)
}

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
                Config.get<boolean>(Settings.ShowTailwindImage) === true ? generateScaledSVGPath() : undefined,
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
