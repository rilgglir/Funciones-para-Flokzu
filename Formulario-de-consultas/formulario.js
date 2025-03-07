function obtenerValorPorClave(clave,texto) {
    var regex = new RegExp(`"${clave}":"([^"]+)"`, 'g');
    var coincidencias = texto.match(regex);
    if (coincidencias) {
        return coincidencias.map(function(match) {
            var valor = match.split(':')[1].replace(/"/g, '').trim();
            return valor;
        });
    } else {
        return ' ';
    }
}
function filtroCampo(campo,cadena){
  
	var cad = cadena;
	var ini = cad.lastIndexOf(campo);
	var ncad = cad.substr(ini);
	var fin = ncad.indexOf(',');
	var ncad2 = ncad.substr(0,fin-2);
  
	var ini2 = ncad2.lastIndexOf('"');
	var filtrado = ncad2.substr(ini2+1);
  
	return filtrado;
}

function integridad(msg,boton){
	
    if (Flokzu.getFieldValue([[¿Ticket valido?]]) == false){
       swal( {type : 'error' , title : 'Datos no coinciden' , text: 'No coincide id con matrícula o nombre, favor de revisar los datos'} );    
        Flokzu.error( [[¿Ticket valido?]] , "Ticket no valido, revisar datos" );
    } 
}

function ocultarCampos(){
  Flokzu.setReadOnly([[Tarea actual del proceso]]);
  Flokzu.setHidden([[Comentario del area]]);
  Flokzu.setHidden([[Matricula]]);

  Flokzu.setHidden([[Nombre del estudiante]]);
  Flokzu.setHidden([[Correo del estudiante]]);
  Flokzu.setHidden([[Nivel]]);
  Flokzu.setHidden([[Campus]]);
  Flokzu.setHidden([[Experiencia]]);
  Flokzu.setHidden([[Programa]]);
  Flokzu.setHidden([[Clave de programa]]);
  Flokzu.setHidden([[Descripcion]]);
}


function consulta(){

    ocultarCampos();
    var tareasPermitidas = [
      "[AGREGAR INFO]"
    ];
    var ticket = Flokzu.getFieldValue([[Id del ticket]]);
    ticket = ticket.toUpperCase();
    ticket = ticket.trim();

    
    Flokzu.setEditable( [[ID]] );
    Flokzu.setFieldValue([[ID]], ticket);
    Flokzu.setHidden( [[ID]] );

    var matri = Flokzu.getFieldValue([[Matricula]]);

    if (ticket != ""){

        var generico = "https://app.flokzu.com/flokzuopenapi/api/e3bf3bd4bd3e3e74d253d718585035acd83100761ad5ce37/instance?identifier="+ticket;
        var xhr = new XMLHttpRequest();
      
        xhr.open('GET', generico);
      
        xhr.setRequestHeader('X-Api-Key', 'e3bf3bd4bd3e3e74d253d718585035acd83100761ad5ce37');
        xhr.setRequestHeader('X-Username', 'rlopezgu@utel.edu.mx');
        
        xhr.onreadystatechange = function() { 
    
          if (xhr.readyState === 4) {  

            var data = JSON.parse(xhr.responseText);
            if (data[0].matricula == matri){
            Flokzu.setFieldValue([[Cobertura para el código postal?]], data[0].terrestre);
            
              if(tareasPermitidas.includes(getActiveTaskName(xhr.responseText))){
                Flokzu.setEditable([[¿Ticket valido?]]);
                Flokzu.setFieldValue([[¿Ticket valido?]], true);
                Flokzu.setReadOnly([[¿Ticket valido?]]);  
              }else{
                Flokzu.setEditable([[¿Ticket valido?]]);
                Flokzu.setFieldValue([[¿Ticket valido?]], false);
                Flokzu.setReadOnly([[¿Ticket valido?]]);                 
              }

              Flokzu.setEditable([[Tarea actual del proceso]]);
              Flokzu.setFieldValue([[Tarea actual del proceso]], getActiveTaskName(xhr.responseText));
              Flokzu.setReadOnly([[Tarea actual del proceso]]);
              
              
              Flokzu.setEditable([[Comentario del area]]);
              Flokzu.setFieldValue([[Comentario del area]], xhr.responseText);

              Flokzu.setEditable([[Nombre del estudiante]]);
              Flokzu.setFieldValue([[Nombre del estudiante]], obtenerValorPorClave("Nombre del estudiante",xhr.responseText)[0]);
              Flokzu.setReadOnly([[Nombre del estudiante]]);
              Flokzu.setEditable([[Matricula]]);
              Flokzu.setFieldValue([[Matricula]], obtenerValorPorClave("Matricula",xhr.responseText)[0]);
              Flokzu.setReadOnly([[Matricula]]);
              Flokzu.setEditable([[Correo del estudiante]]);
              Flokzu.setFieldValue([[Correo del estudiante]], obtenerValorPorClave("Correo del estudiante",xhr.responseText)[0]);
              Flokzu.setReadOnly([[Correo del estudiante]]);
              Flokzu.setEditable([[Nivel]]);
              Flokzu.setFieldValue([[Nivel]], obtenerValorPorClave("Nivel",xhr.responseText)[0]);
              Flokzu.setReadOnly([[Nivel]]);
              Flokzu.setEditable([[Campus]]);
              Flokzu.setFieldValue([[Campus]], obtenerValorPorClave("Campus",xhr.responseText)[0]);
              Flokzu.setReadOnly([[Campus]]);
              Flokzu.setEditable([[Experiencia]]);
              Flokzu.setFieldValue([[Experiencia]], obtenerValorPorClave("Experiencia",xhr.responseText)[0]);
              Flokzu.setReadOnly([[Experiencia]]);
           
  Flokzu.setEditable([[Descripcion]]);
              Flokzu.setFieldValue([[Descripcion]], filtroCampo("Descripcion",xhr.responseText));
              Flokzu.setReadOnly([[Descripcion]]);
            }else{
                ocultaCampos();
                Flokzu.setEditable([[¿Ticket valido?]]);
                Flokzu.setFieldValue([[¿Ticket valido?]], false);
                Flokzu.setReadOnly([[¿Ticket valido?]]);      
                swal( {type : 'error' , title : 'Datos no aceptados' , text: 'Id de ticket, matrícula o tarea no coinciden, no puedes agregar informacion en este ticket'} ); 
                Flokzu.setEditable([[Tarea actual del proceso]]);
                Flokzu.setFieldValue([[Tarea actual del proceso]], obtenerValorPorClave("name",xhr.responseText)[0]);             
                Flokzu.setReadOnly([[Tarea actual del proceso]]);
            }
          


          }
          xhr.send();
        }
}

function getActiveTaskName(jsonData) {

  //var regex = /"name":\s*"([^"]*\[^"]*[^"]*)"/;
  var regex = /"activeTasks":\[{"name":\s*"([^"]*\[^"]*[^"]*)"/;

  var match = jsonData.match(regex);

  if (match) {
      return match[1];
  } else {
      return null; 
  }
}

Flokzu.onInit(ocultarCampos);
Flokzu.onAction(integridad);
Flokzu.onChange( [[Id del ticket]] , consulta);