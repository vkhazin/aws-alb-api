clear
sudo apt install -y zip

zip ./deployment.zip -r ./ -x *.git*

aws lambda update-function-code \
    --function-name smith-poc-alb-api \
    --zip-file fileb://./deployment.zip \
    --publish \
    --region $AWS_REGION
    
rm ./deployment.zip