if [ -z $1 ]; then
  echo "Must specify version"
  exit 1
fi
VERSION=$1
az container create \
    --resource-group $RES_GROUP \
    --name aggregator \
    --image $ACR_NAME.azurecr.io/aggregator:$VERSION \
    --registry-login-server $ACR_NAME.azurecr.io \
    --registry-username $(az keyvault secret show --vault-name $AKV_NAME --name $ACR_NAME-pull-usr --query value -o tsv) \
    --registry-password $(az keyvault secret show --vault-name $AKV_NAME --name $ACR_NAME-pull-pwd --query value -o tsv) \
    --dns-name-label aggregator-$ACR_NAME \
    --query "{FQDN:ipAddress.fqdn}" \
    --output table
