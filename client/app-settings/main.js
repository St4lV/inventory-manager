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
const element_viewer = document.querySelector("#element-viewer");

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

async function bindActions() {
	const edit_company_btn = document.querySelector("#edit-company-data-btn");
	edit_company_btn.addEventListener("click",()=>{displayElementViewer("edit-company-data")});

	const new_client_btn = document.querySelector("#new-client-btn");
	new_client_btn.addEventListener("click",()=>{displayElementViewer("new-client")});

	const new_owner_btn = document.querySelector("#new-owner-btn");
	new_owner_btn.addEventListener("click",()=>{displayElementViewer("new-owner")});

	const new_location_btn = document.querySelector("#new-location-btn");
	new_location_btn.addEventListener("click",()=>{displayElementViewer("new-location")});

	const new_tag_btn = document.querySelector("#new-tag-btn");
	new_tag_btn.addEventListener("click",()=>{displayElementViewer("new-tag")});
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
}

async function displayElements() {
	
	displayCompanyInfo();
	displayClients();
	displayOwners();
	displayLocations();
	displayTags();

	function displayCompanyInfo() {
		const c_name = document.querySelector("#app-settings-company-name");
		const c_address = document.querySelector("#app-settings-company-address");
		const c_email = document.querySelector("#app-settings-company-email");
		const c_tel = document.querySelector("#app-settings-company-tel");
		const c_siren = document.querySelector("#app-settings-company-siren");

		c_name.innerHTML= `<a href="https://annuaire-entreprises.data.gouv.fr/rechercher?terme=${company_data.siren}" target="_blank">${company_data.name}<a/>`;
		c_address.innerText= company_data.address;
		c_email.innerText= company_data.email;
		c_tel.innerText= company_data.tel;
		c_siren.innerText= company_data.siren;
	}

	function displayClients() {
		let dom = "";
		const list_el = document.querySelector("#client-list");
		for (let i of client_list){
			dom+=`<li class="entity-item">
					<div class='edit-element-container'>
					<h3><a href="https://annuaire-entreprises.data.gouv.fr/rechercher?terme=${i.siren}" target="_blank">${i.name}</a></h3>
					<button type="button" class="settings-edit-btn edit-client-btn" data-client="${escapeHtml(JSON.stringify(i))}" aria-label="Ajouter un client">${svg.edit}</button>
					</div>
					<p class="entity-detail">${i.address}</p>
					<p class="entity-detail">${i.tel}</p>
					<p class="entity-detail">${i.email}</p>
					<p class="entity-detail entity-siren">${i.siren}</p>
				</li>`
		}
		list_el.innerHTML=dom;

		const edit_client_btn_list = document.querySelectorAll(".edit-client-btn");
		for (let i of edit_client_btn_list){
			i.addEventListener("click",()=>{
				displayElementViewer("edit-client",JSON.parse(i.dataset.client))
			});
		}
	}

	function displayOwners() {
		let dom = "";
		const list_el = document.querySelector("#owner-list");
		for (let i of owner_list){
			dom+=`<li class="chip-item owner-chip-item" data-owner="${escapeHtml(JSON.stringify(i))}"><h3>${i.label}</h3></li>`
		}
		list_el.innerHTML=dom;

		const owner_chip_item_list = document.querySelectorAll(".owner-chip-item");
		for (let i of owner_chip_item_list){
			i.addEventListener("click",()=>{
				displayElementViewer("edit-owner",JSON.parse(i.dataset.owner));
			});
		}

	}

	function displayLocations() {
		let dom = "";
		const list_el = document.querySelector("#location-list");
		for (let i of address_list){
			dom+=`
			<li class="entity-item">
				<div class='edit-element-container'>
					<h3>${i.label}</h3>
					<button type="button" class="settings-edit-btn edit-location-btn" data-location="${escapeHtml(JSON.stringify(i))}" aria-label="Ajouter un client">${svg.edit}</button>
				</div>
				<p class="entity-detail">${i.address}</p>
			</li>`
		}
		list_el.innerHTML=dom;

		const edit_location_btn_list = document.querySelectorAll(".edit-location-btn");
		for (let i of edit_location_btn_list){
			i.addEventListener("click",()=>{
				displayElementViewer("edit-location",JSON.parse(i.dataset.location))
			});
		}
	}

	function displayTags() {
		let dom = "";
		const list_el = document.querySelector("#tag-list");
		for (let i of tag_list){
			dom+=`<li class="chip-item tag-chip-item" data-tag="${escapeHtml(JSON.stringify(i))}"><p>${i.label}</p></li>`
		}
		list_el.innerHTML=dom;

		const tag_chip_item_list = document.querySelectorAll(".tag-chip-item");
		for (let i of tag_chip_item_list){
			i.addEventListener("click",()=>{
				displayElementViewer("edit-tag",JSON.parse(i.dataset.tag));
			});
		}
	}
	
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

function displayElementViewer(mode = "item", data = {}) {
	prevFocusedElement = document.activeElement;
	let dom = '';
	let loaded = false;

	switch (mode) {
		case "edit-company-data":
			editCompanyDataMode();
			break;
		case "new-client":
			newClientMode();
			break;
		case "edit-client":
			editClientMode(data.siren);
			break;
		case "new-owner":
			newOwnerMode();
			break;
		case "edit-owner":
			editOwnerMode(data.label)
			break;
		case "new-location":
			newLocationMode();
			break;
		case "edit-location":
			editLocationMode(data.address)
			break;
		case "new-tag":
			newTagMode();
			break;
		case "edit-tag":
			editTagMode(data.label);
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

	function showDeleteModal(message, onConfirm) {
		const dialog = document.createElement('dialog');
		dialog.id = 'modal-confirmation';
		dialog.innerHTML = `
			<p>${escapeHtml(message)}</p>
			<menu>
				<button type="button" class="btn-modal btn-modal-annuler" id="modal-cancel">Annuler</button>
				<button type="button" class="btn-modal btn-modal-supprimer" id="modal-delete">Supprimer</button>
			</menu>
		`;
		document.body.appendChild(dialog);
		dialog.showModal();

		dialog.querySelector('#modal-cancel').addEventListener('click', () => {
			dialog.close();
			dialog.remove();
		});
		dialog.querySelector('#modal-delete').addEventListener('click', async () => {
			dialog.close();
			dialog.remove();
			await onConfirm();
		});
		dialog.addEventListener('close', () => { if (document.body.contains(dialog)) dialog.remove(); });
	}

	function bindCloseAndConfirm(onConfirm) {
		document.querySelector("#element-viewer-close").addEventListener("click", () => closeViewer());
		document.querySelector("#element-viewer-confirm").addEventListener("click", onConfirm);
	}

	function editCompanyDataMode() {
		loaded = true;
		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Éditer les informations de la société</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Informations de la société</legend>
				<div class="settings-form-field">
					<label for="edit-company-name">Nom de la structure</label>
					<input type="text" id="edit-company-name" value="${escapeHtml(company_data.name)}" placeholder="Nom de la structure" autocomplete="organization">
				</div>
				<div class="settings-form-field">
					<label for="edit-company-address">Adresse</label>
					<input type="text" id="edit-company-address" value="${escapeHtml(company_data.address)}" placeholder="42 rue de la Paix, Paris (75000)" autocomplete="street-address">
				</div>
				<div class="settings-form-field">
					<label for="edit-company-tel">Téléphone</label>
					<input type="tel" id="edit-company-tel" value="${escapeHtml(company_data.tel)}" placeholder="+33 1 23 45 67 89" autocomplete="tel">
				</div>
				<div class="settings-form-field">
					<label for="edit-company-email">Courriel</label>
					<input type="email" id="edit-company-email" value="${escapeHtml(company_data.email)}" placeholder="contact@structure.com" autocomplete="email">
				</div>
				<div class="settings-form-field">
					<label for="edit-company-siren">SIREN</label>
					<input type="text" id="edit-company-siren" value="${escapeHtml(company_data.siren)}" placeholder="000 000 000" inputmode="numeric" pattern="[0-9\\s]{9,11}" autocomplete="off">
				</div>
			</fieldset>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			const body = {
				new_name: document.getElementById('edit-company-name').value,
				new_address: document.getElementById('edit-company-address').value,
				new_tel: document.getElementById('edit-company-tel').value,
				new_email: document.getElementById('edit-company-email').value,
				new_siren: document.getElementById('edit-company-siren').value,
			};
			await HTTPRequest.put('/api/v1/company/', body);
			closeViewer();
			await refreshData();
			await displayElements();
		});
	}

	function newClientMode() {
		loaded = true;
		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Nouveau client</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Informations du client</legend>
				<div class="settings-form-field">
					<label for="edit-client-name">Nom</label>
					<input type="text" id="edit-client-name" placeholder="Nom du client">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-address">Adresse</label>
					<input type="text" id="edit-client-address" placeholder="Adresse du client">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-tel">Téléphone</label>
					<input type="tel" id="edit-client-tel" placeholder="+33 1 23 45 67 89">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-email">Courriel</label>
					<input type="email" id="edit-client-email" placeholder="contact@client.com">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-siren">SIREN</label>
					<input type="text" id="edit-client-siren" placeholder="000 000 000" inputmode="numeric">
				</div>
			</fieldset>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			const body = {
				name: document.getElementById('edit-client-name').value,
				address: document.getElementById('edit-client-address').value,
				tel: document.getElementById('edit-client-tel').value,
				email: document.getElementById('edit-client-email').value,
				siren: document.getElementById('edit-client-siren').value,
			};
			await HTTPRequest.post('/api/v1/client/', body);
			closeViewer();
			await refreshData();
			await displayElements();
		});
	}

	function editClientMode(ref) {
		let selected_client = {};
		for (let i of client_list) {
			if (i.siren === ref) {
				selected_client = i;
				loaded = true;
				break;
			}
		}
		if (!loaded) return;

		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Éditer ${escapeHtml(selected_client.name)}</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Modifier le client</legend>
				<div class="settings-form-field">
					<label for="edit-client-name">Nom</label>
					<input type="text" id="edit-client-name" value="${escapeHtml(selected_client.name)}">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-address">Adresse</label>
					<input type="text" id="edit-client-address" value="${escapeHtml(selected_client.address)}">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-tel">Téléphone</label>
					<input type="tel" id="edit-client-tel" value="${escapeHtml(selected_client.tel)}">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-email">Courriel</label>
					<input type="email" id="edit-client-email" value="${escapeHtml(selected_client.email)}">
				</div>
				<div class="settings-form-field">
					<label for="edit-client-siren">SIREN</label>
					<input type="text" id="edit-client-siren" value="${escapeHtml(selected_client.siren)}" inputmode="numeric">
				</div>
				<div class="settings-form-field">
				<div id="edit-client-is-entity-container">
					<label for="edit-client-is-entity">Est une structure juridique : </label>
					<input type="checkbox" id="edit-client-is-entity" ${selected_client.is_entity === true ? "checked" : ""}>
				</div>
				</div>
			</fieldset>
			<hr class="viewer-divider">
			<button type="button" class="btn-supprimer" id="btn-delete-client" aria-label="Supprimer le client ${escapeHtml(selected_client.name)}">
				${svg.delete} Supprimer le client
			</button>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			const body = {
				name: selected_client.name,
				address: selected_client.address,
				tel: selected_client.tel,
				email: selected_client.email,
				siren: selected_client.siren,
				is_entity: selected_client.is_entity,
				new_name: document.getElementById('edit-client-name').value,
				new_address: document.getElementById('edit-client-address').value,
				new_tel: document.getElementById('edit-client-tel').value,
				new_email: document.getElementById('edit-client-email').value,
				new_siren: document.getElementById('edit-client-siren').value,
				new_is_entity: document.getElementById('edit-client-is-entity').checked,
			};
			await HTTPRequest.put('/api/v1/client/', body);
			closeViewer();
			await refreshData();
			await displayElements();
		});

		document.getElementById('btn-delete-client').addEventListener('click', () => {
			showDeleteModal(`Supprimer le client « ${selected_client.name} » ? Cette action est irréversible.`, async () => {
				await HTTPRequest.delete('/api/v1/client/', {
					name: selected_client.name,
					address: selected_client.address,
					tel: selected_client.tel,
					email: selected_client.email,
					siren: selected_client.siren,
					is_entity: selected_client.is_entity,
				});
				closeViewer();
				await refreshData();
				await displayElements();
			});
		});
	}

	function newOwnerMode() {
		loaded = true;
		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Nouveau propriétaire</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Nouveau propriétaire</legend>
				<div class="settings-form-field">
					<label for="edit-owner-label">Libellé</label>
					<input type="text" id="edit-owner-label" placeholder="Nom du propriétaire">
				</div>
			</fieldset>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			await HTTPRequest.post('/api/v1/owner/', {
				label: document.getElementById('edit-owner-label').value,
			});
			closeViewer();
			await refreshData();
			await displayElements();
		});
	}

	function editOwnerMode(ref) {
		let selected_owner = {};
		for (let i of owner_list) {
			if (i.label === ref) {
				selected_owner = i;
				loaded = true;
				break;
			}
		}
		if (!loaded) return;

		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Éditer ${escapeHtml(selected_owner.label)}</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Modifier le propriétaire</legend>
				<div class="settings-form-field">
					<label for="edit-owner-label">Libellé</label>
					<input type="text" id="edit-owner-label" value="${escapeHtml(selected_owner.label)}">
				</div>
			</fieldset>
			<hr class="viewer-divider">
			<button type="button" class="btn-supprimer" id="btn-delete-owner" aria-label="Supprimer le propriétaire ${escapeHtml(selected_owner.label)}">
				${svg.delete} Supprimer le propriétaire
			</button>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			await HTTPRequest.put('/api/v1/owner/', {
				label: selected_owner.label,
				new_label: document.getElementById('edit-owner-label').value,
			});
			closeViewer();
			await refreshData();
			await displayElements();
		});

		document.getElementById('btn-delete-owner').addEventListener('click', () => {
			showDeleteModal(`Supprimer le propriétaire « ${selected_owner.label} » ?`, async () => {
				await HTTPRequest.delete(`/api/v1/owner/?label=${encodeURIComponent(selected_owner.label)}`);
				closeViewer();
				await refreshData();
				await displayElements();
			});
		});
	}

	function newLocationMode() {
		loaded = true;
		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Nouvel emplacement</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Nouvel emplacement</legend>
				<div class="settings-form-field">
					<label for="edit-location-label">Libellé</label>
					<input type="text" id="edit-location-label" placeholder="Bureau, Entrepôt…">
				</div>
				<div class="settings-form-field">
					<label for="edit-location-address">Adresse</label>
					<input type="text" id="edit-location-address" placeholder="42 rue de la Paix, Paris (75000)">
				</div>
			</fieldset>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			await HTTPRequest.post('/api/v1/location/', {
				label: document.getElementById('edit-location-label').value,
				address: document.getElementById('edit-location-address').value,
			});
			closeViewer();
			await refreshData();
			await displayElements();
		});
	}

	function editLocationMode(ref) {
		let selected_location = {};
		for (let i of address_list) {
			if (i.address === ref) {
				selected_location = i;
				loaded = true;
				break;
			}
		}
		if (!loaded) return;

		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Éditer ${escapeHtml(selected_location.label)}</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Modifier l'emplacement</legend>
				<div class="settings-form-field">
					<label for="edit-location-label">Libellé</label>
					<input type="text" id="edit-location-label" value="${escapeHtml(selected_location.label)}">
				</div>
				<div class="settings-form-field">
					<label for="edit-location-address">Adresse</label>
					<input type="text" id="edit-location-address" value="${escapeHtml(selected_location.address)}">
				</div>
			</fieldset>
			<hr class="viewer-divider">
			<button type="button" class="btn-supprimer" id="btn-delete-location" aria-label="Supprimer l'emplacement ${escapeHtml(selected_location.label)}">
				${svg.delete} Supprimer l'emplacement
			</button>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			await HTTPRequest.put('/api/v1/location/', {
				label: selected_location.label,
				address: selected_location.address,
				new_label: document.getElementById('edit-location-label').value,
				new_address: document.getElementById('edit-location-address').value,
			});
			closeViewer();
			await refreshData();
			await displayElements();
		});

		document.getElementById('btn-delete-location').addEventListener('click', () => {
			showDeleteModal(`Supprimer l'emplacement « ${selected_location.label} » ?`, async () => {
				await HTTPRequest.delete(`/api/v1/location/?label=${encodeURIComponent(selected_location.label)}&address=${encodeURIComponent(selected_location.address)}`);
				closeViewer();
				await refreshData();
				await displayElements();
			});
		});
	}

	function newTagMode() {
		loaded = true;
		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Nouvelle étiquette</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Nouvelle étiquette</legend>
				<div class="settings-form-field">
					<label for="edit-tag-label">Libellé</label>
					<input type="text" id="edit-tag-label" placeholder="Nom de l'étiquette">
				</div>
			</fieldset>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			await HTTPRequest.post('/api/v1/tag/', {
				label: document.getElementById('edit-tag-label').value,
			});
			closeViewer();
			await refreshData();
			await displayElements();
		});
	}

	function editTagMode(ref) {
		let selected_tag = {};
		for (let i of tag_list) {
			if (i.label === ref) {
				selected_tag = i;
				loaded = true;
				break;
			}
		}
		if (!loaded) return;

		element_viewer.innerHTML = `
		<div id="element-viewer-content" role="dialog" aria-modal="true" aria-labelledby="viewer-title" tabindex="-1">
			<div id="element-viewer-item-top-bar-holder">
				<h2 id="viewer-title">Éditer ${escapeHtml(selected_tag.label)}</h2>
				<menu id="element-viewer-item-menu">
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-confirm" aria-label="Confirmer">${svg.confirm}</button>
					<button type="button" class="element-viewer-menu-icons-btn" id="element-viewer-close" aria-label="Fermer">${svg.close}</button>
				</menu>
			</div>
			<hr class="viewer-divider">
			<fieldset>
				<legend class="sr-only">Modifier l'étiquette</legend>
				<div class="settings-form-field">
					<label for="edit-tag-label">Libellé</label>
					<input type="text" id="edit-tag-label" value="${escapeHtml(selected_tag.label)}">
				</div>
			</fieldset>
			<hr class="viewer-divider">
			<button type="button" class="btn-supprimer" id="btn-delete-tag" aria-label="Supprimer l'étiquette ${escapeHtml(selected_tag.label)}">
				${svg.delete} Supprimer l'étiquette
			</button>
		</div>
		`;

		bindCloseAndConfirm(async () => {
			await HTTPRequest.put('/api/v1/tag/', {
				label: selected_tag.label,
				new_label: document.getElementById('edit-tag-label').value,
			});
			closeViewer();
			await refreshData();
			await displayElements();
		});

		document.getElementById('btn-delete-tag').addEventListener('click', () => {
			showDeleteModal(`Supprimer l'étiquette « ${selected_tag.label} » ?`, async () => {
				await HTTPRequest.delete(`/api/v1/tag/?label=${encodeURIComponent(selected_tag.label)}`);
				closeViewer();
				await refreshData();
				await displayElements();
			});
		});
	}
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