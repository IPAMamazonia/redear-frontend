#!/bin/bash

usage()
{
    echo "========================================================================================================"
    echo "Parametros:"
    echo ""
    echo "--dev   Ambiente DEV - Ambiente local do Desenvolvedor (Hot Reload)"
    echo "--hmg   Ambiente HMG - Ambiente de homologacao"
    echo "--prod  Ambiente PROD - Ambiente de producao"
    echo "========================================================================================================"
}

cleanup_docker()
{
    echo "Limpando lixo Docker..."
    docker system prune -f
    docker builder prune -f
}

case $1 in
    --dev | --hmg | --prod | --clean );;
    -h | --help )
        usage
        exit
    ;;
    * )
        usage
        exit 1
esac

if [ "$1" == "--dev" ]; then
    echo "Iniciando ambiente de desenvolvimento..."
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --remove-orphans
fi

if [ "$1" == "--hmg" ]; then
    echo "Fazendo deploy em homologacao..."
    docker compose -f docker-compose.yml -f docker-compose.hmg.yml up -d --build --remove-orphans
    cleanup_docker
fi

if [ "$1" == "--prod" ]; then
    echo "Fazendo deploy em producao..."
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --remove-orphans
    cleanup_docker
fi

if [ "$2" == "--clean" ]; then
    cleanup_docker
fi
