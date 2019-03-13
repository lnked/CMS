<!DOCTYPE html>
<!-- (c) lnk. CELEBRO Studio | http://celebro.ru -->
<!--[if lt IE 7]><html class="ie6" lang="{$_page.lang}"><![endif]-->
<!--[if IE 7]>   <html class="ie7" lang="{$_page.lang}"><![endif]-->
<!--[if IE 8]>   <html class="ie8" lang="{$_page.lang}"><![endif]-->
<!--[if IE 9]>   <html class="ie9" lang="{$_page.lang}"><![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" itemscope="itemscope" itemtype="http://schema.org/{if !isset($uri[1])}WebPage{else}ItemPage{/if}" lang="{$_page.lang}">
<!--<![endif]-->
<head>
    <meta charset="UTF-8">
 
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="/css/main.min.css">

    <title itemprop="name">{$_meta.title}</title>
    
    <meta name="robots" content="{$_meta.robots}">
    <meta name="keywords" content="{$_meta.keywords}">
    <meta itemprop="description" name="description" content="{$_meta.description}">
    
    <meta name="cms" content="celebro.cms">
    <meta name="author" content="http://celebro.ru/">

    <meta itemprop="inLanguage" content="{$_page.lang}">

    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE">
    <meta name="format-detection" content="telephone=no">
    
    <meta http-equiv="imagetoolbar" content="no">
    <meta http-equiv="Cache-Control" content="public">
    <meta http-equiv="Cache-Control" content="max-age=3600, must-revalidate">
    
    <link rel="icon" type="image/png" href="/favicon.png">
    
    <link rel="home" href="/">
</head>
<body>

<div class="sidebar" itemscope="itemscope" itemtype="http://schema.org/WPSideBar">
    <a id="navigation-sandwich" class="navigation-sandwich" href="#"></a>
    
    <h1><a href="/" rel="home" accesskey="1" data-title="CELEBRO.CMS" data-instant>CELEBRO.CMS</a></h1>
    
    <ul class="nav">
    {foreach $_sitemenu.main as $page}
		{* $page *}
		<li itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$page.link}" class="nav__link" title="{$page.name}" itemprop="url" data-instant><span itemprop="name">{$page.name}</span></a>
		{if $page.tree}
			<ul>
			{foreach $page.tree as $submenu}
                <li itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$submenu.link}" class="nav__link" title="{$submenu.name}" itemprop="url" data-instant><span itemprop="name">{$submenu.name}</span></a>
                {if $submenu.tree}
                    <ul>
                    {foreach $submenu.tree as $last}
                        <li itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$last.link}" class="nav__link" title="{$last.name}" itemprop="url" data-instant><span itemprop="name">{$last.name}</span></a></li>
                    {/foreach}
                    </ul>
                {/if}
                </li>
            {/foreach}
			</ul>
		{/if}
		</li>
	{/foreach}
	</ul>

</div>

<div class="wrap" id="layout-wrapper">
    <div class="container">
        <div class="content clearfix" itemprop="mainContentOfPage">
            <h2>{$_page.name}</h2>
        
            {$_page.content}
        </div>
    </div>    
    
    <div class="footer" itemscope="itemscope" itemtype="http://schema.org/WPFooter">

    </div>
</div>

<script src="/js/main.min.js"></script>

</body>
</html>