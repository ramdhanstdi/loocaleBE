const { partners } = require('../../models');
const xlsx = require('xlsx');

exports.saveExcel = async (req, res) => {
  const file = req.file;

  // Read the Excel file data
  const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: true });

  const rows = [];
  data.forEach((row, index) => {
    if (index > 0) {
      const rowData = {
        image_url: row[0],
        name: row[1],
        location: row[2],
        activity: row[3],
        instagram: row[4],
        whatsapp: row[5],
      };
      rows.push(rowData);
    }
  });
  try {
    const response = await partners.bulkCreate(rows);
    res.json({ response });
  } catch (error) {
    res.json({ error });
  }
};

exports.getPartners = async (req, res) => {
  const { activity, location } = req.query;
  const whereCondition = {};

  if (activity) {
    whereCondition.activity = activity;
  }

  if (location) {
    whereCondition.location = location;
  }
  try {
    const response = await partners.findAll({
      where: whereCondition,
    });
    return res.status(200).send({
      statusCode: '200',
      status: 'succes get data',
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      statusCode: '400',
      status: 'failed get data',
      data: error,
    });
  }
};
