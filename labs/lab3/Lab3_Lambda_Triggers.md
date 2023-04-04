# Lambda Triggers

These commands were used to initialize the project:
```shell
mkdir lab3-lambda-triggers && cd lab3-lambda-triggers && cdk init app --language typescript
```

## How Lambda gets triggered

### Function URL

We saw this in depth in Lab 2. Lambda Function URLs are a simple, low-cost mechanism for triggering 
Lambdas so long as you don't need all the bells and whistles provided by API gateway.

API Gateway
Event Sources

### API Gateway

There are many good reasons to go through API Gateway.

For public APIs, API Gateway allows custom domains rather than the AWS domains. It also allows 
creating a public-facing _facade_ into VPC resources using `VpcLink`. You can configure API Gateway 
routes using the OpenAPI (formerly known as Swagger docs).

>From the CDK docs:
>Amazon API Gateway is a fully managed service that makes it easy for developers to publish, maintain, 
>monitor, and secure APIs at any scale. Create an API to access data, business logic, or functionality 
>from your back-end services, such as applications running on Amazon Elastic Compute Cloud (Amazon EC2), 
>code running on AWS Lambda, or any web application.

A lot of times the advanced features of the full API Gateway RestApi aren't needed. A simpler, lower-cost 
subset of features is available through the API Gateway HttpApi. 
[How to choose](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) is 
driven by your specific project needs.

> Note:  We'll use the RestApi in our labs because the CDK only has an alpha version of the HttpRest construct; specifically, 
> [@aws-cdk/aws-apigatewayv2-alpha module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-apigatewayv2-alpha-readme.html)  

### Event Sources 

For triggering Lambda from AWS Services there are many Event Sources we can leverage.

#### EventBridge

We don't have a lab on EventBridge, but it's a great Event Bus solution for internal and external app integrations.

![Event Bus](Amazon-EventBridge.png)

EventBridge Pipes provides a well-understood mechanism for event ingestion, transformation 
and enriching, and publication.

![EventBridge Pipes](Amazon-EventBridge-Pipes.png)

Using EventBridge as a Scheduler, we can _fire and forget_ scheduled events, knowing they'll be 
handled at the right time. 

![EventBridge Scheduler](Amazon-EventBridge-Scheduler.png)

## Remove

https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html

https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html

https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html

## Labs

### Exercise 1 - API Gateway to Lambda

> A. Build and synthesize a CFN script using `tsc && cdk synth`

> B. Build and deploy using `tsc && cdk deploy`

> C. Look for the `Lab3LambdaTriggersStack.apiforlambdaapidemourl` URL in the output. POST a JSON message to that endpoint
> Note: No Auth is required

### Exercise 2 - Some Event Sources

> A. Look for the `Lab3LambdaTriggersStack.lab3apilambdademologgroupname` value in the output. This is the AWS CloudWatch 
> Log Group name for the Lambda consuming from the SQS queue.
> 
> Open a terminal window and run `aws logs tail --follow <log group name>`

> B. Look for the `Lab3LambdaTriggersStack.lab3apisqsapiurl` URL. POST a bunch of messages (> 10) through to SQS
> Note: This does require the POST use AWS signed messages. Postman will do thia for you. You can probably post it through
> an API Gateway Test execution as well.

Watch the logs for the Lambda to pick up the messages from SQS.

You can use this example:
```json
{
    "order": {
        "orderId": "P12345",
        "customerId": "abc-1234",
        "orderDate": "2023-03-31",
        "cart": {
            "lineItems": [
                {
                    "productId": "P11101",
                    "productName": "Ultra Smooth Black pen",
                    "qty": 10,
                    "salePrice": 0.99
                },
                {
                    "productId": "N99901",
                    "productName": "Writer's Deluxe Notebook",
                    "qty": 5,
                    "salePrice": 9.99
                },
                {
                    "productId": "YH87659",
                    "productName": "Stink-free Yellow Highlighter",
                    "qty": 2,
                    "salePrice": 1.99
                }
            ]
        },
        "shipping": {
            "contactName": "Jane Smith",
            "streetAddress": "123 Main St",
            "city": "Windy City",
            "state": "IL",
            "zipcode": "12345"
        }
    }
}
```
