// The numbers behind <HeadroomSlider />, from the OBR's Economic and fiscal outlook, October 2026.
export const HEADROOM_BN = 15; // fiscal headroom against the rules in 2029–30
export const COST_PER_POINT_BN = 9; // extra deficit in 2029–30 from a one-point rise, via linkers

// "£13.5bn", "£9bn"
export const bn = (value: number) => `£${Number.isInteger(value) ? value : value.toFixed(1)}bn`;

/** What an inflation surprise of `points` every year does to the headroom, scaled linearly. */
export function headroomAfter(points: number) {
  const cost = COST_PER_POINT_BN * points;
  const over = cost >= HEADROOM_BN;
  const result =
    points === 0
      ? "No surprise: the buffer is untouched."
      : over
        ? `Headroom gone: about ${bn(cost - HEADROOM_BN)} over.`
        : `Headroom left: about ${bn(HEADROOM_BN - cost)}.`;
  return { cost, over, result };
}
