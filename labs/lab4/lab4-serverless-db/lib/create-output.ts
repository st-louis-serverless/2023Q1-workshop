import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

export const createOutput = (owner: Construct, id: string, value: string): cdk.CfnOutput => {
  return new cdk.CfnOutput(owner, id, { value })
}
