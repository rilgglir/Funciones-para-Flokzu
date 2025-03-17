function validador(msg,boton){
	
    if (Flokzu.getFieldValue([[He leído y acepto]]) == false){
       swal( {type : 'error' , title : 'Leer política' , text: 'Leer política y marcar "He leído y acepto"'} );    
        Flokzu.error( [[He leído y acepto]] , "Leer y aceptar política" );
    } 

    if (boton == "Requisición aceptada") {

        generarCodigoRespuesta();

        Flokzu.setRequired([[Nombre del reclutador asignado]]);
        Flokzu.setRequired([[Correo del reclutador asignado]]);
        Flokzu.setRequired([[Fecha aproximada para resultados]]);

    }

}

function esquemaTrabajo(){
    if (Flokzu.getFieldValue([[Esquema de trabajo]]) == "Remoto"){
        Flokzu.setRequired([[Lugar de trabajo]]);
        Flokzu.setHidden([[Proporción]]);
    }
    if (Flokzu.getFieldValue([[Esquema de trabajo]]) == "Hibrido"){
        Flokzu.setRequired([[Lugar de trabajo]]);
        Flokzu.setRequired([[Proporción]]);
    }
    if (Flokzu.getFieldValue([[Esquema de trabajo]]) == "Presencial" || Flokzu.getFieldValue([[Esquema de trabajo]]) == ""){
        Flokzu.setHidden([[Lugar de trabajo]]);
        Flokzu.setHidden([[Proporción]]);
    }
}

function sumaPosiciones(){
        
        var turnoCompleto = Flokzu.getFieldValue([[Número de posiciones a cubrir turno completo]]);
        var turnoMatutino = Flokzu.getFieldValue([[Número de posiciones a cubrir turno matutino]]);
        var turnoVespertino = Flokzu.getFieldValue([[Número de posiciones a cubrir turno vespertino]]);

        if(turnoCompleto == ""){
            turnoCompleto = 0;
        }
        if(turnoMatutino == ""){
            turnoMatutino = 0;
        }
        if(turnoVespertino == ""){
            turnoVespertino = 0;
        }
        
        var suma = turnoCompleto + turnoMatutino + turnoVespertino;
        
        Flokzu.setEditable([[Número de posiciones a cubrir en total]]);
        Flokzu.setFieldValue([[Número de posiciones a cubrir en total]], suma);
        Flokzu.setReadOnly([[Número de posiciones a cubrir en total]]);
}

function estadoInicial(){
    Flokzu.setReadOnly([[Número de posiciones a cubrir en total]]);
}

function generarCodigoRespuesta(){

    console.log("Entra a la funcion");
        Flokzu.setEditable([[IDTicket]]);
    
 
        var idTicket = Flokzu.getFieldValue([[IDTicket]]);
                
        var fecha = moment();
        
        var num = idTicket.split('-');
        
        var sumaTotal = sumarDigitosIndividual(fecha.format("DDMM")) + sumarDigitosIndividual(num[1]);
        while(sumaTotal > 9){
            sumaTotal = sumarDigitosIndividual(sumaTotal);
        }
        
        
        var codigoRespuesta = fecha.format("DDMM") + "-" + num[1] + sumaTotal;
        
        console.log('Prueba de codigo ${codigoRespuesta}');
        
        Flokzu.setFieldValue([[Clave de solicitud padre]], codigoRespuesta);
}
function sumarDigitosIndividual(numero) {
        var cadena = numero.toString(); 
        var suma = 0;
        for (var i = 0; i < cadena.length; i++) {
            suma += parseInt(cadena.charAt(i));
        }
        return suma;
}

Flokzu.onInit(estadoInicial);
Flokzu.onInit(esquemaTrabajo);
Flokzu.onAction(validador);
Flokzu.onChange([[Esquema de trabajo]],esquemaTrabajo);
Flokzu.onChange([[Número de posiciones a cubrir turno completo]],sumaPosiciones);
Flokzu.onChange([[Número de posiciones a cubrir turno matutino]],sumaPosiciones);
Flokzu.onChange([[Número de posiciones a cubrir turno vespertino]],sumaPosiciones);