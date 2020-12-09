$(function() {
    $("#txtData").val(sessionStorage.getItem("data"));
    $("#txtRule").val(sessionStorage.getItem("rule"));
    $("#txtDataKeyword").val(sessionStorage.getItem("dataKeyword"));
    $("#txtRuleKeyword").val(sessionStorage.getItem("ruleKeyword"));
    $("#txtMatchPhone").val(sessionStorage.getItem("matchPhone"));
    $("#txtMatchKeyword").val(sessionStorage.getItem("matchKeyword"));

    $('#cbMatchPhone').change(function () {
        $('#txtMatchPhoneContainer').slideToggle();
    })
    
    $('#cbRandom').change(function () {
        randomOrder = !randomOrder;
    })
});