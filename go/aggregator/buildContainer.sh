if [ -z $1 ]; then
  echo "Must specify version"
  exit 1
fi
VERSION=$1
az acr build --registry $ACR_NAME --image aggregator:$VERSION .
