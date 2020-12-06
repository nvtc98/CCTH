$(function() {
    $("#txtData").val(sessionStorage.getItem("data"));
    $("#txtRule").val(sessionStorage.getItem("rule"));
    $("#txtMatchPhone").val(sessionStorage.getItem("matchPhone"));
    $("#txtMatchKeyword").val(sessionStorage.getItem("matchKeyword"));

    $('#cbMatchPhone').change(function () {
        $('#txtMatchPhoneContainer').slideToggle();
    })
    
    $('#cbRandom').change(function () {
        randomOrder = !randomOrder;
    })
});