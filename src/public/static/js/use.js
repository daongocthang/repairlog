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

$('#navbarContent .launch-modal').on('click', function () {
    const { action, attached } = $(this).data();
    modal.show({
        ...$(this).data(),
        afterLoad: function () {
            $('#modal form').attr('action', action);
            $('.download__url').attr('href', attached);
        },
    });
});

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

    modal.submit(
        {
            url: form.attr('action'),
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                modal.dismiss();
                if (input.files[0]) $('#loader').modal('show');
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
    const data = parseJsonData(form.serializeArray());
    modal.submit(
        {
            url: form.attr('action'),
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
    const data = parseJsonData(form.serializeArray());
    modal.submit(
        { url: form.attr('action'), type: 'put', data: { order: JSON.stringify(data) } },
        (then = function () {
            notifyDataSetChanged();
        }),
    );
}
