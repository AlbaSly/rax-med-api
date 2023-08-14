export function TransformStringToDateTime(value: string) {
    console.log(value);
    const [hours, minutes] = value.split(':');

    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0);
    date.setMilliseconds(0);
    console.log(date)
    return date;
}