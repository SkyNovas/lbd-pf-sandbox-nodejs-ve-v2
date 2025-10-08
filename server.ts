import express from 'express';
import { handler } from './src/index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
var cors = require('cors')

const app = express();
const port = 10443;

app.use(cors());
app.use(express.json());


app.all('*', async (req, res) => {

  const event: APIGatewayProxyEvent = {
    body: JSON.stringify(req.body),
    headers: req.headers as { [key: string]: string },
    httpMethod: req.method,
    isBase64Encoded: false,
    path: req.path,
    pathParameters: null,
    queryStringParameters: req.query as { [key: string]: string },
    stageVariables: null,
    requestContext: {} as any,
    resource: req.path,
    multiValueHeaders: {}, 
    multiValueQueryStringParameters: null,
  };

  const context: Context = {} as any;


  try {

    const response = await handler(event, context);
    res.header({...response.headers})
    res.status(response.statusCode || 200).json(response.body ? JSON.parse(response.body) : {});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Servicio: http://localhost:${port}`);
});
