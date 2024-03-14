import stringUtils from './string-utils.mjs'

const CONFIG_KEYS = process.env.MIDDLEWARE_CONFIG_KEYS.split(",");
const APP_KEY_SET = Object.keys(process.env).filter((key) => {
    return CONFIG_KEYS.includes(key ? key.split("__")[0]: false);
});
const FLAGS = {
    useVite: {
        aliases:[
            "--vite",
            "-v"
        ]
    }
};


function loadConfigs(){
    const config = {};

    //Load arguments
    config.args = loadArguments();
    
    //Load ENVs
    for(const key of CONFIG_KEYS){
        const configName = stringUtils.toCamelCase(key,"_");
        
        config[configName] = buildConfigObject(key)
    }    

    return config;
}

//Argument helper functions
function loadArguments(){   
    const args = {};

    if(process.argv.length < 3){
        return args;
    }

    const argsSet = new Set(process.argv.slice(2));

    for(const flag in FLAGS){
        for(const alias of FLAGS[flag].aliases){
            if(argsSet.has(alias)){
                args[flag] = true;
                break;
            }
        }
    }

    return args;
}

//ENV helper functions
//Wrapper for recursive method
function buildConfigObject(configKey){
    const configKeySet = getObjectKeySet(APP_KEY_SET, configKey);
    return buildObject(configKeySet, configKey);
}

//Recursively build config objects including nested ones
function buildObject(objKeySet, objKey){
    const obj = {};

    while(objKeySet.length > 0){
        const propertyKey = objKeySet[0];
        const splitKey = parseKey(propertyKey, objKey);
        const propertyName = splitKey[0];
        const propertyCamelName = stringUtils.toCamelCase(propertyName, "_");

        if(splitKey.length == 1){
            const propertyValue = process.env[propertyKey];
            
            obj[propertyCamelName] = convertValue(propertyValue);
            objKeySet.shift();
        } else {
            const propObjKey = `${objKey}__${propertyName}`;
            const propObjKeySet = getObjectKeySet(objKeySet, propObjKey);

            objKeySet = objKeySet.filter((key)=>{return key ? !propObjKeySet.includes(key) : false});

            obj[propertyCamelName] = buildObject(propObjKeySet, propObjKey);
        }
    }

    return obj;
}

//Helpers
//Parses given key removing the object key prefix from it
function parseKey(key, objKey){
    return key.replace(`${objKey}__`, "").split("__");
}

//Filter keySet based on objectKey prefix
function getObjectKeySet(keySet, objKey){
   return keySet.filter((key) => {return key ? key.indexOf(objKey) == 0: false});    
}

function convertValue(value){
    value = value.trim();

    if(!isNaN(value)){
        if(!(value.length > 16)){
            return Number(value);
        }
    } else if(value.toUpperCase() === 'TRUE' ||
              value.toUpperCase() === 'FALSE'){
        
        return value.toUpperCase() === 'TRUE';
    }

    return value;
}

//Exports
const config = loadConfigs();

export default config;
export const args = config.args;
export const server =  config.server;
export const session = config.session;
export const discord = config.discord;