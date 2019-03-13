{if isset($uri[1]) && isset($_breadcrumbs) nocache}
{strip}

<nav class="breadcrumbs clearfix">
	<ol class="breadcrumbs__list" itemscope itemtype="http://schema.org/BreadcrumbList">
	{foreach from=$_breadcrumbs item=i name=breadcrumbs}
		<li class="breadcrumbs__item" rel="nofollow" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
			{if $smarty.foreach.breadcrumbs.last}
				<span class="breadcrumbs__item__link current" itemprop="item">
					<span itemprop="name">{$i.name}</span>
				</span>
			{else}
				<a href="{$i.link}" class="breadcrumbs__item__link" itemprop="url item">
					<span itemprop="name">{$i.name}</span>
				</a>
			{/if}
			<meta itemprop="position" content="{$smarty.foreach.breadcrumbs.iteration}">
		</li>
	{/foreach}
	</ol>
</nav>

{/strip}
{/if}