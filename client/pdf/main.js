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

	async getText() {
		const response = await fetch(this.url);
		const data = await response.text();
		return { status: response.status, data: data };
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

	async postDisplayGeneratedFile(body) {
		try {
			const result = await fetch("/api/v1/pdf", {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
	
			if (!result.ok) {
				throw new Error(`Error [${result.status}] : ${result.data} `);
			}
	
			const blob = await result.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');
			URL.revokeObjectURL(url);
	
		} catch (error) {
			console.error(error);
		}
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
	static getText(url) { return new HTTPRequest(url).getText(); }
	static post(url, body) { return new HTTPRequest(url).post(body); }
	static put(url, body) { return new HTTPRequest(url).put(body); }
	static postFile(url, formData) { return new HTTPRequest(url).postFile(formData); }
	static postDisplayGeneratedFile(url, formData) { return new HTTPRequest(url).postDisplayGeneratedFile(body); }
	static delete(url) { return new HTTPRequest(url).delete(); }
}

class PDF_1 {
	constructor() {
		this._stock_list = [];
		this._total_price = 0;
	}

	setCompany() {
		const el = document.querySelector("#pdf-doc-company-data");
		el.innerHTML = this._partsGenerator();
	}

	setClient(client) {
		const el = document.querySelector("#pdf-doc-client-data");
		el.innerHTML = this._partsGenerator("client", client);
	}

	_partsGenerator(mode = "company", data = company_data) {
		return `
		<p class="party-role">${mode === "company" ? "LE LOUEUR" : "LE LOCATAIRE"}</p>
		<p><span class="field-label">Raison sociale :</span><span class="field-value">${data.name}</span></p>
		<p><span class="field-label">Adresse :</span><span class="field-value">${data.address}</span></p>
		<p><span class="field-label">Téléphone :</span><span class="field-value">${data.tel}</span></p>
		<p><span class="field-label">Courriel :</span><span class="field-value">${data.email}</span></p>
		<p><span class="field-label">SIREN :</span><span class="field-value">${data.siren}</span></p>`;
	}

	setAdress(address) {
		const address_span = document.querySelector("#pdf-doc-address");
		address_span.innerText = escapeHtml(address);
		const doc_redac_location = document.querySelector("#pdf-doc-redaction-location");
		doc_redac_location.textContent=escapeHtml((address.split(",")[1]).split(" (")[0])
	}

	stock = {
		add: (obj = {}) => {
			if (!obj || !obj.label) return;
			if (this.stock._exist(obj)) {
				console.error(obj.label, " déjà dans la liste");
				return;
			}
			
			if (obj.available_count === undefined) {
				obj.available_count = obj.count;
			}
			this._stock_list.push(obj);
			this.stock._updateDoc();
		},
		replace: (obj = {}, newObj = {}) => {
			if (!this.stock._exist(obj)) return;
			const index = this._stock_list.indexOf(obj);
			this._stock_list[index] = newObj;
			this.stock._updateDoc();
		},
		remove: (obj = {}) => {
			if (!this.stock._exist(obj)) return;
			const index = this._stock_list.indexOf(obj);
			this._stock_list.splice(index, 1);
			this.stock._updateDoc();
		},
		_exist: (obj = {}) => {
			return this._stock_list.includes(obj);
		},
		_updateDoc: () => {
			const menu_tbody = document.querySelector("#menu-stock-list-tbody");
			const doc_tbody = document.querySelector("#doc-stock-list-tbody");
			const lots_empty = document.querySelector("#menu-lots-empty");
			const lots_wrapper = document.querySelector("#menu-lots-table-wrapper");
			const lot_badge = document.querySelector("#lot-count-badge");
			const menu_total = document.querySelector("#menu-total-ttc");
			const doc_total = document.querySelector("#doc-total-ttc");
			const doc_art3 = document.querySelector("#doc-article3-total");
			const annexe_1_list = document.querySelector("#annexe-1-stock-list");
			const annexe_2_list = document.querySelector("#annexe-2-stock-list");

			const empty = this._stock_list.length === 0;

			lots_empty.hidden = !empty;
			lots_wrapper.hidden = empty;
			lot_badge.hidden = empty;

			if (empty) {
				lots_empty.style.display="block"
				menu_tbody.innerHTML = "";
				doc_tbody.innerHTML  = `<tr><td colspan="4" style="text-align:center;color:#888;font-style:italic;">Aucun lot sélectionné</td></tr>`;
				if (menu_total) menu_total.textContent = "-";
				if (doc_total)  doc_total.textContent  = "-";
				if (doc_art3)   doc_art3.textContent   = "-";
				saveDraft();
				return;
			} else {
				lots_empty.style.display="none"
			}
			const total = this._stock_list.reduce((sum, i) => sum + (Number(i.rental_price) || 0), 0);
			const totalFormate = formatPrix(total * (rental_time / 24).toFixed(0));
			this._total_price = totalFormate;

			lot_badge.textContent = this._stock_list.length;

			if (menu_total) menu_total.textContent = totalFormate;
			if (doc_total)  doc_total.textContent  = totalFormate;
			if (doc_art3)   doc_art3.textContent   = `${totalFormate.replace(" €", "")} euros TTC`;
			const total_caution_el = document.querySelector("#doc-caution-total");
			total_caution_el.innerText = (total * 8).toFixed(0)+'€';

			let menu_dom = "";
			let doc_dom  = "";
			let annexe_1_dom = "";
			let annexe_2_dom = "";

			this._stock_list.forEach((i, idx) => {
				const prix = formatPrix(i.rental_price);

				const max = parseInt(i.available_count ?? i.count ?? 1);
				const value = parseInt(i.count ?? max);

				menu_dom += `<tr>
					<th scope="row">
						<span class="lot-label-main">${escapeHtml(i.label)}</span>
						<span class="lot-label-sub">${escapeHtml(i.item_data?.label ?? "")}</span>
					</th>
					<td>${ max === 1 ? escapeHtml(String(value)) :
					'<input class="lot-count-selector" type="number" min="1" max="' + max +'" value="' + value + '" data-lot-index="' + idx + '"/>'}</td>
					<td>${prix}</td>
					<td>${escapeHtml(i.condition_data?.label ?? "-")}</td>
					<td>
						<button class="btn-remove-lot" data-remove-index="${idx}" type="button" aria-label="Retirer ${escapeHtml(i.label)}">
							${svg.close}
						</button>
					</td>
				</tr>`;

				doc_dom += `<tr data-lot-index="${idx}">
					<th scope="row">${escapeHtml(i.label)}</th>
					<td class="doc-lot-count">${escapeHtml(String(value))}</td>
					<td>${prix}</td>
					<td>${escapeHtml(i.condition_data?.label ?? "-")}</td>
				</tr>`;

				annexe_1_dom+=`<li class="annexe-li">
				<h3>${i.label}</h3>
				<fieldset>
				<p>${i.specification}</p>
				</fieldset>
				</li>
				<hr>`;
				
				annexe_2_dom+=`<li class="annexe-li">
				<h3>${i.label}</h3>
				<p>L'état diffère de celui déclaré à l'Annexe 1 : <label for ="annexe-2-condition-changed-no">Non </label><input type="checkbox" name="annexe-2-condition-changed-no"><label for ="annexe-2-condition-changed-yes"> Oui </label><input type="checkbox" name="annexe-2-condition-changed-yes"> :</p>
				<h4>Changements constatés :</h4>
				<br/><p>......................................................................................................................................................................................................................</p>
				<br/><p>......................................................................................................................................................................................................................</p>
				<br/><p>......................................................................................................................................................................................................................</p>
				</li>
				<hr>`;

			});

			menu_tbody.innerHTML = menu_dom;
			doc_tbody.innerHTML  = doc_dom;
			annexe_1_list.innerHTML = annexe_1_dom;
			annexe_2_list.innerHTML = annexe_2_dom;

			saveDraft();
		}
	};
}

const draft_key = "contrat_draft_v1";

function stockKey(s = {}) {
	return [
		s.label,
		s.item_data?.reference ?? s.item_data?.label ?? "",
		s.condition_data?.label ?? "",
		s.location_data?.label ?? "",
		s.purchase_date ?? "",
		s.purchase_price ?? "",
	].join("||");
}

function formatPrix(val) {
	const n = Number(val);
	if (isNaN(n)) return "-";
	return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function formatDateFr(val) {
	if (!val) return "-";
	const d = new Date(val);
	if (isNaN(d.getTime())) return "-";
	const date = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
	const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
	return `${date.charAt(0).toUpperCase() + date.slice(1)} à ${heure}`;
}

function saveDraft() {
	try {
		const date_start = document.querySelector("#menu-date-start")?.value ?? null;
		const date_end   = document.querySelector("#menu-date-end")?.value ?? null;

		const draft = {
			client_siren: document.querySelector("#menu-select-client")?.value ?? null,
			location:     document.querySelector("#menu-select-location")?.value ?? null,
			date_start,
			date_end,
			stock_keys: act_pdf._stock_list.map(s => stockKey(s)),
			time_total: (date_start && date_end)
				? (new Date(date_end) - new Date(date_start)) / (1000 * 60 * 60)
				: null
		};
		
		const hasDonnees = draft.stock_keys.length > 0
			|| (draft.client_siren && draft.client_siren !== "none")
			|| (draft.location && draft.location !== "none")
			|| draft.date_start
			|| draft.date_end
			|| draft.time_total>0;

		if (hasDonnees) {
			localStorage.setItem(draft_key, JSON.stringify(draft));
			updateDraftIndicator(true);
		} else {
			localStorage.removeItem(draft_key);
			updateDraftIndicator(false);
		}
	} catch (e) {
		console.error("Erreur sauvegarde brouillon :", e);
	}
}

function restoreDraft() {
	const raw = localStorage.getItem(draft_key);
	if (!raw) return;

	try {
		const b = JSON.parse(raw);

		if (b.client_siren && b.client_siren !== "none") {
			const sel = document.querySelector("#menu-select-client");
			if (sel) sel.value = b.client_siren;
			const client = client_list.find(c => c.siren === b.client_siren);
			if (client) act_pdf.setClient(client);
		}

		if (b.location && b.location !== "none") {
			const sel = document.querySelector("#menu-select-location");
			if (sel) sel.value = b.location;
			act_pdf.setAdress(b.location);
		}

		if (b.date_start) {
			const inp = document.querySelector("#menu-date-start");
			if (inp) inp.value = b.date_start;
			const span = document.querySelector("#pdf-doc-date-start");
			if (span) span.textContent = formatDateFr(b.date_start);
			const date_redac = document.querySelector("#pdf-doc-date-redaction");
			if (date_redac) date_redac.textContent = formatDateFr(b.date_start);
		}

		if (b.date_end) {
			const inp = document.querySelector("#menu-date-end");
			if (inp) inp.value = b.date_end;
			const span = document.querySelector("#pdf-doc-date-end");
			if (span) span.textContent = formatDateFr(b.date_end);
		}

		if (b.time_total) {
			const el = document.querySelector("#doc-total-rental-time");
			if (el) el.textContent = `${b.time_total} heures`;
			rental_time = b.time_total;
		}

		if (Array.isArray(b.stock_keys)) {
			for (const key of b.stock_keys) {
				const stock = stock_list.find(s => stockKey(s) === key);
				if (stock) act_pdf.stock.add(stock);
			}
		} else if (Array.isArray(b.stock_labels)) {
			for (const label of b.stock_labels) {
				const stock = stock_list.find(s => s.label === label);
				if (stock) act_pdf.stock.add(stock);
			}
		}

		updateDraftIndicator(true);

	} catch (e) {
		console.error("Erreur restauration brouillon :", e);
		localStorage.removeItem(draft_key);
	}
}

function emptyDraft() {
	localStorage.removeItem(draft_key);

	act_pdf._stock_list = [];
	act_pdf.stock._updateDoc();

	const sel_client = document.querySelector("#menu-select-client");
	if (sel_client) sel_client.value = client_list[0]?.siren ?? "none";
	if (client_list[0]) act_pdf.setClient(client_list[0]);

	const sel_loc = document.querySelector("#menu-select-location");
	if (sel_loc) sel_loc.value = "none";

	const inp_start = document.querySelector("#menu-date-start");
	if (inp_start) inp_start.value = "";

	const inp_end = document.querySelector("#menu-date-end");
	if (inp_end) inp_end.value = "";

	const span_start = document.querySelector("#pdf-doc-date-start");
	if (span_start) span_start.textContent = "-";

	const span_end = document.querySelector("#pdf-doc-date-end");
	if (span_end) span_end.textContent = "-";

	const span_addr = document.querySelector("#pdf-doc-address");
	if (span_addr) span_addr.textContent = "";

	const el = document.querySelector("#doc-total-rental-time");
	if (el) el.textContent = `24 heures`;
	rental_time = 24;

	if (product_input_search) product_input_search.value = "";
	selected_stock_to_add = {};

	updateDraftIndicator(false);
}

function updateDraftIndicator(visible) {
	const el = document.querySelector("#draft-indicator");
	if (el) el.hidden = !visible;
}

const svg = {
	close:   `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>`,
	edit:    `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/></svg>`,
	delete:  `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/></svg>`,
	confirm: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/></svg>`,
	add:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>`,
};

const product_input_search = document.querySelector("#menu-search-input-search");
const menu_search_add_item = document.querySelector("#menu-search-add-item");
const menu_stock_list = document.querySelector("#menu-stock-list-tbody");
const element_viewer = document.querySelector("#element-viewer");

let product_list   = [];
let stock_list     = [];
let tag_list       = [];
let condition_list = [];
let address_list   = [];
let owner_list     = [];
let client_list    = [];
let calendar_events_list = [];
let company_data   = {};
let calendar_fetched = false;

let datalist_map = new Map();
let selected_stock_to_add = {};
let rental_time = 24;

const act_pdf = new PDF_1();

async function bindActions() {
	fillSelectOptions();

	menu_search_add_item.addEventListener("click", () => {
		if (!selected_stock_to_add?.label) return;
		act_pdf.stock.add(selected_stock_to_add);
		selected_stock_to_add = {};
		product_input_search.value = "";
	});

	menu_stock_list.addEventListener("click", (e) => {
		const btn = e.target.closest(".btn-remove-lot");
		if (!btn) return;
		const index = parseInt(btn.dataset.removeIndex, 10);
		const item  = act_pdf._stock_list[index];
		if (item) act_pdf.stock.remove(item);
	});

	menu_stock_list.addEventListener("input", (e) => {
		const input = e.target.closest(".lot-count-selector");
		if (!input) return;

		const index = parseInt(input.dataset.lotIndex, 10);
		const item  = act_pdf._stock_list[index];
		if (!item) return;

		const value = parseInt(input.value, 10);
		if (isNaN(value)) return;

		item.count = value;

		const doc_cell = document.querySelector(
			`#doc-stock-list-tbody tr[data-lot-index="${index}"] .doc-lot-count`
		);
		if (doc_cell) doc_cell.textContent = value;
	});

	menu_stock_list.addEventListener("change", (e) => {
		const input = e.target.closest(".lot-count-selector");
		if (!input) return;

		const index = parseInt(input.dataset.lotIndex, 10);
		const item  = act_pdf._stock_list[index];
		if (!item) return;

		const max = parseInt(input.max, 10) || 1;
		let value = parseInt(input.value, 10);
		if (isNaN(value) || value < 1) value = 1;
		if (value > max) value = max;
		input.value = value;

		item.count = value;
		act_pdf.stock._updateDoc();
	});


	const date_start = document.querySelector("#menu-date-start");
	const date_end = document.querySelector("#menu-date-end");

	date_start.addEventListener("change", (e) => {
		const span = document.querySelector("#pdf-doc-date-start");
		if (span) span.textContent = formatDateFr(e.target.value);

		const date_redac = document.querySelector("#pdf-doc-date-redaction");
		if (date_redac) date_redac.textContent = formatDateFr(e.target.value);

		if (date_start.value && date_end.value){
			const time_total = (new Date(date_end.value) - new Date(date_start.value)) / (1000 * 60 * 60)
			const el = document.querySelector("#doc-total-rental-time");
			if (el) el.textContent = `${time_total} heures`;
			rental_time = time_total;
			act_pdf.stock._updateDoc();
		}
		saveDraft();
	});

	date_end.addEventListener("change", (e) => {
		const span = document.querySelector("#pdf-doc-date-end");
		if (span) span.textContent = formatDateFr(e.target.value);

		if (date_start.value && date_end.value){
			const time_total = (new Date(date_end.value) - new Date(date_start.value)) / (1000 * 60 * 60)
			const el = document.querySelector("#doc-total-rental-time");
			if (el) el.textContent = `${time_total} heures`;
			rental_time = time_total;
			act_pdf.stock._updateDoc();
		}

		saveDraft();
	});

	document.querySelector("#btn-generate").addEventListener("click", async () => {
		const sel_client = document.querySelector("#menu-select-client");
		if (!sel_client.value || sel_client.value === "none") {
			alert("Veuillez sélectionner un client avant de générer le contrat.");
			return;
		}
		if (act_pdf._stock_list.length === 0) {
			alert("Veuillez ajouter au moins un lot avant de générer le contrat.");
			return;
		}

		if (calendar_fetched){
			if (confirm("Sauvegarder l'événement sur Nextcloud ?")) {
				const address_span = document.querySelector("#pdf-doc-address");
	
				const event_desc = act_pdf._stock_list.map((i) => `${i.label} x ${i.count}`).join('\n');
				const event_client = client_list.find((c) => c.siren === sel_client.value);
				
				const new_event = calDavEventBuilder(new Date(date_start.value),new Date(date_end.value),`Location ${event_client.name} [${act_pdf._total_price}]`,event_desc,address_span.innerText, false) 
				new_event.start.toDateString()
	
				let event_exist = false;
				let targeted_event = null;
				for (let i of calendar_events_list){
					if (new Date(i.start).toDateString() === new_event.start.toDateString() && new Date(i.end).toDateString() === new_event.end.toDateString() && i.name.split("[")[0].trim() === (`Location ${event_client.name}`).trim()){
						event_exist = true;
						targeted_event = calDavEventBuilder(i.start,i.end,i.name,i.description,i.location,false);
					}
				}
				
				if (event_exist){
					await new HTTPRequest("/api/v1/caldav").put({event:targeted_event,new_event:new_event});
				} else {
					await new HTTPRequest("/api/v1/caldav").post({event:new_event});
				}
	
				function calDavEventBuilder(start = new Date(), end = start = new Date(), summary = "", description = "", location = "", allDay = false){
					return {
						start: start,
						end: end,
						summary: summary,
						description: description,
						location: location,
						allDay: allDay,
					}
				}
			};
		};

		const pdf_doc = document.querySelector("#pdf-doc-container").innerHTML;
		const pdf_css = (await new HTTPRequest("/pdf/pdf.css").getText()).data;
	
		await new HTTPRequest("/api/v1/pdf").postDisplayGeneratedFile({ html: pdf_doc, css: pdf_css });
		
	});

	document.querySelector("#btn-reset").addEventListener("click", () => {
		if (act_pdf._stock_list.length > 0 || localStorage.getItem(draft_key)) {
			if (!confirm("Réinitialiser le formulaire et effacer le brouillon ?")) return;
		}
		emptyDraft();
	});
}

async function refreshData() {
	const fetches = [
		{ key: "product_list",  url: "/api/v1/item/"      },
		{ key: "stock_list",    url: "/api/v1/stock/"     },
		{ key: "tag_list",      url: "/api/v1/tag/"       },
		{ key: "condition_list",url: "/api/v1/condition/" },
		{ key: "address_list",  url: "/api/v1/location/"  },
		{ key: "owner_list",    url: "/api/v1/owner/"     },
		{ key: "client_list",   url: "/api/v1/client/"    },
		{ key: "company_data",  url: "/api/v1/company/"   },
	];

	const results = await Promise.all(fetches.map(f => new HTTPRequest(f.url).get()));

	results.forEach((res, idx) => {
		const key = fetches[idx].key;
		if (res.status === 200) {
			if (key === "product_list")   product_list   = res.data;
			if (key === "stock_list")     stock_list     = res.data;
			if (key === "tag_list")       tag_list       = res.data;
			if (key === "condition_list") condition_list = res.data;
			if (key === "address_list")   address_list   = res.data;
			if (key === "owner_list")     owner_list     = res.data;
			if (key === "client_list")    client_list    = res.data;
			if (key === "company_data")   company_data   = res.data;
		}
	});
}

async function displayElements() {
	initPDF();
	product_input_search.value = "";
	await displayFooterData();
}

async function fetchCalendar() {
	const calendar_data_fetch = await new HTTPRequest("/api/v1/caldav/").get();
	if (calendar_data_fetch.status !== 200){
		console.error("Caldav server unreachable");
		calendar_fetched = false;
		return
	}
	calendar_events_list = calendar_data_fetch.data;
	calendar_fetched= true;
}

function initPDF() {
	act_pdf.setCompany();
	if (client_list[0]) act_pdf.setClient(client_list[0]);
}

function fillSelectOptions() {

	const select_client = document.querySelector("#menu-select-client");
	select_client.innerHTML = select_dom(client_list, "siren", "name");
	select_client.addEventListener("change", () => {
		const client = searchArrayEl(client_list, "siren", select_client.value);
		if (client) {
			act_pdf.setClient(client);
			saveDraft();
		}
	});

	const select_location = document.querySelector("#menu-select-location");
	select_location.innerHTML = select_dom(address_list, "address", "label");
	select_location.addEventListener("change", () => {
		act_pdf.setAdress(select_location.value);
		saveDraft();
	});

	const select_tag = document.querySelector("#menu-search-select-tag");
	select_tag.innerHTML = `<option value="none" selected>Toutes</option>` + select_dom(tag_list);
	select_tag.addEventListener("change", () => {
		select_item.innerHTML = `<option value="none" disabled selected>Tous</option>` + select_dom(
			select_tag.value !== "none"
				? product_list.filter(p => p.tags.includes(select_tag.value))
				: product_list,
			"reference", "label"
		);
		const filtre = select_tag.value === "none"
			? stock_list
			: stock_list.filter(i => i.item_data.tags.includes(select_tag.value));
		menu_search_datalist.innerHTML = buildDatalistDom(filtre);
	});

	const select_item = document.querySelector("#menu-search-select-item");
	select_item.innerHTML = `<option value="none" disabled selected>Tous</option>` + select_dom(product_list, "reference", "label");
	select_item.addEventListener("change", () => {
		const filtre = select_item.value === "none"
			? stock_list
			: stock_list.filter(i => i.item_data.reference === select_item.value);
		menu_search_datalist.innerHTML = buildDatalistDom(filtre);
	});

	const menu_search_datalist = document.querySelector("#menu-search-datalist");
	menu_search_datalist.innerHTML = buildDatalistDom(stock_list);

	product_input_search.addEventListener("change", () => {
		const stock = datalist_map.get(product_input_search.value);
		if (stock) selected_stock_to_add = stock;
	});

	function searchArrayEl(list, param, value) {
		for (const i of list) {
			if (i[param] === value) return i;
		}
		return null;
	}

	function select_dom(list = [], param_val = "label", display_val = param_val) {
		let dom = "";
		for (const i of list) {
			dom += `<option value="${escapeHtml(i[param_val])}">${escapeHtml(i[display_val])}</option>`;
		}
		return dom;
	}

	function buildDatalistDom(liste) {
		datalist_map.clear();
		let dom = "";
		for (const i of liste) {
			const display = `${i.label} - ${i.item_data.label} (${i.item_data.reference},${i.location_data.label}) [${i.condition_data.label}]`;
			datalist_map.set(display, i);
			dom += `<option value="${escapeHtml(display)}"></option>`;
		}
		return dom;
	}
}

async function displayFooterData() {
	const result = await new HTTPRequest("/api").get();
	if (result.status !== 200) return;
	const app_data = result.data;
	const footer = document.querySelector("footer");
	footer.innerHTML = `<p>App made by <a href="https://github.com/${app_data.dev}" target="_blank">${app_data.dev}</a> | ${app_data.app}@${app_data.version} | ${app_data.license} License</p>`;
}

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

(async () => {
	await refreshData();
	await bindActions();
	await displayElements();
	restoreDraft();
	await fetchCalendar();
})();