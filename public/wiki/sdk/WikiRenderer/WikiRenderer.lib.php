<?php
/**
 * Wikirenderer is a wiki text parser. It can transform a wiki text into xhtml or other formats
 * @package WikiRenderer
 * @author Laurent Jouanneau <jouanneau@netcourrier.com>
 * @copyright 2003-2007 Laurent Jouanneau
 * @link http://wikirenderer.berlios.de
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public 2.1
 * License as published by the Free Software Foundation.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 */
define('WIKIRENDERER_PATH', dirname(__FILE__).'/');
define('WIKIRENDERER_VERSION', '3.0-php4');

/**
 * base class to generate output from inline wiki tag
 *
 * this objects are driven by the wiki inline parser
 * @package WikiRenderer
 * @abstract
 * @see WikiInlineParser
 */
class WikiTag {

    var $beginTag='';
    var $endTag='';
    var $attribute=array();
    var $isTextLineTag=false;
    var $separators=array();
    var $checkWikiWordIn=array();

    // private
    var $contents=array('');
    var $wikiContentArr = array('');
    var $wikiContent='';
    var $separatorCount=0;
    var $separator=false;
    var $checkWikiWordFunction=false;
    var $config = null;
    /**
    * @param WikiRendererConfig $config
    */
    function WikiTag(&$config){
        $this->config = & $config;
        $this->checkWikiWordFunction=$config->checkWikiWordFunction;
        if($config->checkWikiWordFunction === null) $this->checkWikiWordIn=array();
        if(count($this->separators)) $this->separator= $this->separators[0];
    }

    /**
    * called by the inline parser, when it found a new content
    * @param string $wikiContent   the original content in wiki syntax if $parsedContent is given, or a simple string if not
    * @param string $parsedContent the content already parsed (by an other wikitag object), when this wikitag contents other wikitags
    * @final
    */
    function addContent($wikiContent, $parsedContent=false){
        if($parsedContent === false){
            $parsedContent =$this->_doEscape($wikiContent);
            if(count( $this->checkWikiWordIn)
                && isset($this->attribute[$this->separatorCount])
                && in_array($this->attribute[$this->separatorCount], $this->checkWikiWordIn)){
                $parsedContent=$this->_findWikiWord($parsedContent);
            }
        }
        $this->contents[$this->separatorCount] .= $parsedContent;
        $this->wikiContentArr[$this->separatorCount] .= $wikiContent;
    }

    /**
    * called by the inline parser, when it found a separator
    * @final
    */
    function addseparator(){
        $this->wikiContent.= $this->wikiContentArr[$this->separatorCount];
        $this->separatorCount++;
        if($this->separatorCount> count($this->separators))
            $this->separator = end($this->separators);
        else
            $this->separator = $this->separators[$this->separatorCount-1];
        $this->wikiContent.= $this->separator;
        $this->contents[$this->separatorCount]='';
        $this->wikiContentArr[$this->separatorCount]='';
    }

    /**
    * return the separator used by this tag.
    *
    * The tag can support many separator
    * @return string the separator
    */
    function getCurrentSeparator(){
            return $this->separator;
    }

    /**
    * return the wiki content of the tag
    * @return string the content
    * @final
    */
    function getWikiContent(){
        return $this->beginTag.$this->wikiContent.$this->wikiContentArr[$this->separatorCount].$this->endTag;
    }

    /**
    * return the generated content of the tag
    * @return string the content
    */
    function getContent(){ return $this->contents[0];}

    /**
    * return the generated content of the tag
    * @return string the content
    * @final
    */
    function getBogusContent(){
        $c=$this->beginTag;
        $m= count($this->contents)-1;
        $s= count($this->separators);
        foreach($this->contents as $k=>$v){
            $c.=$v;
            if($k< $m){
                if($k < $s)
                    $c.=$this->separators[$k];
                else
                    $c.=end($this->separators);
            }
        }

        return $c;
    }

    /**
    * escape a simple string.
    * @access protected
    */
    function _doEscape($string){
        return $string;
    }

    function _findWikiWord($string){
        if($this->checkWikiWordFunction !== null && preg_match_all("/(?<=\b)[A-Z][a-z]+[A-Z0-9]\w*/", $string, $matches)){
            $fct=$this->checkWikiWordFunction;
            $match = array_unique($matches[0]); // il faut avoir une liste sans doublon, � cause du str_replace suivant...
            $string= str_replace($match, $fct($match), $string);
        }
        return $string;
    }

}

/**
 *
 */
class WikiTextLine extends WikiTag {
    var $isTextLineTag=true;
}


/**
 *
 */
class WikiHtmlTextLine extends WikiTag {
    var $isTextLineTag=true;
    var $attribute=array('$$');
    var $checkWikiWordIn=array('$$');

   function _doEscape($string){
      return htmlspecialchars($string);
   }
}


/**
 * a base class for wiki inline tag, to generate XHTML element.
 * @package WikiRenderer
 * @abstract
 */
class WikiTagXhtml extends WikiTag {
   var $name;
   var $attribute=array('$$');
   var $checkWikiWordIn=array('$$');

   function getContent(){
        $attr='';
        $cntattr=count($this->attribute);
        $count=($this->separatorCount >= $cntattr?$cntattr-1:$this->separatorCount);
        $content='';

        for($i=0;$i<=$count;$i++){
            if($this->attribute[$i] != '$$')
                $attr.=' '.$this->attribute[$i].'="'.htmlspecialchars($this->wikiContentArr[$i]).'"';
            else
                $content = $this->contents[$i];
        }
        return '<'.$this->name.$attr.'>'.$content.'</'.$this->name.'>';
   }

   function _doEscape($string){
       return htmlspecialchars($string);
   }
}


/**
 * The parser used to find all inline tag in a single line of text
 * @package WikiRenderer
 * @abstract
 */
class WikiInlineParser {

    var $listTag=array();
    var $simpletags=array();

    var $resultline='';
    var $error=false;
    var $str=array();
    var $splitPattern='';
    var $_separator;
    var $config;
    /**
    * constructeur
    * @param   array    $inlinetags liste des tags permis
    * @param   string   caract�re s�parateur des diff�rents composants d'un tag wiki
    */
    function WikiInlineParser(&$config){

        $separators = array();
        $this->escapeChar = '\\';
        $this->config = & $config;
        foreach($config->inlinetags as $class){
            $t = new $class($config);
            $this->listTag[$t->beginTag]=$t;

            $this->splitPattern.=preg_quote($t->beginTag).')|(';
            if($t->beginTag!= $t->endTag)
                $this->splitPattern.=preg_quote($t->endTag).')|(';
            $separators = array_merge($separators, $t->separators);
        }
        foreach($config->simpletags as $tag=>$html){
            $this->splitPattern.=preg_quote($tag).')|(';
        }
        $separators= array_unique($separators);
        foreach($separators as $sep){
            $this->splitPattern.=preg_quote($sep).')|(';
        }

        $this->splitPattern = '/('.$this->splitPattern.preg_quote($this->escapeChar ).')/';
        $this->simpletags= $config->simpletags;
    }

    /**
    * fonction principale du parser.
    * @param   string   $line avec des eventuels tag wiki
    * @return  string   chaine $line avec les tags wiki transform� en HTML
    */
    function parse($line){
        $this->error=false;

        $this->str = preg_split($this->splitPattern,$line, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
        $this->end = count($this->str);
        $l = $this->config->textLineContainer;
        $firsttag = new $l($this->config);

        if($this->end > 1){
            $pos=-1;
            $this->_parse($firsttag, $pos);
            return $firsttag->getContent();
        }else{
            $firsttag->addContent($line);
            return  $firsttag->getContent();
        }
    }


    /**
    * coeur du parseur. Appel� r�cursivement
    * @return integer new position
    */
    function _parse(&$tag, $posstart){

      $checkNextTag=true;
      $brutContent = '';
      // on parcours la chaine,  morceau apr�s morceau
      for($i=$posstart+1; $i < $this->end; $i++){
            $t=&$this->str[$i];
            $brutContent.=$t;
            // a t-on un antislash ?
            if($t === $this->escapeChar){
               if($checkNextTag){
                  $t=''; // oui -> on ignore le tag (on continue)
                  $checkNextTag=false;
               }else{
                  // si on est l�, c'est que pr�c�dement c'etait un anti slash
                  $tag->addContent($this->escapeChar); //,false);
                  $checkNextTag=true;
               }

            // est-ce un s�parateur ?
            }elseif($t === $tag->getCurrentSeparator()){
                $tag->addSeparator();

            }elseif($checkNextTag){
                // a-t-on une balise de fin du tag ?
                if($tag->endTag == $t && !$tag->isTextLineTag){
                    return $i;
                // a-t-on une balise de debut de tag quelconque ?
                }elseif( isset($this->listTag[$t]) ){
                    $newtag = $this->listTag[$t];
                    $i=$this->_parse($newtag,$i);
                    if($i !== false){
                        $tag->addContent($newtag->getWikiContent(), $newtag->getContent());
                    }else{
                        $i=$this->end;
                        $tag->addContent($newtag->getWikiContent(), $newtag->getBogusContent());
                    }

                // a-t-on un tag simple ?
                }elseif( isset($this->simpletags[$t])){
                    $tag->addContent($t, $this->simpletags[$t]);
                }else{
                    $tag->addContent($t);
                }
            }else{
                if(isset($this->listTag[$t]) || isset($this->simpletags[$t]) || $tag->endTag == $t)
                    $tag->addContent($t);
                else
                    $tag->addContent($this->escapeChar.$t);
                $checkNextTag=true;
            }
      }
      if(!$tag->isTextLineTag ){
         //--- on n'a pas trouv� le tag de fin
         // on met en erreur
         $this->error=true;
         return false;
      }else
        return $this->end;
   }

}



/**
 * classe de base pour la transformation des �lements de type bloc
 * @abstract
 */
class WikiRendererBloc {

    /**
    * @var string  code identifiant le type de bloc
    */
   var $type='';

   /**
    * @var string  chaine qui sera ins�r�e � l'ouverture du bloc
    * @access private
    */
   var $_openTag='';

   /**
    * @var string  chaine qui sera ins�r�e � la fermeture du bloc
    * @access private
    */
   var $_closeTag='';
   /**
    * @var boolean    indique si le bloc doit �tre immediatement ferm� apr�s d�tection
    * @access private
    */
   var $_closeNow=false;

   /**
    * @var WikiRenderer      r�f�rence � la classe principale
    */
   var $engine=null;

   /**
    * @var   array      liste des �lements trouv�s par l'expression r�guli�re regexp
    */
   var $_detectMatch=null;

   /**
    * @var string      expression r�guli�re permettant de reconnaitre le bloc
    */
   var $regexp='';

   /**
    * constructeur � surcharger pour d�finir les valeurs des diff�rentes propriet�s
    * @param WikiRender    $wr   l'objet moteur wiki
    * @abstract
    */
   function WikiRendererBloc(&$wr){
      $this->engine = &$wr;
   }

   /**
    * renvoi une chaine correspondant � l'ouverture du bloc
    * @return string
    */
   function open(){
      return $this->_openTag;
   }

   /**
    * renvoi une chaine correspondant � la fermeture du bloc
    * @return string
    */
   function close(){
      return $this->_closeTag;
   }

   /**
    * indique si le bloc doit etre imm�diatement ferm�
    * @return string
    */
   function closeNow(){
      return $this->_closeNow;
   }

   /**
    * test si la chaine correspond au debut ou au contenu d'un bloc
    * @param string   $string
    * @return boolean   true: appartient au bloc
    */
   function detect($string){
      return preg_match($this->regexp, $string, $this->_detectMatch);
   }

   /**
    * renvoi la ligne, trait�e pour le bloc. A surcharger �ventuellement.
    * @return string
    * @abstract
    */
   function getRenderedLine(){
      return $this->_renderInlineTag($this->_detectMatch[1]);
   }

   /**
    * traite le rendu des signes de type inline (qui se trouvent necessairement dans des blocs
    * @param   string  $string une chaine contenant une ou plusieurs balises wiki
    * @return  string  la chaine transform�e en XHTML
    * @see WikiRendererInline
    */
   function _renderInlineTag($string){
      return $this->engine->inlineParser->parse($string);
   }
}


/**
 * classe de base pour la configuration
 * @bastract
 */

class WikiRendererConfig {

   /**
    * @var array   liste des tags inline
   */
   var $inlinetags= array();

   var $textLineContainer = 'WikiTextLine';

   /**
   * liste des balises de type bloc reconnus par WikiRenderer.
   */
   var $bloctags = array();


   var $simpletags = array();

   var $checkWikiWordFunction = null;

   /**
    * methode invoqu�e avant le parsing
    * Peut �tre utilis�e selon les besoins des r�gles
    */
    function onStart($texte){

        return $texte;
    }

   /**
    * methode invoqu�e apr�s le parsing
    * Peut �tre utilis�e selon les besoins des r�gles
    */
    function onParse($finalTexte){
        return $finalTexte;
    }

}

/**
 * Moteur de rendu. Classe principale � instancier pour transformer un texte wiki en texte XHTML.
 * utilisation :
 *      $ctr = new WikiRenderer();
 *      $monTexteXHTML = $ctr->render($montexte);
 */
class WikiRenderer {

   /**
    * @var   string   contient  du texte analys�
    * @access private
    */
   var $_newtext;

   /**
    * @var WikiRendererBloc element bloc ouvert en cours
    * @access private
    */
   var $_currentBloc=null;

   /**
    * @var array       liste des differents types de blocs disponibles
    * @access private
    */
   var $_blocList= array();

   /**
    * @var WikiInlineParser   analyseur pour les tags wiki inline
    */
   var $inlineParser=null;

   /**
    * liste des lignes o� il y a une erreur wiki
    */
   var $errors=array();


   var $config=null;
   /**
    * instancie les diff�rents objets pour le rendu des elements inline et bloc.
    */
   function WikiRenderer( $config=null){

      if(is_string($config)){
          $f = WIKIRENDERER_PATH.'rules/'.basename($config).'.php';
          if(file_exists($f)){
              require_once($f);
              $this->config= new $config();
          }else
             trigger_error('Wikirenderer : bad config name', E_USER_ERROR);

      }elseif(is_object($config)){
         $this->config=$config;
      }else{
         require_once(WIKIRENDERER_PATH . 'rules/wr3_to_xhtml.php');
         $this->config= new wr3_to_xhtml();
      }

      $this->inlineParser =& new WikiInlineParser($this->config);

      foreach($this->config->bloctags as $name){
         $this->_blocList[]= new $name($this);
      }
   }

   /**
    * Methode principale qui transforme les tags wiki en tag XHTML
    * @param   string  $texte le texte � convertir
     * @return  string  le texte converti en XHTML
    */
   function render($texte){
      $texte = $this->config->onStart($texte);

      $lignes=preg_split("/\015\012|\015|\012/",$texte); // on remplace les \r (mac), les \n (unix) et les \r\n (windows) par un autre caract�re pour d�couper proprement

      $this->_newtext=array();
      $this->errors=array();
      $this->_currentBloc = null;

      // parcours de l'ensemble des lignes du texte
      foreach($lignes as $num=>$ligne){
         if($this->_currentBloc){
            // un bloc est d�j� ouvert
            if($this->_currentBloc->detect($ligne)){
                $s =$this->_currentBloc->getRenderedLine();
                if($s !== false)
                    $this->_newtext[]=$s;
            }else{
                $this->_newtext[count($this->_newtext)-1].=$this->_currentBloc->close();
                $found=false;
                foreach($this->_blocList as $bloc){
                    if($bloc->type != $this->_currentBloc->type && $bloc->detect($ligne)){
                        $found=true;
                        // on ouvre le nouveau

                        if($bloc->closeNow()){
                            // si on doit fermer le nouveau maintenant, on le ferme
                            $this->_newtext[]=$bloc->open().$bloc->getRenderedLine().$bloc->close();
                            $this->_currentBloc = null;
                        }else{
                            $this->_currentBloc = $bloc; // attention, il faut une copie !
                            $this->_newtext[]=$this->_currentBloc->open().$this->_currentBloc->getRenderedLine();
                        }
                        break;
                    }
                }
                if(!$found){
                   $this->_newtext[]= $this->inlineParser->parse($ligne);
                   $this->_currentBloc = null;
                }
            }

         }else{
            $found=false;
            // pas de bloc ouvert, on test avec tout les blocs.
            foreach($this->_blocList as $bloc){
                if($bloc->detect($ligne)){
                    $found=true;
                    if($bloc->closeNow()){
                        $this->_newtext[]=$bloc->open().$bloc->getRenderedLine().$bloc->close();
                    }else{
                        $this->_currentBloc = $bloc; // attention, il faut une copie !
                        $this->_newtext[]=$this->_currentBloc->open().$this->_currentBloc->getRenderedLine();
                    }
                    break;
                }
            }
            if(!$found){
                $this->_newtext[]= $this->inlineParser->parse($ligne);
            }
         }
         if($this->inlineParser->error){
            $this->errors[$num+1]=$ligne;
         }
      }
      if($this->_currentBloc){
          $this->_newtext[count($this->_newtext)-1].=$this->_currentBloc->close();
      }

      return $this->config->onParse(implode("\n",$this->_newtext));
   }

    /**
     * renvoi la version de wikirenderer
     * @access public
     * @return string   version
     */
    function getVersion(){
       return WIKIRENDERER_VERSION;
    }

    function & getConfig(){
        return $this->config;
    }

}

?>