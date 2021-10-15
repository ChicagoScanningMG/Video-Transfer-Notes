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
  bgAnimate = false;

})

$("#stop-button").click(function(){
  console.log("stop button Clicked");
  resetTimer();

})

function resetTimer(){

  timerOn = false;
  bgAnimate = false;
  $("#stop-timer-button").css("display", "inherit");
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

      var flashRed = setInterval(function(){

        if (bgAnimate == false){
          clearInterval(flashRed);
          return;
        }

        $("body").animate({"background-color": "rgb(235, 0, 0)"}, 400)
          .delay(400)
          .animate({"background-color": "black"}, 400);

      }, 1600);

    }

    if (timerOn == false) {
      clearInterval(timer);
      countdownDuration = 10 * 60 * 1000;
    }

  }, 1000);

}

$("#order-id").change(function(){

  var orderID = $('#order-id').val();
  var tapeName = orderID.split("_");

  if (tapeName.length > 1){

    $('#order-id').val(tapeName[0]);
    $('#last-name').val(tapeName[1]);
    $('#tape-num').val(tapeName[2]);
    $('#tape-num').focus();

  }



})

$('#order-id').change(function(){
  $('#order-notes').html("Retrieving Order Notes");
  $('#last-name').val("");
  $('#last-name').attr("placeholder", "Retrieving Customer Name");
  getOrderDetails($('#order-id').val(), $('#tape-num').val());
})

$('#tape-num').change(function(){
  $('#existing-qc-notes').html("Retrieving Tape Notes");
  getOrderDetails($('#order-id').val(), $('#tape-num').val());
})





serverlessForm.addEventListener('submit', e => {
    e.preventDefault();

    var orderID = $('#order-id').val();
    var lastName = $('#last-name').val();
    var tapeNum = $('#tape-num').val();
    var qcNotes = $('#qc-notes').val();
    var billingNotes = $('#billing-notes').val();

    Swal.fire({
      title: 'Ready to Log Tape <br/>' + orderID + '_' + lastName + '_ ' + tapeNum + '?',
      text: 'Has the file been reviewed?  Ready to Log Tape?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Log Tape',
      returnFocus: false,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire('Saved!', '', 'success')
        logTape(e)
      }
    })

});

function logTape(e){

  spinner.show();

  var orderID = $('#order-id').val();
  var tapeNum = $('#tape-num').val();
  var qcNotes = $('#qc-notes').val();
  var billingNotes = $('#billing-notes').val();

  console.log(orderID);

  var tapeProgress = "";

  fetch(scriptURLC, {
          method: 'POST',
          body: new FormData(serverlessForm)
      })
      .then(res => {

          console.log(res);
          spinner.hide();

          res.json().then(function(data) {
            console.log(data);
            tapeProgress = data.tapeProgress;

            if (res['status'] == 200) {

                if(data.errorTitle == ""){
                  Swal.fire({
                    title: "Tape Logged!",
                    html: "Tape #" + tapeNum + " For Order " + orderID + "_" + $("#last-name").val() + " Has Been Logged!" + "<br/>" + data.tapeProgress,
                    icon: "success",
                    returnFocus: false
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Swal.fire('Saved!', '', 'success')
                      // $(".resetAble").val("");
                      resetTimer();
                      $('#order-id').val(orderID);
                      $('#stop-time').val("")
                      $('#tape-num').val("");
                      $('#qc-notes').val("");
                      $("#billing-notes").val("").change();
                      $('#needs-review').prop('checked', false);
                      $('#notes-only').prop('checked', false);
                      $('#existing-qc-notes').html("");
                      $('#tape-num').focus();
                    }
                  });
                } else { //There was a logging error

                  Swal.fire({
                    title: data.errorTitle,
                    html: data.errorText,
                    icon: "error",
                    returnFocus: false
                  });

                }

                return true;

            } else {
                Swal.fire("Something went wrong!", "Review Footage Log and/or contact Admin<br/>" + orderID + "<br/>" + tapeNum + "<br/>" + qcNotes + "<br/>" + billingNotes, "error");

            }

          });



          document.getElementById('submitForm').classList.remove('loading');

      })
      .catch(error => {
          spinner.hide();
          // document.getElementById('submitForm').classList.remove('loading');
          Swal.fire("Something went wrong!", "Review Footage Log and/or contact Admin", "error");
          // todo enable submit button

      })
}

function getOrderDetails(orderID, tapeNum){

  const params = new URLSearchParams({
    orderID: orderID,
    tapeNum: tapeNum,
    getOrderDetails: true
  });

    fetch(scriptURLC, {

      method: 'POST',
      body: params

    }).then(response => response.json())
    .then(data => {

      var splitNotes = data.tapeNotes.split("\n\n");
      console.log(splitNotes);
      var formattedNotes = "";

      if (splitNotes.length > 1){

        splitNotes.forEach(line => formattedNotes = formattedNotes + line + "<br/>");

      } else {

        formattedNotes = data.tapeNotes;

      }

      $("#existing-qc-notes").html(formattedNotes);
      $("#order-notes").html(data.orderNotes);
      $("#last-name").val(data.customerName);

      copyToClipboard($('#order-id').val() + "_" + $('#last-name').val() + "_" + ('000' + $('#tape-num').val()).slice(-3))

      $('#last-name').attr("placeholder", "Smith");

      if ($('#tape-num').val() == "") {
        $('#tape-num').focus();
      } else if ($("#initials").val() == "") {
        $('#initials').focus();
      } else {
        $('#qc-notes').focus();
      }

      console.log(data)
    });

}

function copyToClipboard(value) {
  var tempInput = document.createElement("input");
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}
