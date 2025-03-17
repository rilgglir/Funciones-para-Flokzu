function decision(msg, boton) {
    console.log(boton);
    if (boton == "PROCESO ACEPTADO") {

        Flokzu.setEditable([[Ultima decisión]]);
        Flokzu.setFieldValue([[Ultima decisión]], 'ACEPTADO');
        Flokzu.setReadOnly([[Ultima decisión]]);
        hilarDecision("A");
    }


    if (boton == "PROCESO RECHAZADO") {
        Flokzu.setEditable([[Ultima decisión]]);
        Flokzu.setFieldValue([[Ultima decisión]], 'RECHAZADO');
        Flokzu.setReadOnly([[Ultima decisión]]);
        hilarDecision("R");
    }


    dirigir();
    generarCodigoRespuesta();

}
function hilarDecision(letra) {
    Flokzu.setEditable([[Decisiones]]);
    var hilo = Flokzu.getFieldValue([[Decisiones]]) + letra;
    Flokzu.setFieldValue([[Decisiones]], hilo);
    Flokzu.setReadOnly([[Decisiones]]);
}
function dirigir() {

    var estadosAfectado = ["A", "RA"];
    var estadosSolicitante = ["R", "AA"];
    var estadosAplica = ["AR", "RR", "AAA", "AAR", "RAA", "RAR"];

    Flokzu.setEditable([[Dirigido a]]);
    var hilo = Flokzu.getFieldValue([[Decisiones]]);

    if (estadosAfectado.includes(hilo))
        Flokzu.setFieldValue([[Dirigido a]], "AFECTADO");

    if (estadosSolicitante.includes(hilo))
        Flokzu.setFieldValue([[Dirigido a]], "SOLICITANTE");

    if (estadosAplica.includes(hilo))
        Flokzu.setFieldValue([[Dirigido a]], "APLICAR");


    Flokzu.setReadOnly([[Dirigido a]]);
}
function asis() {
    if (Flokzu.getFieldValue([[Asistida]]) == true) {
        Flokzu.setRequired([[Correo del asesor(Asistida)]]);
        Flokzu.setRequired([[Canal(Asistida)]]);

    } if (Flokzu.getFieldValue([[Asistida]]) == false) {
        Flokzu.setHidden([[Correo del asesor(Asistida)]]);
        Flokzu.setHidden([[Canal(Asistida)]]);
    }
}
function reasignacion() {
    if (Flokzu.getFieldValue([[Reasignacion]]) == true) {

        Flokzu.setRequired([[Canal(reasignacion)]]);
        Flokzu.setRequired([[Agente(reasignacion)]]);
        Flokzu.setRequired([[Correo del asesor(reasignacion)]]);
        Flokzu.setRequired([[Matricula(reasignacion)]]);
        Flokzu.setEditable([[Matricula 2(reasignacion)]]);
        Flokzu.setEditable([[Matricula 3(reasignacion)]]);

    } if (Flokzu.getFieldValue([[Reasignacion]]) == false) {
        Flokzu.setHidden([[Canal(reasignacion)]]);
        Flokzu.setHidden([[Agente(reasignacion)]]);
        Flokzu.setHidden([[Correo del asesor(reasignacion)]]);
        Flokzu.setHidden([[Matricula(reasignacion)]]);
        Flokzu.setHidden([[Matricula 2(reasignacion)]]);
        Flokzu.setHidden([[Matricula 3(reasignacion)]]);
    }
}
function venta() {
    if (Flokzu.getFieldValue([[Venta]]) == true) {
        Flokzu.setReadOnly([[Fecha del cambio de busqueda]]);
        Flokzu.setRequired([[Correo del asesor de venta]]);
        Flokzu.setRequired([[Area de venta]]);

    } if (Flokzu.getFieldValue([[Venta]]) == false) {
        Flokzu.setHidden([[Correo del asesor de venta]]);
        Flokzu.setHidden([[Area de venta]]);
    }
}
function generarCodigoRespuesta() {

    Flokzu.setEditable([[Dirigido a]]);
    Flokzu.setEditable([[Decisiones]]);
    Flokzu.setEditable([[Ticket]]);

    var dirigidoA = Flokzu.getFieldValue([[Dirigido a]]);
    var decisiones = Flokzu.getFieldValue([[Decisiones]]);
    var idTicket = Flokzu.getFieldValue([[Ticket]]);

    var letraDirigidoA = dirigidoA === 'SOLICITANTE' ? 'S' : dirigidoA === 'AFECTADO' ? 'A' : '';

    var fecha = moment();

    var num = idTicket.split('-');


    var sumaTotal = sumarDigitosIndividual(fecha.format("DDMMhh")) + sumarDigitosIndividual(num[1]);
    while (sumaTotal > 9) {
        sumaTotal = sumarDigitosIndividual(sumaTotal);
    }


    var codigoRespuesta = letraDirigidoA + "-" + decisiones + "-" + fecha.format("DDMMhh") + "-" + num[1] + sumaTotal;


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

function ocultar() {

    Flokzu.setReadOnly([[Dirigido a]]);
    Flokzu.setReadOnly([[Decisiones]]);
    Flokzu.setReadOnly([[Ticket]]);
    Flokzu.setReadOnly([[Ultima decisión]]);
    Flokzu.setReadOnly([[Código de respuesta]]);

}
Flokzu.onAction(decision);
Flokzu.onInit(ocultar);
Flokzu.onInit(asis);
Flokzu.onInit(venta);
Flokzu.onInit(reasignacion);