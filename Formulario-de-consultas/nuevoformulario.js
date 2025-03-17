function consulta() {

    console.log("Consulta");
    var ticket = Flokzu.getFieldValue([[Id del ticket]]);
    ticket = ticket.toUpperCase();
    ticket = ticket.trim();
    console.log(ticket);

    Flokzu.setEditable([[ID]]);
    Flokzu.setFieldValue([[ID]], ticket);
    Flokzu.setReadOnly([[ID]]);

    var otrosCampos = "";

    if (ticket != "") {

        var generico = "https://app.flokzu.com/flokzuopenapi/api/e3bf3bd4bd3e3e74d253d718585035acd83100761ad5ce37/instance?identifier=" + ticket;
        var xhr = new XMLHttpRequest();

        xhr.open('GET', generico);

        xhr.setRequestHeader('X-Api-Key', 'e3bf3bd4bd3e3e74d253d718585035acd83100761ad5ce37');
        xhr.setRequestHeader('X-Username', 'rlopezgu@utel.edu.mx');

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {
                console.log(xhr.responseText);

                var data = JSON.parse(xhr.responseText);

                if(validaDato(data.fields, datoParidad() )){

                    editaCampos();

                    if(data.lockStatus == 3){
                        console.log("Ticket cerrado");
                        Flokzu.setFieldValue([[Tarea actual del proceso]], "Ticket cerrado");
                        Flokzu.setFieldValue([[Fecha de inicio de la tarea actual]], "Ticket sin tarea activa");
                    }else{
                        console.log("Comienza despliegue de info, el nombre de la tarea es:");
                        console.log(data.activeTasks[0].name);
                        Flokzu.setFieldValue([[Tarea actual del proceso]], data.activeTasks[0].name);
                        console.log("Su fecha de creación de tarea:");
                        console.log(data.activeTasks[0].creationDate); //Fecha de creacion del ticket
                        Flokzu.setFieldValue([[Fecha de inicio de la tarea actual]], data.activeTasks[0].creationDate);
                        agregaInfo(data.activeTasks[0].name);
                    }

                    console.log(data.dateCreated); //Fecha de creacion del ticket
                    console.log(JSON.stringify(data.dateCreated)); //Fecha de creacion del ticket
                    Flokzu.setFieldValue([[Fecha de creacion del ticket]], JSON.stringify(data.dateCreated));

                    console.log("Información del primer campo:");
                    if (data.fields && data.fields.length > 0) {
                        data.fields.forEach(function(field) {
                            console.log(field);
                            if (field["Nombre del estudiante"]) {
                                Flokzu.setFieldValue([[Nombre del estudiante]],field["Nombre del estudiante"]);
                            }else if (field["Correo del estudiante"]) {
                                Flokzu.setFieldValue([[Correo del estudiante]],field["Correo del estudiante"]);
                            }else if (field["Nivel"]) {
                                Flokzu.setFieldValue([[Nivel]],field["Nivel"]);
                            }else if (field["Campus"]) {
                                Flokzu.setFieldValue([[Campus]],field["Campus"]);
                            }else if (field["Experiencia"]) {
                                Flokzu.setFieldValue([[Experiencia]],field["Experiencia"]);
                            }else if (field["Programa"]) {
                                Flokzu.setFieldValue([[Programa]],field["Programa"]);
                            }else if (field["Comentario de Finanzas"]) {
                                Flokzu.setFieldValue([[Comentario de finanzas]],field["Comentario de Finanzas"]);
                            }else if (field["Comentario de finanzas"]) {
                                Flokzu.setFieldValue([[Comentario de finanzas]],field["Comentario de finanzas"]);
                            }else if (field["Comentario de SER"]) {
                                Flokzu.setFieldValue([[Comentario de SER]],field["Comentario de SER"]);
                            }else if (field["Comentario de cobranza"]) {
                                Flokzu.setFieldValue([[Comentario de cobranza]],field["Comentario de cobranza"]);
                            }else if (field["Comentario de academia"]) {
                                Flokzu.setFieldValue([[Comentario de academia]],field["Comentario de academia"]);
                            }else{
                                valores = JSON.stringify(field);
                                if (valores.includes('"Descripci')) {
                                    Flokzu.setFieldValue([[Descripcion]],valores);
                                }

                                if (!valores.includes('"Evidencia')&& !valores.includes('":""')&& !valores.includes('"Descripci')&& !valores.includes('AutomClav')&&!valores.includes('.')) {
                                    otrosCampos = otrosCampos + valores + "\n";
                                    Flokzu.setFieldValue([[Otros campos]],otrosCampos);
                                }
                            }

                        });

                    }
                    bloqueaCampos();
                }
            }
        }

        xhr.send();

    }
};

function validaDato(campos,dato){

    console.log("Valida dato");

    //Usando destructuring

    if (campos && campos.length > 0) {
        for (var i = 0; i < campos.length; i++) {
            var campo = campos[i];
            console.log("Comparando: " + campo["Matricula"] +campo["Matrícula"]+campo["Correo_electronico_del_lead"] + " con " + dato);
            if (campo["Matricula"] == dato || campo["Matrícula"] == dato || campo["Correo_electronico_del_lead"] == dato) {
                console.log("Dato igual");
                return true;
        }
        /*const {Matricula, Matrícula, Correo_electronico_del_lead} = campos;
        if (Matricula==dato || Matrícula==dato || Correo_electronico_del_lead==dato) {
            return true;
        }else{
            return false;
        }*/
    }
    console.log("Dato igual");
   return false;
}
}

function activaDatoValidador(){
    if (Flokzu.getFieldValue([[Cuenta con matrícula el ticket a consultar?]])==true) {
        Flokzu.setRequired([[Matricula]]);
        Flokzu.setHidden([[Correo del lead]]);
    }else{
        Flokzu.setHidden([[Matricula]]);
        Flokzu.setRequired([[Correo del lead]]);
    }
}

function datoParidad(){
    if (Flokzu.getFieldValue([[Cuenta con matrícula el ticket a consultar?]])==true) {
        return Flokzu.getFieldValue([[Matricula]]);
    }else{
        return Flokzu.getFieldValue([[Correo del lead]]);
    }
}

function ocultaCampos(){
    Flokzu.setHidden([[Tarea actual del proceso]]);
    Flokzu.setHidden([[Fecha de creacion del ticket]]);
    Flokzu.setHidden([[Fecha de inicio de la tarea actual]]);
    Flokzu.setHidden([[Comentario del solicitante]]);
    Flokzu.setHidden([[Nombre del estudiante]]);
    Flokzu.setHidden([[Correo del estudiante]]);
    Flokzu.setHidden([[Nivel]]);
    Flokzu.setHidden([[Campus]]);
    Flokzu.setHidden([[Experiencia]]);
    Flokzu.setHidden([[Programa]]);
    Flokzu.setHidden([[Descripcion]]);
    Flokzu.setHidden([[Otros campos]]);
    Flokzu.setHidden([[Comentario de finanzas]]);
    Flokzu.setHidden([[Comentario de SER]]);
    Flokzu.setHidden([[Comentario de cobranza]]);
    Flokzu.setHidden([[Comentario de academia]]);
    Flokzu.setHidden([[¿Puede agregar información?]]);
}
function editaCampos(){
    Flokzu.setEditable([[Tarea actual del proceso]]);
    Flokzu.setEditable([[Fecha de creacion del ticket]]);
    Flokzu.setEditable([[Fecha de inicio de la tarea actual]]);
    Flokzu.setEditable([[Nombre del estudiante]]);
    Flokzu.setEditable([[Correo del estudiante]]);
    Flokzu.setEditable([[Nivel]]);
    Flokzu.setEditable([[Campus]]);
    Flokzu.setEditable([[Experiencia]]);
    Flokzu.setEditable([[Programa]]);
    Flokzu.setEditable([[Descripcion]]);
    Flokzu.setEditable([[Otros campos]]);
    Flokzu.setEditable([[Comentario de finanzas]]);
    Flokzu.setEditable([[Comentario de SER]]);
    Flokzu.setEditable([[Comentario de cobranza]]);
    Flokzu.setEditable([[Comentario de academia]]);
    Flokzu.setEditable([[¿Puede agregar información?]]);
}
function bloqueaCampos(){
    Flokzu.setReadOnly([[Tarea actual del proceso]]);
    Flokzu.setReadOnly([[Fecha de creacion del ticket]]);
    Flokzu.setReadOnly([[Fecha de inicio de la tarea actual]]);
    Flokzu.setReadOnly([[Nombre del estudiante]]);
    Flokzu.setReadOnly([[Correo del estudiante]]);
    Flokzu.setReadOnly([[Nivel]]);
    Flokzu.setReadOnly([[Campus]]);
    Flokzu.setReadOnly([[Experiencia]]);
    Flokzu.setReadOnly([[Programa]]);
    Flokzu.setReadOnly([[Descripcion]]);
    Flokzu.setReadOnly([[Otros campos]]);
    Flokzu.setReadOnly([[Comentario de finanzas]]);
    Flokzu.setReadOnly([[Comentario de SER]]);
    Flokzu.setReadOnly([[Comentario de cobranza]]);
    Flokzu.setReadOnly([[Comentario de academia]]);
    Flokzu.setReadOnly([[¿Puede agregar información?]]);
}

function agregaInfo(tarea){
    tarea = tarea.toLowerCase();
    console.log("Agrega info" + tarea);
    if (tarea.includes("info") || tarea.includes("suspen")){
        console.log("En espera de info" +tarea.toLowerCase());
        Flokzu.setRequired([[Comentario del solicitante]]);
        Flokzu.setFieldValue([[¿Puede agregar información?]],true);
    }else{
        console.log("No esta espera de info" +tarea.toLowerCase());
        Flokzu.setHidden([[Comentario del solicitante]]);
        Flokzu.setFieldValue([[¿Puede agregar información?]],false);
    }
}

Flokzu.onInit(activaDatoValidador);
Flokzu.onInit(ocultaCampos);
Flokzu.onChange([[Cuenta con matrícula el ticket a consultar?]], activaDatoValidador);
Flokzu.onChange([[Id del ticket]], consulta);