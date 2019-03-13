{strip}

<!-- <script src="//api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script> -->

{* type   = 'inline' *}

{compress
    attr   = 'data-no-instant'
    mode   = 'js'
    source = [
        [ 'file' => '/js/vendor.min.js' ],
        [ 'file' => '/js/app.min.js' ]
    ]
}

{if isset($suggestions)}
    <!--[if lt IE 10]><script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery-ajaxtransport-xdomainrequest/1.0.1/jquery.xdomainrequest.min.js"></script><![endif]-->
    <script type="text/javascript" src="https://dadata.ru/static/js/lib/jquery.suggestions-15.12.min.js"></script>
{/if}

</body>
</html>
{/strip}