
describe('tree', function(){

  it('group', function() {

    $tree('(div>(div)*2)') /*
    <div>
    	<div></div>
    	<div></div>
    </div>
    */

    $tree('div>(header>ul>li*2>a)*2+footer>p') /*
    <div>
    	<header>
    		<ul>
    			<li><a href=""></a></li>
    			<li><a href=""></a></li>
    		</ul>
    	</header>
    	<header>
    		<ul>
    			<li><a href=""></a></li>
    			<li><a href=""></a></li>
    		</ul>
    	</header>
    	<footer>
    		<p></p>
    	</footer>
    </div>
    */

    $tree('(div>dl>(dt+dd)*3)*2+footer>p') /*
    <div>
    	<dl>
    		<dt></dt>
    		<dd></dd>
    		<dt></dt>
    		<dd></dd>
    		<dt></dt>
    		<dd></dd>
    	</dl>
    </div>
    <div>
    	<dl>
    		<dt></dt>
    		<dd></dd>
    		<dt></dt>
    		<dd></dd>
    		<dt></dt>
    		<dd></dd>
    	</dl>
    </div>
    <footer>
    	<p></p>
    </footer>
    */

  })

  it('self-closing', function() {
    $tree('br') // <br>
    $tree('hr') // <hr>
    $tree('meta') // <meta>
  })

  it('default attributes', function() {
    $tree('a') // <a href=""></a>
    $tree('link') // <link rel="stylesheet" href="">
  })

  describe('emmet cheat-sheet', function() {

  	/*

			Everything should work like emmet
  		http://docs.emmet.io/cheat-sheet/

  	*/

    it('Child: >', function() {
      $tree('nav>ul>li') /*
      <nav>
      	<ul>
      		<li></li>
      	</ul>
      </nav>
      */
    })

    it('Sibling: +', function() {
      $tree('div+p+bq') /*
      <div></div>
      <p></p>
      <blockquote></blockquote>
      */
    })

    it('Climb-up: ^', function() {
      $tree('div+div>p>span+em^bq') /*
      <div></div>
      <div>
      	<p><span></span><em></em></p>
      	<blockquote></blockquote>
      </div>
      */

      $tree('div+div>p>span+em^^bq') /*
      <div></div>
      <div>
      	<p><span></span><em></em></p>
      </div>
      <blockquote></blockquote>
      */
    })

    it('Grouping: ()', function() {
      $tree('div>(header>ul>li*2>a)+footer>p') /*
      <div>
      	<header>
      		<ul>
      			<li><a href=""></a></li>
      			<li><a href=""></a></li>
      		</ul>
      	</header>
      	<footer>
      		<p></p>
      	</footer>
      </div>
      */

      $tree('(div>dl>(dt+dd)*3)+footer>p') /*
      <div>
      	<dl>
      		<dt></dt>
      		<dd></dd>
      		<dt></dt>
      		<dd></dd>
      		<dt></dt>
      		<dd></dd>
      	</dl>
      </div>
      <footer>
      	<p></p>
      </footer>
      */
    })

    it('Multiplication: *', function() {
      $tree('ul>li*5') /*
      <ul>
      	<li></li>
      	<li></li>
      	<li></li>
      	<li></li>
      	<li></li>
      </ul>
      */
    })

    it('Item numbering: $', function() {
      $tree('ul>li.item$*5') /*
      <ul>
      	<li class="item1"></li>
      	<li class="item2"></li>
      	<li class="item3"></li>
      	<li class="item4"></li>
      	<li class="item5"></li>
      </ul>
      */

      $tree('h$[title=item$]{Header $}*3') /*
      <h1 title="item1">Header 1</h1>
      <h2 title="item2">Header 2</h2>
      <h3 title="item3">Header 3</h3>
      */

      $tree('ul>li.item$$$*5') /*
      <ul>
      	<li class="item001"></li>
      	<li class="item002"></li>
      	<li class="item003"></li>
      	<li class="item004"></li>
      	<li class="item005"></li>
      </ul>
      */

      $tree('ul>li.item$@-*5') /*
      <ul>
      	<li class="item5"></li>
      	<li class="item4"></li>
      	<li class="item3"></li>
      	<li class="item2"></li>
      	<li class="item1"></li>
      </ul>
      */

      $tree('ul>li.item$@3*5') /*
      <ul>
      	<li class="item3"></li>
      	<li class="item4"></li>
      	<li class="item5"></li>
      	<li class="item6"></li>
      	<li class="item7"></li>
      </ul>
      */

      $tree('ul>li.item$@-3*5') /*
      <ul>
      	<li class="item7"></li>
      	<li class="item6"></li>
      	<li class="item5"></li>
      	<li class="item4"></li>
      	<li class="item3"></li>
      </ul>
      */
    })

    it('ID and CLASS attributes', function() {
      $tree('#header') /*
      <div id="header"></div>
      */

      $tree('.title') /*
      <div class="title"></div>
      */

      $tree('form#search.wide') /*
      <form id="search" class="wide"></form>
      */

      $tree('p.class1.class2.class3') /*
      <p class="class1 class2 class3"></p>
      */
    })

    it('Custom attributes', function() {
      $tree('p[title="Hello world"]') /*
      <p title="Hello world"></p>
      */

      $tree('td[rowspan=2 colspan=3 title]') /*
      <td rowspan="2" colspan="3" title=""></td>
      */

      $tree('[a=\'value1\' b="value2"]') /*
      <div a="value1" b="value2"></div>
      */
    })

    it('Text: {}', function() {
      $tree('a{Click me}') /*
      <a href="">Click me</a>
      */

      $tree('p>{Click }+a{here}+{ to continue}') /*
      <p>Click <a href="">here</a> to continue</p>
      */
    })

    it('Implicit tag names', function() {
      $tree('.class') /*
      <div class="class"></div>
      */

      $tree('em>.class') /*
      <em><span class="class"></span></em>
      */

      $tree('ul>.class') /*
      <ul>
      	<li class="class"></li>
      </ul>
      */

      $tree('table>.row>.col') /*
      <table>
      	<tr class="row">
      		<td class="col"></td>
      	</tr>
      </table>
      */
    })

  })


})




var tests = [
   //'bla1 .foo h1#eyed.klass'
   //'bla1 .foo h1#eyed.klass.kkll.cl3[class="baz" attr]'
   //'h1#eyed.klass.kkll.cl3[foo="baz" attr]'
   //"h1#eyed.klass.kkll.cl3[foo='baz' attr]{Title ok}"
   //'bla1 .foo h1#eyed.klass.kkll.cl3[foo="baz" attr]{Title ok}>span#ok>em'
   //'bla1 .foo h1#eyed.klass.kkll.cl3[foo="baz" attr]{Title ok}>span#ok>em+strong'

  //,'bla2 .class section[id="id" class="class"]>h1{Title ok}'
  //,'bla3 #id'
  //,'bla4 div>span+div{>ok}^p'
  //,'bla5 #id--subid.cl-ass'
  //,'bla6 .clas__a--ss#id__id'
  //,'bla7 .bar.baz{yo}[id="foo" attr]'
  //,'bla8 h1{foo+bar}'
  //,'bla9 link[rel=prefetch title="Hello world"]'
  //,'blaA foo'

  //'div+div>p[title="Hello world"]>span+em^^bq'
  //'div>(header>ul>li*2>a)+footer>p'
  '(div>dl>(dt+dd)*3)+footer>p'
  ,'div>(header>ul>li*2>a)+footer>p'
  //,'button[disabled.]'

  /*
  'nav>ul>li+li'
  ,'div+p+bq'
  ,'div+div>p>span+em^bq'
  ,'div+div>p>span+em^^bq'

  ,'div>(header>ul>li*2>a)+footer>p'
  ,'(div>dl>(dt+dd)*3)+footer>p'

  ,'ul>li*5'

  ,'ul>li.item$*5'
  ,'h$[title=item$]{Header $}*3'
  ,'ul>li.item$$$*5'
  ,'ul>li.item$@-*5'
  ,'ul>li.item$@3*5'

  ,'#header'
  ,'.title'
  ,'form#search.wide'
  ,'p.class1.class2.class3'

  ,'p[title="Hello world"]'
  ,'td[rowspan=2 colspan=3 title]'
  ,'[a=\'value1\' b="value2"]'

  ,'a{Click me}'
  ,'p>{Click }+a{here}+{ to continue}'

  ,'.class'
  ,'em>.class'
  ,'ul>.class'
  ,'table>.row>.col'
  */

]
