import * as cdk from 'aws-cdk-lib'
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'

export default class Lab2LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // const functionPath = path.join(__dirname, 'functions', 'demo')
    const functionPath = path.join(__dirname, '..', 'functions', 'demo')

    const fn = new lambda.Function(this, 'Lab2_Lambda_Demo_Function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'stls-demo-lambda.handler', // format is: <filename without ext>.<exported function name>
      code: lambda.Code.fromAsset(functionPath),
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.RETAIN,
      },
      reservedConcurrentExecutions: 50, // set to 0 to disable the function from handling ay requests
      logRetention: RetentionDays.ONE_DAY,
    })

    const fnUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })

    const aliasName = 'dev' // this could a feature tag passed in from CI, commit id fetched from git, etc
    const featureAlias = new lambda.Alias(this, 'lab2_DevAlias', {
      aliasName: aliasName,
      version: fn.currentVersion,
      description: 'Lambda deployment-time alias for a feature',
    })

    const aliasUrl = featureAlias.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })

    new CfnOutput(this, 'lab2_SimpleFunction-arn', {
      value: fn.functionArn,
    })

    new CfnOutput(this, 'lab2_SimpleFunction-name', {
      value: fn.functionName,
    })

    new CfnOutput(this, 'lab2_SimpleFunction-currentVersion', {
      value: fn.currentVersion.version,
    })

    new CfnOutput(this, 'lab2_SimpleFunction-url', {
      value: fnUrl.url,
    })

    new CfnOutput(this, 'lab2_SimpleFunction-alias-url', {
      value: aliasUrl.url,
    })
  }
}
