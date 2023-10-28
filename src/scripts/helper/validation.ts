export function validateEmail(email: string): boolean {
    if (typeof email !== 'string') {
        throw new TypeError('Expected a string');
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}