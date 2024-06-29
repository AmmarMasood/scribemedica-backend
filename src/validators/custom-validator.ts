import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function IsTranscriptLongerThan500Characters(
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isTranscriptLongerThan500Characters',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          return value.length > 500;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be longer than 500 characters`;
        },
      },
    });
  };
}
