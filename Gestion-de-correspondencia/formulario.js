function estadoInicial(){
    Flokzu.setReadOnly([[Estatus de docs digitales]]);
    Flokzu.setReadOnly([[Estatus de docs fisicos]]);
    Flokzu.setReadOnly([[Estatus de titulacion]]);
    Flokzu.setReadOnly([[Atiende primero:]]);

    Flokzu.setHidden([[Cobertura para el código postal?]]);
    Flokzu.setHidden([[Ciudad/Localidad]]);
    Flokzu.setHidden([[Estado]]);
}

function consultaDocs(){

    var matricula = Flokzu.getFieldValue([[Matricula]]);
    var generico = "https://api-consultas-flokzu.vercel.app/api/docs/"+matricula; //ambiente de pruebas, debe sustituirse por la URL de producción, datos no son de estudiantes reales
    var xhr = new XMLHttpRequest();

    xhr.open('GET', generico);

    xhr.setRequestHeader('x-api-key', 'be517257-2017-4b07-97e3-ad733ac27bf6');
    
    xhr.onreadystatechange = function() { 

        if (xhr.readyState === 4 && xhr.status === 200) {  

            var data = JSON.parse(xhr.responseText);

            Flokzu.setEditable([[Estatus de docs digitales]]);
            Flokzu.setEditable([[Estatus de docs fisicos]]);
            Flokzu.setEditable([[Estatus de titulacion]]);    

            Flokzu.setFieldValue([[Estado actual del estudiante]], data[0].estatus);
            Flokzu.setFieldValue([[Estatus de docs digitales]],data[0].estatus_expediente_digital);
            Flokzu.setFieldValue([[Estatus de docs fisicos]], data[0].estatus_expediente_fisico);
            Flokzu.setFieldValue([[Estatus de titulacion]], data[0].estatus_titulacion);



            Flokzu.setReadOnly([[Estatus de docs digitales]]);
            Flokzu.setReadOnly([[Estatus de docs fisicos]]);
            Flokzu.setReadOnly([[Estatus de titulacion]]);
            Flokzu.setReadOnly([[Atiende primero:]]);

            
        } 
    }
    
    xhr.send();
    estadoInicial();
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

            Flokzu.setEditable([[Cobertura para el código postal?]]);
            Flokzu.setEditable([[Ciudad/Localidad]]);
            Flokzu.setEditable([[Estado]]);

            Flokzu.setFieldValue([[Cobertura para el código postal?]], data[0].terrestre);
            Flokzu.setFieldValue([[Ciudad/Localidad]],data[0].ciudad);
            Flokzu.setFieldValue([[Estado]], data[0].estado);
            Flokzu.setFieldValue([[Nombre de quien recibe paquete]], Flokzu.getFieldValue([[Nombre del estudiante]]));      
            
            Flokzu.setReadOnly([[Cobertura para el código postal?]]);
            Flokzu.setReadOnly([[Ciudad/Localidad]]);
            Flokzu.setReadOnly([[Estado]]);
        } 
    }

    xhr.send();
}

function activaMatriz(){
    if( Flokzu.getFieldValue([[Estado actual del estudiante]]) != "" 
    && Flokzu.getFieldValue([[Estatus de docs digitales]]) != "" 
    && Flokzu.getFieldValue([[Estatus de docs fisicos]]) != "" 
    && Flokzu.getFieldValue([[Estatus de titulacion]]) != ""
    && Flokzu.getFieldValue([[Tipo de entrega]]) != ""){

        Flokzu.setEditable([[Atiende primero:]]);
        matriz();
        Flokzu.setReadOnly([[Atiende primero:]]);

    }
}

function matriz(){ //Evalua los estados actual, digitales, físicos y titulacion para arrojar los resultados de la matriz de estatus, se ve con quien se asigna y si procede la solicitud

    var actual = Flokzu.getFieldValue([[Estado actual del estudiante]]);
    var digitales = Flokzu.getFieldValue([[Estatus de docs digitales]]);
    var fisicos = Flokzu.getFieldValue([[Estatus de docs fisicos]]);
    var titulacion = Flokzu.getFieldValue([[Estatus de titulacion]]);

    if(Flokzu.getFieldValue([[Tipo de solicitud]]) == "Prestamo de documento" || Flokzu.getFieldValue([[Tipo de solicitud]]) == "Devolución de documentos"){

  
        if(fisicos == "Fisico Devuelto" || fisicos == "Sin documentos"){ //Regla, sin docs físicos no se entrega nada
            Flokzu.setFieldValue([[Atiende primero:]], "Sin docs");
            editaInfo("Sin documentos que entregar");
            validar(false);
            if (titulacion == "TITULADO"){                                 //Regla, sin docs físicos pero ya con titulación, se va con titulación para RG
                Flokzu.setFieldValue([[Atiende primero:]], "Titulacion"); 
                editaInfo("Solicitud válida");
                validar(true);            
            }
            if (digitales == "Completo" && titulacion == "NULL"){           //Regla, sin docs físicos pero con digitales completos y duda en estado de titulo, pasa con Gera
                Flokzu.setFieldValue([[Atiende primero:]], "ArchivoEscaneo");
                editaInfo("Solicitud válida");
                validar(true);            
            }
        }else{
            if (actual == "MATRICULADO") {                              //Regla, si es matriculado y tiene docs, se entrega el expediente
                Flokzu.setFieldValue([[Atiende primero:]], "ArchivoExpediente");
                editaInfo("Operación válida");
                validar(true);
            }
            if (actual == "EGRESADO") { 
                if (titulacion == "TITULADO") {                     //Regla, si es egresado y titulado, se va con titulación para RG
                    Flokzu.setFieldValue([[Atiende primero:]], "Titulacion");
                    editaInfo("Operación válida");
                    validar(true);
                }else{                                               //Regla, si es egresado y no titulado, se va con Archivo para escaneo de docs            
                    Flokzu.setFieldValue([[Atiende primero:]], "ArchivoEscaneo");
                    editaInfo("Operación válida");
                    validar(true);
                }   
            }

        }

        if(fisicos == "Fisico apocrifo" || digitales == "Digital Apocrifo"){ //Regla, si hay apocrifos no se regresan docs, ya que es la regla con mas prioridad, la colocaré hasta abajo por la ejecición en cascada
            Flokzu.setFieldValue([[Atiende primero:]], "NoValido");
            editaInfo("Documentación apocrifa, no procede la solicitud");
            validar(false);
        }
    }
}

Flokzu.onInit(estadoInicial);
Flokzu.onChange([[Estado actual del estudiante]], activaMatriz);
Flokzu.onChange([[Estatus de docs digitales]], activaMatriz);
Flokzu.onChange([[Estatus de docs fisicos]], activaMatriz);
Flokzu.onChange([[Estatus de titulacion]], activaMatriz);
Flokzu.onChange([[Tipo de entrega]], activaMatriz);
Flokzu.onChange([[Matricula]], consultaDocs);
Flokzu.onChange([[Código postal]], consultaPostal);