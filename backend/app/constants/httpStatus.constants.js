export const HttpStatus = {
  INVALID_REQUEST: { statusCode: 400, code: 'InvalidRequest' },
  UNAUTHORIZED: { statusCode: 401, code: 'Unauthorized' },
  FORBIDDEN: { statusCode: 403, code: 'Forbidden' },
  NOT_FOUND: { statusCode: 404, code: 'NotFound' },
  METHOD_NOT_ALLOWED: { statusCode: 405, code: 'Method Not Allowed' },
  CONFLICT: { statusCode: 409, code: 'Conflict' },
  PAYLOAD_TOO_LARGE: { statusCode: 413, code: 'Payload Too Large' },
  UNSUPPORTED_MEDIA_TYPE: { statusCode: 415, code: 'Unsupported Media Type' },
  TOO_MANY_REQUESTS: { statusCode: 429, code: 'Too Many Requests' },

  INTERNAL_SERVER_ERROR: { statusCode: 500, code: 'InternalServerError' },
  BAD_GATEWAY: { statusCode: 502, code: 'BadGateway' },
  SERVICE_UNAVAILABLE: { statusCode: 503, code: 'ServiceUnavailable' },
  GATEWAY_TIMEOUT: { statusCode: 504, code: 'GatewayTimeout' },
}
