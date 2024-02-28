"use strict";

$(document).ready(function () {

    // Divido el body wn 2 columnas
    $("body").append("<div id='cartas'></div>"); // Una para colocar la baraja
    $("body").append("<div id='info'></div>");  // Otra para mostrar su información

    // Les aplico css
    $("#cartas").css({
        "grid-column": "1",
        "height": "100%",
        "display": "flex",
        "align-items": "center"
    });

    $("#info").css({
        "grid-column": "2",
        "height": "100%",
        "display": "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center"
    });

    // Creo un div para almacenar las cartas y poder posicionarlas mejor
    $("#cartas").append("<div id='baraja'></div>");
    $("#baraja").css({
        "width": "100%",
        "display": "flex",
        "margin-left": "50px",
        "flex-direction": "row",
        "justify-content": "center",
        "align-items": "center"
    });

    // Creo un array de objetos donde almaceno las cartas
    var cartas = [
        { id: 1, nombre: 'Chewbacca' },
        { id: 2, nombre: 'Darth Vader' },
        { id: 3, nombre: 'R2-D2' },
        { id: 4, nombre: 'C-3PO' },
        { id: 5, nombre: 'Yoda' }
    ];

    // Establezco los valores de las variables para que las cartas aparezcas como un abanico y unas encima de otras
    var rotacion = -30;
    var profundidad = 1;
    var centro = false;

    // Por cada posción del array, se añade un div que contendrá una carta a la que se la aplicará su css correspondiente
    cartas.forEach(function (carta) {
        $("#baraja").append("<div id='id" + carta.id + "' class='carta'><h2>" + carta.nombre + "</h2><div><img src='../img/" + carta.id + ".jpeg' /></div></div>");
        $("#id" + carta.id).css({
            "transform": "rotate(" + rotacion + "deg)",
            "z-index": "" + profundidad + ""
        });

        rotacion = rotacion + 15;

        if (centro == false) {
            profundidad = profundidad + 1;
            if (profundidad == 3) {
                centro = true;
            }
        } else {
            profundidad = profundidad - 1;
        }
    });
    
    // Creo estas variables para guardar la posición de la carta antes de pasar por encima
    var originalTransform;
    var originalZIndex;

    // Cuando se pasa por encima de la carta, esta pasa a estar recta y encima del resto
    $(".carta").mouseenter(function (ev) {
        originalTransform = $(this).css("transform");
        originalZIndex = $(this).css("z-index");

        $(this).css({ "transform": "scale(1.2)", "z-index": "4" });
    });

    // Cuando se sale de ella, se le aplica el css de antes
    $(".carta").mouseleave(function () {
        $(this).css({ "transform": "" + originalTransform + "", "z-index": "" + originalZIndex + "" });
    });


    // Esta función recoge el valor obtenido de una petición y la introduce en la columna de la información 
    function mostrarInfo(data) {

        // Si se ha obtenido dicha información lo realiza:
        if (data.results.length > 0) {
            var personaje = data.results[0];
            var informacion = $("<div id='informacion'><h2>Información de " + personaje.name + "</h2><div>" +
                "<p>Género: " + personaje.gender + "</p>" +
                "<p>Año de nacimiento: " + personaje.birth_year + "</p>" +
                "<p>Altura: " + personaje.height + " cm</p>" +
                "<p>Peso: " + personaje.mass + " kg</p>" +
                "<p>Color de piel: " + personaje.skin_color + "</p>" +
                "<br>"+
                "<hr>"+
                "<br>"+
                "<h3>Películas</h3>"+
                "</div></div>");

            // Si existe el div donde va la información del personaje seleccionado, lo borra
            var miInfo = $("#informacion");
            if (miInfo) {
                miInfo.remove();
            }

            // Añade la información a la columna
            $("#info").append(informacion);

            // Busca las películas en las que ha participado el personaje y las va añadiendo a la información
            personaje.films.forEach(function (filmUrl) {
                $.ajax({
                    url: filmUrl,
                    method: "GET",
                    success: function (filmData) {
                        $("#informacion").append("<p>"+filmData.title+"</p>");
                    },
                    error: function (error) {
                        console.error("Error al obtener información de la película:", error);
                    }
                });
            });
        } else {
            console.error("No se encontraron resultados para el personaje:", nombreCarta);
        }
    }

    // Al hacer click sobre la carta, se raliza una petición que busca información sobre el personaje de la carta y la envía a otra función
    $(".carta").click(function () {
        var nombreCarta = $(this).find("h2").text();
        console.log("Nombre de la carta clicada: " + nombreCarta);

        $.ajax({
            url: `https://swapi.dev/api/people/?search=${nombreCarta}&format=json`,
            method: "GET",
            success: function (data) {
                mostrarInfo(data);
            },
            error: function (error) {
                // Manejar errores en la solicitud
                console.error("Error al obtener información del personaje:", error);
            }
        });
    });

    // Creo una función para crear estrellas (divs con "·") y que caigan por la pantalla
    function crearEstrella() {
        
        // La creo
        let estrella = $("<div class='estrella'>*</div>");
    
        // Se establece el tamaño y opacidad aleatoriamente
        let tamano = Math.random() * 30 + 10; 
        let opacidad = Math.random(); 
    
        // Le aplico el css
        estrella.css({
          'font-size': tamano + 'px',
          'opacity': opacidad
        });
    
        // Posiciono la estrella arriba a la izquierda
        estrella.css({
          'top': '0',
          'left': Math.random() * $(window).width() // Posición horizontal aleatoria
        });
    
        // Afgrego la estrella
        $('body').append(estrella);
    
        // Animación de la estrella
        estrella.animate(
          { top: $(window).height()}, // Se desplaza hasta el final de la pantalla
          Math.random() * 5000 + 1000, // Dura 3 segundos
          'linear', // Tipo de animación
          function() {
            // Se ejecuta al finalizar la animación
            $(this).remove(); // Elimina la estrella del documento
            crearEstrella(); // Crear una nueva estrella
          }
        );
      }

      crearEstrella();
      crearEstrella();
      crearEstrella();
      crearEstrella();
});

