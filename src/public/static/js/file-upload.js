$('#form').submit(function () {
    $('#status').empty().text('File is uploading...');
    $(this).ajaxSubmit({
        error: function (err) {
            $('#status').empty().text(err.responseJSON.message);
        },

        success: function (res) {
            renderStats(true);
            $('#status').empty().text(res.message);
        },
    });
    //Very important line, it disable the page refresh.
    return false;
});
