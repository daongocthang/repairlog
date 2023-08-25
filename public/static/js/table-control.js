window.selectors = [];

const initTable = (elem) => {
    $(elem).bootstrapTable({
        icons: { clearSearch: 'glyphicon-remove' },
    });
    $(elem).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', () => {
        window.selectors = $.map($(elem).bootstrapTable('getSelections'), (row) => row.receiptNo);

        if (window.selectors.length) {
            $('#menuOthers .dropdown-item').removeClass('hidden');
            $('#menuOthers .dropdown-header').addClass('hidden');
            $('#menuDel').removeClass('disabled');
        } else {
            $('#menuOthers .dropdown-item').addClass('hidden');
            $('#menuOthers .dropdown-header').removeClass('hidden');
            $('#menuDel').addClass('disabled');
        }
    });

    // searchOnEnterKey
    $('.bootstrap-table .search input').on('keypress', function (e) {
        if (e.key === 'Enter') {
            $('.search input').select();
        }
    });
};
