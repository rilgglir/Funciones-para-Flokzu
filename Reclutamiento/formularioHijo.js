/*-Separar "ID padre" y hacer consulta, traer numero de vacantes, "Nombre de tu reclutador"
p-"Sexo", si es Femenino preguntar si está embarazada
p-Validaciones NSS 11 digitos
p-Validaciones CURP 18 caracteres
p-Validaciones RFC 13 caracteres
p-Llamado a API de codigo postal desde campo "Código postal", colocando "Municipio / delegacion" y "Estado"
p-"¿Has trabajo previamente en Utel?" si es SI, pedir:
*Nombre del área anterior
*Nombre del líder inmediato
*Fecha de ingreso
*Fecha de salida
*Número de empleado anterior
*Motivo de salida
*/

function estadoInicial(){

    Flokzu.setReadOnly([[ID padre]]);
    Flokzu.setReadOnly([[¿ID valido?]]);

    sexo();
    trabajoPrevio();
}

function consultaPostal(){
  
    var postal = parseInt(Flokzu.getFieldValue([[Código postal]]));
    var generico = "https://api-consultas-flokzu.vercel.app/api/postal/"+postal; //ambiente de pruebas, debe sustituirse por la URL de producción, datos no son de estudiantes reales
    var xhr = new XMLHttpRequest();

    xhr.open('GET', generico);

    xhr.setRequestHeader('x-api-key', 'be517257-2017-4b07-97e3-ad733ac27bf6');
    
    xhr.onreadystatechange = function() { 

        if (xhr.readyState === 4 && xhr.status === 200) {  

            var data = JSON.parse(xhr.responseText);

            Flokzu.setEditable([[Municipio / delegacion]]);
            Flokzu.setEditable([[Estado]]);

            Flokzu.setFieldValue([[Municipio / delegacion]],data[0].ciudad);
            Flokzu.setFieldValue([[Estado]], data[0].estado);
            
            Flokzu.setReadOnly([[Municipio / delegacion]]);
            Flokzu.setReadOnly([[Estado]]);
        } 
    }

    xhr.send();
}
function trabajoPrevio(){
    if(Flokzu.getFieldValue([[¿Has trabajado previamente en Utel?]]) == "Si"){
        Flokzu.setRequired([[Nombre del área anterior]]);
        Flokzu.setRequired([[Nombre del líder inmediato]]);
        Flokzu.setRequired([[Fecha de ingreso]]);
        Flokzu.setRequired([[Fecha de salida]]);
        Flokzu.setRequired([[Número de empleado anterior]]);
        Flokzu.setRequired([[Motivo de salida]]);
    }else{
        Flokzu.setHidden([[Nombre del área anterior]]);
        Flokzu.setHidden([[Nombre del líder inmediato]]);
        Flokzu.setHidden([[Fecha de ingreso]]);
        Flokzu.setHidden([[Fecha de salida]]);
        Flokzu.setHidden([[Número de empleado anterior]]);
        Flokzu.setHidden([[Motivo de salida]]);
    }
}
function validaNSS(){

    if (Flokzu.getFieldValue([[NSS]]) != "" && Flokzu.getFieldValue([[NSS]]).length != 11){
        swal( {type : 'error' , title : 'Dato incompleto' , text: 'Se requieren 11 dígitos'} );
    }
}
function validaCURP(){

    if (Flokzu.getFieldValue([[CURP]]) != "" && Flokzu.getFieldValue([[CURP]]).length != 18){
        swal( {type : 'error' , title : 'Dato incompleto' , text: 'Se requieren 18 caracteres'} );
    }
}
function validaRFC(){

    if (Flokzu.getFieldValue([[RFC]]) != "" && Flokzu.getFieldValue([[RFC]]).length != 18){
        swal( {type : 'error' , title : 'Dato incompleto' , text: 'Se requieren 13 caracteres'} );
    }
}
function sexo(){
    if (Flokzu.getFieldValue([[Sexo]]) == "Femenino"){
        Flokzu.setRequired([[¿Estás embarazada?]]);
    }else{
        Flokzu.setHidden([[¿Estás embarazada?]]);
    }
}

function validarCheck(){
    var cadena = Flokzu.getFieldValue([[ Código de respuesta ]]).trim().toUpperCase();
    
    
    var partes = cadena.split('-');
    var primerNumero = parseInt(partes[0]);
    var segundoNumero = parseInt(partes[1].slice(0, -1));

    // Sumar todos los dígitos de ambos números
    var sumaTotal = sumarDigitosIndividual(primerNumero) + sumarDigitosIndividual(segundoNumero);


    // Obtener el resultado final con un solo dígito
    while(sumaTotal > 9){
        sumaTotal = sumarDigitosIndividual(sumaTotal);
    }

    if( sumaTotal == cadena.slice(-1)){
        validacion(true);
        procesarCodigo(cadena.slice(0, -1));  // pasa la cadena sin el último carácter
    }else{
        validacion(false);
        ocultarCampos();
    }

}

function procesarCodigo(codigo) {

    // Separar en variables los 4 datos
    var datos = codigo.split("-");
    //Sobre fecha límite
    var fecha = moment(datos[0],"DDMM").add(3,'d');
    if (moment(fecha).day() == 6 || moment(fecha).day() == 0){
        fecha = moment(fecha).add(2,'d')
    }

    //Sobre ticket principal
    var num = datos[1];
    num = "RPO-" + num;
    Flokzu.setEditable([[IDTicketPadre]]);
    Flokzu.setFieldValue([[IDTicketPadre]], num);
    Flokzu.setReadOnly([[IDTicketPadre]]);
    
    // Calcular la diferencia en horas entre fechas
    var fechaActual = moment();
    (fecha.isSameOrAfter(fechaActual))? validacion(true): validacion(false); // true si apun estamos a tiempo, false si ya se pasó la hora  

}

function sumarDigitosIndividual(numero) {
    var cadena = numero.toString(); 
    var suma = 0;
    for (var i = 0; i < cadena.length; i++) {
        suma += parseInt(cadena.charAt(i));
    }
    return suma;
}

function validacion(valor){
    Flokzu.setEditable([[¿ID valido?]]);
    Flokzu.setFieldValue([[¿ID valido?]], valor);
    Flokzu.setReadOnly([[¿ID valido?]]);
}
function validaciones(msg,boton){

    if(boton== 'Enviar' && Flokzu.getFieldValue([[¿ID valido?]])== false){
  
        swal( {type : 'info' , title : 'Dato no coincide' , text: "Verifica que tu codigo sea correcto"} );
        Flokzu.error( [[¿ID valido?]] , "Codigo incorrectos" );
      
    }
  
  }


Flokzu.onInit(estadoInicial);
Flokzu.onAction(validaciones);
Flokzu.onChange([[Código postal]], consultaPostal);
Flokzu.onChange([[¿Has trabajado previamente en Utel?]], trabajoPrevio);
Flokzu.onChange([[NSS]], validaNSS);
Flokzu.onChange([[CURP]], validaCURP);
Flokzu.onChange([[RFC]], validaRFC);
Flokzu.onChange([[Código de respuesta]] , validarCheck);


