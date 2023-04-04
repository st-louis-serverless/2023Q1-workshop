# AWS Workshop Intro

## Welcome!

Welcome to the first St. Louis Serverless quarterly workshop. We started this format 
in 2023 to give a more in-depth look at serverless application development than what 
our monthly, 1-hour meetings could provide.

No prior serverless knowledge or experience is required.

To fit into a compressed 3-hour format, the workshops will be intentionally _low-code_. 
Architects, developers, and technical managers with little (recent) coding experience 
can still benefit without struggling to write a bunch of code.

> Windows Users: Many of the lab instructions will include example shell commands you can use to get things done.
> Some of these will be Mac-only or *nix commands. There won't be a lot of incompatible commands.
> 
> I will endeavor to explain _what_ needs to be done in addition to providing macOS commands to do it.
> 
> Windows users will need to translate to Powershell or the normal command shell. Better still, if you can use WLS, 
> the commands should mostly work like the Mac commands.
> 
> I'm sorry for the inconvenience.

## Our Serverless App

First, we'll have a CDK and Lambda warmup labs to lay some foundational concepts. Then, we'll do a lab 
to build a simple **Link Shortener** app.

## Code

In this workshop, we will be using the AWS **Cloud Development Kit (CDK)**.

The CDK supports multiple languages, but we will only use two: Java and Typescript. As 
this is a _low-code_ workshop, it's mostly important the code is readable and understandable, 
so ample comments will be included, so you don't have to struggle too much with an unfamiliar 
language.

However, short examples will be shown in the other supported languages to give you a feel 
for how they look.

> The CDK project directories for Java and Typescript are in this project under the `labs` folder, named _java_ and _typescript_.

### Lessons
A _lesson_ is a combination of theory presentation and practical lab time. The 
presentation lays out a few key aspects of the topic, but will obviously cover
only a small amount of detail.

The idea is to show you a little of what's available and how it can be used, 
not to make you an expert at using it or understanding all AWS serverless services.

The overall workshop structure will be:

### Agenda
  1. Introductions
  2. What is serverless
  3. AWS CDK (Lab 1)
  4. AWS Lambda (Lab 2)
  5. Lambda triggers (Lab 3)
  6. Step Functions (no lab)
  7. Serverless Databases (Lab 4)
  8. Q&A and Wrap-up

> Note: Breaks are not scheduled. Take them as you need them.

## Next Steps

See the [Workshop Setup](setup_instructions/workshop_setup.md) for setting up your computer for 
the workshop.
