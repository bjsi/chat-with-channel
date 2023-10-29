export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastExecTime = 0;

  const throttledFunc = (...args: Parameters<T>) => {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    if (!timeoutId && timeSinceLastExec >= delay) {
      func(...args);
      lastExecTime = currentTime;
    } else if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      lastExecTime = Date.now();
      timeoutId = undefined;
    }, delay - timeSinceLastExec);
  };

  return throttledFunc as T;
}
