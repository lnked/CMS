{strip}
<aside class="sidebar" itemscope="itemscope" itemtype="http://schema.org/WPSideBar">
	<a id="navigation-sandwich" class="navigation-sandwich" href="#"></a>
	
	<h1 class="sidebar__logo" itemprop="name"><a href="/" rel="home" itemprop="url" accesskey="1" data-title="CELEBRO.CMS" data-instant>CELEBRO.CMS</a></h1>
	
	<a href="/examples/shop/cart" class="cart-holder js-cart-holder">
		<span class="cart-holder__count watch-cart-count">{$smarty.session.cart.result.count}</span>
		<span class="cart-holder__total">на <span class="cart-holder__total__value watch-cart-money">{$smarty.session.cart.result.money|to_money}</span> р.</span>
		<span class="cart-holder__empty">корзина пуста</span>
	</a>

	{$accesskey = 1}

	<a accesskey="§" title="Меню сайта"></a>
	{if isset($_sitemenu.main) nocache}
		<ul class="navigation" role="navigation">
		{foreach $_sitemenu.main as $e}
			{$accesskey = $accesskey + 1}
		  
			<li class="navigation__item" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$e.link}" class="navigation__item__link{if isset($uri[0]) && $uri[0] == $e.sys_name || !isset($uri[0]) && $e.sys_name == 'main'} current{/if}" title="{$e.name}" itemprop="url" accesskey="{$accesskey}" data-instant><span itemprop="name">{$e.name}</span></a>
				{if !empty($e.tree)}
				<ul class="navigation__item__submenu">
				{foreach $e.tree as $i}
					{$accesskey = $accesskey + 1}
					<li class="navigation__item" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$i.link}" class="navigation__item__link{if isset($uri[1]) && $uri[1] == $i.sys_name} current{/if}" title="{$i.name}" itemprop="url" accesskey="{$accesskey}" data-instant><span itemprop="name">{$i.name}</span></a>
						{if !empty( $i.tree )}
						<ul class="navigation__item__submenu">
						{foreach $i.tree as $s}
							{$accesskey = $accesskey + 1}
							<li class="navigation__item navigation__item_dots" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$s.link}" class="navigation__item__link{if isset($uri[2]) && $uri[2] == $s.sys_name} current{/if}" title="{$s.name}" itemprop="url" accesskey="{$accesskey}" data-instant><span itemprop="name">{$s.name}</span></a>
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
	{/if}
</aside>
{/strip}