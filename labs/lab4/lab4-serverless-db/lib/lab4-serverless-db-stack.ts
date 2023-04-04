import * as cdk from 'aws-cdk-lib'
import { RemovalPolicy } from 'aws-cdk-lib'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import { AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { ApiGatewayToDynamoDB } from '@aws-solutions-constructs/aws-apigateway-dynamodb'
import { createOutput } from './create-output'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Lab4ServerlessDbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const apiProps: apigw.RestApiProps = {
      restApiName: 'stls-ddb-demo',
      deploy: true,
      deployOptions: {
        stageName: 'dev',
      },
    }

    const tableProps: ddb.TableProps = {
      billingMode: BillingMode.PAY_PER_REQUEST, // serverless means $0 if no load
      tableName: 'api-ddb-demo',
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        type: AttributeType.STRING,
        name: 'id',
      },
    }

    const saveTemplate = JSON.stringify({
      TableName: 'api-ddb-demo',
      Item: {
        id: {
          S: '$context.requestId',
        },
        first_name: {
          S: "$input.path('$.first_name')",
        },
        last_name: {
          S: "$input.path('$.last_name')",
        },
        message: {
          S: "$input.path('$.message')",
        },
      },
    })

    const results = new ApiGatewayToDynamoDB(this, 'stls-api-gateway-dynamodb-230404', {
      allowCreateOperation: true,
      allowDeleteOperation: true,
      allowReadOperation: true,
      apiGatewayProps: apiProps,
      dynamoTableProps: tableProps,
      createRequestTemplate: saveTemplate,
    })

    createOutput(this, 'api-ddb-url', results.apiGateway.url)
    createOutput(this, 'api-ddb-tablename', results.dynamoTable.tableName)
    createOutput(this, 'api-ddb-table-arn', results.dynamoTable.tableArn)
  }
}
