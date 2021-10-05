var spinner = $('#loader');
const scriptURLC ='https://script.google.com/macros/s/AKfycbwOfIsJmBwuIP4LF633tpTgrR7GJD9M8b4NN0EZ7fmSueHKXXcr0gMgeCnNzW7n7GFv/exec';
// const scriptURLC ='turd';
const serverlessForm = document.forms['serverless-form'];

$("#reset-btn").click(function(){
  $("#contactForm").trigger("reset");
  $(".pulled-detail").html("");
});

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
