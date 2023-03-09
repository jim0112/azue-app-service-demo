import { DefaultAzureCredential } from '@azure/identity';
import { Connection } from 'tedious';
import insert from "../src/utils/insert";
import viewData from "../src/utils/view";
import deleteAll from "../src/utils/deleteall";

const connect = async(type, date, time, action, callback) => {
    const credential = new DefaultAzureCredential();
    const accessToken = await credential.getToken("https://database.windows.net/.default");
    const connection = new Connection({
        server: 'jimsqltest.database.windows.net',
        authentication: {
            type: 'azure-active-directory-access-token',
            options: {
                token: accessToken.token
            }
        },
        options: {
            database: 'app-demo',
            encrypt: true,
            port: 1433
        }
    });
    connection.connect();
    if(type == 'i'){
        connection.on('connect', function(err) {   
            insert(connection, date, time, action);
            console.log("insertion succeed");
        });
    }
    else if(type == 'v'){
        connection.on('connect', function(err) {   
            viewData(connection, (err, results) => {
                console.log("view succeed");
                callback(null, results);
            });
        });
    }
    else{
        connection.on('connect', function(err) {   
            deleteAll(connection);
            console.log("deletion succeed");
        });
    }
}
export default connect;