# Deployment Instructions

This project is configured to deploy to AWS S3 and CloudFront using GitHub Actions.

## Prerequisites

1.  **AWS Account**: You must have an AWS account.
2.  **S3 Bucket**: Create an S3 bucket in AWS (e.g., `meravakil-app-production`). Enable "Static website hosting" in the bucket properties.
    *   *Note: Uncheck "Block all public access" if you are hosting directly from S3, or keep it blocked and use CloudFront's Origin Access Control (OAC).*
3.  **CloudFront Distribution**: Create a CloudFront distribution pointing to your S3 bucket.
4.  **IAM User**: Create an IAM user with permissions to:
    *   Upload to S3 (`s3:PutObject`, `s3:ListBucket`, `s3:DeleteObject`)
    *   Invalidate CloudFront cache (`cloudfront:CreateInvalidation`)

## Setup GitHub Secrets

Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**. Add the following secrets:

| Secret Name | Value Description |
| :--- | :--- |
| `AWS_ACCESS_KEY_ID` | The Access Key ID of your IAM user. |
| `AWS_SECRET_ACCESS_KEY` | The Secret Access Key of your IAM user. |
| `AWS_REGION` | The AWS region where your bucket is located (e.g., `ap-south-1` or `us-east-1`). |
| `AWS_S3_BUCKET` | The exact name of your S3 bucket (e.g., `meravakil-app`). |
| `CLOUDFRONT_DISTRIBUTION_ID` | The ID of your CloudFront distribution (e.g., `E1xxxxxxxxx`). |

## Deployment

The deployment workflow is automated. Whenever you push code to the `main` branch, GitHub Actions will:
1.  Install dependencies.
2.  Build the React application.
3.  Upload the `build/` folder to your S3 bucket.
4.  Invalidate the CloudFront cache so users see the latest version immediately.

To trigger a deploy manually, you can also go to the **Actions** tab in GitHub, select "Deploy to AWS S3 and CloudFront", and run the workflow.
