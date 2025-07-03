import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface 
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidDateRange', async: false })
export class IsValidDateRangeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any): boolean {
    if (!value) return true; // Allow optional dates

    const date = new Date(value);
    const now = new Date();
    const maxPastDate = new Date();
    maxPastDate.setFullYear(now.getFullYear() - 5); // 5 years back

    return (
      !isNaN(date.getTime()) &&
      date <= now &&
      date >= maxPastDate
    );
  }

  defaultMessage(): string {
    return 'Date must be valid and within the last 5 years';
  }
}

export function IsValidDateRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateRangeConstraint,
    });
  };
}