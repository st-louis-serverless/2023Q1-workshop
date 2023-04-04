import { SQSBatchResponse, SQSEvent } from 'aws-lambda'
import { ResponsePayload } from './domain-types'

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const eventList = event.Records.map((rec) => JSON.parse(rec.body))

  const payload: ResponsePayload = {
    message: 'STLS SQS to Lambda Demo',
    data: eventList,
    // event: event,
    // context: context
  }

  console.log(`payload: ${JSON.stringify(payload)}`)

  return {
    batchItemFailures: [], // report any record ids that failed, so we won't reprocess all of the batch again
  }
}
