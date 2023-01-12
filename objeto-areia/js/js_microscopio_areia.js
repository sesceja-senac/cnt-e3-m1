$(".botao1").on("click", function () {
    $(this).prop("disabled", true);
    $("#seta2").removeClass("some");
    $("#seta1").addClass("some");
    $("#areia2").removeClass("some");
    $("#areia1").addClass("some");
    $(".botao2").prop("disabled", false);
});

$(".botao2").on("click", function () {
    $(this).prop("disabled", true);
    $("#seta2").addClass("some");
    $("#seta1").removeClass("some");
    $("#areia2").addClass("some");
    $("#areia1").removeClass("some");
    $(".botao1").prop("disabled", false);
});

$("#iniciar").on("click", function(){
    $("#microscopio").removeClass("oculto");
    $("#capaMicroscopio").addClass("oculto");
});

