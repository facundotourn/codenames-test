const url = 'https://codenames-server.herokuapp.com/';
const socket = io.connect(url);
let miSala;
let modoEspia;

$(document).ready(() => {
  $("#btnBuscarSala").click(e => {
    e.preventDefault();
    $("#rowBuscarSala").addClass("d-none");

    socket.emit("SOLICITAR_SALA", $("#inpSala").val());
  });

  $("#btnNuevaPartida").click(e => {
    e.preventDefault();
    $("#btnJugador").click();

    socket.emit("NUEVO_JUEGO", miSala);
  });

  socket.on("ENTREGAR_SALA", sala => {
    $("#rowNuevaPartida").removeClass("d-none");
    $("#rowModo").removeClass("d-none");
    console.log(sala);
    miSala = sala;
    cargarSala(sala);
    if (modoEspia) {
      cambiarAModoEspia();
    }
  });

  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#888888"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#888888",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
          mode: "repulse"
        },
        onclick: {
          enable: false,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true,
    config_demo: {
      hide_card: false,
      background_color: "#ffffff",
      background_image: "",
      background_position: "50% 50%",
      background_repeat: "no-repeat",
      background_size: "cover"
    }
  });
});

function cargarSala(sala) {
  dibujarJuego(sala.juego);
}

function dibujarJuego(juego) {
  $("#tarjetas").html("");
  for (let i = 0; i < 5; i++) {
    // cada row
    $("#tarjetas").append('<div id="row' + i + '" class="row mb-3">');

    for (let j = 0; j < 5; j++) {
      const unaTarjeta = juego.tarjetas.find(item => {
        return item.fil == i && item.col == j;
      });

      let btnClasses = "btn btn-default tarjeta butn paper paper-rise";
      let div = '<div class="col-sm-2 px-2">';

      //console.log(unaTarjeta);
      if (unaTarjeta.visible == true) {
        btnClasses = btnClasses.concat(" trj-visible");

        switch (unaTarjeta.equipo) {
          case "A":
            btnClasses = btnClasses.concat(" trj-visible-azul");
            break;
          case "R":
            btnClasses = btnClasses.concat(" trj-visible-rojo");
            break;
          case "N":
            btnClasses = btnClasses.concat(" trj-visible-neutro");
            break;
          case "X":
            btnClasses = btnClasses.concat(" trj-visible-x");
            break;
          default:
            break;
        }
      }

      if (j == 0) {
        div = '<div class="col-sm-2 offset-sm-1 px-2">';
      }
      $(div)
        .append(
          $(
            '<button id="tarjeta' +
              i +
              j +
              '" class="' +
              btnClasses +
              '" onclick="darVueltaTarjeta(' +
              i +
              ", " +
              j +
              ')">'
          ).html(unaTarjeta.palabra)
        )
        .appendTo("#row" + i);
    }
  }
}

function darVueltaTarjeta(fil, col) {
  console.log(`Dar vuelta tarjeta de la fila ${fil} y la columna ${col}`);
  const index = miSala.juego.tarjetas.findIndex(
    x => x.fil == fil && x.col == col
  );
  miSala.juego.tarjetas[index].visible = true;
  dibujarJuego(miSala.juego);

  socket.emit("DAR_VUELTA_TARJETA", miSala);
}

function cambiarAModoJugador() {
    modoEspia = false;
    
    $('#btnJugador').addClass('active');
    $('#btnEspia').removeClass('active');

  $.each($(".tarjeta"), (index, item) => {
    $item = $("#" + item.id);
    $item
      .removeClass("trj-espia")
      .removeClass("trj-espia-rojo")
      .removeClass("trj-espia-azul")
      .removeClass("trj-espia-x");
  });
}

function cambiarAModoEspia() {
  modoEspia = true;

  $("#btnJugador").removeClass("active");
  $("#btnEspia").addClass("active");

  $.each($(".tarjeta"), (index, item) => {
    var $item = $("#" + item.id);
    var fil = item.id.substr(-2)[0];
    var col = item.id.substr(-1);

    var unaTarjeta = obtenerTarjeta(col, fil);

    if (unaTarjeta.visible == false) {
      switch (unaTarjeta.equipo) {
        case "A":
          $item.addClass("trj-espia-azul").addClass("trj-espia");
          break;
        case "R":
          $item.addClass("trj-espia-rojo").addClass("trj-espia");
          break;
        case "X":
          $item.addClass("trj-espia-x").addClass("trj-espia");
          break;
        case "N":
          $item.addClass("trj-espia");
          break;
        default:
          break;
      }
    }
  });
}

function obtenerTarjeta(col, fil) {
    const index = miSala.juego.tarjetas.findIndex(x => x.fil == fil && x.col == col);
    return miSala.juego.tarjetas[index];
}
