const base64encodedData = Buffer.from(process.env.S_USERNAME + ':' + process.env.S_PASSWORD).toString('base64');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
module.exports.sendRequest = async (url, res) => {
    try {
        let result = await fetch(`${url}/api/backup_products_count_to_xls`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64encodedData
            },
        })
        result = await result.json()
        return res; 
    } catch (error) {
        res.status(500).json(error.message)
    }
}