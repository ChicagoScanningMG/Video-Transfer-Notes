var spinner = $('#loader');
const scriptURLC ='https://script.google.com/macros/s/AKfycbzuHgKLmcypyfGmtdYtQqJn3yNzBm-65uWgfih1YjaUc019vBcrG0kqqjCgbO28fmoo/exec'
const serverlessForm = document.forms['serverless-form'];

$("#reset-btn").click(function(){
  $("#contactForm").trigger("reset");
});



serverlessForm.addEventListener('submit', e => {
    e.preventDefault();
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
                swal("Tape Logged!",
                    "Tape #" + tapeNum + " For Order " + orderID + " Has Been Logged!", "success");
                return true;

            } else {
                swal("Something went wrong!", "Review Footage Log and/or contact Admin<br/>" + orderID + "<br/>" + tapeNum + "<br/>" + qcNotes + "<br/>" + billingNotes, "error");

            }
            document.getElementById('submitForm').classList.remove('loading');

        })
        .catch(error => {

            swal("Something went wrong!", "Review Footage Log and/or contact Admin", "error");
            // todo enable submit button

        })

        // $(".resetAble").val("");
        $('#order-id').val(orderID);
        $('#stop-time').val("XX:XX:XX")
        $('#tape-num').val("");
        $('#qc-notes').val("");
        $("#billing-notes").val("none").change();
        $('#needs-review').prop('checked', false);

});
