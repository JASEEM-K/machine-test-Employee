export type RegistrationErrors = {
    nameError: string | null;
    emailError: string | null;
    passwordError: string | null;
};

export type LoginErrors = {
    emailError: string | null;
    passwordError: string | null;
};

export type DepartmentErrors = {
    deptNameError: string | null;
    descriptionError: string | null;
};

export function validateForm(
    type: "registration",
    data: { name: string; email: string; password: string }
): RegistrationErrors;
export function validateForm(
    type: "login",
    data: { email: string; password: string }
): LoginErrors;
export function validateForm(
    type: "department",
    data: { dept_name: string; description: string }
): DepartmentErrors;
export function validateForm(
    type: "registration" | "login" | "department",
    data: {
        name?: string;
        email?: string;
        password?: string;
        dept_name?: string;
        description?: string;
    }
): RegistrationErrors | LoginErrors | DepartmentErrors {
    const errors: any = {};

    if (type === "registration") {
        if (!data.name || data.name.trim() === "") {
            errors.nameError = "Name is required.";
        } else if (data.name.trim().length < 2) {
            errors.nameError = "Name must be at least 2 characters.";
        } else {
            errors.nameError = null;
        }
    }

    if (type === "registration" || type === "login") {
        // Email validation
        if (!data.email || data.email.trim() === "") {
            errors.emailError = "Email is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errors.emailError = emailRegex.test(data.email)
                ? null
                : "Invalid email format.";
        }

        // Password validation
        if (!data.password || data.password.trim() === "") {
            errors.passwordError = "Password is required.";
        } else if (data.password.length < 6) {
            errors.passwordError = "Password must be at least 6 characters.";
        } else {
            errors.passwordError = null;
        }
    }

    if (type === "department") {
        // Department name validation
        if (!data.dept_name || data.dept_name.trim() === "") {
            errors.deptNameError = "Department name is required.";
        } else if (data.dept_name.trim().length < 2) {
            errors.deptNameError =
                "Department name must be at least 2 characters.";
        } else {
            errors.deptNameError = null;
        }

        // Description validation
        if (!data.description || data.description.trim() === "") {
            errors.descriptionError = "Description is required.";
        } else if (data.description.trim().length < 10) {
            errors.descriptionError =
                "Description must be at least 10 characters.";
        } else {
            errors.descriptionError = null;
        }
    }

    return errors;
}
