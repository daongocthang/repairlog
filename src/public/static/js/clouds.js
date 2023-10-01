function renderClouds(update) {
    $.get('/api/v1/clouds', function (res, status) {
        if (status === 'success') {
            const root = $('#clouds');
            const htmlStr =
                '<li class="nav-item hidden"><a class="nav-link" href="/clouds/{0}">{1}\t<span class="badge badge-{3}">{2}</span></a></li>';
            res.tags.forEach(function (elem) {
                let { style, slug, name, count } = elem;
                if (!update) root.append(htmlStr.f(slug, name, count, style));
                let selector = root.find(`a[href$="${slug}"]`);
                if (count > 0) {
                    selector.find('span.badge').text(count);
                    selector.parent().removeClass('hidden');
                } else {
                    selector.parent().addClass('hidden');
                }
            });

            root.find(`a[href$="${window.location.pathname}"]`).addClass('active');
        }
    });
}

$(function () {
    renderClouds();
});
