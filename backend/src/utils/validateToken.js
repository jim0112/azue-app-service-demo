import jwt from 'jwt-decode';

const Validiting = (token) => {
    if (token == undefined)
        return false
    token = jwt(token.slice(7));
    if (token.scp === "act_as_user" && token.appid === '567c66f8-1530-4930-91a1-257a740aac00'){
        console.log('all match');
        return true
    }
    else
        return false
}

export default Validiting