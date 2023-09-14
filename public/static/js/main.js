$('.calendar').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true,
    todayHighlight: true,
    disableTouchKeyboard: true,
    keyboardNavigation: false,
});
$('#startDate').datepicker('setStartDate', moment().subtract(3, 'months').toDate());
$('#startDate').datepicker('setDate', moment().subtract(3, 'months').toDate());
$('#endDate').datepicker('setStartDate', new Date());
$('#endDate').datepicker('setDate', new Date());

$(function () {
    $('.btn-search').click(function (e) {
        // e.preventDefault();
        $('.search-box').toggle();
    });
});
