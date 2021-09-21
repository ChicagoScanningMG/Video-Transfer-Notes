var spinner = $('#loader');
const scriptURLC ='https://script.google.com/macros/s/AKfycbzpkY2xyES0EpG_lWCa8AXWiIsWIYOWUGfB1e6re81KZ7xnhIdMog7DpOVAJzz1ME3Y/exec';
// const scriptURLC ='turd';
const serverlessForm = document.forms['serverless-form'];

$("#reset-btn").click(function(){
  $("#contactForm").trigger("reset");
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

  fetch(scriptURLC, {
          method: 'POST',
          body: new FormData(serverlessForm)
      })
      .then(res => {

          console.log(res);
          spinner.hide();

          if (res['status'] == 200) {
              Swal.fire({
                title: "Tape Logged!",
                text: "Tape #" + tapeNum + " For Order " + orderID + " Has Been Logged!",
                icon: "success",
                returnFocus: false
              }).then((result) => {
                if (result.isConfirmed) {
                  // Swal.fire('Saved!', '', 'success')
                  $('#tape-num').focus();
                }
              });

              // $(".resetAble").val("");
              $('#order-id').val(orderID);
              $('#stop-time').val("")
              $('#tape-num').val("");
              $('#qc-notes').val("");
              $("#billing-notes").val("").change();
              $('#needs-review').prop('checked', false);
              $('#notes-only').prop('checked', false);

              return true;

          } else {
              Swal.fire("Something went wrong!", "Review Footage Log and/or contact Admin<br/>" + orderID + "<br/>" + tapeNum + "<br/>" + qcNotes + "<br/>" + billingNotes, "error");

          }
          document.getElementById('submitForm').classList.remove('loading');

      })
      .catch(error => {
          spinner.hide();
          document.getElementById('submitForm').classList.remove('loading');
          Swal.fire("Something went wrong!", "Review Footage Log and/or contact Admin", "error");
          // todo enable submit button

      })


}
