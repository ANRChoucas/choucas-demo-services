var map;
//var myLatLng = [43.300000, -0.366667]; // carte centrée sur Pau
//var myLatLng = [45.033996464314285, 6.02084274443297]; // carte centrée sur Villard-Reymond (zone fil rouge)
var myLatLng = [45.186585, 5.736232]; // carte centrée sur Grenoble
var scale = 8;
//var testText = "Monter au cirque de Gavarnie en passant par Luz-Saint-Sauveur.";
var testText = "On se trouve dans une combe qui monte au col de Bellefont. Au-dessus de Perquelin il y a la Cabane de Bellefont. On se situe 50 m au dessus.";
//var wpsServer = "http://192.168.208.1:8080/wps/";
var wpsServer = "http://choucas.univ-pau.fr:8080/wps/";
var api_key = "demo";
var url = "";
var topoUrl = "about:blank";
var textUrl = "about:blank";

function sendTextF(test)
{
	console.log("sendText in");
	inputText = document.getElementById("inputText");
	if (test)
		inputText.value = testText;
	inputText.disabled = true;
	sendText = document.getElementById("sendText");
	sendText.disabled = true;
	testMe = document.getElementById("testMe");
	testMe.disabled = true;
	executeChain();
	outputJson = document.getElementById("outputJson");
	outputString = outputJson.value;
	console.log(outputString);
	if (outputString != "") {
		Json = JSON.parse(outputString);
		updateMap(Json);
		outputJson.innerHTML = JSON.stringify(Json,null, 4);
	}
	inputText.disabled = false;
	sendText.disabled = false;
	testMe.disabled = false;
	console.log("sendText out");
}

function executeChain()
{
	var request = new XMLHttpRequest();	
	var outputToponyms, outputTaggedText
	outputToponyms = '{}'
	
	outputTaggedText = '<?xml version="1.0" encoding="UTF-8"?><tei>  <teiHeader>    <fileDesc>      <titleStmt>        <title>          <!-- title of the resource -->        </title>      </titleStmt>      <publicationStmt>        <p>          <!-- Information about distribution of the resource -->        </p>      </publicationStmt>      <sourceDesc>        <p>          <!-- Information about source from which the resource derives -->        </p>      </sourceDesc>    </fileDesc>  </teiHeader>  <text>    <body>      <p>        <s>          <w lemma="probable" type="A" xml:id="w1">Probable</w>          <w lemma="erreur" type="N" xml:id="w2">erreur</w>          <w lemma="analyser" type="V" xml:id="w3">analyse</w>          <w type="PUN" lemma="" xml:id="w4">,</w>          <w lemma="je" type="PRO" subtype="PpvIL" xml:id="w5">je</w>          <w lemma="etre|suivre" type="V" xml:id="w6">suis</w>          <w lemma="perdre" type="V" xml:id="w7">perdu</w>          <w lemma="!" type="SEN" xml:id="w8">!</w>        </s>      </p>    </body>  </text></tei>';
		
	console.log("executeChain in ");
	inputText = document.getElementById("inputText");
	console.log(inputText.value);
	var request = new XMLHttpRequest();
	// Corps de la requête wps Execute (XML)
	var requestBody = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\r\n<wps:Execute service=\"WPS\" version=\"1.0.0\"\r\n  xmlns:wps=\"http://www.opengis.net/wps/1.0.0\" xmlns:ows=\"http://www.opengis.net/ows/1.1\"\r\n  xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\r\n  xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd\">\r\n  <ows:Identifier>choucas.choucas.algorithm.TextToGeoJsonChain</ows:Identifier>\r\n  <wps:DataInputs>\r\n    <wps:Input> <ows:Identifier>url</ows:Identifier> <wps:Data> <wps:LiteralData dataType='xs:string'></wps:LiteralData> </wps:Data> </wps:Input>\r\n<wps:Input>\r\n      <ows:Identifier>api_key</ows:Identifier>\r\n      <wps:Data>\r\n        <wps:LiteralData dataType=\"xs:string\">"+api_key+"</wps:LiteralData>\r\n      </wps:Data>\r\n    </wps:Input>\r\n    <wps:Input>\r\n      <ows:Identifier>lang</ows:Identifier>\r\n      <wps:Data>\r\n        <wps:LiteralData dataType=\"xs:string\">French</wps:LiteralData>\r\n      </wps:Data>\r\n    </wps:Input>\r\n    <wps:Input>\r\n      <ows:Identifier>textInput</ows:Identifier>\r\n      <wps:Data>\r\n        <wps:LiteralData dataType=\"xs:string\">"+inputText.value+"</wps:LiteralData>\r\n      </wps:Data>\r\n    </wps:Input>\r\n  </wps:DataInputs>\r\n    <wps:ResponseForm>\r\n    <wps:ResponseDocument storeExecuteResponse=\"false\"\r\n      lineage=\"false\" status=\"false\">\r\n      <wps:Output asReference=\"false\" encoding=\"UTF-8\">\r\n        <ows:Identifier>taggedText</ows:Identifier>\r\n      </wps:Output>\r\n      <wps:Output asReference=\"false\" encoding=\"UTF-8\">\r\n        <ows:Identifier>topoList</ows:Identifier>\r\n      </wps:Output>\r\n            <wps:Output asReference=\"false\" encoding=\"UTF-8\">\r\n        <ows:Identifier>textUrl</ows:Identifier>\r\n      </wps:Output>\r\n            <wps:Output asReference=\"false\" encoding=\"UTF-8\">\r\n        <ows:Identifier>topoUrl</ows:Identifier>\r\n      </wps:Output>\r\n    </wps:ResponseDocument>\r\n  </wps:ResponseForm>\r\n</wps:Execute>";
	
	var request = new XMLHttpRequest();
	request.open('POST', wpsServer+"WebProcessingService", false);
	request.setRequestHeader("Content-Type", "application/xml;charset='UTF-8'");
	request.onload = function () {
	if (request.status >= 200 && request.status < 400) {
		var parser, outputs, xmlData;
		parser = new DOMParser();
		xmlData = parser.parseFromString(this.response, "text/xml");
		// TODO vérifier la structure du doc XML

		outputs = xmlData.getElementsByTagName("wps:Output");
		for (i = 0; i < outputs.length; i++) { 
			if (outputs[i].childNodes[1].firstChild.nodeValue == "topoList") {
				outputToponyms = outputs[i].getElementsByTagName("wps:LiteralData")[0].childNodes[0].nodeValue;
				}
			if (outputs[i].childNodes[1].firstChild.nodeValue == "taggedText") {
				outputTaggedText = outputs[i].getElementsByTagName("wps:ComplexData")[0].childNodes[1].innerHTML;
				}
			if (outputs[i].childNodes[1].firstChild.nodeValue == "textUrl") {
				textUrl = outputs[i].getElementsByTagName("wps:LiteralData")[0].childNodes[0].nodeValue;
				}
			if (outputs[i].childNodes[1].firstChild.nodeValue == "topoUrl") {
				topoUrl = outputs[i].getElementsByTagName("wps:LiteralData")[0].childNodes[0].nodeValue;
				}
		}
	}
	else 
		{
			console.log("erreur lors de la requête : " + request.status);
		}
	};
	request.send(requestBody);
	outputJson = document.getElementById("outputJson");
	outputJson.value = outputToponyms;
	linkJson = document.getElementById("linkJson");
	linkJson.href = topoUrl;
	linkJson.style.visibility="visible";
	outputTxt = document.getElementById("outputTxt");
	outputTxt.innerHTML = outputTaggedText;
	outputXml = document.getElementById("outputXml");
	//outputXml.textContent = outputTaggedText;
	document.getElementById('ifOutXml').contentWindow.location.replace(textUrl);
	console.log("executeChain out ");
}

function setupText()
{
	let textContent = "";
	document.getElementById("inputText").value = textContent;
	textFile = document.getElementById("textFile");
	textFile.reset();
}
 
/**
  * from : https://www.zonecss.fr/cours-css-javascript/acceder-aux-css-en-javascript.html
  * @param sIdObj     valeur de l'attribut id ou un objet HTMLElement
  * @param styleProp  nom de la propriété format Csss
  * @return String|undefined la valeur de la propriété css si trouvée
  */
function getvalueCSS( sIdObj, styleProp ){ 
  var sResult = undefined, oEle = typeof(sIdObj) == "object"? sIdObj : document.getElementById(sIdObj), oCss = null; 
  if ( window.getComputedStyle ) {
    if ( oEle.ownerDocument.defaultView.opener ) {
      oCss = oEle.ownerDocument.defaultView.getComputedStyle( oEle, null );
    }else{
      oCss = window.getComputedStyle( oEle, null );
    }
    sResult =  oCss.getPropertyValue(styleProp); 
  } else if ( document.documentElement.currentStyle ) {
    oCss = oEle.currentStyle;
    if(typeof oCss.getPropertyValue !='undefined'){
      sResult = oCss.getPropertyValue(styleProp);
    }else{
      sResult = oCss[styleProp];
    }  
  }
  return sResult; 
}	
	
function setupJson()
{
	resultHeight = getvalueCSS("result","height");
	resultWidth = getvalueCSS("result","width");
	outputJson = document.getElementById("outputJson");
	outputJson.setAttribute("height", resultHeight);
	outputJson.setAttribute("width", resultWidth);
}

function setupXml()
{
	resultHeight = getvalueCSS("result","height");
	resultWidth = getvalueCSS("result","width");
	document.getElementById("outputTxt").height = resultHeight;
	outputXml = document.getElementById("outputXml");
	outputXml.setAttribute("height", resultHeight);
	outputXml.setAttribute("width", resultWidth);
	ifOutXml = document.getElementById("ifOutXml");
	ifOutXml.setAttribute("height", resultHeight);
	ifOutXml.setAttribute("width", resultWidth);
}

function setupMap()
{
		console.log("setupMap in");	
		// Initialisation de la carte, vue centrée sur coordonnées choisies et niveau de zoom
		map = L.map('map').setView(myLatLng, scale);

		// ajout d'une couche fond de carte
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		console.log("setupMap out");
}

function clearMap()
{
	console.log("clearMap in"); 
	// Suppression des couches de la carte
	map.eachLayer((layer) => {
  layer.remove();
	});
	// réinitialisation de la carte
	map.setView(myLatLng, scale);
	// ajout d'une couche fond de carte
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	console.log("clearMap out"); 	
}

/* function updateMap(geoJsonLayer)
// Affichage du point par défaut
{
	console.log("updateMap in"); 
	if (geoJsonLayer != "")
		L.geoJson(geoJsonLayer).addTo(map);
	console.log("updateMap out"); 
}	 */

function updateMap(geoJsonLayer)
// affichage du nom du point au passage souris.
// https://gis.stackexchange.com/questions/245621/how-to-label-geojson-points-in-leaflet
{
	var pointLayer = L.geoJSON(null, {
		pointToLayer: function(feature,latlng){
			label = String(feature.properties.name) // Must convert to string, .bindTooltip can't use straight 'feature.properties.attribute'
			return new L.Marker(latlng, {
				radius : 1,
			}).bindTooltip(label, {permanent: false, opacity: 0.7}).openTooltip();
		}
	});
	pointLayer.addData(geoJsonLayer);
	map.addLayer(pointLayer);
}

function clearAll() 
{
	console.log("clearAll in"); 
	// Suppression des couches de la carte
	clearMap();
	// Initialisation des zones de texte
	inputText = document.getElementById("inputText");
	inputText.value = "";
	ouputJson = document.getElementById("outputJson");
	outputJson.value = "";
	outputJson.innerHTML = "";
	linkJson = document.getElementById("linkJson");
	linkJson.href = "about:blank";
	linkJson.style.visibility="hidden";
	ouputTxt = document.getElementById("outputTxt");
	outputTxt.value = "";
	outputTxt.innerHTML = "";
	ouputXml = document.getElementById("outputXml");
	outputXml.value = "";
	outputXml.innerHTML = "";
	topoUrl = "about:blank";
	textUrl = "about:blank";
	document.getElementById('ifOutXml').contentWindow.location.replace("about:blank");
	// Initialisation des fichier Txt et geoJson
	textFile = document.getElementById("textFile");
	textFile.reset();
	geoFile = document.getElementById("geoFile");
	geoFile.reset();
	// Sélection Onglet texte annoté
	showRes('Txt');
	console.log("clearAll out"); 
}

function seeJson() 
{
	// ouvre une fenetre sans barre d'etat, ni d'ascenceur
	alert(topoUrl);
	w=open("topoUrl",'', 'toolbar=no,scrollbars=no,resizable=yes');	
	w.document.write("<title>Liste des toponymes localisés</title>");
	w.document.write("<body><a href="+topoUrl+">"+topoUrl+"</a></body>");
	w.document.close();
	w.focus();
}
	
function loadFile(file, type) 
{
	var fr = new FileReader();
    fr.onload = function(e) {
		if (type == "geoJson") {
		showGeoDataFile(e);
		}
		if (type == "txt") {
		showTxtDataFile(e);
		}
		};			
	fr.readAsText(file);
	console.log(file);
}
	
function showGeoDataFile(e) 
{
    jsonData = JSON.parse(e.target.result);
	console.log(e.target.result);
	L.geoJson(jsonData).addTo(map);
}

function showTxtDataFile(e) 
{
	inputText = document.getElementById("inputText");
	inputText.value = e.target.result;
}
				
function ShowLocalDataFile(path) 
{
	$.getJSON(path, function(data) {
    console.log('data',data);
	L.geoJson(data).addTo(map);
});
 }
 
function showRes(mode)
{
	console.log("showRes in");
	document.getElementById("map").style.display = "none";
	document.getElementById("geoFile").style.visibility = "hidden";
	document.getElementById("resJson").style.display = "none";
	document.getElementById("resTxt").style.display = "none";
	document.getElementById("resXml").style.display = "none";	
	showMap = document.getElementById("showMap");
	showMap.checked = false;
	showMap.disable = false;
	showJson = document.getElementById("showJson");
	showJson.checked = false;
	showJson.disable = false;
	showTxt = document.getElementById("showTxt");
	showTxt.checked = false;
	showTxt.disable = false;
	showXml = document.getElementById("showXml");
	showXml.checked = false;
	showXml.disable = false;		

	if (mode == 'Map') {		
		document.getElementById("map").style.display = "block";
		document.getElementById("geoFile").style.visibility = "visible";	
		showMap = document.getElementById("showMap");
		showMap.checked = true;
		showMap.disable = true;		
	}
	else { 
		if (mode == 'Json') {
		document.getElementById("resJson").style.display = "block";
		showJson = document.getElementById("showJson");
		showJson.checked = true;		
		showJson.disable = true;
		}
		else {
			if (mode == 'Txt') {
				document.getElementById("resTxt").style.display = "block";	
				showTxt = document.getElementById("showTxt");
				showTxt.checked = true;
				showTxt.disable = true;				
			}
			else {
				document.getElementById("resXml").style.display = "block";	
				showXml = document.getElementById("showXml");
				showXml.checked = true;
				showXml.disable = true;				
			}
		}
	}
		
	console.log("showRes out"); 
}

function setApiKey()
{
	api_key = prompt("L'accès à certains services nécessite une clé d'API. Vous pouvez saisir ci-dessous votre clé personnelle ou utiliser la clé par défaut 'demo'. Pour obtenir une clé personnelle, voir http://erig.univ-pau.fr/PERDIDO/ .", api_key);
}
 
function setup()
{	
	setupMap();
	setupJson();
	setupText();
	setupXml();
	showRes('Txt');
	setApiKey();
	console.log("setup done !");
}

window.onload = setup;