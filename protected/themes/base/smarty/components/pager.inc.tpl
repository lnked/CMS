{if isset($pager.total) && isset($pager.limit) && $pager.total > $pager.limit}
{strip}

{if isset($pager.hash)}
	{$hash=$pager.hash}
{/if}

<div class="pagination clearfix">

	<ul class="pagination__list" role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">
	
	{if isset($pager.prev) && $pager.prev !== ''}
		<li class="pagination__item"><a href="?page={$pager.prev}{$hash}" class="pagination__item__page prev" rel="prev">&larr;</a></li>
	{/if}

	{section name=pager loop=$pager.count step=1}
		{$page = $smarty.section.pager.index + 1}
		<li class="pagination__item"><a href="?page={$page}{$hash}" itemprop="url" class="pagination__item__page{if $page == $pager.page} current{/if}"><span itemprop="name">{$page}</span></a></li>
	{/section}
	
	{if isset($pager.next) && $pager.next !== ''}
		<li class="pagination__item"><a href="?page={$pager.next}{$hash}" class="pagination__item__page next" rel="next">&rarr;</a></li>
	{/if}
	
	</ul>

</div>

{/strip}
{/if}

{*
<!--
{strip}
{if isset($pager.count) && isset($pager.limit) && $pager.count > $pager.limit}
<div class="pagination clearfix">
	<ul>
		{if isset($pager.hashcat)}
			{assign var="hashcat" value="#"|cat:$pager.hashcat}
		{/if}

		{if $pager.pages != 1}
			{if isset($pager.prev) && $pager.prev !== ''}<li><a href="?page={$pager.prev}{$hashcat}" class="pagination__item__page prev">&larr;</a></li>{/if}
			
			{section name=pager loop=$pager.pages step=1}
				{math assign=this_page equation="(a + 1)" a = $smarty.section.pager.index}
				{if isset($pager.current ) && $pager.current == $smarty.section.pager.index}
				<li class="pagination__item"><span class="pagination__item__page current">{$this_page}</span></li>
				{else}
				<li class="pagination__item"><a href="?page={$smarty.section.pager.index}{$hashcat}" class="pagination__item__page">{$this_page}</a></li>
				{/if}
			{/section}

			{if isset($pager.next) && $pager.next !== ''}<li><a href="?page={$pager.next}{$hashcat}" class="pagination__item__page next">&rarr;</a></li>{/if}
		{/if}
	</ul>
</div>
{/if}
{/strip}
-->
*}