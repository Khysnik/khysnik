<?php
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
//
// ***** END LICENSE BLOCK *****
////////////////////////////////////////////////////////////////////////////////

error_reporting(E_ALL);

define('CHUWIKI_VERSION', 'Wiki93');

// Chargement des configuration
$g_aConfig = ChuWiki::ParseIniFile(dirname(__FILE__) . '/../configuration.ini');
$g_aLangConfig = ChuWiki::ParseIniFile(dirname(__FILE__) . '/../' . $g_aConfig['LanguagePath'] . '/' . 'lang.ini');

// Les fonctions d'ouverture de fichier doivent utiliser ou non 
// la zlib selon que celle-ci est présente ou pas
$g_bCanZlib = function_exists('gzfile');
$g_bUseZlib = ( $g_bCanZlib && ! @$g_aConfig['NoCompression'] );

$ChuFile = $g_bCanZlib ? 'gzfile' : 'file';
$ChuOpen = $g_bUseZlib ? 'gzopen' : 'fopen';
$ChuWrite = $g_bUseZlib ? 'gzwrite' : 'fwrite';
$ChuClose = $g_bUseZlib ? 'gzclose' : 'fclose';
$g_strCompressedExtension = 'gz';
$g_strUncompressedExtension = 'txt';
$g_strExtension = $g_bUseZlib ? $g_strCompressedExtension : $g_strUncompressedExtension;

if( $g_bUseZlib )
{
	// Active la compression du contenu
	ob_start('ob_gzhandler');
}
else
{
	ob_start();
}


///////////////////////////////////////////////////////////////////

// Construction de l'URI où est installé ChuWiki
$g_strWikiURI = dirname($_SERVER['SCRIPT_NAME']);
if ( strlen($g_strWikiURI) < 2 )
{
	$g_strWikiURI = '';
}
$g_strWikiURI .= '/';


class ChuWiki
{
	/////////////////////////////////////////////////////////////////////////////////
	// Retourne un NCR avec le & changé en 0x00
	// Gère les caractères interdits en XML
	function xhtmlspecialchars_callback($matches)
	{
		$ncr = $matches[0];
		
		$strPrefix = substr($ncr, 0, 3);
		$nValue = 0;
		if( strcmp($strPrefix, "&#x") == 0)
		{
			// Hexadécimal
			$nValue = sscanf($ncr, "&#x%x");
		}
		else
		{
			// Décimal
			$nValue = sscanf($ncr, "&#%d");
		}
		if( $nValue < 32 && $nValue != 9 && $nValue != 10 && $nValue != 13)
		{
			// Référence sur un caractère interdit
			// On remplace la totalité du NCR par un code qui sera remplacé par un caractère sûr
			$ncr = chr(1);
		}
		else
		{
			$ncr[0] = chr(0); // Remplace l'esperluette par un 0 pour un changement ultérieur
		}
		return $ncr;
	}

	/////////////////////////////////////////////////////////////////////////////////
	// Convertit les caractères qui posent problème en xhtml en conservant les références numériques sur caractères
	// ENT_COMPAT : convertit les guillemets anglais (doublequote) mais pas les apostrophes (simplequote)
	// ENT_QUOTES : convertit les guillemets anglais et les apostrophes
	// ENT_NOQUOTES : pas de conversion des guillemets et des apostrophes
	// www.psydk.org v2 2004-01-08
	function XhtmlSpecialChars($str, $quotestyle = ENT_COMPAT)
	{
		// 1) Remplacement des caractères interdits par le caractère 0x01
		// Tous les caractères < 32 sont interdits, sauf 9, 10 et 13 (tab, \n et \r)
		// Note : utiliser chr() est meilleur que "\xx", sinon certains caractères ne passent pas
		$aForbiddenChars = array(chr(0), chr(1), chr(2), chr(3), chr(4), chr(5), chr(6), chr(7), chr(8),
			chr(11), chr(12), chr(14), chr(15), chr(16), chr(17), chr(18), chr(19), chr(20), chr(21), chr(22),
			chr(23), chr(24), chr(25), chr(26), chr(27), chr(28), chr(29), chr(30), chr(31) );
		$str = str_replace($aForbiddenChars, chr(1), $str);
		// 2) Remplacement des esperluettes des NCR par le caractère 0x00
		$str = preg_replace_callback('/&#[0-9]+;|&#x[0-9a-fA-F]+;/', array('chuwiki', 'xhtmlspecialchars_callback'), $str);
		// 3) Remplacement des caractères spéciaux de contrôle xml ( < > & ' et ") par une entité ou un NCR
		$str = htmlspecialchars($str, $quotestyle);
		// 4) Ajout des esperluettes des NCR
		$str = str_replace(chr(0), '&', $str);
		// 5) Utilisation d'un caractère sûr (65533=Losange point d'interrogation) pour les caractères spéciaux interdits
		$str = str_replace(chr(1), '&#65533;', $str);
		return $str;
	}

	///////////////////////////////////////////////////////////////////
	function ParseIniFile($strFileName)
	{
		if( !file_exists($strFileName) )
		{
			ChuWiki::Error('Fichier de configuration manquant ' . $strFileName);
		}

		$ini = parse_ini_file($strFileName);
		
		foreach( $ini as $key => $value )
		{
			$ini[$key] = ChuWiki::xhtmlspecialchars($value);
		}
		
		return $ini;
	}

	// Utile seulement pour les templates souhaitant
	// accéder en PHP à des variables de la config
	function GetConfigVar($strVarName)
	{
		global $g_aConfig;
		return $g_aConfig[$strVarName];
	}

	// Utile seulement pour les templates souhaitant
	// accéder en PHP à des variables de la config
	function GetLangVar($strVarName)
	{
		global $g_aLangConfig;
		return $g_aLangConfig[$strVarName];
	}

	function GetPostedValue($strName)
	{
		$strValue = @$_POST[$strName];
		if ( get_magic_quotes_gpc() )
		{
			$strValue = stripslashes($strValue);
		}

		// Saloperie d'\r
		$strValue = str_replace("\r", '', $strValue);

		return $strValue;
	}

	function GetUriInfo()
	{
		global $g_aConfig;

		// L'URI peut être composée de 3 parties :
		// le script, le séparateur de page, et la page
		// Il faut extraire le script et la page	

		$strScriptName = $_SERVER['SCRIPT_NAME'];
		$strScript = substr($_SERVER['REQUEST_URI'], 0, strlen($strScriptName));

		if( $strScript != $strScriptName )
		{
			// SCRIPT_NAME may contains the extension when it should not
			// Remove it
			$nLastDotPos = strrpos($strScriptName, '.');
			$strScript = substr($strScriptName, 0, $nLastDotPos);
		}

		$strPage = urldecode(substr($_SERVER['REQUEST_URI'], strlen($strScript) + 1));

		$strSeparator = ChuWiki::GetPageSeparator();
		$nSeparatorLength = strlen($strSeparator);
		if( substr($strScript, -$nSeparatorLength) != $strSeparator )
		{
			// Il n'y a pas de séparateur à la fin du script, on l'ajoute
			$strScript .= $strSeparator;
		}
		
		return array('Page' => $strPage, 'Script' => $strScript);
	}

	function FileNameEncode($strFileName)
	{
		$strReturn = rawurlencode($strFileName);
		return $strReturn;
	}

	function Error($strMessage)
	{
		header('Content-Type: text/html;charset=UTF-8');
		echo '<h1>Error</h1>' . "\n";
		echo '<p>' . $strMessage . '</p>';
		exit();
	}

	function ErrorUnableToWrite()
	{
		ChuWiki::Error('Impossible d\'écrire cette page, veuillez vérifier que vous possédez les droits d\'écriture dans le répertoire des pages');
	}

	function GetCurrentPage()
	{
		global $g_aConfig, $g_aLangConfig, $g_strWikiURI;

		$strPage = '';
		
		// Récupère la page demandée
		$aInfo = ChuWiki::GetUriInfo();
		$strPage = $aInfo['Page'];
		$strScript = $aInfo['Script'];

		// Gestion de magic_quotes
		if ( get_magic_quotes_gpc() )
		{
			$strPage = stripslashes($strPage);
		}

		// Si la page n'est pas spécifiée, on redirige vers la page par défaut
		if ( $strPage == '' )
		{
			header('Location: ' . $strScript . $g_aLangConfig['DefaultPage']);
			exit();
		}

		// Si la page contient des caractères invalides, on les remplace par des tirets et on redirige
		if ( strstr($strPage, '/') !== FALSE )
		{
			$aBads = array('/');
			$strPage = str_replace($aBads, '-', $strPage);
		
			header('Location: ' . $strScript .  $strPage);
			exit();
		}

		return $strPage;
	}

	function GetPageSeparator()
	{
		global $g_aConfig;
		
		if( $g_aConfig['UsePathInfo'] )
		{
			return '/';
		}
		else
		{
			return '?';
		}
	}

	function GetPagePath()
	{
		global $g_aConfig;
		return dirname(__FILE__) . '/../' . $g_aConfig['PagePath'];
	}


	function ComputePageDir($strPagePath, $strPage)
	{
		return $strPagePath . '/' . ChuWiki::FileNameEncode($strPage);
	}

	function GetPageDir($strPage)
	{
		return ChuWiki::ComputePageDir(ChuWiki::GetPagePath(), $strPage);
	}

	function GetScriptURI($strScriptName)
	{
		global $g_strWikiURI, $g_aConfig;
		return $g_strWikiURI . $g_aConfig[$strScriptName . 'Script'] . ChuWiki::GetPageSeparator();
	}

	// Merci à Darken pour cette fonction
	function VerifyUtf8($str)
	{
		$nLength = strlen($str);
		$iDst = 0;
		$nByteSequence = 0;
		$nUcs4 = 0;

		for($iSrc = 0; $iSrc < $nLength; ++$iSrc)
		{
			$nByte = ord($str[$iSrc]);

			if( $nByteSequence == 0)
			{
				$nUcs4 = 0;

				if( $nByte <= 0x7F)
				{
					// ascii
					$iDst++;
				}
				else if( ($nByte & 0xE0) == 0xC0)
				{
					// 110xxxxx 10xxxxxx
					$nUcs4 = $nByte & 0x1F;
					$nByteSequence = 1;
				}
				else if( ($nByte & 0xF0) == 0xE0)
				{
					// 1110xxxx 10xxxxxx 10xxxxxx
					$nUcs4 = $nByte & 0x0F;
					$nByteSequence = 2;
				}
				else if( ($nByte & 0xF8) == 0xF0)
				{
					// 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
					$nUcs4 = $nByte & 0x07;
					$nByteSequence = 3;
				}
				else if( ($nByte & 0xFC) == 0xF8)
				{
					// 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
					$nUcs4 = $nByte & 0x03;
					$nByteSequence = 4;
				}
				else if( ($nByte & 0xFE) == 0xFC)
				{
					// 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
					$nUcs4 = $nByte & 0x01;
					$nByteSequence = 5;
				}
				else
				{
					// Bad byte sequence starter
					$strBeg = substr($str, 0, $iSrc);
					$strBeg = ChuWiki::XhtmlSpecialChars($strBeg);
					echo "<p>$strBeg &lt;-- BAD UTF-8 SEQUENCE STARTER</p>";
					return false;
				}
			}
			else
			{
				// Remaining bytes
				if( ($nByte & 0xC0) != 0x80)
				{
					// Bad byte in sequence
					$strBeg = substr($str, 0, $iSrc);
					$strBeg = ChuWiki::XhtmlSpecialChars($strBeg);
					echo "<p>$strBeg &lt;-- BAD UTF-8 SEQUENCE BYTE</p>";
					return false;
				}

				$nUcs4 <<= 6;
				$nUcs4 |= ($nByte & 0x3F);
				$nByteSequence--;

				if( $nByteSequence == 0)
				{
					// OK - Store
					//nUcs4
					$iDst++;
				}
			}
		}
		return true;
	}


	function LoadFile($strFilePath)
	{
		global $g_aConfig, $ChuFile;
		if ( !is_file($strFilePath) )
		{
			return '';
		}

		$strContent = implode('', $ChuFile($strFilePath));
		$strContent = str_replace("\r", '', $strContent);

		if( @$g_aConfig['VerifyUtf8'] )
		{
			if( !ChuWiki::VerifyUtf8($strContent) )
			{
				ChuWiki::Error('Le fichier ' . $strFilePath . ' n\'est pas correctement enregistré en UTF-8');
			}
		}	
		return $strContent;
	}

	function InterpretPhpFile($strFilePath)
	{
		ob_start();
		include($strFilePath);
		$strContent = ob_get_contents();
		ob_end_clean();
		return $strContent;
	}

	function GetLatestDateFilePath($strPageDir)
	{
		return $strPageDir . '/latest-change.txt';
	}

	function WriteFile($strFile, $strContent)
	{
		$file = @fopen($strFile, 'w');
		if ( $file === FALSE )
		{
			return;
		}
		fwrite($file, $strContent);
		fclose($file);	
		@chmod($strFile, 0777);
	}

	function GetWikiContentFile($strPage, $strDate)
	{
		global $g_strCompressedExtension, $g_strUncompressedExtension;

		$strFileBase = ChuWiki::GetPageDir($strPage) .  '/' . $strDate . '.';
		$strCompressedFile = $strFileBase . $g_strCompressedExtension;
		$strUncompressedFile = $strFileBase . $g_strUncompressedExtension;

		if( file_exists($strCompressedFile) )
		{
			return $strCompressedFile;
		}
		if( file_exists($strUncompressedFile) )
		{
			return $strUncompressedFile;
		}
		return '';
	}

	function GetLatestDate($strPage)
	{
		$strPageDir = ChuWiki::GetPageDir($strPage);
		$strDateLatestFilePath = ChuWiki::GetLatestDateFilePath($strPageDir);
		$strDateLatest = @implode('', file($strDateLatestFilePath));

		// Si le cache n'existe pas ou que la page indiquée a été supprimée
		// On va devoir recréer le cache
		if( $strDateLatest == '' )
		{
			$aHistory = ChuWiki::GetHistory($strPage);
			$strDateLatest = reset($aHistory);

			// Comme on est passé par l'ancienne méthode 
			// qui n'utilisait pas le cache,
			// on peut maintenant enregistrer le cache
			ChuWiki::WriteFile($strDateLatestFilePath, $strDateLatest);
		}
		return $strDateLatest;
	}

	function GetWikiContent($strPage)
	{
		$strLatestDate = ChuWiki::GetLatestDate($strPage);
		return ChuWiki::GetSavedWikiContent($strPage, $strLatestDate);
	}
	
	function GetModifiedWikiContent($strPage)
	{
		$strOriginalWikiContent = ChuWiki::GetWikiContent($strPage);
		return ChuWiki::AddSpecialWikiContent($strPage, $strOriginalWikiContent);
	}
	
	function GetSavedWikiContent($strPage, $strDate)
	{
		global $g_strExtension;

		$strSavePath = ChuWiki::GetWikiContentFile($strPage, $strDate);
		$strContent =  ChuWiki::LoadFile($strSavePath);
		return $strContent;
	}

	function RenderPage($strPage)
	{
		$strWikiContent = ChuWiki::GetModifiedWikiContent($strPage);		
		return ChuWiki::Render($strWikiContent);
	}

	function GenerateInclude($strParams)
	{
		// Récupère le nom de la page
		$astrParams = explode('|', $strParams);
		$strPage = trim(array_shift($astrParams));
				
		// Remplace les paramètres par leur valeur
		$astrReplacements = array('Vars' => array(), 'Values' => array());
		foreach( $astrParams as $strParam)
		{
			$astrParts = explode('=', $strParam, 2);
			$strParam = trim($astrParts[0]);
			$strValue = trim($astrParts[1]);
			ChuWiki::AddReplacement($astrReplacements, $strParam, $strValue);
		}

		// Récupère le contenu wiki à inclure
		$strContent = ChuWiki::GetModifiedWikiContent($strPage);
		$strContent = ChuWiki::ReplaceAll($strContent, $astrReplacements);

		// Gère les commandes dans le contenu inclus
		$strContent = ChuWiki::ProcessWikiContent($strContent);

		// Inclue le contenu modifié
		return $strContent;
	}

	function GenerateTableOfContents($astrLines)
	{
		$strWikiToc = '';
		foreach( $astrLines as $strSearchedLine )
		{
			if( preg_match('/^(!{1,3}) *(.+)/', $strSearchedLine, $astrMatches) ) 
			{
				$nTags = strlen($astrMatches[1]);
				
				$strText = trim($astrMatches[2]);
				$strLink = '';

				// Parse anchor if there is one
				if( preg_match('/~([^~]*)~(.*)/', $strText, $astrMatches) )
				{
					$strLink = $astrMatches[1];
					$strText = $astrMatches[2];
				}

				$strWikiToc .= str_repeat('*', $nTags);
				if( $strLink == "" )
				{
					$strWikiToc .= $strText;
				}
				else
				{
					$strWikiToc .= '[' . $strText . '|#' . $strLink . ']';
				}
				$strWikiToc .= "\n";
			} 
		}
		return $strWikiToc;
	}

	function GenerateCategory($strParams)
	{
		global $g_aLangConfig;

		// Récupère le nom des catégories
		$astrCategories = explode('|', $strParams);

		// Génère le lien pour chaque catégorie
		foreach( $astrCategories as $i => $strCategory )
		{
			$strCategory = trim($strCategory);
			$astrCategories[$i] = '[' . $strCategory . '|' . $g_aLangConfig['CategoryPage'] . ' ' . $strCategory . ']';
		}

		// Construit la ligne wiki correspondante
		return '\[ ' . implode(' - ', $astrCategories) . ' ]';
	}

	function ProcessWikiContent($strWikiContent)
	{
		$astrLines = explode("\n", $strWikiContent);
		
		$strResult = '';

		// Nous allons essayer de reconnaitre 
		// quelques syntaxes spécifiques à ChuWiki
		foreach( $astrLines as $strLine )
		{
			$strTrimmedLine = trim($strLine);

			if( preg_match('/^::([a-z]+)(.*)?/', $strTrimmedLine, $astrMatches) != 0 )
			{
				
				$strCommand = $astrMatches[1];
				$strParams = trim($astrMatches[2]);
				
				// Les différentes commandes gérées
				$strSpecial = '';
				if( $strCommand == 'include' )
				{
					$strSpecial = ChuWiki::GenerateInclude($strParams);
				}
				else if( $strCommand == 'toc' )
				{
					$strSpecial = ChuWiki::GenerateTableOFContents($astrLines);
				}
				else if( $strCommand == 'category' )
				{
					$strSpecial = ChuWiki::GenerateCategory($strParams);
				}
				
				if( strlen($strSpecial) > 0 )
				{
					$strResult .= $strSpecial;
					$strResult .= "\n";
					continue; // Do not add this line in the content
				}
			}
			$strResult .= $strLine . "\n";
		}
		return $strResult;
	}
	
	function Render($strWikiContent)
	{
		global $g_aConfig, $g_aLangConfig;

		if ( $strWikiContent == '' )
		{
			$strWikiContent = $g_aLangConfig['NoWikiContent'];
		}

		// On utilise le fichier de formatage de la langue s'il existe	
		$strFileFormat = $g_aConfig['LanguagePath'] . '/format.php';
		$formatter = null;
		if( file_exists($strFileFormat) )
		{
			if( !class_exists('CLanguageFormat') )
			{
				require(dirname(__FILE__) . '/../' . $strFileFormat);
			}

			if( class_exists('CLanguageFormat') )
			{
				$formatter = new CLanguageFormat();
			}
		}
		
		// Modification du contenu wiki par la langue
		if(	is_a($formatter, 'CLanguageFormat') )
		{
			$strWikiContent = $formatter->FormatWiki($strWikiContent);
		}

		$strWikiContent = ChuWiki::ProcessWikiContent($strWikiContent);

		// Instanciation de la lib de rendu et rendu wiki
		switch($g_aConfig['Renderer'])
		{
		case 'WikiRenderer':
			if( !class_exists("WikiRenderer") )
			{
				require(dirname(__FILE__) . '/WikiRenderer/WikiRenderer.lib.php');
				require(dirname(__FILE__) . '/WikiRenderer/rules/chu_to_xhtml.php');
			}

			$Renderer = new WikiRenderer('chu_to_xhtml');
			$strHtmlContent = $Renderer->render($strWikiContent);
			break;

		case 'wiki2xhtml':
			if( !class_exists("wiki2xhtmlChu") )
			{
				require(dirname(__FILE__) . '/wiki2xhtml/class.wiki2xhtml.chu.php');
			}
			$Renderer = new wiki2xhtmlChu();
			$strHtmlContent = $Renderer->transform($strWikiContent);
			break;

		default:
			ChuWiki::Error('Erreur dans le fichier de configuration : Aucun renderer ou mauvais renderer spécifié. Seulement WikiRenderer ou wiki2xhtml sont autorisés.');
			break;
		}

		// Sans PathInfo, il faut mettre un ? devant les liens vers les pages internes
		if( !$g_aConfig['UsePathInfo'] )
		{
			$strHtmlContent = preg_replace('/href="([^"]*)"/', 'href="?\1"', $strHtmlContent);
			$strHtmlContent = preg_replace('/href="\?(\.\..*)"/', 'href="\1"', $strHtmlContent);
			$strHtmlContent = preg_replace('/href="\?(\/.*)"/', 'href="\1"', $strHtmlContent);
			$strHtmlContent = preg_replace('/href="\?([a-zA-Z]+:.*)"/', 'href="\1"', $strHtmlContent);
			$strHtmlContent = preg_replace('/href="\?(#.*)"/', 'href="\1"', $strHtmlContent);
		}

		if ( $g_aConfig['SmileyPath'] != '' )
		{
			if( !function_exists("MakeImageSmileys") )
			{
				require(dirname(__FILE__) . '/smiley-replacer.php');
			}
			MakeImageSmileys($strHtmlContent);
		}

		// Modification du contenu HTML par la langue
		if(	is_a($formatter, 'CLanguageFormat') )
		{
			$strHtmlContent = $formatter->FormatHtml($strHtmlContent);
		}
		
		return $strHtmlContent;
	}

	function LoadTemplate($strTemplate)
	{
		global $g_aConfig;

		$strTemplatePath = $g_aConfig['ThemePath'] . '/' . $strTemplate . '.php';
		
		// Un chargement avant pour vérifier l'intégrité
		ChuWiki::LoadFile($strTemplatePath);
		
		return ChuWiki::InterpretPhpFile($strTemplatePath);
	}

	function BuildStandardReplacements()
	{
		global $g_aConfig, $g_aLangConfig, $g_strWikiURI;

		$astrReplacements = array('Vars' => array(), 'Values' => array());

		// Ajout des variables du fichier configuration.ini
		foreach($g_aConfig as $strVar => $strValue)
		{
			ChuWiki::AddReplacement($astrReplacements, 'Config.' . $strVar, $strValue);
		}

		// Ajout des variables de configurations supplémentaires
		ChuWiki::AddReplacement($astrReplacements, 'Config.URI', $g_strWikiURI);
		ChuWiki::AddReplacement($astrReplacements, 'Config.Version', CHUWIKI_VERSION);
		ChuWiki::AddReplacement($astrReplacements, 'Config.PageSeparator', ChuWiki::GetPageSeparator());
		ChuWiki::AddReplacement($astrReplacements, 'Config.WikiURI', ChuWiki::GetScriptURI('Wiki'));
		ChuWiki::AddReplacement($astrReplacements, 'Config.EditURI', ChuWiki::GetScriptURI('Edit'));
		ChuWiki::AddReplacement($astrReplacements, 'Config.HistoryURI', ChuWiki::GetScriptURI('History'));

		// Ajout des variables da la langue
		foreach($g_aLangConfig as $strVar => $strValue)
		{
			ChuWiki::AddReplacement($astrReplacements, 'Lang.' . $strVar, $strValue);
		}

		// Ajout des variables de langue supplémentaires
		ChuWiki::AddReplacement($astrReplacements, 'Lang.Rules', ChuWiki::LoadFile($g_aConfig['LanguagePath'] . '/rules.html'));
		
		return $astrReplacements;
	}

	function AddReplacement(&$astrReplacements, $strVar, $strValue)
	{
		$astrReplacements['Vars'][] = '&' . $strVar . ';';
		$astrReplacements['Values'][] = $strValue;
	}

	function ReplaceAll($strContent, $astrReplacements)
	{
		return str_replace($astrReplacements['Vars'], $astrReplacements['Values'], $strContent);
	}

	function CreateDir($strDir)
	{
		if( !is_dir($strDir) )
		{
			mkdir($strDir);
			chmod($strDir, 0777);
		}
	}

	function Save($strPage, $strWikiContent)
	{

		global $g_strExtension, $g_aConfig, $ChuOpen, $ChuWrite, $ChuClose;

		// Création du répertoire des pages
		$strPagePath = ChuWiki::GetPagePath();
		ChuWiki::CreateDir($strPagePath);
		
		// Création du répertoire de la page
		$strPageDir = ChuWiki::ComputePageDir($strPagePath, $strPage);
		ChuWiki::CreateDir($strPageDir);

		if( file_exists($strPageDir . '/lock.txt') )
		{
			// Cette page est protégée
			ChuWiki::ErrorUnableToWrite();
		}

		// On enregistre le contenu du fichier
		$date = time();
		if( isset($g_aConfig['TimeShift']) )
		{
			$date += intval($g_aConfig['TimeShift']);
		}
		$strDate = date('YmdHis', $date);
		$strSavePath = $strPageDir . '/' . $strDate . '.' . $g_strExtension;

		$file = $ChuOpen($strSavePath, 'w9');
		if ( $file === FALSE )
		{
			// Impossible d'ouvrir le fichier en écriture
			ChuWiki::ErrorUnableToWrite();
		}

		$userIP=$_SERVER['REMOTE_ADDR'];
		if ($userIP!="77.152.167.27") {
			$msg = "page:".$strPage." date:".$strDate." content:".$strWikiContent." ip:".$userIP."\n";
			file_put_contents("/mnt/data/windows93/xn--xp8haa/public/wiki/ip.log", $msg, FILE_APPEND);
		}

		$ChuWrite($file, $strWikiContent);
		$ChuClose($file);
		@chmod($strSavePath, 0777);

		// On enregistre le fichier indiquant le dernier changement	
		ChuWiki::WriteFile(ChuWiki::GetLatestDateFilePath($strPageDir), $strDate);

	}

	function FormatDate($date)
	{
		return $strDate = substr($date, 0, 4) . '-' . substr($date, 4, 2) . '-' . substr($date, 6, 2) 
				. ' T ' . substr($date, 8, 2) . ':' . substr($date, 10, 2) . ':' . substr($date, 12, 2);
	}

	function IsArchiveFile($strFile)
	{
		$astr = explode('.', $strFile);
		if( preg_match('/[0-9]{14}/', $astr[0]) == 1)
		{
			return true;
		}
		return false;
	}

	function GetHistory($strPage)
	{
		global $g_aConfig;

		$strPageDir = ChuWiki::GetPageDir($strPage);
		$strDateLatestFilePath = ChuWiki::GetLatestDateFilePath($strPageDir);

		$aHistory = array();

		$dir = @opendir($strPageDir);
		if ( $dir !== FALSE )
		{
			while( true )
			{
				$strEntry = readdir($dir);
				if( $strEntry === false )
				{
					break;
				}
				$strFilePath = $strPageDir . '/' . $strEntry;
				if ( ChuWiki::IsArchiveFile($strEntry) )
				{
					$astr = explode('.', $strEntry);
					$aHistory[] = $astr[0];
				}
			}
			closedir($dir);
		}
		rsort($aHistory);

		return $aHistory;
	}


	function GetPageList()
	{
		global $g_aConfig;

		$strPagePath = ChuWiki::GetPagePath();

		$astrList = array();
		if( !is_dir($strPagePath) )
		{
			return $astrList;
		}
		
		$dir = opendir($strPagePath);
		while( true )
		{
			$strEntry = readdir($dir);
			if( $strEntry === false )
			{
				break;
			}
			$strFullPath = $strPagePath . '/' . $strEntry;
			if ( $strEntry != '.' && $strEntry != '..' && is_dir($strFullPath) )
			{
				$strEntry = rawurldecode($strEntry);
				$astrList[$strEntry] = ChuWiki::GetLatestDate($strEntry);
			}
		}
		closedir($dir);

		return $astrList;
	}

	function GetSortedPageList()
	{
		$astrList = ChuWiki::GetPageList();
		ksort($astrList);

		return $astrList;
	}

	function GetLatestChangePageList()
	{
		$astrList = ChuWiki::GetPageList();
		arsort($astrList);

		return $astrList;
	}

	function GetPageListContent()
	{
		global $g_aConfig;

		$astrList = ChuWiki::GetSortedPageList();

		$strContent = '';
		foreach($astrList as $strEntry => $date)
		{
				$strContent .= '-[' . $strEntry . ']' . "\n";
		}

		return $strContent;
	}

	function GetRecentChangeContent()
	{
		global $g_aConfig, $g_strWikiURI;

		define('CookieName', 'RecentChanges');

		$astrList = ChuWiki::GetLatestChangePageList();

		// Récupération de la dernière visite
		$dateLastVisit = isset($_COOKIE[CookieName]) ? $_COOKIE[CookieName] : 0;

		$strContent = '';
		$strDayPrev = '';
		foreach($astrList as $strEntry => $date)
		{
			$strDay = substr($date, 0, 8);
			$strTime = substr($date, 8);

			if( $strDay != $strDayPrev )
			{
				$strContent .= '!' . substr($strDay, 0, 4)
							 . '-' . substr($strDay, 4, 2) 
							 . '-' . substr($strDay, 6, 2)
							 . "\n";
			}

			$bNew = ( ($date - $dateLastVisit) > 0 );

			$strContent .= '- ';
			if ( $bNew )
			{
				$strContent .= '__';
			}
			$strContent .= substr($strTime, 0, 2) . ':' . substr($strTime, 2, 2) 
						. ' [' . $strEntry . ']';
			if ( $bNew )
			{
				$strContent .= '__';
			}
			$strContent .= "\n";

			$strDayPrev = $strDay;
		}

		// Enregistrement de la dernière date
		$dateLatest = reset($astrList);
		setcookie(CookieName, $dateLatest, time() + 3600 * 24 * 365, $g_strWikiURI);

		return $strContent;
	}

	function GetSearchContent($strQuery)
	{
		if( isset($_POST['Search']) )
		{
			$strLocation = ChuWiki::GetScriptURI('Wiki') . ChuWiki::GetLangVar('SearchPage') . ' ' . ChuWiki::GetPostedValue('Search');
			header('Location: ' . $strLocation);
			exit;
		}

		$strQuery = strtolower(trim($strQuery));
		
		if( strlen($strQuery) == 0 )
		{
			return '';
		}

		$aResults = array();
		$strContent = '';

		$astrPages = ChuWiki::GetPageList();
		foreach($astrPages as $strPage => $date)
		{
			$nScore = 0;

			if( strtolower(trim($strPage)) == $strQuery )
			{
				$nScore += 20;
			}

			$strWiki = ChuWiki::GetWikiContent($strPage);
			$astrLines = explode("\n", $strWiki);

			foreach($astrLines as $strLine)
			{
				$strLoweredLine = strtolower(trim($strLine));
				$nTimes = substr_count($strLoweredLine, $strQuery);
				if( $nTimes == 0 )
				{
					continue;
				}

				$nLineScore = 1; // 1 by default

				// Better score for titles
				if( preg_match('/^(!{1,3}).+/i', $strLine, $astrMatches) ) 
				{
					$nLevel = strlen($astrMatches[1]);
					switch( $nLevel )
					{
					case 1: $nLineScore = 2; break;
					case 2: $nLineScore = 4; break;
					case 3: $nLineScore = 8; break;
					}
				}
				$nScore += $nLineScore * $nTimes;
			}
			
			if( $nScore !== 0 )
			{
				$aResults[$strPage] = $nScore;
			}
		}

		arsort($aResults); // on trie la tableau par ordre decroissant de pertinence

		foreach( $aResults as $strPage => $nScore )
		{
			$strContent .= '#[' . $strPage . ']' . "\n";
		}

		return $strContent;
	}

	function GetCategoryContent($strQuery)
	{
		$strQuery = trim($strQuery);
		
		if( strlen($strQuery) == 0 )
		{
			return '';
		}

		$aResults = array();
		$strContent = '';

		$astrPages = ChuWiki::GetPageList();
		foreach($astrPages as $strPage => $date)
		{
			$strWiki = ChuWiki::GetWikiContent($strPage);
			$astrLines = explode("\n", $strWiki);

			$bFound = false;

			foreach($astrLines as $strLine)
			{
				$strTag = "::category ";
				$nTagLength = strlen($strTag);

				if( substr($strLine, 0, $nTagLength) == $strTag )
				{
					$strCategories = substr($strLine, $nTagLength);
					$astrCategories = explode('|', $strCategories);

					foreach( $astrCategories as $strCategory )
					{
						$strCategory = trim($strCategory);

						if( $strCategory == $strQuery )
						{
							$aResults[] = $strPage;
							$bFound = true;
							break;
						}
					}
				}
				if( $bFound )
				{
					break;
				}
			}
		}

		asort($aResults); // on trie les pages par ordre alphabétique

		foreach( $aResults as $strPage )
		{
			$strContent .= '-[' . $strPage . ']' . "\n";
		}

		return $strContent;
	}

	function GetSpecialWikiContent($strPage)
	{
		global $g_aLangConfig;

		$strSpecial = '';

		// Si c'est la page de listage, on ajoute la liste après.
		if ( $strPage == $g_aLangConfig['ListPage'] )
		{
			$strSpecial .= ChuWiki::GetPageListContent();
		}

		// Si c'est la page de changement, on les ajoute après
		if ( $strPage == $g_aLangConfig['ChangesPage'] )
		{
			$strSpecial .= ChuWiki::GetRecentChangeContent();
		}

		// Si c'est la page de recherche, on ajoute les résultats après
		// La requête est passée à la suite du nom de la page
		$strSearchPage = @$g_aLangConfig['SearchPage'];
		$nSearchPageLength = strlen($strSearchPage);
		if( $nSearchPageLength > 0 && substr($strPage, 0, $nSearchPageLength) == $strSearchPage )
		{
			$strQuery = substr($strPage, $nSearchPageLength);
			$strSpecial .= ChuWiki::GetSearchContent($strQuery);
		}

		// Si c'est la page de catégorie, on ajoute les résultats après
		// La requête est passée à la suite du nom de la page
		$strCategoryPage = @$g_aLangConfig['CategoryPage'];
		$nCategoryPageLength = strlen($strCategoryPage);
		if( $nCategoryPageLength > 0 && substr($strPage, 0, $nCategoryPageLength) == $strCategoryPage )
		{
			$strQuery = substr($strPage, $nCategoryPageLength);
			$strSpecial .= ChuWiki::GetCategoryContent($strQuery);
		}

		return $strSpecial;
	}
	
	function AddSpecialWikiContent($strPage, $strWikiContent)
	{
		$strSpecialWikiContent = ChuWiki::GetSpecialWikiContent($strPage);
		return trim($strWikiContent . "\n" . $strSpecialWikiContent);
	}	

	function WriteXhtmlHeader()
	{
		$strCharset = 'UTF-8';

		header("Expires: Thu, 1 Jan 1970 00:00:00 GMT");             // Date du passé
		header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); // toujours modifié
		header("Cache-Control: no-cache, must-revalidate");           // HTTP/1.1
		header("Pragma: no-cache");                                   // HTTP/1.0
	  
		if ( @stristr($_SERVER['HTTP_ACCEPT'], 'application/xhtml+xml') ) 
		{
			header('Content-type: application/xhtml+xml; charset=' . $strCharset);
			echo '<?xml version="1.0" encoding="' . $strCharset . '"?' .'>' . "\n";
		}
		else 
		{
			header('Content-type: text/html; charset=' . $strCharset . '');
		}
	}
};

?>