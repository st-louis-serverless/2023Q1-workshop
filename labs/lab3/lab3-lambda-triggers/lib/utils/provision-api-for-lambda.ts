import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Deployment, IntegrationOptions, Stage } from 'aws-cdk-lib/aws-apigateway'
import { createOutput } from './create-output'
import { Construct } from 'constructs'

// Utility method to create an API for a Lambda
export const provisionApiForLambda = (
  owner: Construct,
  id: string,
  handler: lambda.Function,
  stageName: string,
  integrationOptions: IntegrationOptions
): apigw.LambdaRestApi => {
  // LambdaRestApi by default proxies the entire request for Lambda. This
  // keeps things simple at the API level and sets you up for using HttpApi
  const api = new apigw.LambdaRestApi(owner, id, {
    handler,
    integrationOptions,
    deploy: false,
    retainDeployments: false,
  })

  const deployment = new Deployment(owner, `${id}-apiDeployment`, {
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
