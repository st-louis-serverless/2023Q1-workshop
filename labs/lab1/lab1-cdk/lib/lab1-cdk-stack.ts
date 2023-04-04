import * as cdk from 'aws-cdk-lib'
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketProps } from 'aws-cdk-lib/aws-s3'

const lab1BucketProps: BucketProps = {
  accessControl: BucketAccessControl.PRIVATE,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  // versioned: true,
  removalPolicy: RemovalPolicy.DESTROY, // when stack is destroyed, non-empty bucket will be, too
}

export class Lab1CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, 'stls-workshop-bucket', lab1BucketProps)

    new CfnOutput(this, 'lab1-bucket-arn', {
      value: bucket.bucketArn,
    })

    new CfnOutput(this, 'lab1-bucket-name', {
      value: bucket.bucketName,
    })

    new CfnOutput(this, 'lab1-bucket-regional-domain-name', {
      value: bucket.bucketRegionalDomainName,
    })
  }
}
