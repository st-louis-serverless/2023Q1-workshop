import * as cdk from 'aws-cdk-lib'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Deployment, Stage } from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { createOutput } from './create-output'
import { Construct } from 'constructs'

// Utility method to create an API for a Lambda
export const provisionApiForSQS = (owner: Construct, id: string, queue: sqs.IQueue, region: string, stageName: string): apigw.RestApi => {
  // LambdaRestApi by default proxies the entire request for Lambda. This
  // keeps things simple at the API level and sets you up for using HttpApi
  const api = new apigw.RestApi(owner, id, {
    deploy: false,
    retainDeployments: false,
  })

  const apiIntegration = new apigw.AwsIntegration({
    service: 'sqs',
    region: region,
    path: `${cdk.Aws.ACCOUNT_ID}/${queue.queueName}`,
    integrationHttpMethod: 'POST',
    options: {
      credentialsRole: createRole(owner, queue),
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: { 'application/json': '' },
        },
      ],
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      requestParameters: { 'integration.request.header.Content-Type': "'application/x-www-form-urlencoded'" },
      requestTemplates: { 'application/json': 'Action=SendMessage&MessageBody=$input.body' },
    },
  })

  const queueApi = api.root.addResource('queue')
  queueApi.addMethod('POST', apiIntegration, {
    methodResponses: [{ statusCode: '200' }],
  })

  const deployment = new Deployment(owner, `${id}-api-deployment`, {
    api,
    retainDeployments: false,
  })

  api.deploymentStage = new Stage(owner, `${id}-stage-${stageName}`, {
    deployment: deployment,
    stageName: stageName,
  })

  createOutput(owner, `${id}:url`, api.url)

  return api
}

const createRole = (owner: Construct, queue: sqs.IQueue): iam.Role => {
  const credentialsRole = new iam.Role(owner, 'api-sqs-role', {
    assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess')],
  })

  credentialsRole.attachInlinePolicy(
    new iam.Policy(owner, 'sqs-message-policy', {
      statements: [
        new iam.PolicyStatement({
          actions: ['sqs:SendMessage'],
          effect: iam.Effect.ALLOW,
          resources: [queue.queueArn],
        }),
      ],
    })
  )

  return credentialsRole
}
