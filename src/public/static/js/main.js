$('.dt-picker').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true,
    todayHighlight: true,
    disableTouchKeyboard: true,
    keyboardNavigation: false,
});
$('.dt-0').datepicker('update', moment().toDate());
$('.dt-3').datepicker('update', moment().subtract(3, 'months').toDate());
