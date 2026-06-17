export interface PositionLike {
    isEqual(position: PositionLike): boolean
}

export interface RangeLike {
    start: PositionLike
    end: PositionLike
    contains(positionOrRange: PositionLike | RangeLike): boolean
}

export interface SelectionLike extends RangeLike {
    active: PositionLike
    isEmpty: boolean
}

/**
 * Checks whether a selection should unfold a folded range.
 *
 * @param selection - The current editor selection or cursor position.
 * @param range - The folded range being tested.
 * @returns True when the selection contains the range, is inside it, or the cursor is on either boundary.
 */
export function doesSelectionActivateRange(selection: SelectionLike, range: RangeLike): boolean {
    return (
        selection.contains(range) ||
        range.contains(selection) ||
        (selection.isEmpty && (selection.active.isEqual(range.start) || selection.active.isEqual(range.end)))
    )
}
