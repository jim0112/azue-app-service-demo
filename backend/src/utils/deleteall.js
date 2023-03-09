import { Request } from 'tedious';

const deleteAll = async (connection) => {
    let result = "";
    let data = [];
    var request = new Request("DELETE FROM [dbo].[Schedules]", function(err) {  
        if (err) {  
            console.log(err);
        }
    });
    request.on("requestCompleted", function () {
        connection.close();
    });
    connection.execSql(request);
}
export default deleteAll;