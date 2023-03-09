import { Request } from 'tedious';

const viewData = async (connection, callback) => {
    let result = "";
    let data = [];
    var request = new Request("SELECT * FROM [dbo].[Schedules]", function(err) {  
        if (err) {  
            console.log(err);
        }
        callback(null, data);
    });
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
            if (column.value === null) {  
                console.log('NULL');  
            } else {  
                result += column.value + " ";  
            }  
        });  
        console.log(result);
        data.push(result);
        result = "";
    });
    request.on("requestCompleted", function () {
        connection.close();
    });
    connection.execSql(request);
}
export default viewData;