if [ -z $1 ]; then
  echo "Must specify version"
  exit 1
fi
VERSION=$1
az container create \
    --resource-group $RES_GROUP \
    --name backend \
    --image $ACR_NAME.azurecr.io/backend:$VERSION \
    --registry-login-server $ACR_NAME.azurecr.io \
    --registry-username $AZ_REG_USRNAME \
    --registry-password $AZ_REG_PSWD \
    --dns-name-label backend-$ACR_NAME \
    --query "{FQDN:ipAddress.fqdn}" \
    --output table
