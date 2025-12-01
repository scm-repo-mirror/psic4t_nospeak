export function softVibrate() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(5);
    }
}
