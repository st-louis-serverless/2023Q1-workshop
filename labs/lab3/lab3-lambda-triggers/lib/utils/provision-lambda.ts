import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import * as path from 'path'
import { createOutput } from './create-output'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'

export const provisionLambda = (owner: Construct, id: string, handlerFilename: string): lambda.Function => {
  const functionPath = path.join(__dirname, '..', '..', 'functions', 'trigger-demo')

  const fn = new lambda.Function(owner, id, {
    architecture: lambda.Architecture.ARM_64, // X86_64 is default, but ARM is a little cheaper
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: `${handlerFilename}.handler`, // handler format is: <filename without ext>.<exported function name>
    code: lambda.Code.fromAsset(functionPath),
    currentVersionOptions: {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // this is the default. In this lab we're not keeping versions around
    },
    reservedConcurrentExecutions: 5, // set to 0 to disable the function from handling ay requests
    logRetention: RetentionDays.ONE_DAY, // this value could come from the context, in env vars, etc.
  })

  createOutput(owner, `${id}-arn`, fn.functionArn)
  createOutput(owner, `${id}-log-group-name`, fn.logGroup.logGroupName) // use "aws logs tail --follow <group name>" to watch logs

  return fn
}
