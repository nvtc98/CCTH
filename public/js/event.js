$(function() {
    $("#txtData").val(sessionStorage.getItem("data"));
    $("#txtRule").val(sessionStorage.getItem("rule"));

    $("#txtDataKeyword1").val(sessionStorage.getItem("dataKeyword1"));
    $("#txtDataKeyword2").val(sessionStorage.getItem("dataKeyword2"));
    $("#txtKeywordList").val(sessionStorage.getItem("keywordList"));

    $("#txtMatchPhone").val(sessionStorage.getItem("matchPhone"));
    $("#txtMatchKeyword").val(sessionStorage.getItem("matchKeyword"));

    $('#cbMatchPhone').change(function () {
        $('#txtMatchPhoneContainer').slideToggle();
    })
    
    $('#cbRandom').change(function () {
        randomOrder = !randomOrder;
    })
});