const { partners } = require('../../models');
const xlsx = require('xlsx');
const areaConfig = require('../../assets/area.json');

exports.saveExcel = async (req, res) => {
  const file = req.file;

  // Read the Excel file data
  const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: true });

  const rows = [];
  data.forEach((row, index) => {
    if (index > 0) {
      if (row[0]) {
        const rowData = {
          id: row[0],
          name: row[1],
          category: row[2],
          provinsi: row[3],
          lokasi: row[4],
          servis1: row[5],
          servis2: row[6],
          servis3: row[7],
          whatsapp: row[8],
          instagram: row[9],
          images: row[10],
          gmaps: row[11],
          createdAt: row[12],
          updatedAt: row[13],
        };
        rows.push(rowData);
      }
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
  const { category, provinsi } = req.query;
  const whereCondition = {};

  if (category) {
    whereCondition.category = category;
  }

  if (provinsi) {
    const formated = provinsi === 'DI Yogyakarta' ? 'DIY' : provinsi;
    whereCondition.provinsi = formated;
  }
  try {
    const response = await partners.findAll({
      where: whereCondition,
    });

    // Grouping Data
    const groupedCategory = {};
    response.forEach((item) => {
      const { images, name, category, provinsi, lokasi, servis1, servis2, servis3, instagram, whatsapp } = item;
      if (!groupedCategory[category]) {
        groupedCategory[category] = {
          category,
          totalCount: 0,
          data: [
            {
              images,
              category,
              name,
              provinsi,
              lokasi,
              servis1,
              servis2,
              servis3,
              instagram,
              whatsapp,
              gmaps,
            },
          ],
        };
      }
      if (!whereCondition.hasOwnProperty('category') && groupedCategory[category].data.length < 3) {
        groupedCategory[category].data.push({
          images,
          name,
          category,
          provinsi,
          lokasi,
          servis1,
          servis2,
          servis3,
          instagram,
          whatsapp,
          gmaps,
        });
      }
      if (whereCondition.hasOwnProperty('category')) {
        groupedCategory[category].data.push({
          images,
          name,
          category,
          provinsi,
          lokasi,
          servis1,
          servis2,
          servis3,
          instagram,
          whatsapp,
          gmaps,
        });
      }
      groupedCategory[category].totalCount++;
    });
    const result = Object.values(groupedCategory);

    // Custom sorting function
    const customSort = (a, b) => {
      if (a.category === null && b.category !== null) {
        return 1;
      }
      if (a.category !== null && b.category === null) {
        return -1;
      }
      return 0;
    };

    result.sort(customSort);

    return res.status(200).send({
      statusCode: '200',
      status: 'succes get data',
      data: result,
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

exports.getGrupingCity = async (req, res) => {
  if (req.query.province) {
    const filtering = areaConfig.provinces.filter((province) =>
      province.toLowerCase().includes(req.query.province.toLowerCase())
    );

    return res.json({ result: filtering });
  }

  return res.json({ result: areaConfig.provinces });
};
