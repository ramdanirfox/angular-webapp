import { createClient } from '@supabase/supabase-js';
const public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjI5MTkyNywiZXhwIjoxOTQ3ODY3OTI3fQ.eLNmjItUHvY4dp_Zt_otakkKr2njaCcY99gjufIeF2U';
const supabaseUrl = 'https://jhqrimueimbqxgowplav.supabase.co';

let HEADERS = {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
    'Content-Type': 'application/json', //optional
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': '98640'
};
// {"displayname":"Ramdan","username":"ramdani","email":"rfox@mail.com","password":"rfox","description":"{}","config":"{}","group":"example"}
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
          const body = JSON.parse(event.body);
          if (body.mode && mode == 'supainsert') {
            const supabase = createClient(supabaseUrl, public_key);
            const { data, error } = await supabase
              .from('notes')
              .insert([
                body.data
              ]);
              return {
                statusCode: 200,
                body: '{"status":"SupabaseSubmitted", "tubuh":"' + body + '","data":"' + data + '","error":"' + error + '"}',
                HEADERS
              } 
          }

            
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