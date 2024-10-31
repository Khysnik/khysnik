<?php
session_start();

function WriteLine($str)
{
	echo $str;
	echo "\n";
}

function BeginDocument($strMode)
{

	WriteLine('<!DOCTYPE html>');
	WriteLine('<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
	WriteLine('<head>');
	WriteLine('<title>&Config.Title;&Lang.WikiTitle; &Page.Name;</title>');
	if( $strMode !== 'wiki' ) 
	{ 
		WriteLine('<meta name="robots" content="noindex,nofollow"/>');
	}
	WriteLine('<meta name="Generator" content="&Config.Version;"/>');
	WriteLine('<link rel="stylesheet" type="text/css" href="&Config.URI;&Config.ThemePath;/style.css"/>');
	WriteLine('<link rel="alternate" type="application/rss+xml" href="&Config.URI;latest-change.php" />');

	WriteLine('</head>');
	WriteLine('');
	WriteLine('<body>');
	WriteLine('<p id="Logo"><a href="&Config.WikiURI;&Lang.DefaultPage;">&Config.Title;</a></p>');
	if( $strMode == 'wiki' )
	{
		WriteLine('<h1>&Page.Name;</h1>');
	}
	else if( $strMode == 'edit' )
	{
		WriteLine('<h1>&Lang.EditTitle; &Page.Name;</h1>');
	}
	else if( $strMode == 'history' )
	{
		WriteLine('<h1>&Lang.HistoryTitle; &Page.Name;</h1>');
	}
}

function WriteMenu()
{
	WriteLine('<div id="Menu">');
	WriteLine('<h2><a href="&Config.WikiURI;&Lang.DefaultPage;">&Config.Title;</a></h2>');
	WriteLine('<ul>');
	WriteLine('<li><a href="&Config.WikiURI;&Lang.ListPage;">&Lang.ListPage;</a></li>');
	WriteLine('<li><a href="&Config.WikiURI;&Lang.ChangesPage;">&Lang.ChangesPage;</a></li>');
	WriteLine('<li><a href="&Config.WikiURI;Help">Help</a></li>');
	WriteLine('</ul>');
	echo ChuWiki::RenderPage(ChuWiki::GetLangVar('MenuPage'));
	
	WriteLine('</div>');
}

function EndDocument($strMode)
{
	WriteLine('<hr id="UtilsSeparator"/>');


	WriteLine('<ul id="Utils">');

	$strBackLine = '<li><a href="&Config.WikiURI;&Page.Name;">&Lang.Back;</a></li>';
	if(isset($_SESSION['admin']))
	{

		if( $strMode == 'edit' )
		{
			WriteLine($strBackLine);
		}
		else
		{
			WriteLine('	<li><a href="&Config.EditURI;&Page.Name;#Wiki">&Lang.Edit;</a></li>');
		}

		if( $strMode == 'history' )
		{
			WriteLine($strBackLine);
		}
		else
		{
			WriteLine('	<li><a href="&Config.HistoryURI;&Page.Name;">&Lang.History;</a></li>');
		}
		WriteLine('<li id="newPage"><a href="#">New Page</a></li>');
		WriteLine('<li id="logout"><a href="logout.php">Logout</a></li>');		

	}else{
		WriteLine('<li id="login"><a href="#">Login</a></li>');
	}



	WriteLine('	<li><form id="Search" action="&Config.WikiURI;&Lang.SearchPage;" method="post"><p><input type="text" name="Search"/><input type="submit" class="Button" value="&Lang.SearchPage;"/></p></form></li>');
	
	WriteLine('</ul>');


	WriteLine('');
	WriteLine('<script type="text/javascript" src="&Config.URI;js/jquery.js"></script>');
	WriteLine('<script type="text/javascript" src="&Config.URI;js/index.js"></script>');
	WriteLine('');
	WriteLine('</body>');
	WriteLine('</html>');
}

?>
