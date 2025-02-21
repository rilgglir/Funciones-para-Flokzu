function estadoInicial(){
    Flokzu.setReadOnly([[Estatus de docs digitales]]);
    Flokzu.setReadOnly([[Estatus de docs fisicos]]);
    Flokzu.setReadOnly([[Estatus de titulacion]]);
    Flokzu.setReadOnly([[Atiende primero:]]);
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

            
        } 
    }
    
    xhr.send();
    estadoInicial();
}

function consultaPostal(){
  
    var postal = Flokzu.getFieldValue([[Código postal]]);
    var generico = "https://api-consultas-flokzu.vercel.app/api/postal/"+postal; //ambiente de pruebas, debe sustituirse por la URL de producción, datos no son de estudiantes reales
    var xhr = new XMLHttpRequest();

    xhr.open('GET', generico);

    xhr.setRequestHeader('x-api-key', 'be517257-2017-4b07-97e3-ad733ac27bf6');
    
    xhr.onreadystatechange = function() { 

        if (xhr.readyState === 4 && xhr.status === 200) {  

            var data = JSON.parse(xhr.responseText);

            Flokzu.setFieldValue([[Cobertura para el código postal?]], data[0].terrestre);
            Flokzu.setFieldValue([[Ciudad/Localidad]],data[0].ciudad);
            Flokzu.setFieldValue([[Estado]], data[0].estado);
            Flokzu.setFieldValue([[Nombre de quien recibe paquete]], Flokzu.getFieldValue([[Nombre del estudiante]]));                
        } 
    }

    xhr.send();
}

Flokzu.onInit(estadoInicial);
Flokzu.onChange([[Matricula]], consultaDocs);
Flokzu.onChange([[Código postal]], consultaPostal);