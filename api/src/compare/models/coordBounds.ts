export default interface CoordBounds {
  /**
   * X-coordinate of upper left corner
   */
  left: number;
  /**
   * Y-coordinate of upper left corner
   */
  top: number;
  /**
   * X-coordinate of bottom right corner
   */
  right: number;
  /**
   * Y-coordinate of bottom right corner
   */
  bottom: number;
}

export function calculateArea({
  left,
  top,
  right,
  bottom,
}: CoordBounds): number {
  return (right - left) * (bottom - top);
}

export function sumOfAreas(bounds: CoordBounds[]): number {
  return bounds.map(calculateArea).reduce((a, b) => a + b, 0);
}
