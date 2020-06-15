import sleep from "../utils/sleep";

export default async function repeatUntil<R>({
  delegate,
  maxWaitingSeconds,
  waitingIntervals,
  defaultWaitingInterval,
  timeoutErrorMessage,
}: {
  delegate: () => Promise<R | null>;
  maxWaitingSeconds: number;
  waitingIntervals: number[];
  defaultWaitingInterval: number;
  timeoutErrorMessage: string;
}): Promise<R> {
  const until = Date.now() + maxWaitingSeconds * 1000;

  for (const interval of waitingIntervals) {
    await sleep(interval * 1000);
    const maybe = await delegate();
    if (maybe !== null) {
      return maybe;
    }
  }

  while (Date.now() < until) {
    await sleep(defaultWaitingInterval * 1000);
    const maybe = await delegate();
    if (maybe !== null) {
      return maybe;
    }
  }

  const maybe = await delegate();
  if (maybe !== null) {
    return maybe;
  }
  throw new Error(timeoutErrorMessage);
}
