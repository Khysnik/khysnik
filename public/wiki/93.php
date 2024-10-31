<?php
// OOF
$ip = $_SERVER['REMOTE_ADDR'] . PHP_EOL;
if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
    else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
    else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
    else $ip = "0-0-0-0";

$ips = file('https://www.windows93.net/oof.log',FILE_IGNORE_NEW_LINES);
foreach ($ips as $ip1) {
   // echo $user;
    if ($ip==$ip1){
        //echo "oof";
        echo "";
        die;
    }
}
////////////////////////////////////////////////////////////////////////////////
// ***** BEGIN LICENSE BLOCK *****
// This file is part of ChuWiki.
// Copyright (c) 2004 Vincent Robert and contributors. All rights
// reserved.
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA//
// ***** END LICENSE BLOCK *****
////////////////////////////////////////////////////////////////////////////////

require(dirname(__FILE__) . '/sdk/sdk.php');
/////////////////////////////////////////////////////////////

// Chargement des informations de la page
$strPage = ChuWiki::GetCurrentPage();

// Chargement du contenu wiki pour cette page
$strWikiContent = ChuWiki::GetWikiContent($strPage);

// Ajout des contenus spéciaux de certaines pages
$strModifiedWikiContent = ChuWiki::AddSpecialWikiContent($strPage, $strWikiContent);

// Rendu wiki
$strHtmlContent = ChuWiki::Render($strModifiedWikiContent);

/////////////////////////////////////////////////////////////

// Chargement du template
$strContent = ChuWiki::LoadTemplate('wiki');

// Les premiers remplacements sont en fonction du fichier de config
$astrReplacements = ChuWiki::BuildStandardReplacements();

// Ajoute les remplacements « runtime »
ChuWiki::AddReplacement($astrReplacements, 'Page.Name', htmlspecialchars($strPage));
ChuWiki::AddReplacement($astrReplacements, 'Page.Wiki', $strWikiContent);
ChuWiki::AddReplacement($astrReplacements, 'Page.Html', $strHtmlContent);

// Applique les remplacements
$strContent = ChuWiki::ReplaceAll($strContent, $astrReplacements);

/////////////////////////////////////////////////////////////
ChuWiki::WriteXhtmlHeader();
echo $strContent;
?>