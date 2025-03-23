class Validate {
  constructor(request, params) {
    this.request = request
    this.params = params
  }

  errors = []

  /**
   * isString
   * isEmail
   * isNumeric
   * isBoolean
   * isLength
   * isEmpty
   * isArray
   * isObject
   * isInclude
   **/
}

export const validate = new Validate()
