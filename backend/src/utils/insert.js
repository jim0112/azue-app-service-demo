import { Request, TYPES } from 'tedious';

const insert = async (connection, date, time, action) => {
    var request = new Request("INSERT INTO dbo.Schedules (Date,Time,Action) VALUES (@Date, @Time, @Action);", function(err) {  
        if (err) {  
           console.log(err);
        }  
    });  
    request.addParameter('Date', TYPES.NVarChar, date);  
    request.addParameter('Time', TYPES.NVarChar , time);  
    request.addParameter('Action', TYPES.NVarChar, action);  
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request); 
}
export default insert;