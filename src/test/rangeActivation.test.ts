import * as assert from "assert"
import { doesSelectionActivateRange, PositionLike, RangeLike, SelectionLike } from "../rangeActivation"

class TestPosition implements PositionLike {
    constructor(readonly offset: number) {}

    isEqual(position: PositionLike): boolean {
        return this.offset === (position as TestPosition).offset
    }
}

class TestRange implements RangeLike {
    readonly start: TestPosition
    readonly end: TestPosition

    constructor(startOffset: number, endOffset: number) {
        this.start = new TestPosition(startOffset)
        this.end = new TestPosition(endOffset)
    }

    contains(positionOrRange: PositionLike | RangeLike): boolean {
        if ("start" in positionOrRange) {
            return this.contains(positionOrRange.start) && this.contains(positionOrRange.end)
        }

        const position = positionOrRange as TestPosition
        return position.offset >= this.start.offset && position.offset <= this.end.offset
    }
}

class TestSelection extends TestRange implements SelectionLike {
    readonly active: TestPosition
    readonly isEmpty: boolean

    constructor(offset: number) {
        super(offset, offset)
        this.active = new TestPosition(offset)
        this.isEmpty = true
    }
}

describe("doesSelectionActivateRange", () => {
    it("activates when a cursor lands on a folded range boundary", () => {
        const range = new TestRange(10, 20)

        assert.strictEqual(doesSelectionActivateRange(new TestSelection(10), range), true)
        assert.strictEqual(doesSelectionActivateRange(new TestSelection(20), range), true)
        assert.strictEqual(doesSelectionActivateRange(new TestSelection(25), range), false)
    })
})
