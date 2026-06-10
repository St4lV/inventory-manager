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

const svg = {
	close: `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>`,
	edit: `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/></svg>`,
	delete: `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"><path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/></svg>`,
	confirm: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/></svg>`,
	add: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-dotted" viewBox="0 0 16 16"><path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>`,
};

const menu_search_select_tags = document.querySelector("#menu-search-select-tags");
const product_input_search = document.getElementById("menu-search-input-search");
const footer_info_span = document.querySelector("#footer-data");
const element_viewer = document.querySelector("#element-viewer");

let selected_tag = "none";

let product_list = [];
let stock_list = [];
let tag_list = [];
let condition_list = [];
let address_list = [];
let owner_list = [];
let client_list = [];
let company_data = {};

let prevFocusedElement = null;

function trapFocus(container) {
	const focusableSelectors = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	function handleKeydown(e) {
		if (e.key === 'Escape') {
			closeViewer();
			return;
		}
		if (e.key !== 'Tab') return;

		const focusable = Array.from(container.querySelectorAll(focusableSelectors))
			.filter(el => el.offsetParent !== null);

		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (e.shiftKey) {
			if (document.activeElement === first) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	container.addEventListener('keydown', handleKeydown);
}

function closeViewer() {
	element_viewer.dataset.opened = "false";
	element_viewer.setAttribute('aria-hidden', 'true');
	element_viewer.innerHTML = "";
	document.body.classList.remove('viewer-opened');
	document.querySelector('main').removeAttribute('aria-hidden');
	document.querySelector('header').removeAttribute('aria-hidden');
	document.querySelector('footer').removeAttribute('aria-hidden');
	if (prevFocusedElement) {
		prevFocusedElement.focus();
		prevFocusedElement = null;
	}
}

let _modalAbortController = null;

function showConfirmModal(message, onConfirm) {
	if (_modalAbortController) _modalAbortController.abort();
	_modalAbortController = new AbortController();
	const { signal } = _modalAbortController;

	let modal = document.getElementById('modal-confirmation');
	if (!modal) {
		modal = document.createElement('dialog');
		modal.id = 'modal-confirmation';
		modal.setAttribute('role', 'alertdialog');
		modal.setAttribute('aria-modal', 'true');
		modal.setAttribute('aria-labelledby', 'modal-confirmation-message');
		modal.innerHTML = `
			<p id="modal-confirmation-message"></p>
			<menu>
				<button type="button" class="btn-modal btn-modal-annuler" id="modal-btn-annuler">Annuler</button>
				<button type="button" class="btn-modal btn-modal-supprimer" id="modal-btn-confirmer">Supprimer</button>
			</menu>
		`;
		document.body.appendChild(modal);
	}

	modal.querySelector('#modal-confirmation-message').textContent = message;

	modal.querySelector('#modal-btn-annuler').addEventListener('click', () => {
		modal.close();
	}, { signal });

	modal.querySelector('#modal-btn-confirmer').addEventListener('click', () => {
		modal.close();
		onConfirm();
	}, { signal });

	modal.addEventListener('click', (e) => {
		if (e.target === modal) modal.close();
	}, { signal });

	modal.showModal();
}

async function generateProductList(searched = "") {
	const product_list_ul = document.querySelector("#product-list");
	let dom = "";

	for (let i of product_list) {
		if ((searched === "" || universalize(i.label).includes(universalize(searched)) || universalize(i.reference).includes(universalize(searched))) && (selected_tag === "none" ? true : findTags(i.tags, selected_tag))) {
			dom += `<li class="product-list-item-container" data-reference="${escapeHtml(i.reference)}" tabindex="0" role="button" aria-label="${escapeHtml(i.label)}">`;
			dom += `<h3>${escapeHtml(i.label)}</h3>`;
			dom += `<p>${escapeHtml(i.reference)}</p>`;
			dom += `<div class="product-list-product-img-container"><img class="product-list-product-img" src="${escapeHtml(i.img_url)}" alt="${escapeHtml(i.label)}"></div>`;
			dom += `<p class="product-list-item-description">${escapeHtml(i.description)}</p>`;
			dom += `<div class="product-list-tag-container">`;
			for (let j of i.tags) {
				dom += `<span class="product-list-item-tag">${escapeHtml(j)}</span>`;
			}
			dom += `</div></li>`;
		}
	}

	product_list_ul.innerHTML = dom;
	bindListActions();

	function findTags(tags, to_find) {
		return tags.some(j => j.includes(to_find));
	}

	function bindListActions() {
		const product_el_list = document.querySelectorAll(".product-list-item-container");
		for (let i of product_el_list) {
			i.addEventListener("click", () => {
				displayElementViewer("item", { reference: i.dataset.reference });
			});
			i.addEventListener("keydown", (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					displayElementViewer("item", { reference: i.dataset.reference });
				}
			});
		}
	}
}

async function bindActions() {
	product_input_search.addEventListener("input", () => {
		generateProductList(product_input_search.value);
	});

	menu_search_select_tags.addEventListener("change", () => {
		selected_tag=menu_search_select_tags.value;
		generateProductList(product_input_search.value);
	});

	const menu_add_item = document.querySelector("#menu-bar-add-item");
	menu_add_item.addEventListener("click",()=>{
		displayElementViewer("new-item",{})
	});
}

async function refreshData() {
	const product_list_fetch = await (new HTTPRequest("/api/v1/item/")).get();
	if (product_list_fetch.status === 200) {
		product_list = product_list_fetch.data;
	} else {
		product_list = [];
	}

	const stock_list_fetch = await (new HTTPRequest("/api/v1/stock/")).get();
	if (stock_list_fetch.status === 200) {
		stock_list = stock_list_fetch.data;
	} else {
		stock_list = [];
	}

	const tag_list_fetch = await (new HTTPRequest("/api/v1/tag/")).get();
	if (tag_list_fetch.status === 200) {
		tag_list = tag_list_fetch.data;
	} else {
		tag_list = [];
	}

	const condition_list_fetch = await (new HTTPRequest("/api/v1/condition/")).get();
	if (condition_list_fetch.status === 200) {
		condition_list = condition_list_fetch.data;
	} else {
		condition_list = [];
	}

	const address_list_fetch = await (new HTTPRequest("/api/v1/location/")).get();
	if (address_list_fetch.status === 200) {
		address_list = address_list_fetch.data;
	} else {
		address_list = [];
	}

	const owner_list_fetch = await (new HTTPRequest("/api/v1/owner/")).get();
	if (owner_list_fetch.status === 200) {
		owner_list = owner_list_fetch.data;
	} else {
		owner_list = [];
	}

	const client_list_fetch = await (new HTTPRequest("/api/v1/client/")).get();
	if (client_list_fetch.status === 200) {
		client_list = client_list_fetch.data;
	} else {
		client_list = [];
	}

	const company_data_fetch = await (new HTTPRequest("/api/v1/company/")).get();
	if (company_data_fetch.status === 200) {
		company_data = company_data_fetch.data;
	} else {
		company_data = [];
	}
	updateSelectTagsData();
}

function updateSelectTagsData() {
	let dom = "<option value='none' selected>Aucun</option>";
	for (let i of tag_list) {
		const name = escapeHtml(i.label);
		dom += `<option value='${name}'>${name}</option>`;
	}
	menu_search_select_tags.innerHTML = dom;
}

function displayElementViewer(mode = "item", data = {}) {
	prevFocusedElement = document.activeElement;
	let dom = '';
	let loaded = false;

	switch (mode) {
		case "item":
			itemMode(data.reference);
			break;
		case "new-item":
			newItemMode();
			break;
		case "edit-item":
			editItemMode(data.reference);
			break;
		case "new-stock":
			newStockMode(data.reference);
			break;
		case "edit-stock":
			editStockMode(data.reference, data.stock)
			break;
	}

	if (loaded) {
		element_viewer.dataset.opened = "true";
		element_viewer.setAttribute('aria-hidden', 'false');
		document.body.classList.add('viewer-opened');
		document.querySelector('main').setAttribute('aria-hidden', 'true');
		document.querySelector('header').setAttribute('aria-hidden', 'true');
		document.querySelector('footer').setAttribute('aria-hidden', 'true');
		const content = document.getElementById('element-viewer-content');
		if (content) {
			content.focus();
			trapFocus(content);
		}
	}

	function itemMode(item_ref) {
		let selected_item = {};
		for (let i of product_list) {
			if (i.reference === item_ref) {
				selected_item = i;
				loaded = true;
				break;
			}
		}
		if (!loaded) return;

		const total_count = selected_item.stock.reduce((s, j) => s + j.count, 0);
		const total_value = selected_item.stock.reduce((s, j) => s + j.purchase_price * j.count, 0);

		dom += `
	<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
	<div id="element-viewer-item-top-bar-holder">
	<h2 id="viewer-title">${escapeHtml(selected_item.label)}</h2>
	<menu id="element-viewer-item-menu">
		<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-item-edit" aria-label="Modifier ${escapeHtml(selected_item.label)}">${svg.edit}</button>
		<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-item-delete" aria-label="Supprimer ${escapeHtml(selected_item.label)}">${svg.delete}</button>
		<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
	</menu>
	</div>
	<hr>
	<div class="item-viewer-body">
		<div class="item-viewer-image-col">
			<div class="product-list-product-img-container">
				<img class="product-list-product-img" src="${escapeHtml(selected_item.img_url)}" alt="${escapeHtml(selected_item.label)}">
			</div>
		</div>
		<div class="item-viewer-info-col">
			<p class="item-viewer-reference"><span class="item-viewer-ref-badge">${escapeHtml(selected_item.reference)}</span></p>
			${selected_item.description ? `<p class="item-viewer-description">${escapeHtml(selected_item.description)}</p>` : ''}
			${selected_item.tags.length > 0 ? `
			<div class="item-viewer-tags" aria-label="Étiquettes">
				${selected_item.tags.map(t => `<span class="product-list-item-tag">${escapeHtml(t)}</span>`).join('')}
			</div>` : ''}
			${selected_item.stock.length > 0 ? `
			<div class="item-viewer-stock-summary">
				<span class="item-viewer-stock-stat"><strong>${total_count}</strong> unité${total_count > 1 ? 's' : ''}</span>
				<span class="item-viewer-stock-stat-sep">·</span>
				<span class="item-viewer-stock-stat"><strong>${total_value.toFixed(2)} €</strong> valeur totale</span>
			</div>` : ''}
		</div>
	</div>
	<section class="item-viewer-stocks-section" aria-label="Stocks de cet article">
		<div class="item-viewer-stocks-header">
			<h3>Stocks${selected_item.stock.length > 0 ? ` <span class="item-viewer-stock-count-badge">${selected_item.stock.length}</span>` : ''}</h3>
		</div>
		${selected_item.stock.length === 0 ? `
		<p class="item-viewer-empty-state">Aucun stock enregistré pour cet article.</p>
		` : `
		<ul class="item-viewer-stock-list">
		${selected_item.stock.map(j => `
			<li class="item-viewer-stock-card">
				<div class="item-viewer-stock-card-header">
					<div class="item-viewer-stock-card-title">
						<span class="item-viewer-stock-card-label">${escapeHtml(j.label)}</span>
						<span class="item-viewer-stock-card-count">× ${j.count}</span>
					</div>
					<span class="item-viewer-stock-card-price">
						${j.purchase_price.toFixed(2)} €${j.vat.set ? ` <span class="item-viewer-stock-vat-badge">TVA ${j.vat.rate} %</span>` : ''}
					</span>
				</div>
				<div class="item-viewer-stock-card-meta">
					<span class="item-viewer-condition-badge">${escapeHtml(j.condition)}</span>
					<span class="item-viewer-stock-meta-item">${escapeHtml(j.location.label)}</span>
					<span class="item-viewer-stock-meta-item">${escapeHtml(j.owner)}</span>
					<span class="item-viewer-stock-meta-item">${dateFormatter(escapeHtml(j.purchase_date))}</span>
				</div>
			</li>`).join('')}
		</ul>`}
	</section>
	</div>`;

		element_viewer.innerHTML = dom;
		bindElementsActions();

		function bindElementsActions() {
			const close_viewer = document.querySelector("#element-viewer-close");
			close_viewer.addEventListener("click", () => closeViewer());

			const edit_item = document.querySelector("#element-viewer-item-edit");
			edit_item.addEventListener("click", () => displayElementViewer("edit-item", data));

			const delete_item = document.querySelector("#element-viewer-item-delete");
			delete_item.addEventListener("click", () => {
				showConfirmModal(
					`Supprimer définitivement « ${selected_item.label} » ? Cette action est irréversible.`,
					async () => {
						await HTTPRequest.delete(`/api/v1/item/${encodeURIComponent(selected_item.reference)}`);
						closeViewer();
						await refreshData();
						await displayElements();
					}
				);
			});
		}
	}

	function editItemMode(item_ref) {
		let selected_item = {};
		for (let i of product_list) {
			if (i.reference === item_ref) {
				selected_item = i;
				loaded = true;
				break;
			}
		}
		if (!loaded) return;

		dom += `
	<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
	<h2 id="viewer-title" class="sr-only">Modification de ${escapeHtml(selected_item.label)}</h2>
	<div id="element-viewer-item-top-bar-holder">
		<div class="stock-form-header-title">
			<span class="stock-form-breadcrumb">Modification</span>
			<span class="item-edit-label-preview" id="item-edit-label-preview">${escapeHtml(selected_item.label)}</span>
		</div>
		<menu id="element-viewer-item-menu">
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
		</menu>
	</div>
	<hr>
	<div class="item-edit-body">
		<div class="item-edit-image-col">
			<div class="product-list-product-img-container">
				<img class="product-list-product-img" id="edit-viewer-img-preview" src="${escapeHtml(selected_item.img_url)}" alt="${escapeHtml(selected_item.label)}">
			</div>
			<div class="stock-form-field item-edit-img-url-field">
				<label for="edit-viewer-img-url">URL de l'image</label>
				<input id="edit-viewer-img-url" type="url" class="item-list-input" value="${escapeHtml(selected_item.img_url)}" placeholder="https://...">
			</div>
		</div>
		<div class="item-edit-fields-col">
			<fieldset class="stock-form-section">
			<legend>Identification</legend>
			<div class="stock-form-grid">
				<div class="stock-form-field stock-form-field--wide">
					<label for="edit-viewer-label">Nom du produit</label>
					<input id="edit-viewer-label" type="text" class="item-list-input" value="${escapeHtml(selected_item.label)}" required>
				</div>
				<div class="stock-form-field stock-form-field--wide">
					<label for="edit-viewer-reference">Référence</label>
					<input id="edit-viewer-reference" type="text" class="item-list-input" value="${escapeHtml(selected_item.reference)}">
				</div>
			</div>
			</fieldset>
			<fieldset class="stock-form-section">
			<legend>Description</legend>
			<div class="stock-form-field">
				<label for="edit-viewer-description" class="sr-only">Description</label>
				<textarea id="edit-viewer-description" rows="5" class="item-list-input">${escapeHtml(selected_item.description)}</textarea>
			</div>
			</fieldset>
			${tag_list.length > 0 ? `
			<fieldset class="stock-form-section">
			<legend>Étiquettes</legend>
			<div class="item-edit-tags-grid" role="group" aria-label="Sélection des étiquettes">
				${tag_list.map(t => `
				<label class="item-edit-tag-checkbox ${selected_item.tags.includes(t.label) ? 'item-edit-tag-checkbox--checked' : ''}">
					<input type="checkbox" value="${escapeHtml(t.label)}" class="item-edit-tag-input" ${selected_item.tags.includes(t.label) ? "checked" : ""}>
					<span>${escapeHtml(t.label)}</span>
				</label>`).join('')}
			</div>
			</fieldset>` : ''}
		</div>
	</div>
	<section class="item-viewer-stocks-section" aria-label="Stocks de cet article">
		<div class="item-viewer-stocks-header">
			<h3>Stocks${selected_item.stock.length > 0 ? ` <span class="item-viewer-stock-count-badge">${selected_item.stock.length}</span>` : ''}</h3>
			<button type="button" class="item-viewer-add-stock-btn" id="element-viewer-add-stock">${svg.add}<span>Ajouter</span></button>
		</div>
		${selected_item.stock.length === 0 ? `
		<p class="item-viewer-empty-state">Aucun stock pour le moment.
			<button type="button" class="item-viewer-empty-add-btn" id="element-viewer-add-stock-2">Ajouter le premier stock</button>
		</p>` : `
		<ul class="item-viewer-stock-list">
		${selected_item.stock.map(j => `
			<li class="item-viewer-stock-card item-viewer-stock-card--editable">
				<div class="item-viewer-stock-card-header">
					<div class="item-viewer-stock-card-title">
						<span class="item-viewer-stock-card-label">${escapeHtml(j.label)}</span>
						<span class="item-viewer-stock-card-count">× ${j.count}</span>
					</div>
					<div class="item-viewer-stock-card-actions">
						<button type="button" data-stock="${escapeHtml(JSON.stringify(j))}" class="element-viewer-menu-icons-btn-edit-stock" aria-label="Modifier le lot ${escapeHtml(j.label)}">${svg.edit}</button>
					</div>
				</div>
				<div class="item-viewer-stock-card-meta">
					<span class="item-viewer-condition-badge">${escapeHtml(j.condition)}</span>
					<span class="item-viewer-stock-meta-item">${escapeHtml(j.location.label)}</span>
					<span class="item-viewer-stock-meta-item">${escapeHtml(j.owner)}</span>
					<span class="item-viewer-stock-meta-item">${j.purchase_price.toFixed(2)} €${j.vat.set ? ' (TVA ' + j.vat.rate + ' %)' : ''}</span>
				</div>
			</li>`).join('')}
		</ul>`}
	</section>
	</div>`;

		element_viewer.innerHTML = dom;

		const edit_label_input = document.querySelector("#edit-viewer-label");
		const edit_reference_input = document.querySelector("#edit-viewer-reference");
		const edit_description_input = document.querySelector("#edit-viewer-description");
		const edit_img_url_input = document.querySelector("#edit-viewer-img-url");
		const label_preview = document.querySelector("#item-edit-label-preview");
		const img_preview = document.querySelector("#edit-viewer-img-preview");

		edit_label_input.addEventListener("input", () => {
			label_preview.textContent = edit_label_input.value || selected_item.label;
		});
		edit_img_url_input.addEventListener("change", () => {
			const url = edit_img_url_input.value.trim();
			if (url) img_preview.src = url;
		});

		bindElementsActions();

		function bindElementsActions() {
			const close_viewer = document.querySelector("#element-viewer-close");
			close_viewer.addEventListener("click", () => closeViewer());

			const confirm_edit = document.querySelector("#element-viewer-confirm");
			confirm_edit.addEventListener("click", async () => {
				const request = new HTTPRequest("/api/v1/item");
				const new_ref = edit_reference_input.value.trim() || selected_item.reference;
				const new_label = edit_label_input.value.trim() || selected_item.label;
				const new_img = edit_img_url_input.value.trim() || selected_item.img_url;
				const new_desc = edit_description_input.value.trim() || selected_item.description;
				const new_tags = [...document.querySelectorAll(".item-edit-tag-input:checked")].map(o => o.value);

				const body = {
					label: selected_item.label,
					img_url: selected_item.img_url,
					description: selected_item.description,
					reference: selected_item.reference,
					tags: selected_item.tags,
					new_label,
					new_img_url: new_img,
					new_description: new_desc,
					new_reference: new_ref,
					new_tags,
				};
				await request.put(body);
				await refreshData();
				await displayElements();
				displayElementViewer("item", { reference: new_ref });
			});

			const add_stock_btn = document.querySelector("#element-viewer-add-stock");
			add_stock_btn.addEventListener("click", () => displayElementViewer("new-stock", selected_item));

			const add_stock_btn_2 = document.querySelector("#element-viewer-add-stock-2");
			if (add_stock_btn_2) add_stock_btn_2.addEventListener("click", () => displayElementViewer("new-stock", selected_item));

			document.querySelectorAll(".item-edit-tag-input").forEach(cb => {
				cb.addEventListener("change", () => {
					cb.closest(".item-edit-tag-checkbox").classList.toggle("item-edit-tag-checkbox--checked", cb.checked);
				});
			});

			const edit_stock_btns = document.querySelectorAll(".element-viewer-menu-icons-btn-edit-stock");
			for (const btn of edit_stock_btns) {
				btn.addEventListener("click", () => {
					displayElementViewer("edit-stock", { reference: selected_item.reference, stock: btn.dataset.stock });
				});
			}
		}
	}

	function newItemMode() {

		loaded = true;

		dom += `
	<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
	<h2 id="viewer-title" class="sr-only">Nouveau Produit</h2>
	<div id="element-viewer-item-top-bar-holder">
		<div class="stock-form-header-title">
			<span class="stock-form-breadcrumb">Création</span>
			<span class="item-edit-label-preview" id="item-edit-label-preview">Nouveau Produit</span>
		</div>
		<menu id="element-viewer-item-menu">
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
		</menu>
	</div>
	<hr>
	<div class="item-edit-body">
		<div class="item-edit-image-col">
			<div class="product-list-product-img-container">
				<img class="product-list-product-img" id="edit-viewer-img-preview" src="/assets/stock.svg" alt="Ajouter une image">
			</div>
			<div class="stock-form-field item-edit-img-url-field">
				<label for="edit-viewer-img-url">URL de l'image</label>
				<input id="edit-viewer-img-url" type="url" class="item-list-input" value="/assets/stock.svg" placeholder="https://...">
			</div>
		</div>
		<div class="item-edit-fields-col">
			<fieldset class="stock-form-section">
			<legend>Identification</legend>
			<div class="stock-form-grid">
				<div class="stock-form-field stock-form-field--wide">
					<label for="edit-viewer-label">Nom du produit</label>
					<input id="edit-viewer-label" type="text" class="item-list-input" placeholder="Product name.." required>
				</div>
				<div class="stock-form-field stock-form-field--wide">
					<label for="edit-viewer-reference">Référence</label>
					<input id="edit-viewer-reference" type="text" class="item-list-input" placeholder="Product reference..">
				</div>
			</div>
			</fieldset>
			<fieldset class="stock-form-section">
			<legend>Description</legend>
			<div class="stock-form-field">
				<label for="edit-viewer-description" class="sr-only">Description</label>
				<textarea id="edit-viewer-description" rows="5" class="item-list-input" placeholder="Product description.."></textarea>
			</div>
			</fieldset>
			${tag_list.length > 0 ? `
			<fieldset class="stock-form-section">
			<legend>Étiquettes</legend>
			<div class="item-edit-tags-grid" role="group" aria-label="Sélection des étiquettes">
				${tag_list.map(t => `
				<label class="item-edit-tag-checkbox">
					<input type="checkbox" value="${escapeHtml(t.label)}" class="item-edit-tag-input"}>
					<span>${escapeHtml(t.label)}</span>
				</label>`).join('')}
			</div>
			</fieldset>` : ''}
		</div>
	</div>
	</div>`;

		element_viewer.innerHTML = dom;

		const edit_label_input = document.querySelector("#edit-viewer-label");
		const edit_reference_input = document.querySelector("#edit-viewer-reference");
		const edit_description_input = document.querySelector("#edit-viewer-description");
		const edit_img_url_input = document.querySelector("#edit-viewer-img-url");
		const label_preview = document.querySelector("#item-edit-label-preview");
		const img_preview = document.querySelector("#edit-viewer-img-preview");

		edit_label_input.addEventListener("input", () => {
			label_preview.textContent = edit_label_input.value || selected_item.label;
		});
		edit_img_url_input.addEventListener("change", () => {
			const url = edit_img_url_input.value.trim();
			if (url) img_preview.src = url;
		});

		bindElementsActions();

		function bindElementsActions() {
			const close_viewer = document.querySelector("#element-viewer-close");
			close_viewer.addEventListener("click", () => closeViewer());

			const confirm_edit = document.querySelector("#element-viewer-confirm");
			confirm_edit.addEventListener("click", async () => {
				const request = new HTTPRequest("/api/v1/item");
				const new_ref = edit_reference_input.value.trim() || null;
				const new_label = edit_label_input.value.trim() || null;
				const new_img = edit_img_url_input.value.trim() || null;
				const new_desc = edit_description_input.value.trim() || null;
				const new_tags = [...document.querySelectorAll(".item-edit-tag-input:checked")].map(o => o.value);

				const body = {
					label: new_label,
					img_url: new_img,
					description: new_desc,
					reference: new_ref,
					tags: new_tags,
				};
				await request.post(body);
				await refreshData();
				await displayElements();
				displayElementViewer("item", { reference: new_ref });
			});

			document.querySelectorAll(".item-edit-tag-input").forEach(cb => {
				cb.addEventListener("change", () => {
					cb.closest(".item-edit-tag-checkbox").classList.toggle("item-edit-tag-checkbox--checked", cb.checked);
				});
			});
		}
	}
	
	function newStockMode(item_ref) {
		let selected_item = {};
		for (let i of product_list) {
			if (i.reference === item_ref) {
				selected_item = i;
				loaded = true;
				break;
			}
		}
		if (!loaded) return;

		dom += `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
		<div id="element-viewer-item-top-bar-holder">
		<div class="stock-form-header-title">
		<span class="stock-form-breadcrumb">${escapeHtml(selected_item.label)}</span>
		<h2 id="viewer-title">Nouveau stock</h2>
		</div>
		<menu id="element-viewer-item-menu">
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
		</menu>
		</div>
		<hr>
		<div class="stock-form-wrapper">
		<form id="stock-form" novalidate>
	
		<fieldset class="stock-form-section">
		<legend>Identification</legend>
		<div class="stock-form-grid">
			<div class="stock-form-field stock-form-field--wide">
				<label for="stock-input-label">Libellé</label>
				<input id="stock-input-label" type="text" class="item-list-input" placeholder="ex. Lot principal" required>
			</div>
			<div class="stock-form-field">
				<label for="stock-input-qty">Quantité</label>
				<input id="stock-input-qty" type="number" min="0" class="item-list-input" placeholder="0" required>
			</div>
			<div class="stock-form-field">
				<label for="stock-input-condition">État</label>
				<select id="stock-input-condition" class="item-list-input">
					${condition_list.map(c => `<option value="${escapeHtml(c.label)}">${escapeHtml(c.label)}</option>`).join('')}
				</select>
			</div>
			<div class="stock-form-field">
				<label for="stock-input-owner">Propriétaire</label>
				<select id="stock-input-owner" class="item-list-input">
					${owner_list.map(o => `<option value="${escapeHtml(o.label)}">${escapeHtml(o.label)}</option>`).join('')}
				</select>
			</div>
		</div>
		</fieldset>
	
		<fieldset class="stock-form-section">
		<legend>Achat</legend>
		<div class="stock-form-grid">
			<div class="stock-form-field">
				<label for="stock-input-date">Date d'achat</label>
				<input id="stock-input-date" type="date" class="item-list-input">
			</div>
			<div class="stock-form-field">
				<label for="stock-input-price">Prix d'achat (€)</label>
				<input id="stock-input-price" type="number" min="0" step="0.01" class="item-list-input" placeholder="0.00">
			</div>
			<div class="stock-form-field stock-form-field--toggle">
				<label class="stock-toggle-label" for="stock-input-vat">
					<input id="stock-input-vat" type="checkbox" class="stock-toggle-checkbox">
					<span class="stock-toggle-text">TVA applicable</span>
				</label>
			</div>
			<div class="stock-form-field" id="stock-vat-rate-wrapper" hidden>
				<label for="stock-input-vat-rate">Taux de TVA (%)</label>
				<input id="stock-input-vat-rate" type="number" min="0" max="100" class="item-list-input" placeholder="20">
			</div>
		</div>
		</fieldset>
	
		<fieldset class="stock-form-section">
		<legend>Localisation</legend>
		<div class="stock-form-grid">
			<div class="stock-form-field stock-form-field--wide">
				<label for="stock-input-location">Emplacement</label>
				<select id="stock-input-location" class="item-list-input">
					${address_list.map(a => `<option value="${escapeHtml(a.address)}">${escapeHtml(a.label)}</option>`).join('')}
				</select>
			</div>
		</div>
		</fieldset>
	
		</form>
		${selected_item.stock.length > 0 ? `
		<section class="stock-existing-section" aria-label="Stocks existants">
		<h3 class="stock-existing-title">Stocks existants</h3>
		<ul class="stock-existing-list">
		${selected_item.stock.map(j => `
			<li class="product-list-stock-container">
			<hr/>
			<div class="element-viewer-menu-stock-list-edit-title-comp">
			<h4>${escapeHtml(j.label)} × ${j.count}</h4>
			<button type="button" data-stock="${escapeHtml(JSON.stringify(j))}" class="element-viewer-menu-icons-btn-edit-stock" aria-label="Modifier ${escapeHtml(j.label)}">${svg.edit}</button>
			</div>
			<p>${escapeHtml(j.condition)} — ${escapeHtml(j.location.label)}</p>
			<p>${escapeHtml(j.owner)} — ${j.purchase_price.toFixed(2)} € ${j.vat.set ? '(TVA : ' + j.vat.rate + ' %)' : ''}</p>
			</li>`).join('')}
		</ul>
		</section>` : ''}
		</div>
		</div>`;

		element_viewer.innerHTML = dom;
		bindElementsActions();

		function bindElementsActions() {
			const close_btn = document.querySelector("#element-viewer-close");
			close_btn.addEventListener("click", () => closeViewer());

			const vat_checkbox = document.querySelector("#stock-input-vat");
			const vat_rate_wrapper = document.querySelector("#stock-vat-rate-wrapper");
			vat_checkbox.addEventListener("change", () => {
				if (vat_checkbox.checked) {
					vat_rate_wrapper.removeAttribute("hidden");
					document.querySelector("#stock-input-vat-rate").focus();
				} else {
					vat_rate_wrapper.setAttribute("hidden", "");
				}
			});

			const confirm_btn = document.querySelector("#element-viewer-confirm");
			confirm_btn.addEventListener("click", async () => {
				const label = document.querySelector("#stock-input-label").value.trim();
				const qty = parseInt(document.querySelector("#stock-input-qty").value, 10);
				const condition = document.querySelector("#stock-input-condition").value;
				const owner = document.querySelector("#stock-input-owner").value;
				const date = document.querySelector("#stock-input-date").value;
				const price = parseFloat(document.querySelector("#stock-input-price").value) || 0;
				const vat_set = document.querySelector("#stock-input-vat").checked;
				const vat_rate = parseFloat(document.querySelector("#stock-input-vat-rate").value) || 0;
				const location_address = document.querySelector("#stock-input-location").value;
				const location_obj = address_list.find(a => a.address === location_address)
					|| { address: location_address, label: location_address };

				if (!label || isNaN(qty) || qty < 0) return;

				const body = {
					reference: selected_item.reference,
					label,
					count: qty,
					purchase_date: date,
					purchase_price: price,
					tax_set: vat_set,
					tax_rate: vat_rate,
					location_data: location_obj,
					condition_data: {label:condition},
					owner_data : {label:owner},
					item_data : selected_item
				};
				await HTTPRequest.post("/api/v1/stock/", body);
				await refreshData();
				await displayElements();
				displayElementViewer("item", { reference: selected_item.reference });
			});

			const edit_stock_btns = document.querySelectorAll(".element-viewer-menu-icons-btn-edit-stock");
			for (const btn of edit_stock_btns) {
				btn.addEventListener("click", () => {
					displayElementViewer("edit-stock", { reference: selected_item.reference, stock: btn.dataset.stock });
				});
			}
		}
	}

	function editStockMode(item_ref, stock_str) {
		let selected_item = {};
		let selected_stock = {};
		let product_loaded = false;
		for (let i of product_list) {
			if (i.reference === item_ref) {
				selected_item = i;
				product_loaded = true;
				break;
			}
		}

		let stock_loaded = false;
		for (let i of selected_item.stock) {
			if (JSON.stringify(i) === stock_str) {
				selected_stock = i;
				stock_loaded = true;
				break;
			}
		}

		loaded = product_loaded && selected_stock;
		if (!loaded) return;

		dom += `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
		<div id="element-viewer-item-top-bar-holder">
		<div class="stock-form-header-title">
		<span class="stock-form-breadcrumb">${escapeHtml(selected_item.label)}</span>
		<h2 id="viewer-title">Modifier le stock</h2>
		</div>
		<menu id="element-viewer-item-menu">
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
			<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
		</menu>
		</div>
		<hr>
		<div class="stock-form-wrapper">
		<form id="stock-form" novalidate>
	
		<fieldset class="stock-form-section">
		<legend>Identification</legend>
		<div class="stock-form-grid">
			<div class="stock-form-field stock-form-field--wide">
				<label for="stock-input-label">Libellé</label>
				<input id="stock-input-label" type="text" class="item-list-input" value="${escapeHtml(selected_stock.label)}" required>
			</div>
			<div class="stock-form-field">
				<label for="stock-input-qty">Quantité</label>
				<input id="stock-input-qty" type="number" min="0" class="item-list-input" value="${escapeHtml(selected_stock.count)}" required>
			</div>
			<div class="stock-form-field">
				<label for="stock-input-condition">État</label>
				<select id="stock-input-condition" class="item-list-input">
					${condition_list.map(c => `<option value="${escapeHtml(c.label)}" ${c.label === selected_stock.condition ? "selected" : ""}>${escapeHtml(c.label)}</option>`).join('')}
				</select>
			</div>
			<div class="stock-form-field">
				<label for="stock-input-owner">Propriétaire</label>
				<select id="stock-input-owner" class="item-list-input">
					${owner_list.map(o => `<option value="${escapeHtml(o.label)}" ${o.label === selected_stock.owner ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join('')}
				</select>
			</div>
		</div>
		</fieldset>
	
		<fieldset class="stock-form-section">
		<legend>Achat</legend>
		<div class="stock-form-grid">
			<div class="stock-form-field">
				<label for="stock-input-date">Date d'achat</label>
				<input id="stock-input-date" type="date" class="item-list-input" value="${escapeHtml(selected_stock.purchase_date ? selected_stock.purchase_date.split('T')[0] : '')}">
			</div>
			<div class="stock-form-field">
				<label for="stock-input-price">Prix d'achat (€)</label>
				<input id="stock-input-price" type="number" min="0" step="0.01" class="item-list-input" value="${escapeHtml(selected_stock.purchase_price)}">
			</div>
			<div class="stock-form-field stock-form-field--toggle">
				<label class="stock-toggle-label" for="stock-input-vat">
					<input id="stock-input-vat" type="checkbox" class="stock-toggle-checkbox" ${selected_stock.vat.set === true ? "checked" : ""}>
					<span class="stock-toggle-text">TVA applicable</span>
				</label>
			</div>
			<div class="stock-form-field" id="stock-vat-rate-wrapper" ${selected_stock.vat.set === true ? "" : "hidden"}>
				<label for="stock-input-vat-rate">Taux de TVA (%)</label>
				<input id="stock-input-vat-rate" type="number" min="0" max="100" class="item-list-input" value="${escapeHtml(selected_stock.vat.rate)}">
			</div>
		</div>
		</fieldset>
	
		<fieldset class="stock-form-section">
		<legend>Localisation</legend>
		<div class="stock-form-grid">
			<div class="stock-form-field stock-form-field--wide">
				<label for="stock-input-location">Emplacement</label>
				<select id="stock-input-location" class="item-list-input">
					${address_list.map(a => `<option value="${escapeHtml(a.address)}" ${a.address === selected_stock.location.address ? "selected" : ""}>${escapeHtml(a.label)}</option>`).join('')}
				</select>
			</div>
		</div>
		</fieldset>
	
		</form>
		<button type="button" class="btn-supprimer-stock" id="stock-btn-supprimer">
			${svg.delete}<span>Supprimer ce lot</span>
		</button>
		${selected_item.stock.filter(j => JSON.stringify(j) !== JSON.stringify(selected_stock)).length > 0 ? `
		<section class="stock-existing-section" aria-label="Autres stocks">
		<h3 class="stock-existing-title">Autres stocks</h3>
		<ul class="stock-existing-list">
		${selected_item.stock.filter(j => JSON.stringify(j) !== JSON.stringify(selected_stock)).map(j => `
			<li class="product-list-stock-container">
			<hr/>
			<div class="element-viewer-menu-stock-list-edit-title-comp">
			<h4>${escapeHtml(j.label)} × ${j.count}</h4>
			<button type="button" data-stock="${escapeHtml(JSON.stringify(j))}" class="element-viewer-menu-icons-btn-edit-stock" aria-label="Modifier ${escapeHtml(j.label)}">${svg.edit}</button>
			</div>
			<p>${escapeHtml(j.condition)} — ${escapeHtml(j.location.label)}</p>
			<p>${escapeHtml(j.owner)} — ${j.purchase_price.toFixed(2)} € ${j.vat.set ? '(TVA : ' + j.vat.rate + ' %)' : ''}</p>
			</li>`).join('')}
		</ul>
		</section>` : ''}
		</div>
		</div>`;

		element_viewer.innerHTML = dom;
		bindElementsActions();

		function bindElementsActions() {
			const close_btn = document.querySelector("#element-viewer-close");
			close_btn.addEventListener("click", () => closeViewer());

			const vat_checkbox = document.querySelector("#stock-input-vat");
			const vat_rate_wrapper = document.querySelector("#stock-vat-rate-wrapper");
			vat_checkbox.addEventListener("change", () => {
				if (vat_checkbox.checked) {
					vat_rate_wrapper.removeAttribute("hidden");
					document.querySelector("#stock-input-vat-rate").focus();
				} else {
					vat_rate_wrapper.setAttribute("hidden", "");
				}
			});

			const confirm_btn = document.querySelector("#element-viewer-confirm");
			confirm_btn.addEventListener("click", async () => {
				const label = document.querySelector("#stock-input-label").value.trim();
				const qty = parseInt(document.querySelector("#stock-input-qty").value, 10);
				const condition = document.querySelector("#stock-input-condition").value;
				const owner = document.querySelector("#stock-input-owner").value;
				const date = document.querySelector("#stock-input-date").value;
				const price = parseFloat(document.querySelector("#stock-input-price").value) || 0;
				const vat_set = document.querySelector("#stock-input-vat").checked;
				const vat_rate = parseFloat(document.querySelector("#stock-input-vat-rate").value) || 0;
				const location_address = document.querySelector("#stock-input-location").value;
				const location_obj = address_list.find(a => a.address === location_address)
					|| { address: location_address, label: location_address };

				if (!label || isNaN(qty) || qty < 0) return;

				const body = {
					label: selected_stock.label,
					tax_rate: selected_stock.vat.rate,
					tax_set: selected_stock.vat.set,
					purchase_price: selected_stock.purchase_price,
					purchase_date: selected_stock.purchase_date,
					count: selected_stock.count,
					item_data: selected_item,
					condition_data: { label: selected_stock.condition },
					location_data: selected_stock.location,
					owner_data: { label: selected_stock.owner },
					
					new_label: label,
					new_tax_rate: vat_rate,
					new_tax_set: vat_set,
					new_purchase_price: price,
					new_purchase_date: date,
					new_count: qty,
					new_item_data: selected_item,
					new_condition_data: { label: condition },
					new_location_data: location_obj,
					new_owner_data: { label: owner },
				};
				await HTTPRequest.put("/api/v1/stock/", body);
				await refreshData();
				await displayElements();
				displayElementViewer("item", { reference: selected_item.reference });
			});

			const delete_btn = document.querySelector("#stock-btn-supprimer");
			delete_btn.addEventListener("click", () => {
				showConfirmModal(
					`Supprimer définitivement le lot :\n« ${selected_stock.label} » (× ${selected_stock.count}) ?\nCette action est irréversible.`,
					async () => {
						const params = new URLSearchParams({
							label: selected_stock.label,
							tax_rate: selected_stock.vat.rate,
							tax_set: selected_stock.vat.set,
							purchase_price: selected_stock.purchase_price,
							purchase_date: selected_stock.purchase_date,
							count: selected_stock.count,
							item_data: JSON.stringify(selected_item),
							condition_data: JSON.stringify({ label: selected_stock.condition }),
							location_data: JSON.stringify(selected_stock.location),
							owner_data: JSON.stringify({ label: selected_stock.owner }),
						});
						await HTTPRequest.delete(`/api/v1/stock/?${params.toString()}`);
						await refreshData();
						await displayElements();
						displayElementViewer("item", { reference: selected_item.reference });
					}
				);
			});

			const edit_stock_btns = document.querySelectorAll(".element-viewer-menu-icons-btn-edit-stock");
			for (const btn of edit_stock_btns) {
				btn.addEventListener("click", () => {
					displayElementViewer("edit-stock", { reference: selected_item.reference, stock: btn.dataset.stock });
				});
			}
		}
	}

	function dateFormatter(utc_h="2022-03-02T01:00:00") {
		const vals = (utc_h.split("T")[0]).split("-");
		const result = `${vals[2]} / ${vals[1]} / ${vals[0]}`;
		return result;
	}
}

async function displayElements() {
	await generateProductList(product_input_search.value);
	await displayFooterData();
}

async function displayFooterData() {
	const request = new HTTPRequest("/api");
	const result = await request.get();
	if (result.status !== 200){
		return
	}
	const app_data = result.data;
	const dom =`<p>App made by <a href="https://github.com/${app_data.dev}" target="_blank">St4lv</a> | ${app_data.app}@${app_data.version} | ${app_data.license} License</p>`;
	
	const footer = document.querySelector("footer");
	footer.innerHTML = dom;
}

function universalize(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replaceAll(" ", "");
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
})();