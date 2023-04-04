#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { Lab1CdkStack } from '../lib/lab1-cdk-stack'

const app = new cdk.App()

/* If you don't specify 'env' for a stack, it will be environment-agnostic.
   Account/Region-dependent features and context lookups will not work, but a
   single synthesized template can be deployed anywhere.

   For more information,
   see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
*/
new Lab1CdkStack(app, 'Lab1CdkStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})
