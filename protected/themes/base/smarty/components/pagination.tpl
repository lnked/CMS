{if isset($pagination.total) && isset($pagination.limit) && $pagination.total > $pagination.limit}
{strip}

{if isset($pagination.hash)}
	{$hash=$pagination.hash}
{/if}

<div class="pagination clearfix">

	<ul class="pagination__list" role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">
	
	{if isset($pagination.prev) && $pagination.prev !== ''}
		<li class="pagination__item"><a href="?page={$pagination.prev}{$hash}" class="pagination__item__page prev" rel="prev">&larr;</a></li>
	{/if}

	{section name=pager loop=$pagination.count step=1}
		{$page = $smarty.section.pager.index + 1}
		<li class="pagination__item"><a href="?page={$page}{$hash}" itemprop="url" class="pagination__item__page{if $page == $pagination.page} current{/if}"><span itemprop="name">{$page}</span></a></li>
	{/section}
	
	{if isset($pagination.next) && $pagination.next !== ''}
		<li class="pagination__item"><a href="?page={$pagination.next}{$hash}" class="pagination__item__page next" rel="next">&rarr;</a></li>
	{/if}
	
	</ul>

</div>

{/strip}
{/if}