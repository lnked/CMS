<!DOCTYPE html>
<!-- (c) lnk. celebro | http://www.celebro.ru/ -->
{strip}
<html>
<head>
    {compress
        mode   = 'css'
        type   = 'inline'
        source = [
            [
                'file'  => '/css/print.css'
            ]
        ]
    }

    <meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="cms" content="celebro.cms">
    <meta name="author" content="http://celebro.ru/">
    <meta name="viewport" content="width=960; user-scalable=yes">
    <meta name="keywords" content="{$_meta.keywords}">
    <meta name="description" content="{$_meta.description}">
    
    <meta http-equiv="Cache-Control" content="public">
    <meta http-equiv="Cache-Control" content="max-age=3600, must-revalidate">
	
	<link rel="icon" type="image/png" href="/images/favicon.png">
    <!--[if IE]><link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico"><![endif]-->
	<title>{$_meta.title}</title>
</head>

<!-- content -->
{eval var=$_page.content}
{include file="system/pager.tpl"}
<!-- /content -->

</body></html>
{/strip}