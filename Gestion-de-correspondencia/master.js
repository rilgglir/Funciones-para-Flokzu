function fechaTentativa(){
    (Flokzu.getFieldValue([[Tipo de entrega]]) == "Presencial")? Flokzu.setRequired([[Fecha tentativa para recoger]]):Flokzu.setHidden([[Fecha tentativa para recoger]]);
}

function validacion(msg,boton){

    if(boton == "ENTREGADO"){
        Flokzu.setRequired([[Evidencia de entrega]]);
    }else{
        Flokzu.setHidden([[Evidencia de entrega]]);
    }
    
    if(boton=="Enviar" && Flokzu.getFieldValue([[Solicitud valida?]])==false){
        swal( {type : 'error' , title : 'Condiciones no validas' , text: 'El estado del estudiante no permite el requerimiento solicitado'} );    
        Flokzu.error( [[Solicitud valida?]] , "Ticket no valido, revisar datos" );
    }

    //validación de cobertura
    if( Flokzu.getFieldValue([[Tipo de entrega]]) == "A domicilio"
        && Flokzu.getFieldValue([[Estado actual del estudiante]]) == "EGRESADO" 
        && Flokzu.getFieldValue([[Estatus de titulacion]]) == "TITULADO" 
        && (Flokzu.getFieldValue([[Campus]]) == "UTEL HIGHER" || Flokzu.getFieldValue([[Campus]]) == "UTEL STUDENT" ) 
        && Flokzu.getFieldValue([[Cobertura para el código postal?]])==false){
        swal( {type : 'error' , title : 'Sin cobertura' , text: 'El código postal del estudiante no tiene cobertura para entregas, cambiarlo'} );    
        Flokzu.error( [[Solicitud valida?]] , "Ticket no valido, sin cobertura para entregas" );
    }


    if(boton=="Enviar" && Flokzu.getFieldValue([[Solicitud valida?]])==true && Flokzu.getFieldValue([[Tipo de entrega]]) == "Presencial" && validarFecha()==false){
        swal( {type : 'error' , title : 'Condiciones no validas' , text: 'La fecha debe ser posterior a 3 días desde hoy, no hay entregas en fines de semana'} );    
        Flokzu.error( [[Solicitud valida?]] , "Ticket no valido, revisar datos o fecha para recoger" );
    }

    console.log("Prueba de codigo");
    if(boton=="PASAR CON CORRESPONDENCIA" || boton=="INCIDENCIA EN GUÍA"){
        console.log("Entra en la condicion");
        generarCodigoRespuesta();
    }

    if(boton=="ENVIO DE PDF(S)"){
        Flokzu.setRequired([[Archivo 1]]);
    }else{
        Flokzu.setHidden([[Archivo 1]]);
    }

    if(boton=="PAQUETE ENVIADO"){
        Flokzu.setRequired([[Numero de guia]]);
    }else{
        Flokzu.setEditable([[Numero de guia]]);
    }

    if(boton == "RG GENERADA"){
        Flokzu.setFieldValue([[Se generó la RG?]],"SI");
    }
    if(boton == "RG NO GENERADA"){
        Flokzu.setFieldValue([[Se generó la RG?]],"NO");
    }
    //Se generó la RG?
    
}

function estados(){
    ocultarDireccion();
    var estado = Flokzu.getFieldValue([[Estado actual del estudiante]]);
    var tipo = Flokzu.getFieldValue([[Tipo de solicitud]]);
    Flokzu.setHidden([[Fecha de cancelacion]]);
    Flokzu.setHidden([[Motivo de la solicitud]]);
    editaInfo(" ");
    nbt();
    desactivaEscaneo();
    desactivaPrestamo();
    fechaTentativa();

    if(estado != "" && tipo !=""){
        if(tipo == "Prestamo de documento"){
            activaPrestamo();
            switch(estado){
                case "Baja Temporal":
                    editaInfo("La devolución solo aplica en casos de baja definitiva y el préstamo únicamente para estudiantes MATRICULADOs.");
                    validar(false);
                    break;
                case "Baja Definitiva":
                    editaInfo("El préstamo de documentos aplica únicamente para alumnos MATRICULADOs.");
                    validar(false);
                    break;
                /*case "MATRICULADO":
                    Flokzu.setRequired([[Motivo de la solicitud]]);
                    editaInfo("Estado aceptado");
                    validar(true);
                    break;     
                case "EGRESADO":
                    editaInfo("No aplica prestamo, solo devolución.");
                    validar(false);
                    break;*/               
            }

        }else if(tipo == "Devolución de documentos"){
            
            switch(estado){
                case "Baja Temporal":
                    editaInfo("La devolución solo aplica en casos de baja definitiva y el préstamo únicamente para estudiantes MATRICULADOs.");
                    validar(false);
                    break;
                case "Baja Definitiva":
                    editaInfo("Estado aceptado");
                    Flokzu.setEditable([[Atiende primero:]]);
                    Flokzu.setFieldValue([[Atiende primero:]], "ArchivoExpediente");
                    Flokzu.setReadOnly([[Atiende primero:]]);
                    validar(true);
                    break;
                /*case "MATRICULADO":
                    editaInfo("La devolución de documentos aplica únicamente para alumnos con baja definitiva.");
                    validar(false);
                    break;     
                case "EGRESADO":
                    editaInfo("Estado aceptado");
                    validar(true);

                    break;          */     
            }

        }else if(tipo == "Escaneo de documento"){
            
                validar(true);
                activaEscaneo();

        }else{
            validar(false);
        }
    }
}

function nbt(){
    if(Flokzu.getFieldValue([[Motivo de la solicitud]]) == "Por baja"){
        activarNBT();
    }else{
        desactivarNBT();
    }
}
function activarNBT(){
    Flokzu.setRequired([[Vía de contacto]]);
    Flokzu.setRequired([[Dato para contactar]]);
    Flokzu.setRequired([[Descripcion de la solicitud]]);
    Flokzu.setRequired([[Evidencia de la solicitud]]);
}
function desactivarNBT(){
    Flokzu.setHidden([[Vía de contacto]]);
    Flokzu.setHidden([[Dato para contactar]]);
    Flokzu.setHidden([[Descripcion de la solicitud]]);
    Flokzu.setHidden([[Evidencia de la solicitud]]);
}

function activaPrestamo(){

    Flokzu.setRequired([[Se requiere el formato de prestamo de documentos que lo puedes descargar desde el siguiente link: <a href="https://drive.google.com/uc?export=download&amp;id=1RXpZuJ1EMb0282cgTIGrglGvCE0L10Ej">LINK</a>]]);
    Flokzu.setRequired([[Formato de prestamo]]);
}

function desactivaPrestamo(){
    Flokzu.setHidden([[Se requiere el formato de prestamo de documentos que lo puedes descargar desde el siguiente link: <a href="https://drive.google.com/uc?export=download&amp;id=1RXpZuJ1EMb0282cgTIGrglGvCE0L10Ej">LINK</a>]]);
    Flokzu.setHidden([[Formato de prestamo]]);
}

function activaEscaneo(){

    Flokzu.setHidden([[Motivo de la solicitud]]);
    Flokzu.setHidden([[¿Tiene saldo pendiente?]]);
    Flokzu.setHidden([[Tipo de entrega]]);
    Flokzu.setRequired([[Finalidad del documento]]);

}

function desactivaEscaneo(){

    Flokzu.setRequired([[Motivo de la solicitud]]);
    Flokzu.setRequired([[¿Tiene saldo pendiente?]]);
    Flokzu.setRequired([[Tipo de entrega]]);
    Flokzu.setHidden([[Finalidad del documento]]);

}

function mostrarDireccion(){

    Flokzu.setEditable([[Los envíos generalmente corren a cargo del estudiante, pero si cumple con los requisitos para que se le genere la representación gráfica de titulación, la universidad cubrirá el envío del expediente completo. Favor de comunicarle al estudiante que, en caso de que aún no se le pueda generar su representación gráfica de titulación, deberá pagar una guía para el envío de sus documentos. Se le notificará por correo si debe pagar o si la universidad lo cubrirá.]]);
    Flokzu.setRequired([[Código postal]]);
    Flokzu.setRequired([[Cobertura para el código postal?]]);
    Flokzu.setRequired([[Nombre de quien recibe paquete]]);
    Flokzu.setRequired([[Número de contacto]]);
    Flokzu.setRequired([[Calle]]);
    Flokzu.setRequired([[Número]]);
    Flokzu.setRequired([[Colonia]]);
    Flokzu.setRequired([[Ciudad/Localidad]]);
    Flokzu.setRequired([[Estado]]);
}

function ocultarDireccion(){
    Flokzu.setHidden([[Los envíos generalmente corren a cargo del estudiante, pero si cumple con los requisitos para que se le genere la representación gráfica de titulación, la universidad cubrirá el envío del expediente completo. Favor de comunicarle al estudiante que, en caso de que aún no se le pueda generar su representación gráfica de titulación, deberá pagar una guía para el envío de sus documentos. Se le notificará por correo si debe pagar o si la universidad lo cubrirá.]]);
    Flokzu.setHidden([[Código postal]]);
    Flokzu.setHidden([[Cobertura para el código postal?]]);
    Flokzu.setHidden([[Nombre de quien recibe paquete]]);
    Flokzu.setHidden([[Número de contacto]]);
    Flokzu.setHidden([[Calle]]);
    Flokzu.setHidden([[Número]]);
    Flokzu.setHidden([[Colonia]]);
    Flokzu.setHidden([[Ciudad/Localidad]]);
    Flokzu.setHidden([[Estado]]);
}

function editaInfo(info){
    Flokzu.setEditable([[Información sobre requerimiento]]);
    Flokzu.setFieldValue([[Información sobre requerimiento]],info);
    Flokzu.setReadOnly([[Información sobre requerimiento]]);
}
function validar(bool){
    Flokzu.setEditable([[Solicitud valida?]]);
    Flokzu.setFieldValue([[Solicitud valida?]],bool);
    Flokzu.setReadOnly([[Solicitud valida?]]);
}
function generarCodigoRespuesta(){

    console.log("Entra a la funcion");
        Flokzu.setEditable([[Ticket]]);
    
 
        var idTicket = Flokzu.getFieldValue([[Ticket]]);
                
        var fecha = moment();
        
        var num = idTicket.split('-');
        
        var sumaTotal = sumarDigitosIndividual(fecha.format("DDMMhh")) + sumarDigitosIndividual(num[1]);
        while(sumaTotal > 9){
            sumaTotal = sumarDigitosIndividual(sumaTotal);
        }
        
        
        var codigoRespuesta = fecha.format("DDMMhh") + "-" + num[1] + sumaTotal;
        
        console.log('Prueba de codigo ${codigoRespuesta}');
        
        Flokzu.setFieldValue([[Código de respuesta]], codigoRespuesta);
}
function sumarDigitosIndividual(numero) {
        var cadena = numero.toString(); 
        var suma = 0;
        for (var i = 0; i < cadena.length; i++) {
            suma += parseInt(cadena.charAt(i));
        }
        return suma;
}
function validarFecha() {
    //Recoger ambas fechas
    var validacion = false;
    var start = moment();
    var end = moment( Flokzu.getFieldValue([[Fecha tentativa para recoger]]) , "DD/MM/YYYY");


    //Revisar que no sea fin de semana
    if (end.format('ddd') == 'Sat' || end.format('ddd') == 'Sun'){
        validacion=false;
    }else{

        //Que la fecha +3 días se cumpla
        var cont = 3;
        while (cont > 0) {
            
            start = moment(start).add(1, 'd');

            if (start.format('ddd') !== 'Sat' && start.format('ddd') !== 'Sun'){
            cont--;
            }
       }
       //Flokzu.setFieldValue([[Descripcion]], moment(start).format('YYYY MM DD') + "es igual o despues de " + moment(end).format('YYYY MM DD') );
       if (moment(start).isSameOrAfter(end)){
        validacion=false;
       }else{
        validacion=true;
       }
    }
    //Devolver valor
    return validacion;
}
function validarFechaRecoger(){
    if(validarFecha()==false){
        swal( {type : 'error' , title : 'Fecha no valida' , text: 'Solo se puede agendar entre semana y con almenos 3 días laborales de anticipación'} );    
    }

}
function fechaLimite(){
    Flokzu.setEditable([[Fecha de cancelacion]]);
    var end = moment( Flokzu.getFieldValue([[Fecha tentativa para recoger]]) , "DD/MM/YYYY");
    var cont = 3;

    while (cont > 0) {
            
        end = moment(end).add(1, 'd');

        if (end.format('ddd') !== 'Sat' && end.format('ddd') !== 'Sun'){
            cont--;
        }

    }

    Flokzu.setFieldValue([[Fecha de cancelacion]], moment(end).format('DD/MM/YYYY'));

Flokzu.setHidden([[Fecha de cancelacion]]);

}

function direccion(){
    if( Flokzu.getFieldValue([[Tipo de entrega]]) == "A domicilio"
    && Flokzu.getFieldValue([[Estado actual del estudiante]]) == "EGRESADO" 
    && (Flokzu.getFieldValue([[Estatus de titulacion]]) == "TITULADO" || Flokzu.getFieldValue([[Estatus de titulacion]]) == "NULL") 
    && (Flokzu.getFieldValue([[Campus]]) == "UTEL HIGHER" || Flokzu.getFieldValue([[Campus]]) == "UTEL STUDENT" )){
        mostrarDireccion();
    }else{
        ocultarDireccion();
    }
}


Flokzu.onInit(estados);
Flokzu.onInit(direccion);
Flokzu.onAction(validacion);
Flokzu.onChange([[Tipo de entrega]], direccion);
Flokzu.onChange([[Motivo de la solicitud]], nbt);
Flokzu.onChange([[Fecha tentativa para recoger]], fechaLimite);
Flokzu.onChange([[Fecha tentativa para recoger]], validarFechaRecoger);
Flokzu.onChange([[Tipo de solicitud]],estados);
Flokzu.onChange([[Estado actual del estudiante]],estados);
Flokzu.onChange([[Tipo de entrega]],fechaTentativa);