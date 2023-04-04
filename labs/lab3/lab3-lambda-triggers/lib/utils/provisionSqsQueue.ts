import * as sqs from 'aws-cdk-lib/aws-sqs'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import { createOutput } from './create-output'
import { Construct } from 'constructs'

export const provisionSqsQueue = (owner: Construct, id: string, queueName: string): sqs.Queue => {
  const queue = new sqs.Queue(owner, id, {
    queueName: 'demo-queue',
    retentionPeriod: Duration.minutes(15),
    removalPolicy: RemovalPolicy.DESTROY,
  })

  createOutput(owner, `${id}-queueArn`, queue.queueArn)
  createOutput(owner, `${id}-queueUrl`, queue.queueUrl)

  return queue
}
