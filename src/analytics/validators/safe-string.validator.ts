import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface 
} from 'class-validator';

@ValidatorConstraint({ name: 'isSafeString', async: false })
export class IsSafeStringConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    // Check for potential injection patterns
    const dangerousPatterns = [
      /(<script|<\/script>)/gi,
      /(javascript:|data:)/gi,
      /('|")\s*(or|and)\s*('|")/gi,
      /(union|select|insert|update|delete|drop|create|alter)/gi,
      /(\$\{|\$\()/g, // Template literal injection
      /(eval\(|function\()/gi,
    ];

    return !dangerousPatterns.some(pattern => pattern.test(value));
  }

  defaultMessage(): string {
    return 'String contains potentially dangerous content';
  }
}

export function IsSafeString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSafeStringConstraint,
    });
  };
}