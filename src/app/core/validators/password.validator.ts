import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);

  const errors: ValidationErrors = {};
  if (!hasUpperCase) errors['noUpperCase'] = true;
  if (!hasNumber)    errors['noNumber'] = true;
  if (!hasSpecial)   errors['noSpecial'] = true;

  return Object.keys(errors).length ? errors : null;
}