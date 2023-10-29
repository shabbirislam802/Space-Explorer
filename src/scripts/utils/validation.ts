export function validateForm(form: HTMLFormElement): boolean {
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    let isValid = true;

    form.classList.remove('was-validated');

    if (!username) {
        form.username.classList.add('is-invalid');
        isValid = false;
    } else {
        form.username.classList.remove('is-invalid');
    }

    console.log(form.email);
    if (!validateEmail(email)) {
        form.email.classList.add('is-invalid');
        isValid = false;
    } else {
        form.email.classList.remove('is-invalid');
    }

    if (password.length < 8) {
        form.password.classList.add('is-invalid');
        isValid = false;
    } else {
        form.password.classList.remove('is-invalid');
    }

    form.classList.add('was-validated');

    return isValid;
}

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
