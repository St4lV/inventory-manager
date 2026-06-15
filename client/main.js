class HTTPRequest {
	constructor(url) {
		this.url = url;
	}

	async get() {
		const response = await fetch(this.url);
		const data = await response.json();
		return { status: response.status, data: data.data };
	}

	async getImage() {
		const response = await fetch(this.url);
		const contentType = response.headers.get('Content-Type');
		if (contentType && contentType.startsWith('image/')) {
			const blob = await response.blob();
			return { status: response.status, data: blob };
		}
		const data = await response.json();
		return { status: response.status, data: data.data };
	}

	async post(body = {}) {
		const response = await fetch(this.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const data = await response.json();
		return { status: response.status, data: data.data };
	}

	async put(body = {}) {
		const response = await fetch(this.url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const data = await response.json();
		return { status: response.status, data: data.data };
	}

	async postFile(formData) {
		const response = await fetch(this.url, {
			method: 'POST',
			body: formData,
		});
		const data = await response.json();
		return { status: response.status, data: data.data };
	}

	async delete() {
		const response = await fetch(this.url, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await response.json();
		return { status: response.status, data: data.data };
	}

	static get(url) { return new HTTPRequest(url).get(); }
	static getImage(url) { return new HTTPRequest(url).getImage(); }
	static post(url, body) { return new HTTPRequest(url).post(body); }
	static put(url, body) { return new HTTPRequest(url).put(body); }
	static postFile(url, formData) { return new HTTPRequest(url).postFile(formData); }
	static delete(url) { return new HTTPRequest(url).delete(); }
}

let product_list = [];
let stock_list = [];
let tag_list = [];
let condition_list = [];
let address_list = [];
let owner_list = [];
let client_list = [];
let company_data = {};

/* ===========================
   Thème ApexCharts partagé
   =========================== */
const chartColors = {
	text: '#8e8e93',
	grid: '#2a2a2e',
	accent: '#3b82f6',
	series: ['#3b82f6', '#34d399', '#fbbf24', '#f97316', '#ef4444', '#a78bfa', '#ec4899', '#06b6d4'],
};

/* ===========================
   Récupération des données
   =========================== */
async function refreshData() {
	const endpoints = [
		{ key: 'product_list', url: '/api/v1/item/' },
		{ key: 'stock_list', url: '/api/v1/stock/' },
		{ key: 'tag_list', url: '/api/v1/tag/' },
		{ key: 'condition_list', url: '/api/v1/condition/' },
		{ key: 'address_list', url: '/api/v1/location/' },
		{ key: 'owner_list', url: '/api/v1/owner/' },
		{ key: 'client_list', url: '/api/v1/client/' },
		{ key: 'company_data', url: '/api/v1/company/' },
	];

	const results = await Promise.allSettled(
		endpoints.map(e => new HTTPRequest(e.url).get())
	);

	results.forEach((r, i) => {
		const k = endpoints[i].key;
		const fallback = k === 'company_data' ? {} : [];
		window[k] = (r.status === 'fulfilled' && r.value.status === 200) ? r.value.data : fallback;
	});

	// Variables locales en sync
	product_list = window.product_list;
	stock_list = window.stock_list;
	tag_list = window.tag_list;
	condition_list = window.condition_list;
	address_list = window.address_list;
	owner_list = window.owner_list;
	client_list = window.client_list;
	company_data = window.company_data;
}

/* ===========================
   Indicateurs clés
   =========================== */
function updateKPIs() {
	let ref_count = 0;
	let stock_count = 0;
	let total_price = 0;
	let vat_count = 0;
	let total_lots = 0;
	let last_date = null;

	for (let i of product_list) {
		ref_count += 1;
		for (let j of i.stock) {
			total_price += j.purchase_price * j.count;
			stock_count += j.count;
			total_lots += 1;
			if (j.vat && j.vat.set) vat_count += 1;
			if (j.purchase_date) {
				const d = new Date(j.purchase_date);
				if (!last_date || d > last_date) last_date = d;
			}
		}
	}

	const avg_price = stock_count > 0 ? (total_price / stock_count) : 0;
	const vat_pct = total_lots > 0 ? Math.round((vat_count / total_lots) * 100) : 0;

	document.getElementById("kpi-val-references").textContent = ref_count;
	document.getElementById("kpi-val-stocks").textContent = stock_count;
	document.getElementById("kpi-val-value").textContent = `${total_price.toFixed(2)} €`;
	document.getElementById("kpi-val-locations").textContent = address_list.length;
	document.getElementById("kpi-val-clients").textContent = client_list.length;
	document.getElementById("kpi-val-avg-price").textContent = `${avg_price.toFixed(2)} €`;
	document.getElementById("kpi-val-vat").textContent = `${vat_pct} %`;
	document.getElementById("kpi-val-last-purchase").textContent = last_date
		? last_date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
		: '—';
}

/* ===========================
   Utilitaires
   =========================== */
function escapeHtml(str) {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

function objectPathResolver(obj, path) {
	const cles = Array.isArray(path) ? path : path.split('.');
	return cles.reduce((a, key) => a?.[key], obj);
}

function tagSplitterDonut(arr) {
	let result = [];
	for (let i of arr) {
		if (i.tags.length > 0) {
			for (let t of i.tags) result.push({ tag: t });
		} else {
			result.push({ tag: "aucune" });
		}
	}
	return result;
}

function countSplitterDonut(arr) {
	let result = [];
	for (let i of arr) {
		if (i.count >= 1) {
			for (let j = 1; j <= i.count; j++) result.push(i);
		}
	}
	return result;
}

/* ===========================
   Chronologie cumulative
   =========================== */
function displayZoomableTimeseries() {
	const stocks = stock_list;
	let cumul = 0;
	const seriesData = stocks
		.filter(s => s.purchase_date)
		.sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date))
		.map(s => {
			cumul += s.purchase_price * s.count;
			return { x: new Date(s.purchase_date).getTime(), y: cumul };
		});

	const options = {
		series: [{ name: 'Valeur cumulée', data: seriesData }],
		chart: {
			type: 'area',
			stacked: false,
			height: '100%',
			background: 'transparent',
			foreColor: chartColors.text,
			zoom: { type: 'x', enabled: true, autoScaleYaxis: true },
			toolbar: { autoSelected: 'zoom' },
		},
		dataLabels: { enabled: false },
		markers: { size: 0 },
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				inverseColors: false,
				opacityFrom: 0.45,
				opacityTo: 0.02,
				stops: [0, 90, 100],
			},
		},
		colors: [chartColors.accent],
		grid: { borderColor: chartColors.grid, strokeDashArray: 3 },
		yaxis: {
			labels: {
				formatter: (val) => `${val.toFixed(0)} €`,
				style: { colors: chartColors.text },
			},
			title: { text: 'Valeur (€)', style: { color: chartColors.text } },
		},
		xaxis: {
			type: 'datetime',
			labels: { style: { colors: chartColors.text } },
			axisBorder: { color: chartColors.grid },
			axisTicks: { color: chartColors.grid },
		},
		tooltip: {
			theme: 'dark',
			shared: false,
			y: { formatter: (val) => `${val.toFixed(2)} €` },
		},
	};

	new ApexCharts(document.querySelector('#timeseries-stock'), options).render();
}

/* ===========================
   Top articles par valeur (barres horizontales)
   =========================== */
function displayTopItemsBar() {
	const itemValues = {};
	for (let i of product_list) {
		let val = 0;
		for (let j of i.stock) val += j.purchase_price * j.count;
		if (val > 0) itemValues[i.label] = val;
	}

	const sorted = Object.entries(itemValues)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10);

	if (sorted.length === 0) return;

	const options = {
		series: [{ name: 'Valeur', data: sorted.map(e => e[1]) }],
		chart: {
			type: 'bar',
			height: '100%',
			background: 'transparent',
			foreColor: chartColors.text,
			toolbar: { show: false },
		},
		plotOptions: {
			bar: {
				horizontal: true,
				borderRadius: 4,
				barHeight: '65%',
			},
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => `${val.toFixed(0)} €`,
			style: { fontSize: '11px', colors: ['#e8e8ec'] },
			offsetX: 5,
		},
		colors: [chartColors.accent],
		xaxis: {
			categories: sorted.map(e => e[0]),
			labels: { style: { colors: chartColors.text }, formatter: (val) => `${val.toFixed(0)} €` },
			axisBorder: { color: chartColors.grid },
			axisTicks: { color: chartColors.grid },
		},
		yaxis: {
			labels: {
				style: { colors: chartColors.text, fontSize: '11px' },
				maxWidth: 180,
			},
		},
		grid: { borderColor: chartColors.grid, strokeDashArray: 3 },
		tooltip: {
			theme: 'dark',
			y: { formatter: (val) => `${val.toFixed(2)} €` },
		},
	};

	new ApexCharts(document.querySelector('#bar-top-items'), options).render();
}

/* ===========================
   Acquisitions par mois (barres verticales)
   =========================== */
function displayMonthlyBar() {
	const monthly = {};
	for (let s of stock_list) {
		if (!s.purchase_date) continue;
		const d = new Date(s.purchase_date);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
		if (!monthly[key]) monthly[key] = { count: 0, value: 0 };
		monthly[key].count += s.count;
		monthly[key].value += s.purchase_price * s.count;
	}

	const sorted = Object.entries(monthly).sort((a, b) => a[0].localeCompare(b[0]));
	if (sorted.length === 0) return;

	const labels = sorted.map(e => {
		const [y, m] = e[0].split('-');
		return new Date(y, m - 1).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
	});

	const options = {
		series: [
			{ name: 'Unités', type: 'column', data: sorted.map(e => e[1].count) },
			{ name: 'Valeur (€)', type: 'line', data: sorted.map(e => e[1].value) },
		],
		chart: {
			height: '100%',
			background: 'transparent',
			foreColor: chartColors.text,
			toolbar: { show: false },
		},
		stroke: { width: [0, 3], curve: 'smooth' },
		colors: [chartColors.accent, '#34d399'],
		plotOptions: {
			bar: { borderRadius: 4, columnWidth: '55%' },
		},
		dataLabels: { enabled: false },
		xaxis: {
			categories: labels,
			labels: { style: { colors: chartColors.text, fontSize: '10px' }, rotate: -45 },
			axisBorder: { color: chartColors.grid },
			axisTicks: { color: chartColors.grid },
		},
		yaxis: [
			{
				title: { text: 'Unités', style: { color: chartColors.text } },
				labels: { style: { colors: chartColors.text } },
			},
			{
				opposite: true,
				title: { text: 'Valeur (€)', style: { color: '#34d399' } },
				labels: {
					style: { colors: '#34d399' },
					formatter: (val) => `${val.toFixed(0)} €`,
				},
			},
		],
		grid: { borderColor: chartColors.grid, strokeDashArray: 3 },
		legend: {
			labels: { colors: chartColors.text },
			markers: { size: 6 },
		},
		tooltip: {
			theme: 'dark',
			shared: true,
			intersect: false,
		},
	};

	new ApexCharts(document.querySelector('#bar-monthly'), options).render();
}

/* ===========================
   Valeur par emplacement (barres)
   =========================== */
function displayValueByLocation() {
	const locationValues = {};
	for (let s of stock_list) {
		const loc = s.location_data ? s.location_data.label : 'Inconnu';
		if (!locationValues[loc]) locationValues[loc] = 0;
		locationValues[loc] += s.purchase_price * s.count;
	}

	const sorted = Object.entries(locationValues).sort((a, b) => b[1] - a[1]);
	if (sorted.length === 0) return;

	const options = {
		series: [{ name: 'Valeur', data: sorted.map(e => e[1]) }],
		chart: {
			type: 'bar',
			height: Math.max(200, sorted.length * 44),
			background: 'transparent',
			foreColor: chartColors.text,
			toolbar: { show: false },
		},
		plotOptions: {
			bar: {
				horizontal: true,
				borderRadius: 4,
				barHeight: '60%',
				distributed: true,
			},
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => `${val.toFixed(0)} €`,
			style: { fontSize: '11px', colors: ['#e8e8ec'] },
			offsetX: 5,
		},
		colors: chartColors.series,
		xaxis: {
			categories: sorted.map(e => e[0]),
			labels: { style: { colors: chartColors.text }, formatter: (val) => `${val.toFixed(0)} €` },
			axisBorder: { color: chartColors.grid },
			axisTicks: { color: chartColors.grid },
		},
		yaxis: {
			labels: { style: { colors: chartColors.text, fontSize: '11px' } },
		},
		grid: { borderColor: chartColors.grid, strokeDashArray: 3 },
		legend: { show: false },
		tooltip: {
			theme: 'dark',
			y: { formatter: (val) => `${val.toFixed(2)} €` },
		},
	};

	new ApexCharts(document.querySelector('#bar-value-location'), options).render();
}

/* ===========================
   Tableau des dernières acquisitions
   =========================== */
function displayRecentTable() {
	const tbody = document.getElementById("table-recent-body");
	const recent = stock_list
		.filter(s => s.purchase_date)
		.sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
		.slice(0, 10);

	if (recent.length === 0) {
		tbody.innerHTML = `<tr><td colspan="8" class="cell-empty">Aucune acquisition enregistrée.</td></tr>`;
		return;
	}

	let dom = '';
	for (let s of recent) {
		const date = new Date(s.purchase_date).toLocaleDateString('fr-FR', {
			day: 'numeric', month: 'short', year: 'numeric',
		});
		const article = s.item_data ? s.item_data.label : '—';
		const total = (s.purchase_price * s.count).toFixed(2);
		const location = s.location_data ? s.location_data.label : '—';
		const owner = s.owner_data ? s.owner_data.label : '—';

		dom += `<tr>
			<td class="cell-date">${escapeHtml(date)}</td>
			<td class="cell-article" title="${escapeHtml(article)}">${escapeHtml(article)}</td>
			<td class="cell-lot">${escapeHtml(s.label)}</td>
			<td class="cell-num">${s.count}</td>
			<td class="cell-num">${s.purchase_price.toFixed(2)} €</td>
			<td class="cell-total">${total} €</td>
			<td class="cell-location">${escapeHtml(location)}</td>
			<td class="cell-owner">${escapeHtml(owner)}</td>
		</tr>`;
	}
	tbody.innerHTML = dom;
}

/* ===========================
   Beignets
   =========================== */
function displayGraphDonut(list = [], filter_param = "", tag_id = "", colors = []) {
	let series_obj = {};

	for (let el of list) {
		const valeur = objectPathResolver(el, filter_param);
		if (valeur === undefined) continue;
		if (!series_obj[valeur]) series_obj[valeur] = 0;
		series_obj[valeur] += 1;
	}

	let series = [];
	let labels = [];
	for (let el in series_obj) {
		labels.push(el);
		series.push(series_obj[el]);
	}

	if (series.length === 0) return;

	const options = {
		series: series,
		labels: labels,
		chart: {
			type: 'donut',
			background: 'transparent',
			foreColor: chartColors.text,
		},
		colors: colors.length > 0 ? colors : chartColors.series,
		stroke: { colors: ['#1c1c1f'], width: 2 },
		dataLabels: { enabled: false },
		fill: { type: 'gradient' },
		plotOptions: {
			pie: {
				donut: {
					size: '60%',
					labels: {
						show: true,
						name: { color: '#e8e8ec' },
						value: { color: '#e8e8ec', fontSize: '1.2rem', fontWeight: 700 },
						total: {
							show: true,
							color: chartColors.text,
							fontSize: '0.75rem',
							label: 'Total',
							formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
						},
					},
				},
			},
		},
		legend: {
			position: 'bottom',
			fontSize: '11px',
			labels: { colors: chartColors.text },
			markers: { size: 6, offsetX: -3 },
			itemMargin: { horizontal: 6, vertical: 2 },
		},
		responsive: [{
			breakpoint: 600,
			options: {
				chart: { height: 260 },
				legend: { fontSize: '10px' },
			},
		}],
	};

	new ApexCharts(document.querySelector(tag_id), options).render();
}

/* ===========================
   Orchestration
   =========================== */
async function displayElements() {
	updateKPIs();
	displayZoomableTimeseries();
	displayTopItemsBar();
	displayMonthlyBar();
	displayRecentTable();
	displayValueByLocation();
	displayGraphDonut(tagSplitterDonut(product_list), "tag", "#donut1");
	displayGraphDonut(countSplitterDonut(stock_list), "location_data.label", "#donut2");
	displayGraphDonut(countSplitterDonut(stock_list), "condition_data.label", "#donut3", ["#34d399", "#fbbf24", "#f97316", "#ef4444", "#3b82f6"]);
	displayGraphDonut(countSplitterDonut(stock_list), "owner_data.label", "#donut4");
	
	await displayFooterData();
}

async function displayFooterData() {
	const result = await new HTTPRequest("/api").get();
	if (result.status !== 200) return;
	const app_data = result.data;
	const footer = document.querySelector("footer");
	footer.innerHTML = `<p>App made by <a href="https://github.com/${app_data.dev}" target="_blank">${app_data.dev}</a> | ${app_data.app}@${app_data.version} | ${app_data.license} License</p>`;
}

(async () => {
	await refreshData();
	await displayElements();
})();