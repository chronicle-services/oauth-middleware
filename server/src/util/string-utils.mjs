export function toCamelCase(str, separator){
    const wordArr = str.split(separator);
    wordArr.forEach((word, index, array)=>{
        if(index > 0){
            array[index] = word.charAt(0)+word.substring(1).toLowerCase();
        } else {
            array[index] = word.toLowerCase();
        }
    });
    
    return wordArr.join('');
}

export default {
    toCamelCase,
}