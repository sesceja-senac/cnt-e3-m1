var correctCards = 0;
$( init );

function init() {

  // inicia o "jogo"
  correctCards = 0;
  wrongCards = 0;
  $('#cardPile').html( '' );
  $('#cardSlots').html( '' );

  // array que cria as NRs
  var numbers = [ "3", "2", "1", "4", "5", "6", "7", "8","9","10"];
  numbers.sort( function() { return Math.random() - .11} );

  for ( var i=0; i<10; i++ ) {
    $('<div>' + numbers[i] + '</div>').data( 'number', numbers[i] ).attr( 'id', 'card'+numbers[i] ).appendTo( '#cardPile' ).draggable( {
      containment: '#content',
      stack: '#cardPile div',
      cursor: 'move',
      revert: true
    } );
  }

  // array que cria os espaços para inserir os cards
  var words = [ 'Social - Fator Externo', 'Cliente – Fator Interno', 'Legislação – Fator Externo', 'Concorrente – Fator Interno', 'Demográfico – Fator Externo', 'Fornecedor – Fator Interno','Ecológico – Fator Externo','Agência Reguladora – Fator Interno','Tecnológico – Fator Externo','Econômico -  Fator Externo'];
  for ( var i=1; i<=10; i++ ) {
    $('<div class="cards' + i + '">' + words[i-1] + '</div>').data( 'number', i ).appendTo( '#cardSlots' ).droppable( {
      accept: '#cardPile div',
      hoverClass: 'hovered',
      drop: handleCardDrop
    } );
  }
}
// acaba init

//insere o conteúdo de cada um dos cards
$(document).ready(function(){
    $("#card1").html("<img src='img-jogo/4.png'>");
    $("#card2").html("<img src='img-jogo/1.png'>");
    $("#card3").html("<img src='img-jogo/2.png'>");
    $("#card4").html("<img src='img-jogo/9.png'>");
    $("#card5").html("<img src='img-jogo/3.png'>");
    $("#card6").html("<img src='img-jogo/7.png'>");
    $("#card7").html("<img src='img-jogo/6.png'>");
    $("#card8").html("<img src='img-jogo/10.png'>");
    $("#card9").html("<img src='img-jogo/8.png'>");
    $("#card10").html("<img src='img-jogo/5.png'>");
});

//fecha o app
$(function(){
  $("#close-app").click(function(){
      $("#fixer").fadeOut();
  });
});

// função que controle o movimento e o acerto dos cards
function handleCardDrop( event, ui ) {
  var slotNumber = $(this).data( 'number' );
  var cardNumber = ui.draggable.data( 'number' );


  if ( slotNumber == cardNumber ) {
    ui.draggable.addClass( 'correct' );
    ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );
    $(this).css("opacity","0");
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
    correctCards++;
    switch (correctCards) {
          case 0:
              $("#return").html("Exato! Você está certo!");
              break;
          case 1:
              $("#return").html("Exato! Você está certo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio1").play();
              break;
          case 2:
              $("#return").html("Isso mesmo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio2").play();
              break;
          case 3:
              $("#return").html("Acertou de novo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio3").play();
              break;
          case 4:
              $("#return").html("Exato! Você está certo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio1").play();
              break;
          case 5:
              $("#return").html("Acertou de novo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio3").play();
              break;
          case 6:
              $("#return").html("Isso mesmo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio2").play();
              break;
          case 7:
              $("#return").html("Acertou de novo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio3").play();
              break;
          case 8:
              $("#return").html("Exato! Você está certo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio1").play();
              break;
          case 9:
              $("#return").html("Isso mesmo!");
              $("#return").css("transform","scale(1.2,1.2)");
              setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
              document.getElementById("audio2").play();
              break;
          case 10:
             $("#return").html("Muito bem! <br> Você completou o desafio! <br>" );
             document.getElementById("audio6").play();
              break;
      }
  }

  else if (slotNumber !== cardNumber) {
      wrongCards++;
      $("#return").css("transform","scale(1.2,1.2)");
      setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
      $("#return").html("Não, o item não pertence a este espaço. Vamos tentar novamente?");
       document.getElementById("audio4").play();
      if (wrongCards > 1){
          $("#return").html("Não, o item não pertence a este espaço. Vamos tentar novamente?");
          $("#return").css("transform","scale(1.2,1.2)");
          setTimeout(function(){ $("#return").css("transform","scale(1,1)"); }, 500);
      }
  }


  if ( correctCards == 6 ) {
      $("#trava-avanca").attr("onclick","$.fn.fullpage.moveSlideRight();");
      $("#trava-avanca").css("background-color","#cc8200");
      $("#trava-avanca").css("border-color","#af6c00");
      $("#trava-avanca").css("transform","scale(1.2,1.2)");
      setTimeout(function(){ $("#trava-avanca").css("transform","scale(1,1)"); }, 500);

  }

  //botão de fechar dentro do balão de fala
   $("#link-close").click(function(){
      $("#fixer").fadeOut();
  });

}

// botão que mostra o jogo para o usuário
$(function(){
  $("#show-app").click(function(){
    $("#fixer").fadeIn();
  });
});

jQuery.fn.clickToggle = function(a,b) {
  var ab = [b,a];
  return this.on("click", function(){ ab[this._tog^=1].call(this); });
};




$("#objeto-audio").clickToggle(function() {
      document.getElementById("audio1").muted = true;
      document.getElementById("audio2").muted = true;
      document.getElementById("audio3").muted = true;
      document.getElementById("audio4").muted = true;
      document.getElementById("audio5").muted = true;
      document.getElementById("audio6").muted = true;
     $('#objeto-audio').attr('src','img-jogo/obj-mudo.png');

}, function() {
     document.getElementById("audio1").muted = false;
      document.getElementById("audio2").muted = false;
      document.getElementById("audio3").muted = false;
      document.getElementById("audio4").muted = false;
      document.getElementById("audio5").muted = false;
      document.getElementById("audio6").muted = false;
     $('#objeto-audio').attr('src','img-jogo/obj-som.png');
});
