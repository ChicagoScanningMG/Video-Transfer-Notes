var spinner = $('#loader');
const scriptURLC ='https://script.google.com/macros/s/AKfycbwChFoeZe8vagm2tXzhIfFssGjYbItkuaFE-BHiS87MSJItse8kHuxU53z9oUNsPNGR/exec';
const serverlessForm = document.forms['serverless-form'];
var timerOn = false;
var bgAnimate = false;
var oldOrderID = 0000;
var currentOrderID = 0000;
var oldTech = "";
var currentTech = "";

var orderID;
var lastName;
var tapeNum;
var initials;
var qcNotes;
var needsReview;
var notesOnly;
var billingNotes;

$("#reset-btn").click(function(){
  $("#contactForm").trigger("reset");
  $(".pulled-detail").html("");
  $("#billing-notes").val("").change();
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
  console.log("Stop button Clicked");
  resetTimer();

})

$("#progress-btn").click(function(){

  console.log("Order Progress Button Clicked");
  getOrderProgress(orderID);

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

      $("body").css({"animation-name":"doneFlash", "animation-duration":"1.6s", "animation-iteration-count":"infinite"})

    }

    if (timerOn == false) {
      clearInterval(timer);
      countdownDuration = 10 * 60 * 1000;
    }

  }, 1000);

}


//Get Order Notes
$('#order-id').change(function(){

  var orderID = $('#order-id').val();
  var tapeName = orderID.split("_");
  $("#logged-text").html("");

  if (tapeName.length > 1){

    $('#order-id').val(tapeName[0]);
    $('#last-name').val(tapeName[1]);
    $('#tape-num').val(tapeName[2]);
    $('#tape-num').focus();

  }

  currentOrderID = $('#order-id').val();
  currentTech = $('#initials').val();

  console.log("Getting Order Notes");
  $('#order-notes').html("Retrieving Order Notes");
  $('#last-name').val("");
  $('#last-name').attr("placeholder", "Retrieving Customer Name");
  getOrderDetails(currentOrderID, $('#tape-num').val(), currentTech);
})

$('#tape-num').change(function(){

  currentOrderID = $('#order-id').val();
  currentTech = $('#initials').val();
  $("#logged-text").html("");

  $('#existing-qc-notes').html("Retrieving Tape Notes");
  getOrderDetails(currentOrderID, $('#tape-num').val(), currentTech);

})

//If the initials have been updated, update order Status on Order Tracking.
$('#initials').change(function(){

  currentOrderID = $('#order-id').val();
  currentTech = $('#initials').val();

  getOrderDetails(currentOrderID, $('#tape-num').val(), currentTech);

})

//-----------------------------------------------------------------
//~~~~~~~~~~~~~~~~~~~~~~~~~Form Submission~~~~~~~~~~~~~~~~~~~~~~~~~
//-----------------------------------------------------------------

function getFormDetails(){

  orderID = $('#order-id').val();
  lastName = $('#last-name').val();
  tapeNum = $('#tape-num').val();
  initials = $('#initials').val();
  qcNotes = $('#qc-notes').val();
  needsReview = $('#needs-review').is(":checked");
  notesOnly = $('#notes-only').is(":checked");
  billingNotes = $('#billing-notes').val();

  if (currentOrderID != oldOrderID || currentTech != oldTech){

    checkOrderStatus = true;
    oldOrderID = currentOrderID;
    oldTech = currentTech;

  } else {

    checkOrderStatus = false;

  }

}

serverlessForm.addEventListener('submit', e => {
    e.preventDefault();

    getFormDetails();

    console.log("Tape Number: " + tapeNum);

    var standardMessage = {

      title: 'Ready to Log Tape <br/>' + orderID + '_' + lastName + '_ ' + tapeNum + '?',
      text: 'Has the file been reviewed?  Ready to Log Tape?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Log Tape',
      returnFocus: false,
      focusCancel: true

    };

    var loggedMessage = {

      title: 'TAPE IS ALREADY LOGGED! <br/>' + orderID + '_' + lastName + '_ ' + tapeNum,
      text: 'This tape has already been logged! Please confirm the tape information is correct and select "Log Notes Only" to log the tape.',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: false,
      confirmButtonText: 'Log Tape',
      returnFocus: false,
      focusCancel: true

    };

    var message = {};

    if ($("#logged-text").html() != ""){

      if (!$("#notes-only").prop('checked')){

        message = loggedMessage;

      } else {

        loggedMessage.showConfirmButton = true;
        loggedMessage.text = "Tape has already been logged! Confirm you would like to log notes only!";

        message = loggedMessage;

      }

    } else {

      message = standardMessage;

    }

    Swal.fire(message).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire('Saved!', '', 'success')
        logTape(e)
      }
    })

});

function logTape(e){

  spinner.show();

  getFormDetails();

  var params = new URLSearchParams({
    orderID: orderID,
    lastName: lastName,
    tapeNum: tapeNum,
    initials: initials,
    qcNotes: qcNotes,
    needsReview: needsReview,
    notesOnly: notesOnly,
    billingNotes: billingNotes,
    orderCategory: "video",
    requestType: "logTape"
  });

  console.log("Notes Only: " + notesOnly);

  var tapeProgress = "";

  fetch(scriptURLC, {
          method: 'POST',
          body: params
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
                      $('#logged-text').html("");
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

function getOrderDetails(orderID, tapeNum, initials){

  getFormDetails();

  var params = new URLSearchParams({
    orderID: orderID,
    tapeNum: tapeNum,
    initials: initials,
    checkOrderStatus: checkOrderStatus,
    requestType: "getOrderDetails"
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
      $("#order-notes").html('<a href="' + data.orderURL + '" target="_blank">Link to File Log</a>' + '</br>' + data.orderNotes);
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


      try {
        // Your asynchronous code here
        if (data.logged === true) {
          $("#logged-text").html("(Tape Already logged)");
        }
      } catch {
        console.log("Error occurred: " + error.message);
        console.log("No logging information Present");
      }

      console.log(data)
    });

}

function getOrderProgress(orderID){

  spinner.show();

  getFormDetails();

  var params = new URLSearchParams({
    orderID: orderID,
    requestType: "getOrderProgress"
  });

  console.log("Getting Order Progress");

  var tapeProgress = "";

  fetch(scriptURLC, {
          method: 'POST',
          body: params
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
                    title: "Current Order Progress",
                    html: data.tapeProgress,
                    icon: "success",
                    returnFocus: false
                  }).then((result) => {
                    if (result.isConfirmed) {

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
                Swal.fire("Something went wrong!", "Please Try Again or Contact Admin", "error");

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

function copyToClipboard(value) {
  var tempInput = document.createElement("input");
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}
