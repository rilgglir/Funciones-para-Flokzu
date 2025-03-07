function mensajeEstudiante(msg,boton){

    if(boton == "LINEAMIENTO NO CORRESPONDE" || boton == "CANCELAR SOLICITUD" || boton == "NO APLICA/SIGUE MATRICULADO"){
        Flokzu.setRequired([[Mensaje al estudiante]]);
    }else{
        Flokzu.setEditable([[Mensaje al estudiante]]);
    }
    
}

Flokzu.onAction(mensajeEstudiante);
