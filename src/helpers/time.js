export function minutesToFormattedTime(mins) {
    return {
        hours: Math.floor(mins / 60),
        minutes: mins % 60,
    };
}
