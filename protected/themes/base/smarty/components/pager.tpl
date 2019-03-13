{strip}{if isset($pager_info ) && $pager_info.all_items > $pager_info.limit}
<ul class="pager">
	{assign var=uri value=$smarty.server.REQUEST_URI}
		{if $pager_info.page_count != 1}
			{if !$pager_info.advanced}
				{foreach item=item from=$pager_info.arr_pages}
					{math assign=this_page equation="(a + 1)" a = $item.point}
					{if $pager_info.curr_page == $item.point}
					<li class="current"><span>{$this_page}</span></li>
					{else}
					<li><a href="{$item.qstring}">{$this_page}</a></li>
					{/if}
				{/foreach}
			{else}
			{********************}
				<li class="previous">{if $pager_info.curr_page == 0}первая{else}<a href="{$pager_info.arr_pages[0].qstring}">первая</a>{/if}</li> 
				{section name=j start=$pager_info.advanced.offset loop=$pager_info.advanced.loop}
					{math assign=this_page equation="(a + 1)" a = $pager_info.arr_pages[j].point}
					{if $pager_info.curr_page == $pager_info.arr_pages[j].point}
					<li class="current"><span>{$this_page}</span></li> 
					{else}
					<li><a href="{$pager_info.arr_pages[j].qstring}">{$this_page}</a></li> 
					{/if}
				{/section}
				{math assign=last_j equation="(a-1)" a=$pager_info.page_count}
				<li class="next">{if $pager_info.curr_page == $last_j}последная{else}<a href="{$pager_info.arr_pages[$last_j].qstring}">последняя</a>{/if}</li>
			{/if}
		{/if}
</ul>
<div style="clear:both"></div>
{/if}{/strip}