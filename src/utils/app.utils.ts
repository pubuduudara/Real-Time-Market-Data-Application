export class AppUtil {
  /**
   * Validate a date string format
   * @param dateStr - The date string to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  public static isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }
  /**
   * Parse a date string or default to the current date
   * @param dateStr - The date string to parse
   * @returns {Date} - A Date object
   */
  public static parseDateOrDefault(dateStr?: string): Date {
    return dateStr && this.isValidDate(dateStr)
      ? new Date(dateStr)
      : new Date();
  }
}
