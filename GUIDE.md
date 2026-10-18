# MyWealth : mettre l'application sur votre téléphone (gratuit)

Ce guide vous accompagne pas à pas, sans connaissances techniques. Prévoyez **30 à 45 minutes** la première fois.
Coût total : **0 CHF** (GitHub gratuit, Dropbox Basic gratuit).

**Ce que vous obtenez :** une application « MyWealth » sur l'écran d'accueil de votre iPhone ou Android et sur votre ordinateur. Vos données se synchronisent automatiquement dans **votre propre** cloud.

---

## 0. Ce qu'il faut savoir avant de commencer

- **Où sont vos données ?** Sur chaque appareil (stockage du navigateur) et dans un fichier privé de votre cloud (`mywealth-donnees.json`, dans un dossier réservé à l'application). **Nulle part ailleurs** : pas de serveur MyWealth, pas de statistiques, pas de publicité.
- **GitHub sert uniquement à héberger le code** de l'application (les pages web), jamais vos chiffres. Le dépôt peut donc être **public** sans risque.
  - Avec le plan gratuit de GitHub, GitHub Pages exige un dépôt **public**. Un dépôt privé avec Pages demande un plan payant ; Cloudflare Pages, gratuit, accepte un dépôt privé (voir l'annexe B).
- **Quel cloud choisir ?**

| | **Dropbox** (recommandé) | **OneDrive** |
|---|---|---|
| Prix | gratuit (Dropbox Basic, 2 Go) | gratuit |
| Carte bancaire | **non** | **oui, demandée** : Microsoft exige un « compte Azure gratuit » vérifié par carte de crédit ou de débit pour enregistrer une application (autorisation temporaire de 1 USD annulée ensuite, aucun débit) |
| Reconnexion | rarement (jeton longue durée) | possiblement toutes les 24 h sur iPhone (session Microsoft courte dans les navigateurs) |

  Depuis juin 2024, un compte Microsoft personnel **seul** ne peut plus enregistrer d'application : il faut un « annuaire » Microsoft Entra, obtenu via l'inscription Azure gratuite (avec carte).
  Si vous préférez éviter la carte, prenez **Dropbox**. Les deux sont prévus dans l'application, et un seul suffit.

---

## 1. Créer un compte GitHub (2 min)

1. Allez sur **https://github.com/signup**.
2. Saisissez votre e-mail, un mot de passe et un **nom d'utilisateur**, par exemple `baptiste-sv`.
   - Ce nom apparaîtra dans l'adresse de votre application : `https://baptiste-sv.github.io/mywealth/`
3. Validez l'e-mail de confirmation. Choisissez le plan **Free**.

## 2. Créer le dépôt « mywealth » (1 min)

1. En haut à droite, cliquez sur **＋** › **New repository**.
2. **Repository name** : `mywealth`
3. Cochez **Public**. Ne cochez rien d'autre.
4. Cliquez sur **Create repository**.

## 3. Déposer les fichiers (3 min)

1. Décompressez **MyWealth.zip** sur votre ordinateur (double-clic). Vous obtenez un dossier `MyWealth` qui contient `index.html`, `config.js`, `sw.js`, `manifest.webmanifest`, `redirect.html`, `GUIDE.md` et les dossiers `icons` et `vendor`.
2. Sur la page de votre dépôt, cliquez sur le lien **uploading an existing file** (ou **Add file › Upload files**).
3. Ouvrez le dossier `MyWealth` et **sélectionnez tout son contenu** (pas le dossier lui-même).
4. Glissez la sélection dans la page GitHub. Les dossiers `icons` et `vendor` doivent apparaître avec leurs fichiers.
5. En bas, cliquez sur **Commit changes**.

> Vérification : à la racine du dépôt, vous devez voir `index.html` directement, et non un dossier `MyWealth`.

## 4. Activer GitHub Pages (2 min, plus quelques minutes d'attente)

1. Dans le dépôt : **Settings** (roue dentée) › menu de gauche **Pages**.
2. **Build and deployment** › **Source** : `Deploy from a branch`.
3. **Branch** : `main`, dossier `/ (root)`, puis **Save**.
4. Après 1 à 5 minutes, l'adresse s'affiche en haut de la page : `https://VOTRE-NOM.github.io/mywealth/`
   - Notez-la **exactement**, y compris le `/` final.
5. Ouvrez-la : MyWealth fonctionne déjà, sans synchronisation pour l'instant.

---

## 5A. Option recommandée : relier Dropbox (5 min)

1. Si besoin, créez un compte gratuit sur **https://www.dropbox.com/basic**.
2. Ouvrez **https://www.dropbox.com/developers/apps** et cliquez sur **Create app**.
3. **Choose an API** : `Scoped access`.
4. **Choose the type of access** : `App folder`. Ainsi, MyWealth ne voit **que son propre dossier**, jamais vos autres fichiers.
5. **Name your app** : un nom unique, par exemple `MyWealth-Baptiste`. Cliquez sur **Create app**.
6. Onglet **Permissions** : cochez `files.content.write` et `files.content.read`, puis cliquez sur **Submit** en bas de la page.
7. Onglet **Settings** :
   - **OAuth 2 › Redirect URIs** : collez votre adresse, par exemple `https://baptiste-sv.github.io/mywealth/` (avec le `/` final), puis cliquez sur **Add**.
   - **Allow public clients (Implicit Grant & PKCE)** : laissez sur **Allow**.
   - Copiez la valeur **App key**. Vous n'avez **pas** besoin de l'« App secret » : ne l'utilisez jamais.
8. L'application reste en statut « Development ». C'est normal et suffisant pour un usage personnel ; ne demandez pas la mise en production.

Passez ensuite à l'**étape 6**.

## 5B. Option OneDrive (si vous acceptez la vérification par carte)

1. **Obtenir un annuaire Microsoft (une seule fois)** :
   - Allez sur **https://azure.microsoft.com/free**, cliquez sur « Essayer gratuitement » et connectez-vous avec **votre compte Microsoft habituel** (celui de OneDrive).
   - Indiquez votre téléphone et une carte de crédit ou de débit. Les cartes prépayées et virtuelles sont refusées. Une autorisation temporaire de 1 USD peut apparaître, puis elle est annulée.
   - Au bout de 30 jours, Microsoft vous proposera le « paiement à l'utilisation » : **refusez simplement**. L'abonnement d'essai est alors désactivé, mais l'annuaire Microsoft Entra (version gratuite) et l'application que vous allez créer continuent de fonctionner.
   - Ne créez aucune autre ressource Azure (machines virtuelles, stockage, etc.).
2. Ouvrez **https://entra.microsoft.com** › **Entra ID** › **Inscriptions d'applications** (App registrations) › **Nouvelle inscription**.
3. **Nom** : `MyWealth`.
4. **Types de comptes pris en charge** : **Comptes Microsoft personnels uniquement** (Personal Microsoft accounts only).
5. **URI de redirection** :
   - plateforme : **Application monopage (SPA)** ;
   - adresse : `https://VOTRE-NOM.github.io/mywealth/redirect.html`
6. Cliquez sur **S'inscrire** (Register). Sur la page « Vue d'ensemble », copiez l'**ID d'application (client)**.
7. Facultatif mais conseillé : **Autorisations d'API** › **Ajouter une autorisation** › **Microsoft Graph** › **Autorisations déléguées** › cochez `Files.ReadWrite.AppFolder` › **Ajouter**.
   - C'est la permission la plus restreinte : MyWealth n'accède qu'à son dossier `Applications/MyWealth`, pas au reste de votre OneDrive.
8. Ne créez **pas** de « secret client » : il est inutile ici.

---

## 6. Coller l'identifiant dans `config.js` (1 min)

1. Sur GitHub, dans votre dépôt, cliquez sur le fichier **config.js**, puis sur l'icône **crayon** (Edit).
2. Collez votre identifiant entre les guillemets :
   - **Dropbox** : `DROPBOX_APP_KEY: "abcd1234efgh567",`
   - **OneDrive** : `ONEDRIVE_CLIENT_ID: "11111111-2222-3333-4444-555555555555"`
3. Cliquez sur **Commit changes** (deux fois). Attendez environ 1 minute que GitHub Pages se mette à jour.

> Ces identifiants **ne sont pas secrets** : ils peuvent rester dans un dépôt public. Ils ne permettent rien sans votre propre connexion.

## 7. Première synchronisation (sur l'ordinateur)

1. Ouvrez `https://VOTRE-NOM.github.io/mywealth/` dans Chrome, Edge, Safari ou Firefox.
2. Cliquez sur **Se connecter à Dropbox** (ou **Se connecter avec Microsoft**) et acceptez l'accès.
3. **Reprendre les données de la version ordinateur** (`patrimoine.html`), si vous l'avez déjà utilisée :
   - dans `patrimoine.html`, cliquez sur **Exporter**, ou repérez votre fichier `mywealth-donnees.json` / `patrimoine-donnees.json` ;
   - dans MyWealth en ligne : **Réglages › Importer (JSON)** › choisissez ce fichier › confirmez.
   - Autre possibilité : déposez ce fichier dans le dossier de l'application de votre cloud (Dropbox : `Applications/MyWealth-Baptiste` ; OneDrive : `Applications/MyWealth`) **avant** la première connexion. MyWealth le reprendra tout seul.
4. Le voyant en haut doit afficher **« Synchronisé avec Dropbox à HH:MM »**.

## 8. Installer sur le téléphone

**iPhone (Safari obligatoire)**
1. Ouvrez votre adresse dans **Safari**.
2. Touchez le bouton **Partager** (carré avec une flèche vers le haut).
3. Faites défiler et touchez **Sur l'écran d'accueil**, puis **Ajouter**. L'icône **MW** apparaît.
4. **Ouvrez MyWealth depuis cette icône**, puis connectez-vous au cloud **dans l'application installée**. Sur iPhone, l'app installée et Safari ne partagent pas leurs données.

**Android (Chrome)**
1. Ouvrez votre adresse dans **Chrome**.
2. Menu **⋮** › **Installer l'application** (ou **Ajouter à l'écran d'accueil**) › **Installer**.
3. Ouvrez MyWealth depuis l'icône et connectez-vous au cloud.

Après connexion, vos données apparaissent sur le téléphone.

---

## Utilisation au quotidien

- **Modifiez** un solde : il est enregistré sur l'appareil, puis envoyé au cloud environ 2 secondes plus tard.
- **Hors ligne** (avion, montagne) : l'application s'ouvre et fonctionne quand même. Les modifications partent dès le retour du réseau.
- **Conflit** : si vous avez modifié les données sur deux appareils sans synchroniser, MyWealth affiche les deux versions (date et total) et vous laisse **choisir celle à garder**.
- **Copies de sécurité** : en plus du fichier principal, une copie par mois (`mywealth-donnees-AAAA-MM.json`) est gardée dans le même dossier du cloud. Un **Export** de temps en temps reste une bonne idée.
- **Instantanés** : en fin de mois, touchez **Enregistrer un instantané** pour suivre votre évolution.
- **Mettre à jour l'application** : remplacez les fichiers sur GitHub (Add file › Upload files). Vos données ne sont pas touchées, car elles ne sont pas sur GitHub.

## En cas de problème

| Symptôme | Solution |
|---|---|
| « redirect_uri mismatch » / « invalid redirect » | L'adresse enregistrée chez Dropbox ou Microsoft doit être **identique** : Dropbox `https://…github.io/mywealth/` (avec `/`), Microsoft `…/mywealth/redirect.html`. |
| Bandeau « Reconnectez-vous » | Touchez **Se reconnecter**. C'est normal de temps en temps, surtout avec OneDrive sur iPhone. |
| Le bouton « Se connecter » n'apparaît pas | `config.js` n'est pas rempli ou pas encore publié : attendez 1 à 2 minutes et rechargez la page. |
| Dropbox refuse (permissions) | Vérifiez l'étape 5A-6 (cases cochées puis **Submit**), puis reconnectez-vous. |
| Erreur « version plus récente » | Le fichier du cloud vient d'une version plus récente de MyWealth : remettez les derniers fichiers sur GitHub. |

## Annexe A : confidentialité

- Le dépôt GitHub contient **uniquement le code** : aucune donnée personnelle, aucun montant. Ne déposez jamais d'export JSON dans le dépôt.
- L'application ne contacte que :
  - votre cloud (Dropbox ou Microsoft) ;
  - TradingView, pour le cours de l'action (aucune donnée personnelle envoyée) ;
  - Frankfurter (BCE) ou ExchangeRate-API, pour les taux de change.
- Pas d'analytics, pas de cookies publicitaires.
- Pour retirer l'accès à tout moment :
  - Dropbox : **Paramètres › Applications connectées** ;
  - Microsoft : **account.microsoft.com › Confidentialité › Applications et services**.

## Annexe B : Cloudflare Pages (alternative, dépôt privé possible)

1. Créez un compte gratuit sur **https://dash.cloudflare.com/sign-up**.
2. Allez dans **Workers & Pages › Create › Pages**.
   - Soit **Connect to Git**, pour choisir votre dépôt GitHub (il peut être privé) ;
   - soit **Upload assets**, pour glisser directement le contenu du dossier `MyWealth`.
3. Il n'y a ni commande de build ni dossier de sortie à indiquer.
4. Votre adresse sera du type `https://mywealth-xxx.pages.dev/`. Utilisez **cette** adresse aux étapes 5A-7 et 5B-5.
