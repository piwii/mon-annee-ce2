# Mon année de CE2 — livre mobile

Lecteur statique en français, prêt à héberger sur GitHub Pages. Les 84 photographies sont incluses, avec des miniatures légères et un texte reconnu automatiquement pour la recherche.

## Ouvrir le livre

Site en ligne : https://piwii.github.io/mon-annee-ce2/

Dépôt GitHub : https://github.com/piwii/mon-annee-ce2

Ouvrir `dist/index.html` dans un navigateur, ou lancer depuis ce dossier :

```sh
python3 -m http.server 8765 --directory dist
```

Puis ouvrir http://localhost:8765.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub, par exemple `mon-annee-ce2`, avec une branche `main`.
2. Y déposer le contenu de ce projet, en conservant notamment `dist/` et `.github/workflows/pages.yml`. Ne pas déposer les originaux HEIC : les JPEG nécessaires sont déjà dans `dist/photos/`.
3. Dans **Settings → Pages → Build and deployment → Source**, choisir **GitHub Actions**.
4. Dans **Actions**, lancer **Publier le livre sur GitHub Pages → Run workflow**, ou pousser une modification sur `main`.
5. Une fois le déploiement terminé, le lien apparaît dans **Settings → Pages**. Il sera généralement `https://VOTRE-COMPTE.github.io/mon-annee-ce2/`.

L’archive de livraison contient le projet : la décompresser avant d’envoyer les fichiers. Le fichier ZIP seul ne constitue pas un site GitHub Pages. Le dossier `.github` peut être masqué par le Finder.

## Fonctions

- Navigation adaptée au téléphone, à la tablette et à l’ordinateur.
- Classement en grammaire, conjugaison, vocabulaire, orthographe, numération, calcul, géométrie, mesures et problèmes.
- Recherche dans les titres et dans le texte reconnu, insensible aux accents.
- Vue photo, agrandissement jusqu’à 300 %, zoom tactile natif du navigateur.
- Favoris et dernière lecture enregistrés uniquement dans ce navigateur.
- Navigation précédente/suivante, sélection directe d’une photo, touches fléchées.
- Liens directs vers une photo, par exemple `#photo-0222` (identifiant numérique accepté) ou `#photo-222`.

## Contenu et limites

Les photos conservent leur ordre de prise de vue. Les numéros affichés désignent les photos, pas la pagination imprimée. Une photo peut contenir plusieurs leçons. Toutes les photos fournies sont présentes ; aucune page absente des photographies n’a été reconstituée.

Les leçons se consultent en photo, avec un onglet Exercice. La transcription automatique n’est plus affichée ; le texte reconnu sert uniquement à la recherche. Les QR codes et liens imprimés sont conservés dans les photos et ne sont pas transformés en activités.

## Organisation

- `dist/` : le site complet à publier, sans installation ni compilation.
- `dist/photos/` : 84 JPEG, dimension maximale de 2 400 pixels.
- `dist/thumbs/` : miniatures, dimension maximale de 450 pixels.
- `dist/pages.js` : titres, matières et textes.
- `data/ocr.json` : sortie de reconnaissance originale.
- `scripts/prepare.py` : régénération des données et miniatures sur macOS (Python et sips).
- `scripts/recognize.swift` : reconnaissance Apple Vision, en français.

Pour régénérer les textes sur macOS :

```sh
swift scripts/recognize.swift dist/photos/*.jpg > data/ocr.json
python3 scripts/prepare.py
```

Aucun service externe, police distante, suivi analytique ou compte utilisateur n’est requis par le lecteur. Le dossier `dist/` est le seul contenu publié par le workflow. Le site est publié sur GitHub Pages ; chaque envoi sur la branche `main` déclenche son déploiement.

Documentation officielle : [Configurer GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Traitement des 84 photos — 11 septembre 2026

Les images du site et les miniatures ont été remplacées par des versions recadrées, redressées et éclaircies, obtenues sans IA générative. Le traitement remappe les pixels existants : détection des bords du papier, compensation verticale de la courbure, ajustement des bandeaux et correction locale de l’éclairage. Les couleurs restent présentes.

Les originaux HEIC restent à la racine du projet local. Les JPEG avant traitement sont sauvegardés dans `data/original-photos/` (hors publication et hors archive). Les doigts empiétant sur le papier, certains petits bords de reliure et certaines courbures résiduelles restent visibles : les détails cachés ou absents de la prise de vue ne sont pas reconstruits. Les QR codes n’ont pas été redessinés ; leur lecture n’est pas garantie pour toutes les prises de vue.

Les 84 résultats ont été inspectés en planches, avec contrôle détaillé de pages représentatives. Les 84 images et miniatures sont décodables et les originaux sont conservés.

Pour reproduire le traitement avec Python, OpenCV, NumPy, SciPy et Pillow installés :

```sh
python scripts/scan.py
python scripts/flatten_bands.py
```

Ces scripts écrivent dans `output/scans/`. Exécuter les deux dans cet ordre pour repartir des JPEG d’origine ; ne pas appliquer le second plusieurs fois au même résultat. Les rapports de cadrage sont dans `data/scan-report.json` et `data/scan-bands.json`.

Les deux sommaires (français et mathématiques) disposent d’une section dédiée. Les 82 pages de leçons sont affichées et parcourues séparément ; la navigation du lecteur reste dans le groupe ouvert.

## Exercices de compréhension

Chaque page de leçons dispose d’un mini-exercice original de 2 ou 3 questions, soit **82 exercices et 170 questions**. Les deux sommaires n’ont pas d’exercice. Les questions couvrent le français et les mathématiques ; leurs corrigés sont rédigés indépendamment de la transcription OCR.

Dans la bibliothèque, toucher « Exercice » sous une leçon ; dans le lecteur, choisir l’onglet « Exercice ». Choisir une réponse, puis « Vérifier ma réponse ». Une explication suit chaque réponse. Le bilan final affiche le score et les réponses à revoir. « Réessayer » recommence l’exercice. Une réussite signifie que toutes les questions de cet exercice sont correctes ; ce court entraînement ne constitue pas une évaluation exhaustive de la leçon.

La tentative est conservée pendant la visite, y compris lorsqu’on revient à la photo ou change de leçon. Les scores et réponses ne sont pas enregistrés après un rechargement de page ; ils ne sont ni envoyés à un serveur ni associés à un compte.

Les questions se modifient dans `data/questions.tsv` (colonnes séparées par des tabulations : identifiant de photo, question, bonne réponse, deux distracteurs, explication). Exécuter `python3 scripts/prepare_quizzes.py` pour régénérer `dist/quizzes.js`. Le moteur est dans `dist/quiz.js`.

Vérifications : couverture des 82 pages, validité des 170 questions et des choix, syntaxe JavaScript, parcours réel dans le navigateur (réponse manquante, erreur et explication, retour à la photo, bilan 1/2, nouvelle tentative 2/2, problème de mathématiques), affichage mobile à 390 × 844 et absence d’exercice dans les sommaires.

## Évaluations

La section « Évaluations » de l’accueil propose une première évaluation de grammaire sur G1 (La phrase), G2 (Ligne et phrase) et G3 (Les types de phrases). Elle comporte 10 questions à choix unique, à 1 point chacune. Toutes les réponses sont obligatoires et restent modifiables avant validation. La note sur 10 et le corrigé détaillé apparaissent à la fin. Les questions sont dans `dist/evaluations.js`.

Fermer puis rouvrir l’évaluation conserve les réponses pendant la visite. Le résultat reste visible sur l’accueil ; le bouton « Recommencer l’évaluation » permet une nouvelle tentative. Les réponses et la note ne sont pas conservées après rechargement et ne sont pas envoyées à un serveur.

Chaque évaluation possède un lien direct partageable. Pour G1–G3 : `#evaluation-grammaire-g1-g2-g3`, à ajouter à l’adresse du site. Le lien ouvre automatiquement l’évaluation, y compris après rechargement.
