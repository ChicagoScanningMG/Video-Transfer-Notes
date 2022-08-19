var spinner = $('#loader');
const scriptURLC ='https://script.google.com/macros/s/AKfycbwOfIsJmBwuIP4LF633tpTgrR7GJD9M8b4NN0EZ7fmSueHKXXcr0gMgeCnNzW7n7GFv/exec';
// const scriptURLC ='turd';
const serverlessForm = document.forms['serverless-form'];
var timerOn = false;
var bgAnimate = false;

$("#reset-btn").click(function(){
  $("#contactForm").trigger("reset");
  $(".pulled-detail").html("");
  resetTimer();
});

var countdownDuration = 10 * 60 * 1000;

$("#restart-button").click(function(){

  console.log("restart button Clicked");
  countdownDuration = 10 * 60 * 1000;
  $("#stop-timer").html("10:00");
  if (timerOn == false){

    timerOn = true;
    runTimer();

  }
  $("body").css({"animation-name":"", "animation-duration":"", "animation-iteration-count":""})

})

$("#stop-button").click(function(){
  console.log("stop button Clicked");
  resetTimer();

})

function resetTimer(){

  timerOn = false;
  bgAnimate = false;
  $("body").css({"animation-name":"", "animation-duration":"", "animation-iteration-count":""})
  $("#stop-timer-button").css("display", "");
  $("#stop-timer-div").css("display", "none");
  $("body").css("background-color", "black");
  // clearInterval(timer);
  countdownDuration = 10 * 60 * 1000;

}

$("#stop-timer-button").click(function(){

  runTimer();

})

function runTimer(){

  console.log("stop timer button clicked");
  timerOn = true;
  $("#stop-timer-button").css("display", "none");
  $("#stop-timer-div").css("display", "inherit");
  $("#stop-timer").css("width", $("#stop-timer").width());


  var now = new Date().getTime();
  var countdownTime = now + countdownDuration;

  console.log("Countdown Duration: " + countdownDuration);
  console.log("current Time: " + now);
  console.log("Countdown Time: " + countdownTime);

  var timer = setInterval(function(){
    console.log("Tick");

    var now = new Date().getTime();

    var distance = (now + countdownDuration) - now;
    console.log("countdownTime: " + countdownTime);

    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (seconds < 10) seconds = "0" + seconds;

    $("#stop-timer").html(minutes + ":" + seconds);

    countdownDuration = countdownDuration - 1000;

    // If the count down is finished, write some text
    if (distance <= 0) {
      clearInterval(timer);
      countdownDuration = 10 * 60 * 1000;
      timerOn = false;
      bgAnimate = true;

      // var flashRed = setInterval(function(){
      //
      //   if (bgAnimate == false){
      //     clearInterval(flashRed);
      //     return;
      //   }
      //
      //   $("body").animate({"background-color": "rgb(235, 0, 0)"}, 400)
      //     .delay(400)
      //     .animate({"background-color": "black"}, 400);
      //
      // }, 1600);

      $("body").css({"animation-name":"doneFlash", "animation-duration":"1.6s", "animation-iteration-count":"infinite"})

    }

    if (timerOn == false) {
      clearInterval(timer);
      countdownDuration = 10 * 60 * 1000;
    }

  }, 1000);

}
