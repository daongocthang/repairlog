$('#form').submit(function () {
    $('#status').empty().text('File is uploading...');
    $(this).ajaxSubmit({
        error: function (err) {
            console.log(err);
            $('#status').empty().text(err.responseJSON.message);
        },

        success: function (res) {
            renderStats();
            $('#status').empty().text(res.message);
            console.log(res);
        },
    });
    //Very important line, it disable the page refresh.
    return false;
});
