# AWS Workshop Tooling Setup

You are going to need a few tools setup for the workshop. Chances are, if you're a 
developer or architect, you probably already have some or all of these installed.

What follows is helpful guidance to cut through the noise on installing the tools. 
However, you should consult the formal documentation (links provided) to see the 
full solution.
 
- Your favorite IDE
- Git 
- Node
- Typescript
- AWS Cloud Development Kit (CDK)
- AWS CLI

## Integrated Development Environment

I suppose hardcore text editor aficionados won't need an IDE. That's not me though.

I'll be using JetBrains tools (Webstorm, IDEA). You may prefer Visual Studio Code (VSCode) or something else.

Whatever your choice, before the workshop look for and install any plugins / extensions you'd like. 
Just search for "AWS" and you'll find many. 

As always, _caveat emptor_ so I recommend choosing the most popular and well-supported ones.

## Installing Git

There are many ways to install Git. Visit the following page to find the best way for your OS:
[Git Home](https://git-scm.com/)

Mac users may have Git via Xcode, or can use Brew to install it:
```shell
brew install git
```
or MacPorts
```shell
sudo port install git
```

Windows users can install git via [download](https://git-scm.com/download/win) 
or with [Chocalatey](https://community.chocolatey.org/packages/git):
```shell
choco install git
```

However you install it, you can verify the version in use with
```shell
git --version
```
```text
git version 2.39.1
```

## Installing Node

The current [Lambda runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) support Node v12 - v18. 
We'll use Node v18 LTS in this workshop.

You can install Node directly from the [Node download page](https://nodejs.org/en/). 

### NVM

Because Node versions change regularly, I recommend **nvm**, a [Node Version Manager](https://github.com/nvm-sh/nvm). 
It's available for *nix OS's, so Windows users will need to use WSL. To install **nvm**, run
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
or
```shell
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Once installed, you can verify the installation with:
```shell
nvm --version
```
You'll see 0.39.3 output.
> Note: You may need to `source` your shell config file (e.g. .bash_profile or .zshrc) 
> for nvm to be added to the path

Next, install and use Node 18:
```shell
nvm install 18
```
```text
Downloading and installing node v18.14.1...
Downloading https://nodejs.org/dist/v18.14.1/node-v18.14.1-darwin-x64.tar.xz...
########################################################################## 100.0%
Computing checksum with shasum -a 256
Checksums matched!
Now using node v18.14.1 (npm v7.22.0)
```

### Verify Node / npm
```shell
node --version
```
```text
v18.14.1
```
```shell
npm --version
```
```text
7.22.0
```

## Installing Typescript

Prerequisites: npm (from Node)

In this workshop, we will use Typescript, and optionally, Java.

While CDK supports JavaScript, I prefer greater type-safety when the code I'm writing will cause the 
provisioning of AWS resources. A screwy JS type conversion is one less thing I want to lose sleep over.

To install Typescript:

```shell
npm install -g typescript
```
```shell
tsc --version
```
```text
Version 4.9.5
```

## Install CDK

Prerequisites: npm (from Node)

The CDK Toolkit allows us to run CDK commands from the commandline. 
It can be installed locally or in a CI/CD environment.

See [AWS CDK Toolkit docs](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)

Note from the docs:
> If you regularly work with multiple versions of 
> the AWS CDK, consider installing a matching version of the AWS CDK 
> Toolkit in individual CDK projects. To do this, omit -g from the 
> npm install command. Then use npx aws-cdk to invoke it. This runs 
> the local version if one exists, falling back to a global version if not.

Global Installation
```shell
npm install -g aws-cdk
```
Verify installation
```shell
cdk --version
```
```text
2.62.2 (build c164a49)
```

## AWS CLI
AWS provides a useful Command Line Interface (CLI) for interacting with your AWS account and resources.

[AWS official instructions](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Summary:

### Mac users (install just for current user)

- In your browser, download the macOS pkg file: https://awscli.amazonaws.com/AWSCLIV2.pkg
- Create symlinks

```shell
sudo ln -s /folder/installed/aws-cli/aws /usr/local/bin/aws
sudo ln -s /folder/installed/aws-cli/aws_completer /usr/local/bin/aws_completer
```

- Verify
```shell
which aws
aws --version
```
```text
aws-cli/2.10.3 Python/3.9.11 Darwin/22.3.0 exe/x86_64 prompt/off
```

### Windows users

Install via MSI: https://awscli.amazonaws.com/AWSCLIV2.msi, or command line:
```shell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

Verify:
```shell
aws --version
```
```text
aws-cli/2.10.0 Python/3.11.2 Windows/10 exe/AMD64 prompt/off
```

### Linux users

```shell
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

Uninstalling instructions: https://docs.aws.amazon.com/cli/latest/userguide/uninstall.html.

## Whew!

That may seem like a lot if you're starting from scratch... but you probably aren't.

Onto the labs!

# Other tool suggestions (not needed for labs)

## Installing Docker

Installing Docker is optional, but wrecommended, as we'll use it when testing Lambdas locally using SAM.

### About Docker

Containers, and its de facto synonym Docker, was a fantastic addition to enterprise computing.

When we say _Docker_, we might really mean any of these things and more:
- A specification for container images (DockerFile)
- A runtime for running images (docker engine running as dockerd daemon)
- A CLI for interacting with the docker engine
- Docker Desktop, a GUI client for interacting with the Docker engine
- The company, [Docker.com](https://docker.com)
- Containers. Images. Networks. More..

[Geekflare Article on Docker Archtecture](https://geekflare.com/docker-architecture/)

Its small application runtime environment proved an essential ingredient for our development,
testing and consistent, reproducible deployments. Without containers, we would never have been
able to achieve the massively, horizontally-scaled applications we have today. Indeed, Kubernetes
was born out of the need to orchestrate dozens to hundreds to thousands of running containers.

The company behind Docker produced a lot of great open source and proprietary tools generating
great loyalty and endearment from developers and organizations.

> Opinion: Docker threw away most of its good will in a bone-headed licensing change that imposed
> significant costs to enterprises where before there was none. Large companies can easily afford
> the modest $5/month/developer fee, but being force-fed what tasted like a bait-and-switch crap
> sandwich proved too much for many.

Fortunately, if you're in a company that walked away from Docker the company, there are many good
alternatives.

### Installing a container runtime

Explore these (or others) and install one or more:

- [Docker Desktop](https://docker.com)
- [Rancher Desktop](https://rancherdesktop.io/)
- [podman](https://podman.io/)
- [Nerdctl](https://github.com/containerd/nerdctl)

I prefer Rancher Desktop, but also use Docker Desktop. Rancher Desktop not only lets you switch between
using the Docker engine and Nerdctl, but also allows you to run different versions of Kubernetes.

> Tip: I experienced a lot of problems running podman on a Mac M1 when using TestContainers. I had no
> troubles with Rancher Desktop or Docker Desktop. Unfair as it is, this soured me completely on using podman.


## Installing AWS SAM

We'll provision our resources using AWS CDK. However, there's another AWS tool that allows
us to test Lambda and API Gateway locally before we provision the resources on AWS. That
tool is 
[AWS Serverless Application Model (SAM)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html).

In this workshop, we'll just use the CLI version, not the GUI.

You can follow the online [Installation instructions for SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

**tl;dr**

Mac users can use Brew:
```shell
brew tap aws/tap
brew install aws-sam-cli
```

Windows users can download an [MSI installer](https://github.com/aws/aws-sam-cli/releases/latest/download/AWS_SAM_CLI_64_PY3.msi)

## Installing Java

This workshop will primarily use TypeScript. However, Java is
ubiquitous and for man use cases has better Lambda execution performance than Node, so
we'll also use it in this workshops as an _**optional**_ approach.

A Google search on `installing java` will reveal there are many ways to
install Java. Once an approach is chosen, you need to decide which
Java Development Kit (JDK) you will use.

Since this is an AWS-oriented workshop, we'll use an **AWS Corretto JDK**,
which is what Amazon uses for the Java-based Lambda runtimes. It is based
on the OpenJDK distribution, so feel free to use that if you prefer.

Windows users can follow the
[Oracle instructions](https://docs.oracle.com/en/java/javase/11/install/installation-jdk-microsoft-windows-platforms.html).
or use [Chocalatey](https://community.chocolatey.org/packages/openjdk)

I strongly recommend Mac and Linux users use [SDK Man](https://sdkman.io/).

### sdkman
To install sdkman, run
```shell
curl -s "https://get.sdkman.io" | bash
```

Verify with
```shell
sdk version
```
```text
SDKMAN 5.16.0
```

To list available Java versions and JDK distributions:
```shell
sdk list java
```
```text
================================================================================
Available Java Versions for macOS 64bit
================================================================================
 Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
 Corretto      |     | 19.0.2       | amzn    |            | 19.0.2-amzn         
               |     | 19.0.1       | amzn    |            | 19.0.1-amzn         
               |     | 17.0.6       | amzn    |            | 17.0.6-amzn         
               |     | 17.0.5       | amzn    |            | 17.0.5-amzn         
               |     | 15.0.1       | amzn    | local only | 15.0.1-amzn         
               |     | 11.0.18      | amzn    |            | 11.0.18-amzn        
               |     | 11.0.17      | amzn    |            | 11.0.17-amzn        
               |     | 11.0.9       | amzn    | local only | 11.0.9-amzn         
               |     | 8.0.362      | amzn    |            | 8.0.362-amzn        
               |     | 8.0.352      | amzn    |            | 8.0.352-amzn        
               |     | 8.0.275      | amzn    | local only | 8.0.275-amzn        
 Gluon         |     | 22.1.0.1.r17 | gln     |            | 22.1.0.1.r17-gln    
               |     | 22.1.0.1.r11 | gln     |            | 22.1.0.1.r11-gln    
               |     | 22.0.0.3.r17 | gln     |            | 22.0.0.3.r17-gln    
               |     | 22.0.0.3.r11 | gln     |            | 22.0.0.3.r11-gln    
 GraalVM       |     | 22.3.r19     | grl     |            | 22.3.r19-grl        
               |     | 22.3.r17     | grl     |            | 22.3.r17-grl        
               |     | 22.3.r11     | grl     |            | 22.3.r11-grl 
...               
```
> Note: You may need to source your shell config file

Install AWS Corretto v17.0.6:
```shell
sdk install java 17.0.6-amzn
```
```text
Downloading: java 17.0.6-amzn

In progress...

########################################################

Repackaging Java 17.0.6-amzn...

Done repackaging...
Cleaning up residual files...

Installing: java 17.0.6-amzn
Done installing!

Do you want java 17.0.6-amzn to be set as default? (Y/n): Y

Setting java 17.0.6-amzn as default.
```

Verify Java installed:
```shell
java --version
```
```text
openjdk 17.0.6 2023-01-17 LTS
OpenJDK Runtime Environment Corretto-17.0.6.10.1 (build 17.0.6+10-LTS)
OpenJDK 64-Bit Server VM Corretto-17.0.6.10.1 (build 17.0.6+10-LTS, mixed mode, sharing)
```
