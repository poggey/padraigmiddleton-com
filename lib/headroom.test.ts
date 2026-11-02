import { describe, expect, it } from "vitest";
import { headroomAfter } from "./headroom";

describe("headroomAfter", () => {
  it("leaves the buffer alone with no surprise", () => {
    expect(headroomAfter(0)).toMatchObject({
      cost: 0,
      over: false,
      result: "No surprise: the buffer is untouched.",
    });
  });

  it("scales the OBR's £9bn a point linearly", () => {
    expect(headroomAfter(1)).toMatchObject({
      cost: 9,
      over: false,
      result: "Headroom left: about £6bn.",
    });
    expect(headroomAfter(1.5)).toMatchObject({
      cost: 13.5,
      result: "Headroom left: about £1.5bn.",
    });
  });

  it("says by how much the headroom is gone once the cost passes £15bn", () => {
    expect(headroomAfter(2)).toMatchObject({
      cost: 18,
      over: true,
      result: "Headroom gone: about £3bn over.",
    });
    expect(headroomAfter(3)).toMatchObject({
      cost: 27,
      result: "Headroom gone: about £12bn over.",
    });
  });
});
