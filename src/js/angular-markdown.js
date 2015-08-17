(function () {
    angular.module('angularMarkdown', ['ngSanitize'])
        .config(function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        })
        .service('$markdown', ['$sce', '$sanitize', function ($sce, $sanitize) {
            var serviceInstance = {};
            var converter = new Showdown.converter();

            serviceInstance.markdownToHTML = function (text) {
                var txt = (text || '').replace(/\r?\n/g, '<br/>');
                var $text = $(converter.makeHtml(txt));
                var html = $text.html() || '';

                html = html.replace(/<soft-br\s*\/?>/g, ' <br class="hidden-xs hidden-sm" />');
                html = html.replace(/<youtube>(?:.*?v=)?(.*?)<\/youtube>/g, '<div class="thumbnail"><div class="embed-responsive embed-responsive-4by3"><iframe width="560" height="315" src="https://www.youtube.com/embed/$1?rel=0&amp;controls=0&amp;hd=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></div></div>');

                return $sce.trustAsHtml(html ? html : '');
            };

            return serviceInstance;
        }])
        .filter('markdown', ['$markdown', function ($markdown) {
            return function (text) {
                return $markdown.markdownToHTML(text);
            }
        }]);
})();