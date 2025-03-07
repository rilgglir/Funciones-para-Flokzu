function consulta() {

    console.log("Consulta");
    var ticket = Flokzu.getFieldValue([[Id del ticket]]);
    ticket = ticket.toUpperCase();
    ticket = ticket.trim();
    console.log(ticket);

    Flokzu.setEditable([[ID]]);
    Flokzu.setFieldValue([[ID]], ticket);
    Flokzu.setHidden([[ID]]);

    //var matri = Flokzu.getFieldValue([[Matricula]]);

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

                console.log("Comienza despliegue de info, el nombre de la tarea es:");
                console.log(data.activeTasks[0].name);
                console.log("Su fecha de creación:");
                console.log(data.activeTasks[0].creationDate);
                console.log("Información del primer campo:");

                if (data.fields && data.fields.length > 0) {
                    data.fields.forEach(function(field) {
                        // Aquí puedes acceder a las propiedades de cada campo
                        // Por ejemplo, si cada campo tiene una propiedad 'name' y 'value'
                        if (field["Matricula"]) {
                            Flokzu.setFieldValue([[Matricula]],field["Matricula"]);
                        }
                    });
                }

                var dataFieldsString = JSON.stringify(data.fields);
                Flokzu.setFieldValue([[Comentario del area]], dataFieldsString);

                
            }
        }

        xhr.send();

    }
};

Flokzu.onChange([[Id del ticket]], consulta);