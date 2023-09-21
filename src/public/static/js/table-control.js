var selections = [];

const initTable = function (tableId) {
    $(tableId).bootstrapTable({
        icons: { clearSearch: 'glyphicon-remove' },
        columns: [
            {
                field: 'state',
                checkbox: true,
            },
            {
                field: 'receiptNo',
                title: 'Mã phiếu',
                sortable: true,
            },
            {
                field: 'model',
                title: 'Tên TB',
                sortable: true,
            },
            {
                field: 'serial',
                title: 'Serial',
                sortable: true,
            },
            {
                field: 'description',
                title: 'Mô tả lỗi',
                sortable: true,
            },
            {
                field: 'newSerial',
                title: 'Serial mới',
                sortable: true,
            },
            {
                field: 'method',
                title: 'Biện pháp',
                sortable: true,
            },
            {
                field: 'remark',
                title: 'Chi tiết SC',
                sortable: true,
            },
            {
                field: 'status',
                title: 'Trạng thái',
                sortable: true,
            },
            {
                field: 'createdAt',
                title: 'Ngày lập',
                sortable: true,
            },
            {
                field: 'operate',
                title: 'Thao tác',
                align: 'center',
                formatter: operateFomatter,
                events: window.operateEvents,
            },
        ],
    });

    $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        selections = $.map($(tableId).bootstrapTable('getSelections'), (row) => row.receiptNo);
        notifySelectionChanged();
    });

    // searchOnEnterKey
    $('.bootstrap-table .search input').on('keypress', function (e) {
        if (e.key === 'Enter') {
            $('.search input').select();
        }
    });

    // onOptionItemSelected
    $('#menuOthers').on('click', '.dropdown-item', function () {
        $.ajax({
            url: $(this).data('url'),
            type: 'POST',
            caches: false,
            data: { serializable: JSON.stringify(selections) },
            success: function (data) {
                renderStats(true);
                $(tableId).bootstrapTable('refresh');
                selections = [];
                notifySelectionChanged();
            },
        });
    });
};

window.operateEvents = {
    'click .btn-modal': function (e, value, row, index) {
        const { receiptNo, method, newSerial, remark } = row;

        showModal({
            title: 'Sửa chữa',
            body: '/api/v1/view/update',
            submit: { class: 'btn btn-success', text: 'Cập nhật', handler: 'onModalSubmit' },
            dataForm: { receiptNo, method, newSerial, remark },
        });
    },
};

function operateFomatter(value, row, index) {
    return `<button class="btn btn-outline-primary btn-sm btn-modal" 
    type="button">
    <i class="fa fa-pen"></i>
    </button>`;
}

function notifySelectionChanged() {
    if (selections.length) {
        $('#menuOthers .dropdown-item').removeClass('hidden');
        $('#menuOthers .dropdown-header').addClass('hidden');
        $('#menuDel').removeClass('disabled');
    } else {
        $('#menuOthers .dropdown-item').addClass('hidden');
        $('#menuOthers .dropdown-header').removeClass('hidden');
        $('#menuDel').addClass('disabled');
    }
}

function loadingTemplate() {
    return `<i class="fa fa-spinner fa-spin"></i>`;
}

$(function () {
    initTable('#table');
});
