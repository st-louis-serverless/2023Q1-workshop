# Lab 1 - Introduction to the AWS Lambda

These commands were used to initialize the project:
```shell
mkdir lab2-lambda && cd lab2-lambda && cdk init app --language typescript
```

## About Lambda

Lambda's are a compute mechanism in the category of FaaS (Functions as a Service). They run as 100% AWS-managed resources, 
allowing us to focus (more) on the business problem.

We can use the CDK to provision and configure Lambda's. For testing them locally, we can use AWS SAM (Serverless Application Model) 
to run them as docker containers. Time doesn't permit us to explore this in this workshop, but perhaps we can in our future 
`Mastering AWS Lambda` workshop. 

### Handler Payload

#### Event

```json
{
  "version": "2.0",
  "routeKey": "$default",
  "rawPath": "/",
  "rawQueryString": "",
  "headers": {
    "x-amzn-tls-cipher-suite": "ECDHE-RSA-AES128-GCM-SHA256",
    "x-amzn-tls-version": "TLSv1.2",
    "x-amzn-trace-id": "Root=1-64248369-7480445d351b81866ab10517",
    "x-forwarded-proto": "https",
    "host": "z5iq7ghhq6qeahj6b6rlz7m3na0qcpsl.lambda-url.us-east-2.on.aws",
    "x-forwarded-port": "443",
    "x-forwarded-for": "68.188.90.78",
    "accept": "*/*",
    "user-agent": "curl/7.86.0"
  },
  "requestContext": {
    "accountId": "anonymous",
    "apiId": "z5iq7ghhq6qeahj6b6rlz7m3na0qcpsl",
    "domainName": "z5iq7ghhq6qeahj6b6rlz7m3na0qcpsl.lambda-url.us-east-2.on.aws",
    "domainPrefix": "z5iq7ghhq6qeahj6b6rlz7m3na0qcpsl",
    "http": {
      "method": "GET",
      "path": "/",
      "protocol": "HTTP/1.1",
      "sourceIp": "68.188.90.78",
      "userAgent": "curl/7.86.0"
    },
    "requestId": "a1116be1-a1e5-47e3-b067-13908514c619",
    "routeKey": "$default",
    "stage": "$default",
    "time": "29/Mar/2023:18:28:57 +0000",
    "timeEpoch": 1680114537322
  },
  "isBase64Encoded": false
}
```

#### Context

```json
{
    "callbackWaitsForEmptyEventLoop": true,
    "functionVersion": "$LATEST",
    "functionName": "Lab2LambdaStack-SimpleFunction72920FC2-dEnPCDnB9SRT",
    "memoryLimitInMB": "128",
    "logGroupName": "/aws/lambda/Lab2LambdaStack-SimpleFunction72920FC2-dEnPCDnB9SRT",
    "logStreamName": "2023/03/29/[$LATEST]a56f4130afb34b55950f27506aeabc05",
    "invokedFunctionArn": "arn:aws:lambda:us-east-2:78********16:function:Lab2LambdaStack-SimpleFunction72920FC2-dEnPCDnB9SRT",
    "awsRequestId": "a1116be1-a1e5-47e3-b067-13908514c619"
}
```

## Lambda with the CDK

### Function Code

The code for our Lambda function can come from one of four places:
- lambda.Code.fromBucket(bucket, key[, objectVersion])
- lambda.Code.fromInline(code)
- lambda.Code.fromAsset(path)
- lambda.Code.fromDockerBuild(path, options)
  - An ECR image
  - A Dockerfile

To keep things simple, we'll use the from Asset option in our labs.

#### Lambda from inline code

For simple experiments, it might be convenient to define your Lambda function inline. For
example:

```typescript
const fn = new lambda.Function(this, 'SimpleFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'stls-demo-lambda.handler', // format is: <filename without ext>.<exported function name>
  code: lambda.Code.fromAsset(functionPath),
})

new Function(this, 'MyFunction', {
  handler: 'index.handler',
  code: Code.fromInline(`
    exports.handler = async (event) => {
      console.log('event: ', event)
    };
  `),
  runtime: Runtime.NODEJS_18_X
});
```

#### Lambda from CDK Project Asset

You can define your functions in your CDK project using a `fromAsset` code strategy, e.g.:  
```typescript
const fn = new lambda.Function(this, 'SimpleFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'lambda-file.lambda-handler-function',
  code: lambda.Code.fromAsset(functionPath),
})
```

#### Lambda deployed as a Docker Image

With Docker images, you can build any Lambda runtime you want using
any language that can run in Docker.

From a Dockerfile:
```typescript
new lambda.DockerImageFunction(this, 'AssetFunction', {
  code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-handler')),
})
```

From an Elastic Container Registry (ECR) repository:
```typescript
import * as ecr from 'aws-cdk-lib/aws-ecr';
const repo = new ecr.Repository(this, 'Repository');

new lambda.DockerImageFunction(this, 'ECRFunction', {
  code: lambda.DockerImageCode.fromEcr(repo),
})
```

### Deployment

Every Lambda needs an execution role. You can define your own, or let CDK do it for you.

Deployment will look something like this:
```text
% tsc && cdk deploy

✨  Synthesis time: 6.34s

Lab2LambdaStack: building assets...

[0%] start: Building 13800e363baaadd749d3d0c56361ac68bfee3acb709c8df74c34dd8ee68111e7:78********16-us-east-2
[0%] start: Building 7bb690e00bc638a8c142b1c0798382f9fc842dcfd796aabbbbda146805e26369:78********16-us-east-2
[50%] success: Built 13800e363baaadd749d3d0c56361ac68bfee3acb709c8df74c34dd8ee68111e7:78********16-us-east-2
[100%] success: Built 7bb690e00bc638a8c142b1c0798382f9fc842dcfd796aabbbbda146805e26369:78********16-us-east-2

Lab2LambdaStack: assets built

This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

IAM Statement Changes
┌───┬─────────────────────────────────────────┬────────┬──────────────────────────┬──────────────────────────────┬───────────┐
│   │ Resource                                │ Effect │ Action                   │ Principal                    │ Condition │
├───┼─────────────────────────────────────────┼────────┼──────────────────────────┼──────────────────────────────┼───────────┤
│ + │ ${Lambda_Function_Demo.Arn}             │ Allow  │ lambda:InvokeFunctionUrl │ *                            │           │
│ + │ ${Lambda_Function_Demo.Arn}             │ Allow  │ lambda:InvokeFunctionUrl │ *                            │           │
├───┼─────────────────────────────────────────┼────────┼──────────────────────────┼──────────────────────────────┼───────────┤
│ + │ ${Lambda_Function_Demo/ServiceRole.Arn} │ Allow  │ sts:AssumeRole           │ Service:lambda.amazonaws.com │           │
├───┼─────────────────────────────────────────┼────────┼──────────────────────────┼──────────────────────────────┼───────────┤
│ + │ ${featureAlias}                         │ Allow  │ lambda:InvokeFunctionUrl │ *                            │           │
└───┴─────────────────────────────────────────┴────────┴──────────────────────────┴──────────────────────────────┴───────────┘
IAM Policy Changes
┌───┬─────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource                            │ Managed Policy ARN                                                             │
├───┼─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${Lambda_Function_Demo/ServiceRole} │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole │
└───┴─────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Do you wish to deploy these changes (y/n)? y
Lab2LambdaStack: deploying... [1/1]
[0%] start: Publishing 13800e363baaadd749d3d0c56361ac68bfee3acb709c8df74c34dd8ee68111e7:78********16-us-east-2
[0%] start: Publishing 7bb690e00bc638a8c142b1c0798382f9fc842dcfd796aabbbbda146805e26369:78********16-us-east-2
[50%] success: Published 13800e363baaadd749d3d0c56361ac68bfee3acb709c8df74c34dd8ee68111e7:78********16-us-east-2
[100%] success: Published 7bb690e00bc638a8c142b1c0798382f9fc842dcfd796aabbbbda146805e26369:78********16-us-east-2
Lab2LambdaStack: creating CloudFormation changeset...

 ✅  Lab2LambdaStack

✨  Deployment time: 54.67s

Outputs:
Lab2LambdaStack.SimpleFunctionaliasurl = https://rt7axqkydhojs74dumwc36kzkm0lujbv.lambda-url.us-east-2.on.aws/
Lab2LambdaStack.SimpleFunctionarn = arn:aws:lambda:us-east-2:78********16:function:Lab2LambdaStack-LambdaFunctionDemo9542D2AF-inpWzN53ms1y
Lab2LambdaStack.SimpleFunctioncurrentVersion = 1
Lab2LambdaStack.SimpleFunctionname = Lab2LambdaStack-LambdaFunctionDemo9542D2AF-inpWzN53ms1y
Lab2LambdaStack.SimpleFunctionurl = https://55a6hqei6ytmwofh4d7f64fgy40bqyxs.lambda-url.us-east-2.on.aws/
Stack ARN:
arn:aws:cloudformation:us-east-2:78********16:stack/Lab2LambdaStack/ffb59c50-d17e-11ed-a6d1-06da731fb61f
```
### Versions

The first time a Lambda is deployed it gets an internal `currentVersion` integer version number of 1. It also gets a pseudo-version called **$LATEST**. 
The $LATEST version gets applied to every updated Lambda deployment.

> Note: Many services will not work with the Lambda if $LATEST is the specified version  

Every time we change our Lambda code or configuration (memory, runtime version, etc.), the internal `currentVersion` integer number will increment.

You can reference the `currentVersion` generated in a deployment of a function by refering it directly with `myLambdaFn.currentVersion`.

A specific Lambda version can be referenced by appending the version number on the ARN:
```text
// $LATEST implied
arn:aws:lambda:us-east-2:78********16:function:Lab2LambdaStack-LambdaFunctionDemo9542D2AF-inpWzN53ms1y

// $LATEST explicitly used
arn:aws:lambda:us-east-2:78********16:function:Lab2LambdaStack-LambdaFunctionDemo9542D2AF-inpWzN53ms1y:$LATEST

// Version number used
arn:aws:lambda:us-east-2:78********16:function:Lab2LambdaStack-LambdaFunctionDemo9542D2AF-inpWzN53ms1y:42
```

By default, just the last version will be kept around. To retain all versions, we can configure the Version construct to retain all:
```typescript
const newVersion = fn.currentVersion
newVersion.applyRemovalPolicy(RemovalPolicy.RETAIN) // keep the version
```

All versions, all data:
```text
aws lambda list-versions-by-function --function-name <function name> --no-paginate | jq
```

Just the versions:
```text
aws lambda list-versions-by-function --function-name <function name> --no-paginate | jq '.Versions[].Version'
```

Highest version #:
```text
aws lambda list-versions-by-function --function-name $1 \
--query "max_by(Versions, &to_number(to_number(Version) || '0'))" | jq '.Version'
```

We can use the `aws` cli to list all versions using the `list-versions-by-function` command.

> Note: I'm using the `jq` utility to format the json. For Mac users, just `brew install jq`

### Aliases

Lambda functions are running out in Lambdaland, not in our own EC2 instances or clusters. 
However, the idea of deployments environments is pervasive in our development world; i.e. dev, test, qa, stage, prod, etc.

How can we map Lambda deployments to our mental model of environments?

One strategy would be to use multiple AWS accounts, one for DEV, one for QA, etc. Promotion would then mean 
developing a Lambda function in the DEV account, then redeploying that deployment artifact to the QA account, 
etc. all the way to prod.  This satisfies our mental model and is relatively easy to automate. You'll probably 
want to set up an [AWS Organization](https://aws.amazon.com/organizations/) for consolidated billing and 
centralized management and compliance across accounts.

Another strategy might be to deploy to different regions, one for dev, a different one for qa, etc. However, 
the region decision should be driven by where your customers/users are and disaster recovery / high availability, 
not pseudo-environment segregation.

A simple strategy is just to leverage *aliases* to differentiate between dev, qa, stage, and prod resources. An 
alias is a _pointer_ to one or more Lambda function versions. An alias can point to Lambda versions A and B, applying a 
weighted distribution to each version. Think of A/B testing, or risk management where you want a new function version to 
only get 5% of traffic for a day, with 95% going to the previous version.

A function URL can be tied to an alias so we can call the right version using the alias url.

> Aliases are useful even for in a multi-account strategy. If you want to roll Prod back from v3 of a Lambda to v2, just 
> point the `prod` alias to v2. Or you can do traffic splitting between v2 and v3 using weighting in the alias. 

What would aliases be like in a single account? Imagine a series of updates to a Lambda occurred:
```text
fn version      Aliases
    1       <== featureA

after a fix
    1
    2       <== featureA
    
"promote" to dev
    1
    2       <== featureA, dev
    
after another fix
    1
    2       <== dev
    3       <== featureA

"promote" to dev again
    1
    2
    3       <== featureA, dev

"promote" to qa
    1
    2
    3       <== featureA, dev, qa

"promote" to stage then prod
    1
    2
    3       <== dev, qa, stage, prod (after awhile, no need to keep feature alias, but we could)
    
featureB is deployed and makes it to prod. Development continues...
    3
    4       <== featureB, stage, prod
    5       <== qa
    6       <== dev
    
Oops! featureB broke prod. Point stage and prod back to v3
    1
    2
    3       <== stage, prod
    4       
    5       <== qa
    6      
    7       <== featureB, dev (bug fix)

featureB with fix makes it prod and works as intended
    5
    6      
    7       <== dev, qa, stage, prod             
```

How do we create aliases? We can create aliases to point to versions.

### Labs

#### Exercise 1 - Deploy the Lambda

> A. Run `npm run build` to compile

This step ensures the Typescript is compiled to JavaScript which is what Lambda needs

> B. Run `cdk deploy` and observe the output

> C. Use curl, a browser or your favorite REST client to visit the URL output 

```text
Include /all on the path to see context and event:
curl -s <function url from deployment output>/[all]
```

The output includes the context and event payloads so you can see what data you can work with.

> D. Use the aws cli to list the aliases

```text
aws lambda list-aliases --function-name <function name from deployment output>

Names only:
aws lambda list-aliases --function-name <function name> | jq '.Aliases[].Name'
```

#### Exercise 2 - Update the deployment

> A. Change the Lambda message from using "V1" to V2, then run `tsc && cdk deploy` to deploy a second version

> B. Change the Lambda message from using "V2" to V3, then run `tsc && cdk deploy` to deploy a second version

> C. Let's create a `qa` alias pointing to v2. Run the following command 

```text
tsc && cdk deploy -c op=setAlias -c aliasName=qa -c fnName=<function name from deployment> -c fnVersion=2
```

Congratulations, you've promoted your lambda to QA!

We're using a stack in our code triggered by "op=setAlias" just for creating an alias and pointing it to a version. 
To make it general purpose, we pass in _context_ values on the commandline. (There are other ways to do this.)

Output from running that stack wil yield outputs like this:

```text
Outputs:
Lab2AliasStack.aliasurl = https://vpprxxapoxwt2gqwfl2flrvcge0hnxoe.lambda-url.us-east-2.on.aws/
Lab2AliasStack.aliasversion = 2
Stack ARN:
arn:aws:cloudformation:us-east-2:78********16:stack/Lab2AliasStack/9c886270-d1ab-11ed-a9f3-06d4f38be99b
```

Visit that URL and you'll see:
```json
{
"message": "STLS Demo Lambda - v2"
}
```
Hit the same endpoint with /all added, and you'll see the full set of info.

> D. In the scripts directory, run `./list_all_aliases.sh` and you'll see output lie this
```text
./list_all_aliases.sh
list-aliases... Function Name: ...
{
  "Aliases": [
    {
      "AliasArn": "arn:aws:lambda:us-east-2:78********16:function:Lab2LambdaStack-LambdaDemoFunction65032F8D-csPscLc5Hb5H:dev",
      "Name": "dev",
      "FunctionVersion": "3",
      "Description": "Lambda deployment-time alias for a feature",
      "RevisionId": "4f69ac78-771a-4f82-997e-ab00897c8d30"
    },
    {
      "AliasArn": "arn:aws:lambda:us-east-2:78********16:function:Lab2LambdaStack-LambdaDemoFunction65032F8D-csPscLc5Hb5H:qa",
      "Name": "qa",
      "FunctionVersion": "2",
      "Description": "qa alias",
      "RevisionId": "b761d8b2-7f30-4678-a07c-9cf7ad854db2"
    }
  ]
}

```

> E. Create a Function URL for QA

```text

```

See [AWS CLI docs for Lambda](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lambda/index.html)
