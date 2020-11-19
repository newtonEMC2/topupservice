#!/bin/bash
docker image build -t gcr.io/production-258815/${1} .
docker image push gcr.io/production-258815/${1}
if [ "$2" = "--remote-deploy" ]; then
    kubectl rollout restart deployment/${1}
    kubectl rollout status deployment/${1} --timeout=5m
    echo "Service ${1} updated"
else
  echo "All done :)"
fi
if [[ "$OSTYPE" == "darwin" ]]; then
    afplay /System/Library/Sounds/Funk.aiff
fi
