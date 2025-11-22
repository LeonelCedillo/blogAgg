
export function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match || match.length !== 3) return;

    const digit =  parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "s":
            return digit * 1000;
        case "m":
            return digit * 60 * 1000;
        case "h":
            return digit * 60 * 60 * 1000;
        default:
            return digit;
    }
}