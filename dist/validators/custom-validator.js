"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTranscriptLongerThan500Characters = void 0;
const class_validator_1 = require("class-validator");
function IsTranscriptLongerThan500Characters(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'isTranscriptLongerThan500Characters',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (typeof value !== 'string') {
                        return false;
                    }
                    return value.length > 500;
                },
                defaultMessage(args) {
                    return `${args.property} must be longer than 500 characters`;
                },
            },
        });
    };
}
exports.IsTranscriptLongerThan500Characters = IsTranscriptLongerThan500Characters;
//# sourceMappingURL=custom-validator.js.map