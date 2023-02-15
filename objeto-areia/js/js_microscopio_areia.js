$(".botao1").on("click", function () {
    $(this).prop("disabled", true);
    $("#seta2").removeClass("d-none");
    $("#seta1").addClass("d-none");
    $("#areia2").removeClass("d-none");
    $("#areia1").addClass("d-none");
    $(".botao2").prop("disabled", false);
});

$(".botao2").on("click", function () {
    $(this).prop("disabled", true);
    $("#seta2").addClass("d-none");
    $("#seta1").removeClass("d-none");
    $("#areia2").addClass("d-none");
    $("#areia1").removeClass("d-none");
    $(".botao1").prop("disabled", false);
});

$("#iniciar").on("click", function () {
    $("#microscopio").removeClass("d-none");
    $("#capaMicroscopio").addClass("d-none");
});

// inicia o resize
resizeBodyMicroscopio()

function resizeBodyMicroscopio(){
    var largura = 1920;
    var altura = 1080;

    var larguraScreen = $(window).width();
    var alturaScreen = $(window).height();
    var proporcao;
    var proporcaoAltura = (alturaScreen * 100) / altura / 100;
    var proporcaoLargura = (larguraScreen * 100) / largura / 100;
    if (proporcaoAltura < proporcaoLargura) {
      proporcao = proporcaoAltura
    } else {
      proporcao = proporcaoLargura
    }
    

    $(".body-microscopio").css("transform", "scale("+ proporcao +")")
}

// Ajusta o resize caso o usuário mecha na janela.
$(window).resize(function (){
    resizeBodyMicroscopio()
})

// $(window).bind('resize', function () {
//     if (screen.height > screen.width) {
//         $('.body-microscopio').addClass('horizontal');
//     } else {
//         $('.body-microscopio').removeClass('horizontal');
//         $('.modal-dialog').removeClass('modal-fullscreen');
//         $('.modal-dialog').addClass('modal-lg');
//     }
// });


