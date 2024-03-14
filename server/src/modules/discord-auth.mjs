import {discord as config} from '../util/config-utils.mjs'

async function getBotGuilds(){
    const url = "https://discord.com/api/users/@me/guilds"
    const options = {
        method: 'GET',
        headers: {
            "Authorization": "Bot "+config.bot.token
        }
    }

    let response = (await fetch(url, options));
    if(response.status != 200){
        return null;
    }

    let json = await response.json();

    const result = [];
    if(Array.isArray(json)){
        for(const server of json){
            result.push(server.id);
        }
    }

    return result;
}

async function getUserGuilds(token){
    const url = "https://discord.com/api/users/@me/guilds"
    const options = {
        method: 'GET',
        headers: {
            "Authorization": token.token_type +" "+token.access_token
        }
    }

    let response = (await fetch(url, options));

    if(response.status != 200){
        return null;
    }

    let json = await response.json();

    const result = [];
    if(Array.isArray(json)){
        for(const server of json){
            result.push(server.id);
        }
    }

    return result;
}

async function getToken(code){
    const url = "https://discord.com/api/oauth2/token";
    const options = {
        method: "POST",
        body: new URLSearchParams({
            client_id: config.client.id,
            client_secret: config.client.secret,
            code: code, 
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/"
        })
    };

    let response = (await fetch(url, options));
    
    if(response.status != 200){
        return null;
    }

    let json = await response.json();
    return json;
}

async function verifyUser(code){
    if(code == null){
        return false;
    }

    let token = await getToken(code);

    if(token == null){
        return false;
    }

    let userGuilds = await getUserGuilds(token);
    let botGuilds = await getBotGuilds();

    for(const guild of userGuilds){
        if(botGuilds.includes(guild)){
            return true;
        }
    }
    return false;
}

export default {
    verifyUser
}