{strip}
{include file="./components/meta.tpl"}

{include file="./components/header.tpl"}

{include file="./components/sidebar.tpl"}

<div class="layout-wrapper">
	
	<div class="layout-wrapper__container">
		{include file="./components/breadcrumbs.tpl"}

		<section class="content clearfix" itemprop="mainContentOfPage" role="main">

			<a name="content"></a>

			{if $_page.name}
				<h2>{$_page.name}</h2>
			{/if}

			{$_page.content}

		</section>

	</div>
	
	{include file="./components/footer.tpl"}

</div>

{include file="./components/scripts.tpl"}
{/strip}