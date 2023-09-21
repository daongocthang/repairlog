$('.dt-picker').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true,
    todayHighlight: true,
    disableTouchKeyboard: true,
    keyboardNavigation: false,
});
$('.dt-0').datepicker('update', moment().toDate());
$('.dt-3').datepicker('update', moment().subtract(3, 'months').toDate());

function removeAllSelections() {
    if (!selections) return;
    const form = $('#modal form');
    if (!form) return;

    handleModalSubmit({
        type: 'delete',
        data: { selections: JSON.stringify(selections) },
        then: function () {
            notifyDataSetChanged();
        },
    });
}

function createByFile() {}
function updateByFile() {}
function createOne() {
    const form = $('#modal form');
    if (!form) return;
    form.validate({
        messages: {
            receiptNo: {
                required: 'Bắt buộc nhập mã phiếu',
            },
            model: {
                required: 'Bắt buộc nhập tên TB',
            },
        },
    });

    if (!form.valid()) return;
    const data = form.serializeArray();

    modal.submit({
        data: { stringified: JSON.stringify(data) },
        then: function () {
            notifyDataSetChanged();
        },
    });
}
function updateByPk() {}
