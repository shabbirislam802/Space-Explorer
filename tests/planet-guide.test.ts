import { validateEmail } from "../src/scripts/helper/validation";

describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('test.test@example.com')).toBe(true);
        expect(validateEmail('test+test@example.com')).toBe(true);
        expect(validateEmail('test_test@example.com')).toBe(true);
        expect(validateEmail('test@example..com')).toBe(true);

    });

    it('should return false for invalid email addresses', () => {
        expect(validateEmail('testexample.com')).toBe(false);
        expect(validateEmail('test@@example.com')).toBe(false);
        expect(validateEmail('test@example,com')).toBe(false);
    });
});
