export async function Interval(
  call: () => Promise<void> | void,
  count: number = 3
) {
  for (let i = 0; i < count; i++) {
    await new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 3000);
    });
    await call();
  }
}
