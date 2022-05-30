# Au démarrage :

Afficher la page avec  résultat de la requête

sélectionner la chaine de service

Si le dernier service est sélectionné, activer case à cocher "carte"

# Objets de l'interface :

cases à cocher services : `s1, s2, s3, s4`

zone de saisie du texte : `inputText`

bouton envoi : `sendText`

bouton test : `testMe`

bouton init. : `clearAll`

zone carte : `map`

zone affichage résultat : `result`

zone affichage résultat textuel : `resText`

zone résultat textuel : `outputText`

zone saisie fichier geojson : `geoFile`

 case à cocher Carte : `showMap`

case à cocher texte : `showText`

# Fonctions js :

invoquer la chaîne de services avec un prédéfini : `testMeF()`

invoquer la chaîne de services avec le texte saisi : `sendTextF()` 

initialiser les différents champs (sans recharger la page) : `clearAll()`

charger un fichier sélectionné via l'explorateur et le convertir en objet JSON : `loadFile(file)`

initialiser la carte : `setupMap()`

effacer les couches ajoutées sur la carte : `clearMap()`

initialiser l'application: `setup()`

invoquer la chaine : `executeChain()`

ajouter une couche geoJson à la carte : updateMap(geoJsonLayer)





