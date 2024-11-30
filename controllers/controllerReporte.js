const pool = require('../db');


const handleReportQuery = async (req, res) => {
    const { consulta, mes, year } = req.query;

    if (!consulta || !mes || !year) {
        return res.status(400).json({ error: 'Se requieren los parámetros "consulta", "mes" y "year"' });
    }

    try {
        let query;
        let queryParams;

        switch (consulta) {
            case 'new_customers':
                query = 'SELECT * FROM NewCustomer($1, $2)';
                queryParams = [mes, year];
                break;
            case 'best_seller':
                query = 'SELECT * FROM GetBestSeller($1, $2)';
                queryParams = [mes, year];
                break;
            case 'top_customers':
                query = 'SELECT * FROM GetTopCustomer($1, $2)';
                queryParams = [mes, year];
                break;
            case 'top_mueble':
                query = 'SELECT * FROM GetTopMueble($1, $2)';
                queryParams = [mes, year];
                break;
            case 'muebles_proveedor':
                query = 'SELECT * FROM muebleProveedor';
                break;
            default:
                return res.status(400).json({ error: 'Consulta desconocida' });
        }

        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

module.exports = {
    handleReportQuery
};