export class StringHelper {
  public static randomChar(str: string): string {
    return str[this.randomIndex(str)];
  }

  public static randomIndex(str: string): number {
    return Math.floor(Math.random() * str.length);
  }

  public static setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }
}
