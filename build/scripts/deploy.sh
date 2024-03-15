TARGETS=("all" "client" "server")
ENVIRONMENTS=("local" "development" "production")

TARGET=$1
ENVIRONMENT=$2
VITE=$3

#functions
function validate_target(){
    for t in ${TARGETS[@]}
    do
        if [ $TARGET=$t ]; then
            echo true
            return 0
        fi
    done
    echo false
}

function validate_environment(){
    for e in ${ENVIRONMENTS[@]}
    do
        if [ $ENVIRONMENT=$e ]; then
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
    if [ ! -z "$VITE" ] && [ ${VITE}="-v" ]; then
        cmd="$(build_dotenvx_cmd) npm run dev --prefix client/"
        eval $cmd
    else
        cmd="$(build_dotenvx_cmd) npm run build --prefix client/ && "
        cmd+="rm -rf server/public/views/app && "
        cmd+="mkdir -p server/public/views/app && "
        cmd+="cp -R client/dist/. server/public/views/app"

        eval $cmd
    fi
}

function deploy_server(){
    cmd="$(build_dotenvx_cmd) npm run start --prefix server/"

    if [ $VITE="-v" ]; then
        cmd+=" -- -vite"
    fi

    eval $cmd
}

function deploy_all(){
    cmd="$(build_dotenvx_cmd) npm run build --prefix client/ && "
    cmd+="rm -rf server/public/views/app && "
    cmd+="mkdir -p server/public/views/app && "
    cmd+="cp -R client/dist/. server/public/views/app"
    eval $cmd

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