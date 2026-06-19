const { Router } = require("express");
const router = Router();

const PDFGenerator = require('../../../express_utils/classes/PDFGenerator');
const { closeBrowser } = require('../../../express_utils/browser-pool');

router.post('/', async (req, res) => {
  const { html, css } = req.body;

  if (!html) {
    return res.status(400).json({ data: 'Le champ html est requis.' });
  }

  const generator = new PDFGenerator(html, css);
  const { code, data } = await generator.generate();

  if (code !== 201 || !data) {
    return res.status(code).json({ data: 'La génération du PDF a échoué.' });
  }

let date = new Date();
const doc_date_str_arr =(date.toLocaleDateString()).split("/");
let doc_date = `${doc_date_str_arr[2]}-${doc_date_str_arr[0].length === 1 ? "0"+doc_date_str_arr[0] : doc_date_str_arr[0]}-${doc_date_str_arr[1]}`
  res
    .status(201)
    .set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${doc_date}.pdf"`,
      'Content-Length':      data.length,
    })
    .end(data);
});

process.on('SIGINT',  async () => { await closeBrowser(); process.exit(0); });
process.on('SIGTERM', async () => { await closeBrowser(); process.exit(0); });

module.exports = router;
