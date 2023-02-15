$(function (){
    var erro = new Audio("assets/interativos/esquema_bru/snd/erro.mp3");
    var acerto = new Audio("assets/interativos/esquema_bru/snd/acerto.mp3");
    
    if(window.location.search == '?page=1'){
        $(".bloco5-pg1 .resp, .bloco5-pg1 .item").click(function (){
            $(this).toggleClass("selecionado");

            if($(".bloco5-pg1 .selecionado").length == 2){
                console.log($(".bloco5-pg1 .selecionado")[0].dataset.resp, $(".bloco5-pg1 .selecionado")[1])

                if($(".bloco5-pg1 .selecionado")[0].dataset.resp == $(".bloco5-pg1 .selecionado")[1].dataset.resp)
                {
                    $(".bloco5-pg1 .selecionado").prop("disabled", "disabled")

                    $(".bloco5-pg1 .selecionado").addClass("acertou")

                    $("#respostas1 .selecionado .txtacao").text($("#respostas1 .selecionado")[0].dataset.resp)

                    $(".bloco5-pg1 .selecionado").removeClass(".bloco5-pg1 selecionado");

                    $("#associar_colulas_acertou1").modal("show");

                    acerto.play()
                }else
                {
                    $(".bloco5-pg1 .selecionado").removeClass("selecionado");
                    $("#associar_colulas_errou1").modal("show");
                    erro.play()
                
                }
            }
            
        });
        randomizeResp(50);
    }

    if(window.location.search == '?page=2'){
        $(".bloco4-pg2 .resp, .bloco4-pg2 .item").click(function (){
            $(this).toggleClass("selecionado");

            if($(".bloco4-pg2 .selecionado").length == 2){
                console.log($(".bloco4-pg2 .selecionado")[0].dataset.resp, $(".bloco4-pg2 .selecionado")[1])

                if($(".bloco4-pg2 .selecionado")[0].dataset.resp == $(".bloco4-pg2 .selecionado")[1].dataset.resp)
                {
                    $(".bloco4-pg2 .selecionado").prop("disabled", "disabled")

                    $(".bloco4-pg2 .selecionado").addClass("acertou")

                    $("#respostas2 .selecionado .txtacao").text($("#respostas2 .selecionado")[0].dataset.resp)

                    $(".bloco4-pg2 .selecionado").removeClass(".bloco4-pg2 selecionado");

                    $("#associar_colulas_acertou2").modal("show");

                    acerto.play()
                }else
                {
                    $(".bloco4-pg2 .selecionado").removeClass("selecionado");
                    $("#associar_colulas_errou2").modal("show");
                    erro.play()
                
                }
            }
            
        });
        randomizeResp2(50);
    }

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