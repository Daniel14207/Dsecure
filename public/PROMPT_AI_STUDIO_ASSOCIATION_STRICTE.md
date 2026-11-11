D SECURE — INSTRUCTIONS STRICTES D’ASSOCIATION DES PHOTOGRAPHIES ORIGINALES

OBJECTIF UNIQUE
Associer les photographies originales extraites des classeurs Excel aux fiches produits exactes du catalogue existant. Il s’agit d’un travail de données et d’affichage des images uniquement.

RÈGLES NON NÉGOCIABLES
1. NE MODIFIE PAS l’interface, le design, les couleurs, la navigation, les catégories, les prix, les références, les descriptions, le panier, le checkout, WhatsApp, les filtres ou les fonctionnalités existantes.
2. NE GÉNÈRE JAMAIS d’image avec IA, SVG, illustration, mockup, image de remplacement ou image de stock. Utilise exclusivement les fichiers image réels fournis dans images/.
3. Lis intégralement D_SECURE_IMAGE_MAPPING.xlsx et D_SECURE_IMAGE_MAPPING.csv. La référence exacte est la clé principale. Ne fais pas de rapprochement approximatif sur le seul nom de catégorie.
4. Pour chaque produit, recherche sa référence exacte dans la colonne « Référence exacte (Excel) ». Associe uniquement le fichier inscrit sur la même ligne et dont le statut est IMAGE_INTEGRATED_IN_EXCEL_ROW.
5. Respecte exactement les chemins relatifs et les noms de fichiers. Les images sont classées par dossier (CAMERAS_IP, CAMERAS_ANALOGIQUES, CAMERAS_PTZ, CAMERAS_SOLAIRES_4G, ALARMES_SANS_FIL, ALARMES_FILAIRES, DVR, NVR, KITS_SURVEILLANCE, ACCESSOIRES, SWITCH_POE, ROUTEURS_WIFI, DISQUES_DURS, MONITEURS, TRANSMISSION_ALIMENTATION, BAIES_RACK).
6. UNE photo ne doit pas être réutilisée pour un autre produit. Vérifie les SHA-256 : si deux lignes ont le même hash, ne publie pas les deux associations sans inspection visuelle et validation.
7. N’invente aucune association. Les lignes de l’onglet A_CONTROLER, les références À_IDENTIFIER et les produits sans image doivent rester en attente jusqu’à validation. Ne leur attribue jamais une photo voisine ou générique.
8. Vérifie les chemins depuis la racine réelle du projet. Corrige uniquement les chemins d’assets nécessaires pour afficher les fichiers fournis, sans déplacer ni supprimer les originaux.
9. Dans ProductCard, ProductDetailModal et tout composant catalogue, affiche l’image associée au produit courant. Réinitialise correctement l’état de l’image quand le produit ou le filtre change. Ajoute un fallback neutre uniquement lorsqu’aucune association validée n’existe.
10. Ne duplique pas une image à travers plusieurs cartes à cause d’un index, d’un état React réutilisé, d’une clé non unique ou d’un mapping par position. Utilise une clé stable basée sur la référence produit.

PROCÉDURE OBLIGATOIRE
A. Inspecte le schéma réel du catalogue et le contenu de productImageMap.ts / products.json / products.ts.
B. Compare chaque référence produit à la colonne « Référence exacte (Excel) » sans supprimer les caractères significatifs (/, -, parenthèses, suffixes). Tu peux normaliser les espaces et la casse pour la recherche, mais conserve la référence originale dans les données.
C. Construis ou corrige un mapping déterministe reference -> imagePath.
D. Vérifie que chaque fichier référencé existe réellement. Vérifie les extensions et la casse du chemin.
E. Contrôle visuellement chaque association disponible à l’aide des miniatures dans le classeur. En cas de doute, classe-la dans les éléments à vérifier et ne l’affiche pas comme validée.
F. Teste les pages CAMERAS, ALARMES, ACCESSOIRES, DVR et NVR, puis les détails produit. Confirme qu’aucune photo n’est répétée par erreur.
G. Ne touche à aucun autre aspect du site.

LIVRABLE ATTENDU
Fournis un rapport indiquant : nombre total de produits, nombre de photos réellement affichées, références associées, références sans photo, associations ambiguës, chemins cassés et doublons SHA-256. Ne déclare pas 100 % de réussite sans avoir vérifié les résultats dans le navigateur.

PRIORITÉ ABSOLUE : afficher la vraie photo du bon matériel à côté de sa référence exacte, sans créer d’image et sans modifier l’interface.
