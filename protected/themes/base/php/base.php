<!DOCTYPE html>
<!-- (c) lnk. CELEBRO Studio | http://celebro.ru -->
<!--[if lt IE 7]><html class="ie6" lang="<?php echo $this->e($_page['lang']); ?>"><![endif]-->
<!--[if IE 7]>   <html class="ie7" lang="<?php echo $this->e($_page['lang']); ?>"><![endif]-->
<!--[if IE 8]>   <html class="ie8" lang="<?php echo $this->e($_page['lang']); ?>"><![endif]-->
<!--[if IE 9]>   <html class="ie9" lang="<?php echo $this->e($_page['lang']); ?>"><![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" itemscope="itemscope" itemtype="http://schema.org/" lang="<?php echo $this->e($_page['lang']); ?>">
<!--<![endif]-->
<head>
    <meta charset="UTF-8">
 
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="/css/main.min.css">

    <title itemprop="name"><?php echo $this->e($_page['title']); ?></title>
    
    <meta name="robots" content="<?php echo $this->e($_page['robots']); ?>">
    <meta name="keywords" content="<?php echo $this->e($_page['keywords']); ?>">
    <meta itemprop="description" name="description" content="<?php echo $this->e($_page['description']); ?>">
    
    <meta name="cms" content="celebro.cms">
    <meta name="author" content="http://celebro.ru/">

    <meta itemprop="inLanguage" content="<?php echo $this->e($_page['lang']); ?>">

    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE">
    <meta name="format-detection" content="telephone=no">
    
    <meta http-equiv="imagetoolbar" content="no">
    <meta http-equiv="Cache-Control" content="public">
    <meta http-equiv="Cache-Control" content="max-age=3600, must-revalidate">
    
    <link rel="icon" type="image/png" href="/favicon.png">
    
    <meta name="application-name" content="<?php echo $this->e(COMPANY_NAME); ?>">
    
    <meta property="og:site_name" content="<?php echo $this->e(COMPANY_NAME); ?>">
    <meta property="og:type" content="article">
    <meta property="og:title" content="<?php echo $this->e($_page['title']); ?>">
    <meta property="og:description" content="<?php echo $this->e($_page['description']); ?>">

    <meta name="twitter:site" content="@celebro_web">
    <meta name="twitter:description" content="<?php echo $this->e($_page['description']); ?>">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="<?php echo $this->e($_page['title']); ?>">

    <link rel="home" href="/">
    <link rel="search" href="/search" title="<?php echo $this->e(COMPANY_NAME); ?>" type="application/opensearchdescription+xml">
</head>
<body>

<div class="sidebar" itemscope="itemscope" itemtype="http://schema.org/WPSideBar">
    <a id="navigation-sandwich" class="navigation-sandwich" href="#"></a>
    
    <h1><a href="/" rel="home" accesskey="1" data-title="CELEBRO.CMS" data-instant>CELEBRO.CMS</a></h1>
    
    <ul class="nav">
    <?php if (!empty($_sitemenu['main'])): ?>
    
	    <?php foreach ($_sitemenu['main'] as $page): ?>
	    	<li itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="<?php echo $page['link']; ?>" class="nav__link" title="<?php echo $page['name']; ?>" itemprop="url" data-instant><span itemprop="name"><?php echo $page['name']; ?></span></a>

	    	<?php if (!empty($page['tree'])): ?>
				<ul>
				<?php foreach ($page['tree'] as $submenu): ?>
					
					<li itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="<?php echo $submenu['link']; ?>" class="nav__link" title="<?php echo $submenu['name']; ?>" itemprop="url" data-instant><span itemprop="name"><?php echo $submenu['name']; ?></span></a>
						
						<?php if (!empty($submenu['tree'])): ?>
							<ul>
							<?php foreach ($submenu['tree'] as $last): ?>
								
								<li itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement"><a href="<?php echo $last['link']; ?>" class="nav__link" title="<?php echo $last['name']; ?>" itemprop="url" data-instant><span itemprop="name"><?php echo $last['name']; ?></span></a></li>		
							
							<?php endforeach; ?>
							</ul>
	    				<?php endif; ?>

					</li>

				<?php endforeach; ?>
				</ul>
	    	<?php endif; ?>

	    	</li>
	    <?php endforeach; ?>
    
    <?php endif; ?>
	</ul>

</div>

<div class="wrap" id="layout-wrapper">
    <div class="container">
        <div class="content clearfix" itemprop="mainContentOfPage">
            <h2><?php echo $this->e($_page['name']); ?></h2>
        
            <?php echo $_page['content']; ?>
        </div>
    </div>    
    
    <div class="footer" itemscope="itemscope" itemtype="http://schema.org/WPFooter">

    </div>
</div>

<script src="/js/main.min.js"></script>

</body>
</html>