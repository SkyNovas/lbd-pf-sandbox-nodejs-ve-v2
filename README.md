# Lambda Template with TypeScript
The template serves as the foundation for Lambdas using TypeScript.
  
## Environment Variables
The following environment variables are configured depending on the need (in the local environment, they are set in the .env file)

`URI_TOKEN`

`CUSTOMER_KEY`

`CUSTOMER_SECRET`

`URI_KEY`

`NAME_API`

`USER_MONGO`

`PASS_MONGO`

`HOST_MONGO`

## Installation

```bash
    npm install
```
## Documentation

```
src/
├── config/               # pplication configuration
│   └── database/         # Database-specific configuration
│      └── mongo.config.ts
│
├── database/             # Database connection and models
│   ├── mongo/            # MongoDB connection and models
│       ├── connection.ts
│       └── models/
│           └── example.model.ts
│
├── services/             # Common services
│   ├── encryption.service.ts   # Encryption methods
│   └── token.service.ts        # Token management
│
├── exceptions/           # Exception handling
│   └── api.exception.ts       # API exceptions
│
├── utils/                # General utilities
│   └── api.response.ts       # Generic response
│
└── index.ts             # Registration of handlers for the Lambda
```


The `run-handler.ts` file contains the class that facilitates local testing.


The snippet below defines the input to our Lambda, which is the "event":

```typescript
const event: APIGatewayProxyEvent = {
  body: JSON.stringify({ message: 'Example messsage' }),
  headers: { 'Content-Type': 'application/json' },
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/test',
  pathParameters: null,
  queryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: '/test',
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
};
```

The snippet below defines the context:

```typescript
const context: Context = {} as any;
```

The snippet below performs the call to the Lambda:


```typescript
(async () => {
  try {
    const response = await handler(event, context);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

## Usage CLI

```bash
    npx ts-node run-handler.ts
```
## Usage Server

```bash
    npx ts-node server.ts
```

## Deployment

To deploy this project run

```bash
  npm run build
```
