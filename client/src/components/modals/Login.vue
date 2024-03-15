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
    let url = import.meta.env.VITE_AUTH_URL;
    console.log(`url:${url}`);
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