$('.dt-picker').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true,
    todayHighlight: true,
    disableTouchKeyboard: true,
    keyboardNavigation: false,
});
$('.dt-0').datepicker('update', moment().toDate());
$('.dt-3').datepicker('update', moment().subtract(3, 'months').toDate());

const ErrMsg = {
    required: 'Bắt buộc nhập mã phiếu',
    length: 'Mã phiếu không hợp lệ',
};

function removeAllSelections() {
    if (!selections) return;
    const form = $('#modal form');
    if (!form) return;

    modal.submit(
        {
            url: 'api/v1/order',
            type: 'delete',
            data: { selections: JSON.stringify(selections) },
        },
        (then = function () {
            notifyDataSetChanged();
        }),
    );
}

function uploadExcelFile() {
    const form = $('#modal form');
    if (!form) return;
    const input = form.find('input')[0];

    formData = new FormData();
    formData.append('file', input.files[0]);
    console.log();
    modal.submit(
        {
            url: '/api/v1/import/create',
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                modal.dismiss();
                $('#loader').modal('show');
            },
        },
        function () {
            notifyDataSetChanged();
        },
    );
}
function createOrder() {
    const form = $('#modal form');
    if (!form) return;
    form.validate({
        rules: {
            receiptNo: {
                minlength: 31,
                maxlength: 32,
            },
        },
        messages: {
            receiptNo: {
                required: ErrMsg.required,
                minlength: ErrMsg.length,
                maxlength: ErrMsg.length,
            },
            model: {
                required: ErrMsg.required,
            },
        },
    });

    if (!form.valid()) return;
    const data = parseSerializeArray(form.serializeArray());
    modal.submit(
        {
            url: 'api/v1/order',
            type: 'post',
            data: { order: JSON.stringify(data) },
        },
        (then = function () {
            notifyDataSetChanged();
        }),
    );
}
function updateByPk() {
    const form = $('#modal form');
    if (!form) return;
    const data = parseSerializeArray(form.serializeArray());
    modal.submit(
        { url: '/api/v1/order/update', type: 'put', data: { order: JSON.stringify(data) } },
        (then = function () {
            notifyDataSetChanged();
        }),
    );
}
