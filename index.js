const url = 'https://codenames-server.herokuapp.com/';
const socket = io.connect(url);
let miSala;
let modoEspia;

$(document).ready(() => {
    $('#btnBuscarSala').click((e) => {
        e.preventDefault();
        $('#rowBuscarSala').addClass('d-none');
        
        socket.emit('SOLICITAR_SALA', $('#inpSala').val());
    })

    $('#btnNuevaPartida').click((e) => {
        e.preventDefault();
        $('#btnJugador').click();

        socket.emit('NUEVO_JUEGO', miSala);
    });

    socket.on('ENTREGAR_SALA', (sala) => {
        $('#rowNuevaPartida').removeClass('d-none');
        $('#rowModo').removeClass('d-none');
        miSala = sala;
        cargarSala(sala);
        if (modoEspia) { cambiarAModoEspia() }
    });
})

function cargarSala(sala) {
    dibujarJuego(sala.juego);
}

function dibujarJuego(juego) {
    $('#tarjetas').html('');
    for ( let i = 0; i < 5; i++ ) {
        // cada row
        $('#tarjetas').append('<div id="row' + i + '" class="row mb-3">');

        for (let j = 0; j < 5; j++) {
            const unaTarjeta = juego.tarjetas.find((item) => { return item.fil == i && item.col == j});

            let btnClasses = 'btn btn-default tarjeta butn paper paper-rise';
            let div = '<div class="col-sm-2 px-2">';

            //console.log(unaTarjeta);
            if ( unaTarjeta.visible == true ) {
                btnClasses = btnClasses.concat(' trj-visible');
                
                switch( unaTarjeta.equipo ) {
                    case 'A':
                        btnClasses = btnClasses.concat(' trj-visible-azul');
                        break;
                    case 'R':
                        btnClasses = btnClasses.concat(' trj-visible-rojo');
                        break;
                    case 'N':
                        btnClasses = btnClasses.concat(' trj-visible-neutro');
                        break;
                    case 'X':
                        btnClasses = btnClasses.concat(' trj-visible-x');
                        break;
                    default:
                        break;
                }
            }

            if ( j == 0 ) { div = '<div class="col-sm-2 offset-sm-1 px-2">' }
            $(div).append(
                $('<button id="tarjeta' + i + j + '" class="' + btnClasses + '" onclick="darVueltaTarjeta(' + i + ', ' + j + ')">').html(unaTarjeta.palabra)
            ).appendTo('#row' + i)
        }
    }
}

function darVueltaTarjeta(fil, col) {
    console.log(`Dar vuelta tarjeta de la fila ${fil} y la columna ${col}`);
    const index = miSala.juego.tarjetas.findIndex(x => x.fil == fil && x.col == col);
    miSala.juego.tarjetas[index].visible = true;
    dibujarJuego(miSala.juego);

    socket.emit('DAR_VUELTA_TARJETA', miSala);
}

function cambiarAModoJugador() {
    modoEspia = false;
    
    $('#btnJugador').addClass('active');
    $('#btnEspia').removeClass('active');

    $.each($('.tarjeta'), (index, item) => {
        $item = $('#' + item.id);
        $item.removeClass('trj-espia').removeClass('trj-espia-rojo').removeClass('trj-espia-azul').removeClass('trj-espia-x');
    });
}

function cambiarAModoEspia() {
    modoEspia = true;

    $('#btnJugador').removeClass('active');
    $('#btnEspia').addClass('active');

    $.each($('.tarjeta'), (index, item) => {
        var $item = $('#' + item.id);
        var fil = item.id.substr(-2)[0];
        var col = item.id.substr(-1);
        
        var unaTarjeta = obtenerTarjeta(col, fil);
        
        if (unaTarjeta.visible == false) {
            switch (unaTarjeta.equipo) {
                case 'A':
                    $item.addClass('trj-espia-azul').addClass('trj-espia');
                    break;
                case 'R':
                    $item.addClass('trj-espia-rojo').addClass('trj-espia');
                    break;
                case 'X':
                    $item.addClass('trj-espia-x').addClass('trj-espia');     
                    break;
                case 'N':
                    $item.addClass('trj-espia');
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
