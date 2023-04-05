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

> B. Look for the `Lab3LambdaTriggersStack.lab3apisqsapiurl` URL. POST a bunch of messages (> 20) through to SQS
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
The following is output I got after (re)trying it after the workshop:
```text
% aws logs tail --follow /aws/lambda/Lab3LambdaTriggersStack-lab3apilambdademoA509F451-XFYmUEjRY1pS
2023-04-05T00:45:20.475000+00:00 2023/04/05/[$LATEST]14940df251584843967c057080cc6cc8 INIT_START Runtime Version: nodejs:18.v5  Runtime Version ARN: arn:aws:lambda:us-east-2::runtime:b97ad873eb5228db2e7d5727cd116734cc24c92ff1381739c4400c095404a2d3
2023-04-05T00:45:20.689000+00:00 2023/04/05/[$LATEST]14940df251584843967c057080cc6cc8 START RequestId: 96e18f74-fd3c-4148-958f-dce791456861 Version: $LATEST
2023-04-05T00:45:20.696000+00:00 2023/04/05/[$LATEST]14940df251584843967c057080cc6cc8 END RequestId: 96e18f74-fd3c-4148-958f-dce791456861
2023-04-05T00:45:20.696000+00:00 2023/04/05/[$LATEST]14940df251584843967c057080cc6cc8 REPORT RequestId: 96e18f74-fd3c-4148-958f-dce791456861    Duration: 6.46 msBilled Duration: 7 ms   Memory Size: 128 MB     Max Memory Used: 66 MB  Init Duration: 213.20 ms
^C%                                                                                                                                                              stl-serverless/stls-2023Q1-workshop % cls                                                                                              
stl-serverless/stls-2023Q1-workshop % aws logs tail --follow /aws/lambda/Lab3LambdaTriggersStack-lab3apisqslambdafn063090F2-oxbe4zrEgWJy
2023-04-05T02:44:41.780000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 INIT_START Runtime Version: nodejs:18.v5  Runtime Version ARN: arn:aws:lambda:us-east-2::runtime:b97ad873eb5228db2e7d5727cd116734cc24c92ff1381739c4400c095404a2d3
2023-04-05T02:44:41.995000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 START RequestId: 10fc0d1a-3893-5bef-b65d-51bcda55bf63 Version: $LATEST
2023-04-05T02:44:41.997000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 2023-04-05T02:44:41.996Z  10fc0d1a-3893-5bef-b65d-51bcda55bf63    INFO    payload: {"message":"STLS SQS to Lambda Demo","data":[{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}}]}
2023-04-05T02:44:42.023000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 END RequestId: 10fc0d1a-3893-5bef-b65d-51bcda55bf63
2023-04-05T02:44:42.023000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 REPORT RequestId: 10fc0d1a-3893-5bef-b65d-51bcda55bf63    Duration: 28.74 ms       Billed Duration: 29 ms  Memory Size: 128 MB     Max Memory Used: 66 MB  Init Duration: 214.05 ms        
XRAY TraceId: 1-642ce099-ac3a63ea9dd8ed1c3eb3d1ff       SegmentId: 3f6f748d35ddface     Sampled: true
2023-04-05T02:44:42.026000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 START RequestId: 43c584fb-5205-5d8c-908b-d85db0c38823 Version: $LATEST
2023-04-05T02:44:42.027000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 2023-04-05T02:44:42.027Z  43c584fb-5205-5d8c-908b-d85db0c38823    INFO    payload: {"message":"STLS SQS to Lambda Demo","data":[{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}}]}
2023-04-05T02:44:42.043000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 END RequestId: 43c584fb-5205-5d8c-908b-d85db0c38823
2023-04-05T02:44:42.043000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 REPORT RequestId: 43c584fb-5205-5d8c-908b-d85db0c38823    Duration: 16.64 ms       Billed Duration: 17 ms  Memory Size: 128 MB     Max Memory Used: 66 MB  
XRAY TraceId: 1-642ce099-60c99b78e45f37aa3ad20efe       SegmentId: 1e0e64007e08c4e8     Sampled: true
2023-04-05T02:44:42.091000+00:00 2023/04/05/[$LATEST]c461bdfe99f346c39d153331c9c38ae7 INIT_START Runtime Version: nodejs:18.v5  Runtime Version ARN: arn:aws:lambda:us-east-2::runtime:b97ad873eb5228db2e7d5727cd116734cc24c92ff1381739c4400c095404a2d3
2023-04-05T02:44:44.961000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 START RequestId: 10b4d1bd-5b58-518e-b769-8d1bb997d502 Version: $LATEST
2023-04-05T02:44:44.962000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 2023-04-05T02:44:44.962Z  10b4d1bd-5b58-518e-b769-8d1bb997d502    INFO    payload: {"message":"STLS SQS to Lambda Demo","data":[{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}}]}
2023-04-05T02:44:44.983000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 END RequestId: 10b4d1bd-5b58-518e-b769-8d1bb997d502
2023-04-05T02:44:44.983000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 REPORT RequestId: 10b4d1bd-5b58-518e-b769-8d1bb997d502    Duration: 22.18 ms       Billed Duration: 23 ms  Memory Size: 128 MB     Max Memory Used: 66 MB  
XRAY TraceId: 1-642ce09c-5943e3766e286d2c8c025faa       SegmentId: 1f64e87730ffebdc     Sampled: true
2023-04-05T02:44:45.736000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 START RequestId: 7026dad7-530a-5854-8cc1-8671b1db9dfb Version: $LATEST
2023-04-05T02:44:45.737000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 2023-04-05T02:44:45.737Z  7026dad7-530a-5854-8cc1-8671b1db9dfb    INFO    payload: {"message":"STLS SQS to Lambda Demo","data":[{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}}]}
2023-04-05T02:44:45.738000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 END RequestId: 7026dad7-530a-5854-8cc1-8671b1db9dfb
2023-04-05T02:44:45.738000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 REPORT RequestId: 7026dad7-530a-5854-8cc1-8671b1db9dfb    Duration: 1.86 msBilled Duration: 2 ms   Memory Size: 128 MB     Max Memory Used: 67 MB  
XRAY TraceId: 1-642ce09d-5c3e021b82ed9f54f1ea8159       SegmentId: 127061a4787992bd     Sampled: true
2023-04-05T02:44:53.466000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 START RequestId: 1c3bb9d3-89a4-556d-9beb-e5756b7fe0c2 Version: $LATEST
2023-04-05T02:44:53.563000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 2023-04-05T02:44:53.563Z  1c3bb9d3-89a4-556d-9beb-e5756b7fe0c2    INFO    payload: {"message":"STLS SQS to Lambda Demo","data":[{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}},{"order":{"orderId":"P12345","customerId":"abc-1234","orderDate":"2023-03-31","cart":{"lineItems":[{"productId":"P11101","productName":"Ultra Smooth Black pen","qty":10,"salePrice":0.99},{"productId":"N99901","productName":"Writer's Deluxe Notebook","qty":5,"salePrice":9.99},{"productId":"YH87659","productName":"Stink-free Yellow Highlighter","qty":2,"salePrice":1.99}]},"shipping":{"contactName":"Jane Smith","streetAddress":"123 Main St","city":"Windy City","state":"IL","zipcode":"12345"}}}]}
2023-04-05T02:44:53.584000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 END RequestId: 1c3bb9d3-89a4-556d-9beb-e5756b7fe0c2
2023-04-05T02:44:53.584000+00:00 2023/04/05/[$LATEST]c23dcbedb2244aea9a3189ab2bf5c790 REPORT RequestId: 1c3bb9d3-89a4-556d-9beb-e5756b7fe0c2    Duration: 118.06 ms      Billed Duration: 119 ms Memory Size: 128 MB     Max Memory Used: 67 MB  
XRAY TraceId: 1-642ce0a5-fdcf3a7e8c6b0544d26d13ca       SegmentId: 26fff4de60e992dd     Sampled: true
```
