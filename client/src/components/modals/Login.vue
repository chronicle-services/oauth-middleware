<script setup>
import windowUtils from '@/utils/windowUtils';
import IconDiscord from '@/components/icons/IconDiscord.vue'
import SocialButton from '@/components/elements/SocialButton.vue'

const discordWindowFeatures = {
        popup: true,
        width: 500,
        height: 700,
    };

windowUtils.addCenteredWindowFeatures(discordWindowFeatures, screen);
const discordWindowsFeaturesString = windowUtils.buildWindowFeaturesJson(discordWindowFeatures);

addEventListener("message", (event)=>{
    console.log(event);
})

function onClick(){
    let url = "https://discord.com/oauth2/authorize?client_id=1206008430851129354&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=guilds";
    //url = "https://discord.com/oauth2/authorize?client_id=1206008430851129354&response_type=code&redirect_uri=127.0.0.1%3A3000&scope=guilds";
    //url = "http:localhost:3000?code=blah";

    let authWindow = window.open(url, "popup", discordWindowsFeaturesString);

}

globalThis.oAuthCallback = function(){
    open.value = false;
}
</script>

<template>
    <div class="btn-wrapper">
        <SocialButton @onClick="onClick()" color="#5865F2">
            <template #icon>
                <IconDiscord/>
            </template>
            Login with Discord
        </SocialButton>
    </div>
</template>

<style scoped>
.btn-wrapper {
    display:flex;
    justify-content: center;
}
</style>