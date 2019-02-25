const url = 'http://localhost:4040';
const socket = io.connect(url);
let miSala;

$(document).ready(() => {
    $('#btnBuscarSala').click((e) => {
        e.preventDefault();
        
        socket.emit('SOLICITAR_SALA', $('#inpSala').val());
    })

    $('#btnNuevaPartida').click((e) => {
        e.preventDefault();

        socket.emit('NUEVO_JUEGO', miSala);
    })

    socket.on('ENTREGAR_SALA', (sala) => {
        console.log(sala);
        miSala = sala;
        cargarSala(sala);
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
            console.log(btnClasses);

            if ( j == 0 ) { div = '<div class="col-sm-2 offset-sm-1 px-2">' }
            $(div).append(
                $('<button class="' + btnClasses + '" onclick="darVueltaTarjeta(' + i + ', ' + j + ')">').html(unaTarjeta.palabra)
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