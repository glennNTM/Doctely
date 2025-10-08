# Notifications et Demandes de Consultation — Résumé Fonctionnel

## Notifications (3 scénarios)

- **SCÉNARIO 1 — Nouvelle demande**

  - **Déclencheur**: Un patient soumet une demande avec une spécialité.
  - **Destinataires**: Tous les médecins de cette spécialité.
  - **Événement Socket**: `nouvelle_notification`
  - **Type**: `NOUVELLE_DEMANDE`

- **SCÉNARIO 2 — Demande acceptée**

  - **Déclencheur**: Un médecin accepte une demande.
  - **Destinataire**: Le patient concerné.
  - **Événement Socket**: `nouvelle_notification`
  - **Type**: `DEMANDE_ACCEPTEE`

- **SCÉNARIO 3 — RDV imminent**
  - **Déclencheur**: Un RDV commence dans 5 minutes.
  - **Vérification**: Chaque minute (planificateur cron).
  - **Destinataires**: Patient et médecin.
  - **Événements Socket**:
    - `nouvelle_notification` (notification standard)
    - `rdv_ready` (signal pour rejoindre la consultation)

> Socket.IO est initialisé côté backend et nécessite un JWT dans `handshake.auth.token`.
> Les clients rejoignent leur room personnelle via `socket.emit("register", userId)`.

---

## Flux Demandes de Consultation

- **Création par le patient**

  - Endpoint: `POST /api/demande-consultation`
  - Effet: enregistre la demande (`EN_ATTENTE`) et notifie tous les médecins de la spécialité (SCÉNARIO 1).

- **Consultation côté médecin**

  - Endpoint: `GET /api/demande-consultation/medecin/me`
  - Retour: demandes `EN_ATTENTE` correspondant à la spécialité du médecin connecté.

- **Consultation côté patient**

  - Endpoint: `GET /api/demande-consultation/patient/me`
  - Retour: tableau brut des demandes du patient connecté.

- **Acceptation par un médecin**

  - Endpoint: `PUT /api/demande-consultation/:id/accept`
  - Règle métier: il n’y a pas de refus explicite.
  - Effets attendus:
    - Création du RDV associé immédiatement.
    - Notification au patient (SCÉNARIO 2).
    - Suppression de la demande acceptée (la demande ne doit plus apparaître dans les listes).
  - Les médecins qui ne souhaitent pas traiter la demande l’**ignorent**; elle reste visible pour les autres médecins de la même spécialité.

- **Suppression administrative/explicite d’une demande**
  - Endpoint: `DELETE /api/demande-consultation/:id/delete`
  - Usage: retirer une demande (nettoyage/gestion). Dans le flux métier normal, une acceptation doit créer le RDV et **supprimer automatiquement** la demande.

---

## Récap Endpoints

- `POST /api/demande-consultation` — créer une demande (patient)
- `GET /api/demande-consultation/medecin/me` — lister par spécialité (médecin)
- `GET /api/demande-consultation/patient/me` — lister ses demandes (patient)
- `PUT /api/demande-consultation/:id/accept` — accepter (médecin) → crée RDV + supprime demande
- `DELETE /api/demande-consultation/:id/delete` — supprimer une demande

---

## Planificateur (Scheduler)

- Intervalle: toutes les 1 minute.
- Rôle: détecter les RDV qui démarrent dans 5 minutes et envoyer les notifications (SCÉNARIO 3) + émettre `rdv_ready`.
