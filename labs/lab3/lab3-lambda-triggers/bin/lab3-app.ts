#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { Lab3LambdaTriggerStack } from '../lib/lab3-lambda-trigger-stack'

const app = new cdk.App()
new Lab3LambdaTriggerStack(app, 'Lab3LambdaTriggersStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})
