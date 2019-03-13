{strip}<ul>
{foreach item=item from=$tree}
	{assign var=next_link value=$link|cat:'/'|cat:$item.system}
	<li><a href="{$next_link}"{if $current_id == $item.id} class="current"{/if}>{$item.name}</a>
		{if $item.tree}
			{include file="../system/recursive.tpl" tree=$item.tree link=$next_link current_id=$current_id}
		{/if}
	</li>
{/foreach}
</ul>{/strip}