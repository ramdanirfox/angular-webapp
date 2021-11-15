const tes = { "halo": "dunia" };
const realtime = require('./realtime');
const helper = require('./helpers');
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

const routingRetrieve = async (event, context) => {
    // const body = JSON.parse(event.body);
    // if (body && body.mode) {
    //     const mode = body.mode;
    //     const param = body.data;
    // }
    const param = helper.getQueryParam(event);
    console.log('getaccess', param);
    // .select('*');
    if (param && param.data == 'edp_product_list') {
        const supabase = supa.createClient(supabaseUrl, public_key);
        const { data, error } = await supabase
        .from('edp_produk')
        .select('*');
        return {
            statusCode: 200,
            body: JSON.stringify({
                status: "OK",
                header: HEADERS,
                data: data,
                error: error,
            }),
            HEADERS
        };
    }
    else {
        return {
            statusCode: 200,
            body: '{"error":"Invalid Query Param Data"}',
            HEADERS
        };
    }
};

module.exports = {
    retrieve: routingRetrieve
}