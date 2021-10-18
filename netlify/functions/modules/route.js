const tes = { "halo": "dunia" };
const realtime = require('./realtime');
const supa = require('@supabase/supabase-js');
const public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjI5MTkyNywiZXhwIjoxOTQ3ODY3OTI3fQ.eLNmjItUHvY4dp_Zt_otakkKr2njaCcY99gjufIeF2U';
const supabaseUrl = 'https://jhqrimueimbqxgowplav.supabase.co';

let HEADERS = {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
    'Content-Type': 'application/json', //optional
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': '98640'
};
HEADERS['Access-Control-Allow-Origin'] = '*';
HEADERS['Vary'] = 'Origin';

const routing = async (event, context) => {
    const body = JSON.parse(event.body);
    if (body && body.mode) {
        const mode = body.mode;
        const param = body.data;
        if (mode == 'supabroadcast') {
            // insert into realtime_hooks
            const supabase = supa.createClient(supabaseUrl, public_key);
            const { data, error } = await supabase
              .from('realtime_hooks')
              .insert([
                  {
                      "json_data": param.json_data,
                      "expiry_sec": param.expiry_sec,
                      "app_id": param.app_id,
                      "account_id": param.account_id,
                      "group_id": param.group_id
                  }
              ]);
              const { data2, error2 } = await supabase
              .from('realtime_hooks')
              .delete()
              .match({ id: data[0].id });
              console.log('Supainsert', param);
              return {
                statusCode: 200,
                body: JSON.stringify({
                  status: "supabroadcast",
                  body: body,
                  header: HEADERS,
                  data: data,
                  deleteData: data2,
                  deleteError: error2,
                  error: error,
                }),
                HEADERS
              } 
        }
    }
};

module.exports = {
    assign: routing
}