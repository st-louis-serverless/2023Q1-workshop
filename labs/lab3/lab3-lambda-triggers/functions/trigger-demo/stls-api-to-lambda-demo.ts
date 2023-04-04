import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponsePayload } from './domain-types'

export const handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
  const payload: ResponsePayload = {
    message: 'STLS API Gateway to Lambda Demo',
    data: JSON.parse(event.body || '{}'),
  }

  if (event.queryStringParameters?.showAll) {
    payload.context = context
    payload.event = event
  }

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  }
}
