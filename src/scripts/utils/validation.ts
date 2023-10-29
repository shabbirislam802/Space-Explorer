export function validateForm(form: HTMLFormElement): boolean {
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    form.classList.remove('was-validated');

    if (!username) {
        form.username.classList.add('is-invalid');
        return false;
    } else {
        form.username.classList.remove('is-invalid');
    }

    if (!validateEmail(email)) {
        form.email.classList.add('is-invalid');
        return false;
    } else {
        form.email.classList.remove('is-invalid');
    }

    if (password.length < 8) {
        form.password.classList.add('is-invalid');
        return false;
    } else {
        form.password.classList.remove('is-invalid');
    }

    form.classList.add('was-validated');

    return true;
}

export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
