D SECURE — Catalogue préparatoire
=================================

Fichiers:
- products.json : catalogue structuré, avec toutes les colonnes source conservées dans source_fields.
- products.csv : version tabulaire simplifiée.
- a_verifier.csv : lignes à contrôler avant publication.
- images/ : images intégrées extraites des deux classeurs Excel.

Règle de prix:
selling_price_ar = original_price_ar × 2, calculé uniquement si le prix source est numérique.
Les prix originaux sont conservés et ne sont jamais écrasés.

IMPORTANT:
Cette extraction est une première préparation automatique. Les images Excel sont extraites avec leur position de ligne,
mais l'association image-produit doit être vérifiée visuellement avant publication. Les lignes sans prix restent sans prix
de vente. Le fichier Alarmes filaires contient une colonne intitulée "Sub-D Price 2023 Q2" : confirmer que ces tarifs sont
toujours valides. Aucun produit, prix ou détail manquant n'a été inventé.
