{*
{strip}
<span class="sandwich js-sandwich-menu">
	<span class="sandwich__layer">Menu</span>
</span>

<header class="layout-header" itemscope="itemscope" itemtype="http://schema.org/WPHeader" id="header">
	<div class="layout-header__wrapper">

		{if !isset($uri[0])}
		<span class="layout-header__logo logo"><span itemprop="name">Строительная компания "Зенит"</span></span>
		{else}
		<a href="/" class="layout-header__logo logo" rel="home" itemprop="url" accesskey="1" data-instant><span itemprop="name">Строительная компания "Зенит"</span></a>
		{/if}
		
		{$accesskey = 1}
		
		{if isset($_sitemenu.main) nocache}
		<nav class="layout-header__navigation navigation" role="navigation" id="navigation">
			<div class="navigation__wrapper">
				<ul class="navigation__list clearfix">
				
				{foreach $_sitemenu.main as $e}
					
					{$accesskey = $accesskey + 1}

					<li class="navigation__item{if !empty($e.tree)} js-dropdown{/if}" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement">
						{if (isset($uri[0]) && $uri[0] == $e.sys_name || !isset($uri[0]) && $e.sys_name == 'main') && empty($e.tree)}
							<span class="navigation__link{if !empty($e.tree)} navigation__link_dropdown{/if} current" title="{$e.name}"><span class="navigation__link__middle" itemprop="name">{$e.name}</span></span>
						{else}
							<a href="{$e.link}" class="navigation__link{if !empty($e.tree)} navigation__link_dropdown{/if}{if isset($uri[0]) && $uri[0] == $e.sys_name || !isset($uri[0]) && $e.sys_name == 'main'} current{/if}" title="{$e.name}" itemprop="url" accesskey="{$accesskey}" data-instant><span class="navigation__link__middle" itemprop="name">{$e.name}</span></a>
						{/if}
						
						{if !empty($e.tree)}
						<ul class="navigation__item__submenu submenu">
						
						{foreach $e.tree as $i}	
							
							{$accesskey = $accesskey + 1}
							<li class="submenu__item" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$i.link}" class="submenu__link{if isset($uri[1]) && $uri[1] == $i.sys_name} current{/if}" title="{$i.name}" itemprop="url" accesskey="{$accesskey}" data-instant><span itemprop="name">{$i.name}</span></a></li>

						{/foreach}

						</ul>
						{/if}

					</li>

				{/foreach}

				</ul>
			</div>
		</nav>
		{/if}
		
		<div class="layout-header__phone phone" id="phone">
			{if isset($uri[0]) && urldecode($uri[0]) == 'контакты'}
				<span class="phone__feedback__label">Обратная связь</span>
			{else}
				<a href="/контакты#feedback" class="phone__feedback__link">Обратная связь</a>
			{/if}
			<div class="phone__item"><a href="tel:8-800-505-13-04" class="phone__item__link">8 (800) <strong>505-13-04</strong></a></div>
			<div class="phone__item"><a href="tel:8-989-849-78-30" class="phone__item__link">8 (989) <strong>849-78-30</strong></a></div>
		</div>
		
	</div>
</header>
{/strip}
*}