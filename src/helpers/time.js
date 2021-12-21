/**
 * Converts minutes
 *
 * @param {number} mins - Minutes to convert.
 * @param {boolean} asString - If true convert minutes to formatted string, otherwise return object.
 *
 * @returns {string|{hours: number, minutes: number}} - Returns formatted string or object with hours & minutes.
 */
export function minutesToFormattedTime(mins, asString = false) {
    const toString = (hours, minutes) => {
        let string = "";

        if (hours > 0)
            string += `${hours} ${hours > 1 ? "hrs" : "gr"}`;

        if (minutes > 0)
            string += `${minutes} ${minutes > 1 ? "mins" : "min"}`;

        return string;
    }

    let time = {
        hours: Math.floor(mins / 60),
        minutes: mins % 60,
    };

    return asString ? toString(time.hours, time.minutes) : time;
}
