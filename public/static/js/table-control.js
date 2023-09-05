var selections = [];

const initTable = function (tableId) {
    $(tableId).bootstrapTable({
        icons: { clearSearch: 'glyphicon-remove' },
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
    $('#menuOthers').on('click', 'li.dropdown-item', function () {
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
