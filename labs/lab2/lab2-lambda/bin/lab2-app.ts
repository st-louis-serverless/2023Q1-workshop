#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import Lab2LambdaStack from '../lib/lab2-lambda-stack'
import Lab2AliasStack from '../lib/lab2-alias-stack'

const app = new cdk.App()

const op = app.node.tryGetContext('op')

if (op === 'setAlias') {
  setAlias()
} else {
  deployLambda()
}

function deployLambda() {
  new Lab2LambdaStack(app, 'Lab2LambdaStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  })
}

function setAlias() {
  const aliasName = app.node.tryGetContext('aliasName')
  const fnName = app.node.tryGetContext('fnName')
  const fnVersion = app.node.tryGetContext('fnVersion')

  if (!aliasName || !fnName || !fnVersion) {
    console.log('aliasName & fnName & fnVersion are required in context')
    return
  }

  new Lab2AliasStack(app, 'Lab2AliasStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
    aliasName: aliasName,
    fnName: fnName,
    fnVersion: fnVersion,
  })
}
