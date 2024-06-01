data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "lambda_logging_role" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    effect    = "Allow"
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_logging_policy" {
  name        = "discord_mc2_logging_policy"
  description = "Policy for logging from the Discord MC2 Lambda function"
  policy      = data.aws_iam_policy_document.lambda_logging_role.json
}

data "aws_iam_policy_document" "lambda_invoke_role" {
  statement {
    actions   = ["lambda:InvokeFunction"]
    effect    = "Allow"
    resources = ["arn:aws:lambda:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_invoke_policy" {
  name        = "discord_mc2_invoke_policy"
  description = "Policy for invoking the Discord MC2 Lambda function"
  policy      = data.aws_iam_policy_document.lambda_invoke_role.json
}

data "aws_iam_policy_document" "lambda_start_ec2_role" {
  statement {
    actions = [
      "ec2:StartInstances",
      "ec2:DescribeInstances"
    ]
    effect    = "Allow"
    resources = ["arn:aws:ec2:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_start_ec2_policy" {
  name        = "discord_mc2_start_ec2_policy"
  description = "Policy for starting the EC2 instance from the Discord MC2 Lambda function"
  policy      = data.aws_iam_policy_document.lambda_start_ec2_role.json
}

data "aws_iam_policy_document" "lambda_stop_ec2_role" {
  statement {
    actions = [
      "ec2:StopInstances",
      "ec2:DescribeInstances"
    ]
    effect    = "Allow"
    resources = ["arn:aws:ec2:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_stop_ec2_policy" {
  name        = "discord_mc2_stop_ec2_policy"
  description = "Policy for stopping the EC2 instance from the Discord MC2 Lambda function"
  policy      = data.aws_iam_policy_document.lambda_stop_ec2_role.json
}

data "aws_iam_policy_document" "lambda_create_route53_record_role" {
  statement {
    actions = [
      "route53:ChangeResourceRecordSets"
    ]
    effect    = "Allow"
    resources = ["arn:aws:route53:::hostedzone/${var.route53_hosted_zone_id}"]
  }
}

resource "aws_iam_policy" "lambda_create_route53_record_policy" {
  name        = "discord_mc2_create_route53_record_policy"
  description = "Policy for creating a Route 53 record from the Discord MC2 Lambda function"
  policy      = data.aws_iam_policy_document.lambda_create_route53_record_role.json
}

data "aws_iam_policy_document" "lambda_delete_route53_record_role" {
  statement {
    actions = [
      "route53:ChangeResourceRecordSets"
    ]
    effect    = "Allow"
    resources = ["arn:aws:route53:::hostedzone/${var.route53_hosted_zone_id}"]
  }
}

resource "aws_iam_policy" "lambda_delete_route53_record_policy" {
  name        = "discord_mc2_delete_route53_record_policy"
  description = "Policy for deleting a Route 53 record from the Discord MC2 Lambda function"
  policy      = data.aws_iam_policy_document.lambda_delete_route53_record_role.json
}
