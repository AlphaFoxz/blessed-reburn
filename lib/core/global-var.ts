let screenCount = 0;

export function useGlobalVar() {
  return {
    getScreenCount() {
      return screenCount;
    },
    increaseScreenCount() {
      screenCount++;
    },
  };
}
