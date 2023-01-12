$(function (){
    var erro = new Audio("assets/interativos/esquema_bru/snd/erro.mp3");
    var acerto = new Audio("assets/interativos/esquema_bru/snd/acerto.mp3");
    $(".resp, .item").click(function (){
        $(this).toggleClass("selecionado");

        if($(".selecionado").length == 2){
            console.log($(".selecionado")[0].dataset.resp, $(".selecionado")[1])

            if($(".selecionado")[0].dataset.resp == $(".selecionado")[1].dataset.resp)
            {
                $(".selecionado").prop("disabled", "disabled")
                $(".selecionado").addClass("acertou")
                $(".selecionado .txtacao").text($(".selecionado")[0].dataset.resp)
                $(".selecionado").removeClass("selecionado");
                if(window.location.search == '?page=1'){
                    $("#associar_colulas_acertou1").modal("show");
                } else if(window.location.search == '?page=2'){
                    $("#associar_colulas_acertou2").modal("show");
                }
                acerto.play()
            }else
            {
                // $(".selecionado").addClass("errou")
                $(".selecionado").removeClass("selecionado");
                if(window.location.search == '?page=1'){
                    $("#associar_colulas_errou1").modal("show");
                } else if(window.location.search == '?page=2'){
                    $("#associar_colulas_errou2").modal("show");
                }
                erro.play()
               
            }
        }
        
    });

    randomizeResp(50);
    randomizeResp2(50);
})

function randomizeResp(total){

    let resp = Array.from(document.querySelectorAll('#respostas1 .resp'))

    for (let i = 0; i < total; i++){
        $(resp).each(
            function(){ 
                $(this).insertBefore($(resp[Math.floor(Math.random()*resp.length - 1)]))
            }
        )
    }
}

function randomizeResp2(total){

    let resp = Array.from(document.querySelectorAll('#respostas2 .resp'))

    for (let i = 0; i < total; i++){
        $(resp).each(
            function(){ 
                $(this).insertBefore($(resp[Math.floor(Math.random()*resp.length - 1)]))
            }
        )
    }
}