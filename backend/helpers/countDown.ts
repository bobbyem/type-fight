import colors from "colors";

export function countDown(length: number, callback: void) {
  let value = length;
  const interval = setInterval(() => {
    length = length - 1;
  }, 1000);

  if (value <= 0) {
    console.log(colors.bgCyan(`countDown: Triggering callback function`));
  }
}
