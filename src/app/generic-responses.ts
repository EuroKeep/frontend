// Shape of CakePHP's validation errors, as returned in the `error` field of API responses
// when an entity fails validation, e.g. {name: {_empty: 'This field cannot be empty'}}.
export interface GenericValidationError {
    [key: string]: {
        [key: string]: string
    }
}
