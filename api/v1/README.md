# API Points

URL de base : `/api/v1/`

---

## Company Data

### GET `/api/v1/company/`
Récupère les informations de l'entreprise.

**Paramètres** : aucun

> Entrée unique. Retourne le nom, l'adresse, l'adresse courriel, le téléphone et le SIREN.

---

### PUT `/api/v1/company/`
Modifie les informations de l'entreprise.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `new_name` | string | Nouveau nom |
| `new_address` | string | Nouvelle adresse |
| `new_email` | string | Nouvelle adresse courriel |
| `new_tel` | string | Nouveau téléphone |
| `new_siren` | string | Nouveau SIREN |

---

## Client

### GET `/api/v1/client/`
Récupère tous les clients.

**Paramètres** : aucun

---

### POST `/api/v1/client/`
Crée un nouveau client.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `name` | string | Nom du client |
| `address` | string | Adresse |
| `tel` | string | Téléphone |
| `email` | string | Adresse courriel |
| `siren` | string | SIREN |

---

### PUT `/api/v1/client/`
Modifie un client existant.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `name` | string | Nom actuel |
| `address` | string | Adresse actuelle |
| `tel` | string | Téléphone actuel |
| `email` | string | Adresse courriel actuelle |
| `siren` | string | SIREN actuel |
| `new_name` | string | Nouveau nom |
| `new_address` | string | Nouvelle adresse |
| `new_tel` | string | Nouveau téléphone |
| `new_email` | string | Nouvelle adresse courriel |
| `new_siren` | string | Nouveau SIREN |

---

### DELETE `/api/v1/client/`
Supprime un client.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `name` | string | Nom du client |
| `address` | string | Adresse |
| `tel` | string | Téléphone |
| `email` | string | Adresse courriel |
| `siren` | string | SIREN |

---

## Condition

### GET `/api/v1/condition/`
Récupère toutes les conditions disponibles.

**Paramètres** : aucun

> Endpoint en lecture seule. Les conditions sont des valeurs de référence gérées côté serveur.

---

## Item

### GET `/api/v1/item/`
Récupère tous les articles.

**Paramètres** : aucun

---

### POST `/api/v1/item/`
Crée un nouvel article.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé de l'article |
| `img_url` | string | URL de l'image |
| `description` | string | Description |
| `reference` | string | Référence |

---

### PUT `/api/v1/item/`
Modifie un article existant.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé actuel |
| `img_url` | string | URL de l'image actuelle |
| `description` | string | Description actuelle |
| `reference` | string | Référence actuelle |
| `new_label` | string | Nouveau libellé |
| `new_img_url` | string | Nouvelle URL de l'image |
| `new_description` | string | Nouvelle description |
| `new_reference` | string | Nouvelle référence |

---

### DELETE `/api/v1/item/`
Supprime un article.

**Paramètres de requête (query string) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé de l'article |
| `img_url` | string | URL de l'image |
| `description` | string | Description |
| `reference` | string | Référence |

---

## Location

### GET `/api/v1/location/`
Récupère tous les emplacements.

**Paramètres** : aucun

---

### POST `/api/v1/location/`
Crée un nouvel emplacement.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé de l'emplacement |
| `address` | string | Adresse |

---

### PUT `/api/v1/location/`
Modifie un emplacement existant.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé actuel |
| `address` | string | Adresse actuelle |
| `new_label` | string | Nouveau libellé |
| `new_address` | string | Nouvelle adresse |

---

### DELETE `/api/v1/location/`
Supprime un emplacement.

**Paramètres de requête (query string) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé de l'emplacement |
| `address` | string | Adresse |

---

## Owner

### GET `/api/v1/owner/`
Récupère tous les propriétaires.

**Paramètres** : aucun

---

### POST `/api/v1/owner/`
Crée un nouveau propriétaire.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé du propriétaire |

---

### PUT `/api/v1/owner/`
Modifie un propriétaire existant.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé actuel |
| `new_label` | string | Nouveau libellé |

---

### DELETE `/api/v1/owner/`
Supprime un propriétaire.

**Paramètres de requête (query string) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé du propriétaire |

---

## Stock

### GET `/api/v1/stock/`
Récupère tous les stocks.

**Paramètres** : aucun

---

### POST `/api/v1/stock/`
Crée une entrée de stock.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé du stock |
| `count` | number | Quantité |
| `purchase_price` | number | Prix d'achat |
| `purchase_date` | string | Date d'achat (ISO 8601) |
| `tax_rate` | number | Taux de taxe |
| `tax_set` | boolean | Taxe appliquée |
| `owner_data` | string | Référence vers un propriétaire (`Owner.label`) |
| `item_data` | string | Référence vers un article (`Item.label`) |
| `location_data` | string | Référence vers un emplacement (`Location.label`) |
| `condition_data` | string | Référence vers une condition (`Condition.label`) |
| `tags` | string[] | Liste de références vers des étiquettes (`Tag.label`) |

---

### PUT `/api/v1/stock/`
Modifie une entrée de stock. Les champs sans préfixe identifient le stock ciblé, les champs préfixés `new_` contiennent les nouvelles valeurs.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé actuel |
| `count` | number | Quantité actuelle |
| `purchase_price` | number | Prix d'achat actuel |
| `purchase_date` | string | Date d'achat actuelle |
| `tax_rate` | number | Taux de taxe actuel |
| `tax_set` | boolean | Taxe appliquée actuelle |
| `owner_data` | string | Propriétaire actuel |
| `item_data` | string | Article actuel |
| `location_data` | string | Emplacement actuel |
| `condition_data` | string | État actuel |
| `tags` | string[] | Étiquettes actuelles |
| `new_label` | string | Nouveau libellé |
| `new_count` | number | Nouvelle quantité |
| `new_purchase_price` | number | Nouveau prix d'achat |
| `new_purchase_date` | string | Nouvelle date d'achat |
| `new_tax_rate` | number | Nouveau taux de taxe |
| `new_tax_set` | boolean | Nouvelle taxe appliquée |
| `new_owner_data` | string | Nouveau propriétaire |
| `new_item_data` | string | Nouvel article |
| `new_location_data` | string | Nouvel emplacement |
| `new_condition_data` | string | Nouvel état |
| `new_tags` | string[] | Nouvelles étiquettes |

---

### DELETE `/api/v1/stock/`
Supprime une entrée de stock.

**Paramètres de requête (query string) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé du stock |
| `count` | number | Quantité |
| `purchase_price` | number | Prix d'achat |
| `purchase_date` | string | Date d'achat |
| `tax_rate` | number | Taux de taxe |
| `tax_set` | boolean | Taxe appliquée |
| `owner_data` | string | Propriétaire |
| `item_data` | string | Article |
| `location_data` | string | Emplacement |
| `condition_data` | string | État |
| `tags` | string[] | Étiquettes |

---

## Tag

### GET `/api/v1/tag/`
Récupère toutes les étiquettes.

**Paramètres** : aucun

---

### POST `/api/v1/tag/`
Crée une nouvelle étiquette.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé de l'étiquette |

---

### PUT `/api/v1/tag/`
Modifie une étiquette existante.

**Corps (JSON) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé actuel |
| `new_label` | string | Nouveau libellé |

---

### DELETE `/api/v1/tag/`
Supprime une étiquette.

**Paramètres de requête (query string) :**
| Champ | Type | Description |
|---|---|---|
| `label` | string | Libellé de l'étiquette |