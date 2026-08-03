const { getBrowser } = require('../browser-pool');

class PDFGenerator {
	constructor(html, css) {
		this.html = html ?? '';
		this.css  = css  ?? '';
	}

  #buildPage() {
		const additional_css = `
			* {
				margin: 0px;
				padding: 0px;
				box-sizing: border-box;
			}
				
			:root {
				--color-text:       #1a1a1a;
				--color-text-muted: #555555;
				--color-tag-bg:     #cccccc;
				--transition-base:  0.15s ease;
			}

			.document-viewer {
				background: #ffffff;
				color: #1a1a1a;
				margin: 0 20px;
				font-family: sans-serif;
				font-size: 13px;
				line-height: 1.7;
			}
		`;

		const date = new Date();
		const doc_date_str_arr = date.toLocaleDateString().split("/");
		const doc_date = `${doc_date_str_arr[2]}-${doc_date_str_arr[0].padStart(2, "0")}-${doc_date_str_arr[1].padStart(2, "0")}`;

		return `
<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<title>${doc_date}</title>
	<style>
		${additional_css}
		${this.css}
	</style>
</head>
<body>
	<main class="document-viewer">
	${this.html}
	</main>
</body>
</html>`;
		}

	async generate() {
		let page;
		try {
		const browser  = await getBrowser();
		const contexte = await browser.newContext();
		page           = await contexte.newPage();

		await page.setContent(this.#buildPage(), { waitUntil: 'networkidle' });

		const buffer = await page.pdf({
			format:          'A4',
			printBackground: true,
			margin: { top: '5mm', bottom: '10mm', left: '15mm', right: '15mm' },
		});

		return { code: 201, data: buffer };

		} catch (err) {
		console.error('Erreur génération PDF :', err);
		return { code: 500, data: null };

		} finally {
		await page?.context().close();
		}
	}
}

module.exports = PDFGenerator;