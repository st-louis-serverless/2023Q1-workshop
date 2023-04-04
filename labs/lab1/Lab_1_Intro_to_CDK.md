# Lab 1 - Introduction to the AWS Cloud Development Kit (CDK)

We'll do some CDK stretches in this lab just to make sure credentials are working and to get used to working with it

> All paths are relative to these instructions unless specified otherwise
> The CDK CLI requires you to be in the same directory as your cdk.json file. 
> If you change directories in your terminal, please navigate back to the directory.

These commands were used to initialize the project:
```shell
mkdir lab1-cdk && cd lab1-cdk && cdk init app --language typescript
```
Move into the `lab1-cdk` folder.

From the lab1-cdk directory, run `npm install` to download all the dependencies. (Or `pnpm` or whatever package manager you prefer.)

### LAB 1 - ACTIONS

#### ACTION 1 - Explore the Typescript CDK App

Some highlights:
- The `bin` folder has the entrypoint for our app
- The `lib` folder has the stack(s) we'll deploye
  - Our stack extends a base class named `Stack`
  - We specify what resources we want provisioned by instantiating the `construct`
    - The format is generally `new <construct>(<stack reference>, <some id we make up>, <options>)`
    - The constructs and options are detailed in the [API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
    - The CDK command `cdk docs` will open a browser to the top level of the docs
- The bucket we'll create will be private and versioned

> A. Run `cdk docs`

Always verify you are looking at the correct docs version 

> B. Inspect package.json

We can see our dependencies in package.json. Notice the `aws-cdk-lib` dependency. CDK v1 required
every construct (i.e. Lambda, S3 bucket, etc) to be declared as a separate dependency. CDK v2 packages
all constructs in one library dependency.

> C. Inspect tsconfig.json

The tsconfig file sets strict mode and excludes `node_modules` and `cdk.out`, the output directory.

> D. Review the app file in /bin

Notice, use the AWS derived credentials and config to indicate in what region this stack
is to be deployed and for what account. If we ran it with another access ID, we'd deploy into
the region and account for those credentials.

> E. Review the stack file in /lib

A CDK app typically has a main application and one or more _stacks_. **A stack is a deployable
unit of infrastructure to AWS.**

For instance, you might have a "database stack" that provisions databases and a "serverless compute"
stack that provisions Lambdas and Fargate resources. A better, more microservice approach is a stack 
that deploys all the resources needed by the microservice. 

Stack deployments are _atomic_. Either everything in the stack gets deployed, or nothing will be.
If a stack deployment is partially complete and a failure occurs, all the partial deployment
resources will be removed.

In this simple app, we have one app and one stack instantiated (created) by our application file.

#### Action 2

## Boostrap our CDK Environment

Some CDK operations require a staging bucket for deployment of resources. For example, Lambda deployables need
to be staged in a bucket, then deployed into the Lambda service.

To facilitate this, CDK requires you to _bootstrap_ this bucket using the `cdk bootstrap` command.

> Run `cdk boostrap`

After running it, you'll see something like this:
```text
lab1/lab1-cdk % cdk bootstrap
 ⏳  Bootstrapping environment aws://78********16/us-east-2...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
CDKToolkit: creating CloudFormation changeset...
[██████████████████████████████████████▋···················] (8/12)

4:19:39PM | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack | CDKToolkit
4:20:00PM | CREATE_IN_PROGRESS   | AWS::IAM::Policy           | ImagePublishingRoleDefaultPolicy
4:20:08PM | CREATE_IN_PROGRESS   | AWS::IAM::Policy           | FilePublishingRoleDefaultPolicy
4:20:08PM | CREATE_IN_PROGRESS   | AWS::IAM::Role             | DeploymentActionRole
...
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://78********16/us-east-2 bootstrapped.
```

If you run `aws s3 ls`, you'll see the boostrap bucket was created:
```text
2023-01-15 15:20:09 cdk-hnb659fds-assets-78********16-us-east-2
```

#### ACTION 3

Build the app

```shell
npm run build
```

#### ACTION 4
Let's see what CloudFormation will be generated for our little stack

> A. Run this command: `cdk synth` to see the CloudFormation and observe the CFN output

Let's provision the bucket.

> B. Run this command: `cdk deploy` to provision the bucket (~40s)

Observe the output looks something like this:
```text
 % cdk deploy

✨  Synthesis time: 8.04s

Lab1CdkStack: building assets...

[0%] start: Building b62059d0e8de7f62563d9341ab1d49477c5623ad994e60fe7bc947d994f8d2e3:78********16-us-east-2
[100%] success: Built b62059d0e8de7f62563d9341ab1d49477c5623ad994e60fe7bc947d994f8d2e3:78********16-us-east-2

Lab1CdkStack: assets built

Lab1CdkStack: deploying... [1/1]
[0%] start: Publishing b62059d0e8de7f62563d9341ab1d49477c5623ad994e60fe7bc947d994f8d2e3:78********16-us-east-2
[100%] success: Published b62059d0e8de7f62563d9341ab1d49477c5623ad994e60fe7bc947d994f8d2e3:78********16-us-east-2
Lab1CdkStack: creating CloudFormation changeset...

 ✅  Lab1CdkStack

✨  Deployment time: 34.92s

Outputs:
Lab1CdkStack.bucketarn = arn:aws:s3:::lab1cdkstack-stlsworkshopbucketfd282079-8qa3a02uc2x1
Lab1CdkStack.bucketname = lab1cdkstack-stlsworkshopbucketfd282079-8qa3a02uc2x1
Stack ARN:
arn:aws:cloudformation:us-east-2:78********16:stack/Lab1CdkStack/182a0f90-ce3d-11ed-85c4-023460a6e2da

✨  Total time: 42.96s
```

> C. Run the command `aws s3 ls` and observe the bucket name matches the output

#### ACTION 5

> A. Uncomment the line in the stack class to enable versioning on the bucket; i.e. `versioned: true,`

> B. Run the command `cdk diff` to see what will change

```text
 % cdk diff
Stack Lab1CdkStack
Resources
[~] AWS::S3::Bucket stls-workshop-bucket stlsworkshopbucketFD282079 
 └─ [+] VersioningConfiguration
     └─ {"Status":"Enabled"}

```

> C. Deploy the changes with `cdk deploy` and observe the changes

Notice we got output like this:
```text
% cdk deploy

✨  Synthesis time: 7.3s

Lab1CdkStack: building assets...

[0%] start: Building 359b004f05e7523d2dd8b394a650765909aec0786755634bce5e6f1b00061092:78********16-us-east-2
[100%] success: Built 359b004f05e7523d2dd8b394a650765909aec0786755634bce5e6f1b00061092:78********16-us-east-2

Lab1CdkStack: assets built

Lab1CdkStack: deploying... [1/1]
[0%] start: Publishing 359b004f05e7523d2dd8b394a650765909aec0786755634bce5e6f1b00061092:78********16-us-east-2
[100%] success: Published 359b004f05e7523d2dd8b394a650765909aec0786755634bce5e6f1b00061092:78********16-us-east-2
Lab1CdkStack: creating CloudFormation changeset...

 ✅  Lab1CdkStack

✨  Deployment time: 36.15s

Outputs:
Lab1CdkStack.bucketarn = arn:aws:s3:::lab1cdkstack-stlsworkshopbucketfd282079-8qa3a02uc2x1
Lab1CdkStack.bucketname = lab1cdkstack-stlsworkshopbucketfd282079-8qa3a02uc2x1
Stack ARN:
arn:aws:cloudformation:us-east-2:78********16:stack/Lab1CdkStack/182a0f90-ce3d-11ed-85c4-023460a6e2da

✨  Total time: 43.45s
```

If you want to verify versioning is on, run this command:
```text
% aws s3api get-bucket-versioning --bucket <bucket name>

Example:
% aws s3api get-bucket-versioning --bucket lab1cdkstack-stlsworkshopbucketfd282079-8qa3a02uc2x1
{
    "Status": "Enabled"
}
```
[get-bucket-versioning API](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/get-bucket-versioning.html)

#### ACTION 6 - Cleanup our stack

> A. Run this command: `cdk destroy` and observe the output

```text
% cdk destroy      
Are you sure you want to delete: Lab1CdkStack (y/n)? y
Lab1CdkStack: destroying... [1/1]

 ✅  Lab1CdkStack: destroyed
```

> B. re-run the command `aws s3 ls` and observe the bucket is gone
