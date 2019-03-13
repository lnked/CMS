<!DOCTYPE html>
{strip}
<html lang="ru">
<head>
    <title>{$_meta.title}</title>

    {compress
        mode   = 'css'
        type   = 'inline'
        source = [
            [ 'file' => 'http://fonts.googleapis.com/css?family=Titillium+Web:300|Exo+2:300,400,700&subset=latin,cyrillic' ]
        ]
    }

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="cms" content="celebro.cms">
    <meta name="author" content="http://celebro.ru/">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <meta name="keywords" content="{$_meta.keywords}">
    <meta name="description" content="{$_meta.description}">

    <meta http-equiv="Cache-Control" content="public">
    <meta http-equiv="Cache-Control" content="max-age=3600, must-revalidate">

    <link rel="icon" type="image/png" href="/favicon.png">
</head>
<body>
<body>

{if isset($_sitemenu.main ) nocache}
    <ul>
    {foreach $_sitemenu.main as $e}
        <li><a href="{$e.link}" {if isset($uri[0]) && $uri[0] == $e.sys_name && !$uri[1]} class="current"{/if} data-instant>{$e.name}</a></li>
        {if !empty( $e.tree )}
        <ul>
            {foreach $e.tree as $i}
            <li><a href="{$i.link}" {if isset($uri[1]) && $uri[1] == $i.sys_name} class="current"{/if} data-instant>{$i.name}</a></li>
            {/foreach}
        </ul>
        {/if}
    {/foreach}
    </ul>
{/if}

<div class="content clearfix">
    {include file="./components/breadcrumbs.tpl"}

    <h2>{$_page.name}</h2>

    <!-- content -->
    {$_page.content}
    <!-- /content -->
</div>

{compress
    attr   = 'data-no-instant async'
    mode   = 'js'
    source = [
        [ 'file' => '/js/jquery.js' ],
        [ 'file' => '/js/app.js' ]
    ]
}
</body>
</html>
{/strip}