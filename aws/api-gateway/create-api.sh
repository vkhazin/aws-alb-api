AWS_REGION='us-east-2'
BASEDIR=$(dirname $0)

# Create api-gateway
output=$(aws apigateway import-rest-api --body "file://$BASEDIR/swagger.json" --region $AWS_REGION)

# Extract api-id
chmod +x $BASEDIR/jq-linux64
id=$(echo $output | $BASEDIR/jq-linux64 --raw-output '.id')
echo 'Api Id: '$id

# Create deplyment
output=$(aws apigateway create-deployment --rest-api-id $id --stage-name test --region $AWS_REGION)
id=$(echo $output | $BASEDIR/jq-linux64 --raw-output '.id')
echo 'Deployment Id: '$id