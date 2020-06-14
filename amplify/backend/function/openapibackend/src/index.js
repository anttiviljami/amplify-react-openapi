/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// create api from definition
const OpenAPIBackend = require("openapi-backend").default;
const definition = "./openapi.yml";
const apiRoot = "/api";
const api = new OpenAPIBackend({ definition, apiRoot, quick: true });

// response headers
const headers = {
  "content-type": "application/json",
  "access-control-allow-origin": "*", // lazy cors config
};

// register default handlers
api.register({
  notFound: async (c, event, context) => {
    // route not found
    return {
      statusCode: 404,
      body: JSON.stringify({ err: "not found" }),
      headers,
    };
  },
  validationFail: async (c, event, context) => {
    // request validation failed
    return {
      statusCode: 400,
      body: JSON.stringify({ err: c.validation.errors }),
      headers,
    };
  },
  notImplemented: async (c, event, context) => {
    // mock handler
    const { status, mock } = api.mockResponseForOperation(
      c.operation.operationId
    );
    return {
      statusCode: status,
      body: JSON.stringify(mock),
      headers,
    };
  },
});

api.init();

// entrypoint
exports.handler = async (event, context) => {
  // return json openapi document at root
  if (event.httpMethod === "GET" && event.path === apiRoot) {
    if (!api.document) {
      await api.loadDocument();
    }
    return {
      statusCode: 200,
      body: JSON.stringify(api.document),
      headers,
    };
  }

  // handle request
  return api.handleRequest(
    {
      method: event.httpMethod,
      path: event.path,
      query: event.queryStringParameters,
      body: event.body,
      headers: event.headers,
    },
    event,
    context
  );
};
