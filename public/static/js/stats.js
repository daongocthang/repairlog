function renderStats(update) {
    // $('#stats').empty();
    $.get('/api/v1/stats', function (res, status) {
        if (status === 'success') {
            let htmlStr = '<li><a class="bg-{0} hidden" href="/{1}">{2} <span class="badge">{3}</span></a></li>';
            res.data.forEach(function (elem) {
                let { attr, slug, name, count } = elem;
                if (!update) $('#stats').append(htmlStr.f(attr, slug, name, count));
                let selector = $("#stats a[href$='{0}']".f(slug));
                if (count > 0) {
                    selector.find('span.badge').text(count);
                    selector.removeClass('hidden');
                } else {
                    selector.addClass('hidden');
                }
            });
        }
    });
}

$(function () {
    renderStats();
});
