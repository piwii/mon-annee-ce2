import json,pathlib,subprocess
root=pathlib.Path(__file__).resolve().parent.parent
raw=json.loads((root/'data/ocr.json').read_text())
titles='''Sommaire · Français
La phrase · Ligne et phrase
Les types de phrases
La phrase interrogative
Les formes de phrases
Le verbe
Le sujet du verbe
Le nom
Le déterminant · Les articles
Les déterminants possessifs et démonstratifs
Le pronom personnel · L’adjectif
Le groupe nominal · Le genre et le nombre
L’adverbe · Les prépositions
Le complément du nom · Les constituants de la phrase
Le complément d’objet
Le complément circonstanciel · Les conjonctions de coordination
L’attribut du sujet
Les natures de mots
Les fonctions dans la phrase
L’infinitif et le verbe conjugué
Le présent : 1er et 2e groupes
Être et avoir au présent
Les verbes irréguliers au présent
Le futur : 1er et 2e groupes · Être et avoir
Les verbes irréguliers au futur
L’imparfait : 1er et 2e groupes · Être et avoir
Les verbes irréguliers à l’imparfait
Temps simple et composé · Le passé composé
Le passé composé : 3e groupe · Avoir et être
L’alphabet · L’ordre alphabétique
Les familles de mots · Les synonymes
Les antonymes · Les mots génériques
Le dictionnaire
L’article de dictionnaire · Comprendre un mot
Sens propre et figuré · Le champ lexical
Les préfixes · Les suffixes
Les registres de langue
La lettre finale muette · Les accents
La lettre S · La lettre C
La lettre G · M devant M, B, P
Le son -ill · É ou ER ?
L’accord du pluriel
Le féminin des noms et des adjectifs
Les homophones grammaticaux
Sommaire · Mathématiques
Centaines, dizaines, unités · Décomposer un nombre
Les nombres en lettres · Pair ou impair
Comparer et ranger des nombres
Encadrer des nombres
Le nombre 1 000 · Chiffre et nombre
Le tableau de numération · Les fractions
Les fractions supérieures à 1 · Comparer les fractions
Les tables d’addition
Les doubles et les moitiés
Les compléments à 10 et à 100
L’addition posée
Calculer un complément · Soustraire deux nombres
La soustraction posée
Les tables de 2 et de 5
Les tables de 4 et de 3
Les tables de 9 et de 6
Les tables de 7 et de 8
Toutes les tables de multiplication
Multiplier par 10, 100 ou 1 000
La multiplication en ligne · Doubles et moitiés
La multiplication posée
La division
La division posée
Tracer avec une règle · Droite et segment
Le milieu d’un segment · Les points alignés
Se repérer sur un quadrillage
Se déplacer · Reproduire sur un quadrillage
Les polygones · Les quadrilatères
L’angle droit
Le triangle · La symétrie
Tracer le symétrique · Le cercle
Les solides
Mesurer une longueur · La monnaie
Rendre la monnaie
Lire l’heure · Les durées
Les mesures de longueur
Les mesures de masse
Les mesures de contenance · Le périmètre
Trouver l’opération pour résoudre un problème'''.splitlines()
assert len(titles)==len(raw)==84
pages=[]
for i,(item,title) in enumerate(zip(raw,titles)):
 n=i+219
 cat='Sommaires' if n in [219,263] else next(c for end,c in [(237,'Grammaire'),(247,'Conjugaison'),(255,'Vocabulaire'),(262,'Orthographe'),(270,'Numération'),(286,'Calcul'),(295,'Géométrie'),(301,'Mesures'),(302,'Problèmes')] if n<=end)
 pages.append(dict(id=n,file=item['file'],title=title,category=cat,lines=item['lines']))
(root/'dist/pages.js').write_text('window.PAGES = '+json.dumps(pages,ensure_ascii=False)+';\n')
(root/'dist/thumbs').mkdir(exist_ok=True)
for p in pages:
 target=root/'dist/thumbs'/p['file']
 if not target.exists():
  subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','65','-Z','450',str(root/'dist/photos'/p['file']),'--out',str(target)],check=True,stdout=subprocess.DEVNULL)
print('84 photos et textes préparés.')
