export function customTitle(message){
    if(message){
        message = message.toLowerCase().split('_');
        let final = [ ];
        for(let key of message){
            if(message.indexOf(key) === 0){
                final.push(key.charAt(0).toUpperCase()+ key.slice(1));
            }else{
                final.push(key);
            }
        }
        final = final.join(' ')
        return final;
    }else{
        return '';
    }
}