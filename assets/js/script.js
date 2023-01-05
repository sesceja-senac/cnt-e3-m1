$(document).ready(function() {   
    AOS.init();
})

$('.painel-container button').hover(function (){
    $(this).css('transform', 'scale(2)')
}, function (){
    $(this).css('transform', 'scale(1)')
})

$('.card-sesc').click(function(){
    if($('.card-sesc .active').css('display')!=='none'){
        $('.card-sesc .active').fadeOut()
        $('figcaption.active').fadeOut()
        window.setTimeout(function(){
        $('.card-sesc .hidden').fadeIn()
        $('figcaption.hidden').fadeIn()
    }, 500)
    } else if($('.card-sesc .hidden').css('display')!=='none'){
        $('.card-sesc .hidden').fadeOut()
        $('figcaption.hidden').fadeOut()
    window.setTimeout(function(){
        $('.card-sesc .active').fadeIn()
        $('figcaption.active').fadeIn()
    }, 500)
    }
    
})


$('#bt-audio1').click(function(){
    document.querySelector('#tobe-snd1').play()
})
$('#bt-audio2').click(function(){
    document.querySelector('#tobe-snd2').play()
})
$('#bt-audio3').click(function(){
    document.querySelector('#tobe-snd3').play()
})
$('#bt-audio4').click(function(){
    document.querySelector('#tobe-snd4').play()
})
$('#bt-audio5').click(function(){
    document.querySelector('#tobe-snd5').play()
})
$('#bt-audio6').click(function(){
    document.querySelector('#tobe-snd6').play()
})
$('#bt-audio7').click(function(){
    document.querySelector('#tobe-snd7').play()
})
$('#bt-audio8').click(function(){
    document.querySelector('#tobe-snd8').play()
})
$('#bt-audio9').click(function(){
    document.querySelector('#snd9').play()
})

$('.bt-container button').click(function(){
    $('.bt-container button').removeClass('active')
    $(this).addClass('active')
})


$('#bt-play1').click(function(){
    document.querySelector('#bru-snd1').play()
})
$('#bt-play2').click(function(){
    document.querySelector('#bru-snd2').play()
})
$('#bt-play3').click(function(){
    document.querySelector('#bru-snd3').play()
})
$('#bt-play4').click(function(){
    document.querySelector('#bru-snd4').play()
})
$('#bt-play5').click(function(){
    document.querySelector('#bru-snd5').play()
})
$('#bt-play6').click(function(){
    document.querySelector('#bru-snd6').play()
})
$('#bt-play7').click(function(){
    document.querySelector('#bru-snd7').play()
})
$('#bt-play8').click(function(){
    document.querySelector('#bru-snd8').play()
})