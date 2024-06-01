resource "aws_iam_role" "iam_role_for_entrypoint" {
  name               = "discord_mc2_entrypoint"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "logging_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_logging_policy.arn
  role       = aws_iam_role.iam_role_for_entrypoint.name
}

resource "aws_iam_role_policy_attachment" "invoke_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_invoke_policy.arn
  role       = aws_iam_role.iam_role_for_entrypoint.name
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/entrypoint"
  output_path = "${path.module}/../dist/lambda_function_payload.zip"
}

resource "aws_lambda_function" "discord_mc2_entrypoint" {
  filename      = "${path.module}/../dist/lambda_function_payload.zip"
  function_name = "discord_mc2_entrypoint"
  role          = aws_iam_role.iam_role_for_entrypoint.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime       = "nodejs18.x"
  architectures = ["arm64"]
  timeout       = 10


  environment {
    variables = {
      DISCORD_PUBLIC_KEY = var.discord_bot_public_key
    }
  }
}

resource "aws_lambda_function_url" "discord_mc2_entrypoint" {
  function_name      = aws_lambda_function.discord_mc2_entrypoint.function_name
  authorization_type = "NONE"
}
