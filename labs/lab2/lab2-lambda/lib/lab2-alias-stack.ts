import * as cdk from 'aws-cdk-lib'
import { CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Version } from 'aws-cdk-lib/aws-lambda'

export interface Lab2AliasProps extends cdk.StackProps {
  aliasName: string
  fnName: string
  fnVersion: string
}

export default class Lab2AliasStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Lab2AliasProps) {
    super(scope, id, props)

    const fn = lambda.Function.fromFunctionName(this, 'fromFnName', props.fnName)

    if (!fn) {
      return
    }

    const version = Version.fromVersionAttributes(this, 'fromVersionAttrs', {
      lambda: fn,
      version: props.fnVersion,
    })

    if (!version) {
      return
    }

    const alias = new lambda.Alias(this, 'aliasName', {
      aliasName: props.aliasName,
      version: version,
      description: `${props.aliasName} alias`,
    })

    const aliasUrl = alias.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })

    new CfnOutput(this, 'alias-version', {
      value: version.version,
    })

    new CfnOutput(this, 'alias-url', {
      value: aliasUrl.url,
    })
  }
}
