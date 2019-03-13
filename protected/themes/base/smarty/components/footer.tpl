{strip}
<footer class="footer" itemscope="itemscope" itemtype="http://schema.org/WPFooter">
	{counters}
	
	{if isset($_sitemenu.main ) nocache}
		<ul class="nav">
		{foreach $_sitemenu.main as $e}
			{$accesskey = $accesskey + 1}
			
			<li itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="{$e.link}" class="nav__link{if isset($uri[1]) && $uri[1] == $e.sys_name} current{/if}" title="{$e.name}" itemprop="url" accesskey="{$accesskey}" data-instant><span itemprop="name">{$e.name}</span></a></li>
		{/foreach}
		</ul>
	{/if}

	<div class="studio">
		<a href="http://celebro.ru/" class="studio-link" target="_blank" title="Создание сайтов: разработка и поддержка, дизайн сайтов. Продвижение сайта и интернет реклама. | Веб-студия CELEBRO"><img src="data:image/png;base64,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" width="30" height="32" alt=""><span class="year">2014</span></a>
		
		<div class="studio-info">
			<div class="studio-line">
				Разработка&nbsp;студии&nbsp;<a href="http://celebro.ru/" target="_blank" title="Создание сайтов: разработка и поддержка, дизайн сайтов. Продвижение сайта и интернет реклама. | Веб-студия CELEBRO">celebro.ru</a>
			</div>

			<div class="studio-line">
				<a href="http://cms.celebro.ru/" target="_blank">Система&nbsp;управления&nbsp;контентом</a>
			</div>
		</div>
	</div>
</footer>
{/strip}