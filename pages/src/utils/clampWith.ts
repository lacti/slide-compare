export default function clampWith(maxValue: number) {
  return function (input: number) {
    return Math.min(maxValue - 1, Math.max(0, input));
  };
}
