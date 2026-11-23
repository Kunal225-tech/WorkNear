const DATE_FORMAT: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
};

/** Format a date string safely; returns null for missing or invalid values. */
export function formatDate(
    value: string | Date | undefined | null,
    options: Intl.DateTimeFormatOptions = DATE_FORMAT
): string | null {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    if (year < 2000 || year > 2100) return null;

    return date.toLocaleDateString("en-US", options);
}
