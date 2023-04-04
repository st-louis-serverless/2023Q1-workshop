import * as cdk from 'aws-cdk-lib'
import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'
import { provisionLambda } from './utils/provision-lambda'
import { provisionApiForLambda } from './utils/provision-api-for-lambda'
import { ApiGatewayToSqs, ApiGatewayToSqsProps } from '@aws-solutions-constructs/aws-apigateway-sqs'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { createOutput } from './utils/create-output'

// For demo and lab purposes, I'm using a single stack. A more
// realistic design is to provision all resources needed for microservice
// in a separate stack.
export class Lab3LambdaTriggerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    this.provisionAPIGatewayToLambda()
    this.provisionAPIToSQSToLambda()
  }

  provisionAPIGatewayToLambda() {
    const fn = provisionLambda(this, 'lab3-api-lambda-demo', 'stls-api-to-lambda-demo')
    const devApi = provisionApiForLambda(this, 'lab3-api-for-lambda-api-demo', fn, 'dev', {
      timeout: Duration.seconds(5),
    })
  }

  provisionAPIToSQSToLambda() {
    const apiProps: apigw.RestApiProps = {
      restApiName: 'stls-api-sqs-demo',
      deploy: true,
      retainDeployments: false,
      deployOptions: {
        stageName: 'dev',
      },
    }

    const props: ApiGatewayToSqsProps = {
      queueProps: {
        queueName: 'stls-api-sqs-demo-queue',
        retentionPeriod: Duration.minutes(30),
        removalPolicy: RemovalPolicy.DESTROY,
        // fifo: true,
        // deadLetterQueue: { queue: ..., maxReceiveCount: 100 }
        // encryption: QueueEncryption.SQS_MANAGED
      },
      apiGatewayProps: apiProps,
      allowCreateOperation: true,
      allowReadOperation: true,
    }

    const solnConstructResult = new ApiGatewayToSqs(this, 'ApiGatewayToSqsPattern', props)
    const api = solnConstructResult.apiGateway
    const sqsQueue = solnConstructResult.sqsQueue

    const fn = provisionLambda(this, 'lab3-api-sqs-lambda-fn', 'stls-sqs-to-lambda-demo')

    const eventSource = new SqsEventSource(sqsQueue, {
      batchSize: 5, // default is 10, unless maxBatchingWindow set, then can be 10,000
      maxConcurrency: 2,
      maxBatchingWindow: Duration.seconds(10),
    })
    fn.addEventSource(eventSource)

    createOutput(this, 'lab3-api-sqs-api-url', api.url)
    createOutput(this, 'lab3-sqs-urn', sqsQueue.queueArn)
    createOutput(this, 'lab3-sqs-queue-name', sqsQueue.queueName)
  }
}
