export default class DevConsole {
  public static log(...args: any[]) {
    if (
      process.env.NODE_ENV === "development" ||
      window.location.hash === "#dev"
    ) {
      console.log(...args);
    }
  }
}
