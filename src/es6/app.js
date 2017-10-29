
var actuales = [],
    siguienteHora = [],
	CLIENT_ID = '274125328383-lem62po56ehptmnu98dgts88bnt1n2o2.apps.googleusercontent.com',
	DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
	SCOPES = "https://www.googleapis.com/auth/calendar.readonly",
	authorizeButton = document.getElementById('authorize-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
	iniciarReloj();
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
    	$(".traer-eventos").hide();
        listUpcomingEvents();
    	setInterval(function(){ initClient() }, 1800000);
    	//Oculto el boton
    }else{
    	//Muestro el Boton
    	$(".traer-eventos").show();

    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    var events;

    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        events = response.result.items;
        console.log(events)
        if(events.length>0){
        	$(".no-eventos").hide();
        	$(".cont-eventos-actual,#tableEventos").show();

        	filtraEventos(events);
        }else{
        	$(".cont-eventos-actual,#tableEventos").hide();
        	$(".no-eventos").show();
        }
    });
}

function diffInMinutes(date1,date2) {
    var diff = Math.abs(date1 - date2);
    var minutes = Math.floor((diff/1000)/60);
    return minutes;
}

function filtraEventos(eventos) {
		var horaActual = new Date(),
		inicio;
	console.log(eventos);
    $.each( eventos, function( key, evento ) {
    	inicio = new Date(evento.start.dateTime);
    	//mira si hay eventos que ya iniciaros
		var dA = horaActual.getDate();
        var dE = inicio.getDate();
        console.log("dA",dA);
        console.log("dE",dE);
        if (dA == dE) {
            actuales[actuales.length] = evento;
        } else {
            siguienteHora[siguienteHora.length] = evento;
        }
    });
    pintarEventos();
}
function pintarEventos(){
	var contEventos = $("#eventos"),
		listEventos = $("#tableEventos > tbody")
	//Aqui voy a recorrer los eventos actuales y ponerlos en el html
	contEventos.html('');
	$.each(actuales, function(index, val) {
        var color = "#4F338B";
        console.log(val.location);
        if(val.location!==undefined){
            var lugar = val.location,
                nombre = lugar.replace("-", " ");
            contMapas.append('<img class="img-ruta" src="images/rutas-mapa/Ruta-'+val.location+'.png" class="animacion-ruta">');
        }else{
            var nombre = "No site";
        }
		 /* iterate through array or object */
		 contEventos.append('<div class="eventos" id="evento-1"><h2><i class="img-icono-calendario"></i>'+val.summary+'</h2><p class="fecha-evento">'+formartFecha(val.start.dateTime,2)+'</p><div class="clear"></div><hr><div class="conte-hora-lugar-evento">  <div class="cont-info-evento"><i class="icono-hora-evento"></i><p>'+formartFecha(val.start.dateTime,1)+'</p></div><div class="cont-info-evento"><i class="icono-lugar-evento"></i><p>'+val.location+'</p>  </div></div><div class="clear"></div><div class="conte-edificio-evento edicicio-T"><i class="icono-edificio-evento"></i><p class="nombre-edificio">'+val.location+'</p></div></div>')
	});
	//Lanzo Mapa
	pintarMapa();
	listEventos.html('');
	//Aqui voy a recorer los eventos de la siguiente hora
	$.each(siguienteHora, function(index, val) {
		listEventos.append('<tr><td>'+val.summary+'</td><td>'+formartFecha(val.start.dateTime,1)+'</td><td>'+formartFecha(val.start.dateTime,2)+'</td><td>'+val.location+'</td></tr>');
	});

}

function pintarMapa() {
	var svg=jQuery("")
}

function formartFecha(fecha,tipo){
	var fechaFinal,
		fechaIngresa = new Date(fecha);
	
	switch(tipo){
		case 1:
			//Hora
			var h = fechaIngresa.getHours();
			var m = fechaIngresa.getMinutes();

			var us = 'AM';
			if(h>=12){
				h=h-12;
				us = 'PM';
			}
			if(m<10){
				m = '0'+m;
			}
			fechaFinal = h+':'+m+' '+us;
		break;
		case 2:
			//fecha
			var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var m = monthNames[fechaIngresa.getMonth()]
			var d = fechaIngresa.getDate();
			var y = fechaIngresa.getFullYear();
			fechaFinal = m+' '+d+','+y;
		break;
	}

	return fechaFinal;
}
function iniciarReloj(){
	var today = new Date(),
        mont = today.getMonth(),
        day = today.getDate(),
        year = today.getFullYear(),
        h = today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds(),
        m = checkTime(m),
        s = checkTime(s);
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    document.getElementById('reloj').innerHTML = monthNames[mont]+" "+day+","+year+" "+h + ":" + m + ":"+s;
    var t = setTimeout(iniciarReloj, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}	