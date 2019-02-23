const url = 'http://localhost:4040';
const socket = io.connect(url);

$(document).ready(() => {
    $('#btnBuscarSala').click((e) => {
        e.preventDefault();
        
        socket.emit('SOLICITAR_SALA', $('#inpSala').val());
    })

    socket.on('ENTREGAR_SALA', console.log);
})