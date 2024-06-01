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
