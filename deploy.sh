TARGETS=("all" "client" "client_build" "server")
ENVIRONMENTS=("local" "development" "production")

TARGET=$1
ENVIRONMENT=$2

#functions
function validate_target(){
    for t in ${TARGETS[@]}
    do
        if [ $TARGET = $t ]; then
            echo true
            return 0
        fi
    done
    return false
}

function validate_environment(){
    for e in ${ENVIRONMENTS[@]}
    do
        if [ $ENVIRONMENT = $e ]; then
            echo true
            return 0
        fi
    done
    echo false
}

function get_envs(){
    echo ".env.$ENVIRONMENT .env"
}

function build_dotenvx_cmd(){
    cmd="dotenvx run"
    for e in $(get_envs)
    do
        cmd+=" --env-file=build/config/$e"
    done

    echo "$cmd --"
}

function deploy_client(){
    cmd="$(build_dotenvx_cmd) npm run dev --prefix client/"
    eval cmd
}

function deploy_client_build(){
    cmd="$(build_dotenvx_cmd) npm run build --prefix client/ && "
    cmd+="rm -rf server/public/views/app && "
    cmd+="mkdir -p server/public/views/app && "
    cmd+="cp -R client/dist/. server/public/views/app"

    eval $cmd
}

function deploy_server(){
    server_script="npm run start --prefix server/"
    cmd="$(build_dotenvx_cmd) npm run start --prefix server/"

    eval $cmd
}

function deploy_all(){
    deploy_client_build
    eval "pm2 start '$(build_dotenvx_cmd) npm run start --prefix server/'"
}

#Start
if [ $(validate_target) = "false" ]; then
    echo "Invalid target specified."
    EXIT=true
fi

if [ $(validate_environment) = "false" ]; then
    echo "Invalid environment specified."
    EXIT=true
fi

if [ $EXIT ]; then
    exit 1
fi

eval "deploy_$TARGET"