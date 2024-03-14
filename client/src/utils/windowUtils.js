export default {
    buildWindowFeaturesJson(options){
        let windowFeatures = [];
        for(const property in options){
            windowFeatures.push(property+"="+options[property]);
        }
        return windowFeatures.join(",");
    },
    addCenteredWindowFeatures(options, screen){
        if(screen == null){
            return;
        }

        options.left = (screen.width - options.width)/2;
        options.top = (screen.height - options.height)/2;
    }
}