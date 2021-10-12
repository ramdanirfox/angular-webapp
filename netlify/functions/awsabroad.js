let HEADERS = {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
    'Content-Type': 'application/json', //optional
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': '98640'
};
  
  //This solves the "No ‘Access-Control-Allow-Origin’ header is present on the requested resource."
  
HEADERS['Access-Control-Allow-Origin'] = '*';
HEADERS['Vary'] = 'Origin';

exports.handler = async function (event, context) {
    try {
        console.log('Fire detail', event, context);
        if (event.httpMethod === 'OPTIONS') {
          return { statusCode: '204', HEADERS }
        }
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body)
            //Your code goes here
    
           return {
             statusCode: 200,
             body: '{"status":"Bica", "tubuh":"' + body + '"}',
             HEADERS
           } 
     
        }
        return {
            statusCode: 200,
            body: '{"status":"Generic Access"}',
            HEADERS
        }
      } catch (e) {
        console.error(e)
        return {
          statusCode: 500,
          body: e.toString()
        }
      }
}