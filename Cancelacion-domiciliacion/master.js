function muestraMotivo(){

    if(Flokzu.getFieldValue([[Motivo de eliminación]]) == "Otro"){
        Flokzu.setRequired([[Detalle el motivo]]);
    }else{
        Flokzu.setHidden([[Detalle el motivo]]);
    }
}

function ocultaCampos(){
    Flokzu.setHidden([[Link SIU]]);
}

Flokzu.onInit(muestraMotivo);
Flokzu.onInit(ocultaCampos);
Flokzu.onChange([[Motivo de eliminación]], muestraMotivo);