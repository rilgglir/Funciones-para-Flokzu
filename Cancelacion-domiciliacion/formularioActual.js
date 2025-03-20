function gestionarSaldoVencido() {
    var tieneSaldoVencido = Flokzu.getFieldValue([[¿Se tiene saldo vencido?]]);
    if(tieneSaldoVencido == 'Sí'){
        Flokzu.setEditable([[Cantidad de saldo vencido]]);
        Flokzu.setRequired([[Cantidad de saldo vencido]]);
    } else {
        Flokzu.setHidden([[Cantidad de saldo vencido]]);
    }
}

function matriculaPais(){

    var relacionPais = new Map([
        ['01', "México"],
        ['20', "Colombia"],
        ['24', "Perú"],
        ['28', "Chile"],
        ['29', "Ecuador"],
        ['30', "Estados Unidos"],
        ['31', "España"],
        ['32', "República Dominicana"],
        ['33', "Bolivia"],
        ['34', "El Salvador"],
        ['37', "Guatemala"],
        ['38', "Paraguay"],
        ['39', "Argentina"],
        ['44', "Internacional"],
        ['47', "Filipinas"],
        ['48', "Indonesia"],
        ['49', "Vietnam"],
        ['50', "India"],
        ['55', "Global Asia"],
        ['56', "Panamá"],
      ]);
    
    var relacionLink = new Map([
        ["México","https://siu-utl.scalahed.com/usuarios/login"],
        ["Colombia","https://siu-col.scalahed.com/usuarios/login/"],
        ["Perú","https://siu-per.scalahed.com/usuarios/login/"],
        ["Chile","https://siu-chi.scalahed.com/usuarios/login/"],
        ["Ecuador","https://siu-ecu.scalahed.com/usuarios/login/"],
        ["Estados","https://siu-usa.scalahed.com/usuarios/login/"],
        ["España","https://siu-esp.scalahed.com/usuarios/login/"],
        ["República Dominicana","https://siu-dom.scalahed.com/usuarios/login/"],
        ["Bolivia","https://siu-bol.scalahed.com/usuarios/login/"],
        ["El Salvador","https://siu-sal.scalahed.com/usuarios/login/"],
        ["Guatemala","https://siu-gua.scalahed.com/usuarios/login/"],
        ["Paraguay","https://siu-par.scalahed.com/usuarios/login/"],
        ["Argentina","https://siu-arg.scalahed.com/usuarios/login/"],
        ["Internacional","https://siu-int.scalahed.com/usuarios/login/"],
        ["Filipinas","https://siu-fil.scalahed.com/usuarios/login/"],
        ["Indonesia","https://siu-ind.scalahed.com/"],
        ["Vietnam","https://siu-vie.scalahed.com/"],
        ["India","https://siu-ina.scalahed.com/"],
        ["Global Asia","https://siu-gas.scalahed.com/"],
        ["Panamá","https://siu-pan.scalahed.com/usuarios/login/"],
      ]);

      var matricula = Flokzu.getFieldValue([[Matrícula]]);

      if(matricula.length == 9){
        var inicio = matricula.substring(0,2);
        Flokzu.setFieldValue([[País]],relacionPais.get(inicio));
        Flokzu.setEditable([[Link SIU]]);
        Flokzu.setFieldValue([[Link SIU]],relacionLink.get(relacionPais.get(inicio)));
    }else{
        Flokzu.setFieldValue([[País]],"");
        Flokzu.setFieldValue([[Link SIU]],"");
    }
    
    Flokzu.setReadOnly([[Link SIU]]);
}


Flokzu.onChange([[Matrícula]],matriculaPais);
Flokzu.onChange([[¿Se tiene saldo vencido?]], gestionarSaldoVencido);
Flokzu.onInit(gestionarSaldoVencido);
