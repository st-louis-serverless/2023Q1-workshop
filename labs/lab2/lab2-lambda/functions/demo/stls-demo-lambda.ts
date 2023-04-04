import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'

type Payload = {
  message: string
  event?: any
  context?: Context
  extra?: any // to pick out specific subsets of data
}

export const handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
  const payload: Payload = {
    message: 'STLS Demo Lambda - v3',
  }

  if (event.rawPath === '/all') {
    payload.context = context
    payload.event = event
  }

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  }
}
