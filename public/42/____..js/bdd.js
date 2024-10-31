/*
8888b.  888888 88""Yb 88  dP""b8 888888
 8I  Yb 88__   88__dP 88 dP   `"   88
 8I  dY 88""   88"""  88 Yb        88
8888Y"  888888 88     88  YboodP   88


Depict Manifesto
================
- Comments in demos and exemples show expectations.
- Comments in code should not generate documentation.
  They are for exluding code, explaining tricks and separating sections.
- Tests should generate documentation.
- Documentation should have demos and exemples.

So let's use comments as assertions.

Syntax
======
Inline comments starting with any spaces
and one of theses keywords :
=>|:|is|has|not|do|don't|never|satisfy|match|called
are considered as assertions.

"=>" and ":" are the same as "is equal to".
Assertions can be combined with the keyword "and".

```
is (not)? (an?) {type}
has (not)? (an?) {prop}
(is | has (an?) {prop}) (not)? equal to {*}
(is | has (an?) {prop}) (not)? above {*}
(is | has (an?) {prop}) (not)? below {*}
(is | has (an?) {prop}) (not)? within {*} and {*}

(is)? called {number} (times)?
(is)? called once
(is)? (not|never)? called

(don't|do not)? satisfy {fn}
(don't|do not)? match {regex}
(don't|do not)? throw (an?) {type}

logs 1, 2, 3, 4
logs 1..4
logs 1, 2..4
```

Examples
========
```
// the next lines are assertions
console.log(1<2) // => true
console.log(42) // is a number and is above 40
console.log(42) /// is also the answer to life, the universe, and everything
```

Why ?
=====
Because nobody like :
- Broken demos and examples
- Unmaintened documentation
- To write tests, examples and documentation
With depict, user can copy tests results and start tweeking it

Todo
====
- A lot...
- Improve syntax
- Separate test framework and depict syntax parser
- Write plugins for popular test framework


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

From : https://www.smashingmagazine.com/2012/10/designing-javascript-apis-usability/

1. Function signatures aren’t the only documentation you need, but most tools focus only on them.
2. Example code goes a long way in explaining how something works. Regular API docs usually fail to illustrate that with a fair trade-off.
3. API docs usually fail horribly at explaining things behind the scenes (flow, events, etc).
4. Documenting methods with multiple signatures is usually a real pain.
5. Documenting methods using option objects is often not a trivial task.
6. Generated Methods aren’t easily documented, neither are default callbacks.

"comments to mark sections within your code or to explain general concepts"
*/

!(function(global) {
  "use strict";

  var $noop = global.$noop || function() {};

  function assert(ok, msg) {
    if (!ok) {
      var err = new Error(msg);
      //console.error(err);
      throw err;
    }
  }
  assert.equal = function(value, expected) {
    var ok = value === expected;
    assert(ok, '"' + value + (ok ? '" === "' : '" !== "') + expected + '"');
  };
  assert.strictEqual = function(value, expected) {
    assert.equal(value, expected);
  };
  assert.deepEqual = function(value, expected) {
    var ok = $io.equal(value, expected);
    assert(ok, '"' + value + (ok ? '" === "' : '" !== "') + expected + '"');
  };
  assert.typeOf = function(value, expected) {
    var ok = $io.type(value).toLowerCase() === expected;
    assert(ok, '"' + value + (ok ? '" === "' : '" !== "') + expected + '"');
  };
  assert.isArray = function(value) {
    var ok = $io.isArray(value);
    assert(ok, value + " is not an Array");
  };
  assert.isString = function(value) {
    var ok = $io.isString(value);
    assert(ok, value + " is not a String");
  };

  var indent = 0,
    timer,
    rootSuites = [],
    rootCur,
    cSu,
    cTe,
    cur,
    stats = { tests: 0, passed: 0, failed: 0, pending: 0 },
    testToRun = [];

  function resetGlobals() {
    //uuid = -1;
    indent = 0;
    timer = null;
    rootSuites = [];
    rootCur = cSu = cTe = cur = null;
    stats = { tests: 0, passed: 0, failed: 0, pending: 0 };
    testToRun = [];

    depict.results = [];
    depict.cur = 0;
    depict.calls = {};

    depict.checkCalls = null;
  }

  function Suite(title) {
    this.title = title;
    this.suites = [];
    this.tests = [];
  }

  function Test(title, fn, async) {
    stats.tests++;
    this.title = title;
    this.results = [];
    this.fn = fn;
    this.async = async;
    this.err = null;
    this.ok = null;
    testToRun.push(this);
  }

  function describe(msg, fn) {
    clearTimeout(timer);

    indent++;

    if (indent == 1) {
      rootCur = rootSuites.push(new Suite(msg));
      //console.log(rootCur);
      cSu = rootSuites[rootCur - 1]["suites"];
      cTe = rootSuites[rootCur - 1]["tests"];
    } else {
      cur = cSu.push(new Suite(msg));
      cTe = cSu[cur - 1]["tests"];
      cSu = cSu[cur - 1]["suites"];
    }

    fn();

    indent--;

    var i = 1;
    cSu = rootSuites[rootCur - 1]["suites"];
    while (cSu && cSu["suites"] && i < indent) {
      cTe = cSu["tests"];
      cSu = cSu["suites"];
      i++;
    }

    if (indent === 0) {
      // maybe finished, test if no other describe is called
      timer = setTimeout(function() {
        bdd.trigger("ready", rootSuites);
      }, 0);
    }
  }

  function it(msg, fn) {
    fn = depict.compile(fn, msg);
    cTe.push(new Test(msg, fn, !!fn.length));
  }

  describe.skip = $noop;
  /*describe.only = function(msg, fn) {
    rootSuites.length = 0;
    cSu.length = 0;
    cTe.length = 0;
    describe(msg, fn);
    global.describe = $noop;
    global.describe.skip = $noop;
    global.describe.only = $noop;
  };*/

  it.skip = $noop;
  /*it.only = function(msg, fn) {
    cTe.length = 0;
    it(msg, fn);
    global.it = $noop;
    global.it.skip = $noop;
    global.it.only = $noop;
  };*/

  /*
    8888b.  888888 88""Yb 88  dP""b8 888888
     8I  Yb 88__   88__dP 88 dP   `"   88
     8I  dY 88""   88"""  88 Yb        88
    8888Y"  888888 88     88  YboodP   88
  */

  function traceVariable(result) {
    if ($io.isString(result)) result = '"' + result + '"';
    else if ($io.isArray(result)) result = $io.arr.stringify(result);
    else if ($io.isJSON(result)) result = JSON.stringify(result);
    //console.log(result);
    return result;
  }
  /////////////////////////////////////////////////////////////////////////////
  var uuid = -1;
  var depict = function(arg) {
    return arg;
  };
  depict.results = [];
  depict.cur = 0;
  depict.calls = {};

  depict.checkCalls;

  depict.init = function(i) {
    depict.checkCalls = null;
    depict.cur = i;
  };
  depict.done = function(i) {
    depict.checkCalls = checkCalls;
    return { lines: depict.results[i].lines, fn: depict.results[i].fn };
  };

  function checkCalls(returnOk, i) {
    if (!depict.results[i]) return returnOk;

    var calls = depict.results[i].calls;
    var fn = depict.results[i].fn;

    var changedReturnOk = false;
    $io.obj.each(calls, function(item, id) {
      var ok = true;
      var err = false;

      if (item.type === "log") {
        ok = true;

        console.group(id + " ▸");
        console.log(item.results);
        console.groupEnd(id + " ▸");
        var traced = traceVariable(item.results).slice(1, -1);

        item.open = item.open.replace(/\/\//, "//▸").replace(/\/\*/, "/*▸");

        var space = "";
        if (item.open.indexOf("/*") === 0) {
          space = "";
        } else {
          space = " ";
          if (/\n/g.test(item.open))
            traced = traced.replace(/\n/g, item.open + " ");
          else traced = traced.replace(/\n/g, "\n" + item.open + " ");
        }

        fn.source = fn.source.replace("²_never_called_²" + id, function() {
          return (
            item.code +
            item.separation +
            item.open +
            space +
            traced +
            item.close
          );
        });
      } else if (item.type === "check" && item.args) {
        var check = item.args.check;
        var expected = item.args.expected;
        var has = item.args.has;
        var not = item.args.not;
        var tracedResult;
        var tracedExpected;

        if (item.stringified) {
          try {
            item.expect = JSON.parse(item.expect);
          } catch (e) {}
        }

        if (item.results.length === 1) {
          var result = item.results[0];
          for (var i = 0, l = check.length; i < l; i++) {
            if (check.length === expected.length) {
              try {
                //console.log(expected[i], has[i])
                ok = depict.fn[check[i]](
                  has[i] ? result[has[i]] : result,
                  expected[i]
                );
                //ok = depict.fn[check[i]](result, expected[i]);
                if (not[i]) ok = !ok;
              } catch (e) {
                ok = false;
                err = e;
              }
            } else {
              ok = false;
            }
            if (!ok) {
              tracedExpected = expected[i];
              //console.log(tracedExpected)

              //console.log(item.expect)
              //console.log(tracedExpected)
              //console.log('???', tracedExpected, item.expect, has[i])
              //console.log(typeof item.expect, typeof tracedExpected)
              //console.log(item.expect, tracedExpected)
              if (
                item.expect.slice(1, -1) == tracedExpected ||
                item.expect == tracedExpected
              ) {
                tracedExpected = item.expect;
              } else if (check === "isEqual") {
                tracedExpected =
                  item.expect + " => " + traceVariable(tracedExpected);
              }
              break;
            }
          }
          tracedResult = traceVariable(result);
        } else {
          ok = $io.equal(item.results, expected);
          tracedResult = traceVariable(item.results).slice(1, -1);
        }

        var expectStr;

        if (ok) {
          item.open = item.open.replace(/\/\//, "//✔").replace(/\/\*/, "/*✔");
          expectStr = item.expect;
        } else {
          item.open = item.open.replace(/\/\//, "//✘").replace(/\/\*/, "/*✘");
          if (err) {
            expectStr = err;
          } else {
            if (check[i] === "isEqual") {
              if (/\n/g.test(item.open))
                expectStr =
                  tracedResult +
                  "\n---- expected ----\n" +
                  traceVariable(tracedExpected) +
                  "\n";
              else
                expectStr =
                  tracedResult +
                  " (expected : " +
                  traceVariable(tracedExpected) +
                  ")";
            } else {
              expectStr = item.expect;
            }
          }
        }

        if (item.open.indexOf("/*") !== 0) {
          if (/\n/g.test(item.open))
            expectStr = expectStr.replace(/\n/g, item.open);
          else expectStr = expectStr.replace(/\n/g, "\n" + item.open);
        }

        //var out = item.code+item.separation+item.open+expectStr+item.close
        //out = out.replace(/\$/g, '$$$$')
        fn.source = fn.source.replace("²_never_called_²" + id, function() {
          return (
            item.code + item.separation + item.open + expectStr + item.close
          );
        });
      } else if (item.type === "called" && item.args) {
        for (var i = 0, l = item.args.not.length; i < l; i++) {
          var not = item.args.not[i];
          var expected = item.args.expected[i];
          if (typeof expected === "number") {
            if (expected === item.iteration) ok = true;
          } else if (item.iteration > 0) {
            ok = true;
          }
          if (not) ok = !ok;
          if (!ok) break;
        }
        var out = err
          ? item.code + ";" + item.whitespaces + err + " ✘"
          : ok
            ? "//" + item.whitespaces + item.comment + " ✔"
            : "//" +
              item.whitespaces +
              "called " +
              item.iteration +
              " times (expected : " +
              item.comment +
              ") ✘";

        fn.source = fn.source.replace("²_never_called_²" + id, function() {
          return out;
        });
      }

      //console.log(returnOk)
      var oldReturnOk = returnOk;
      if (!ok) {
        returnOk = false;
      }
      if (oldReturnOk !== returnOk) changedReturnOk = true;
      //console.log(returnOk)
    });

    fn.source = fn.source.replace(/²_never_called_²(\d+)/g, function(_, id) {
      var item = calls[id];
      if (item.type === "check") {
        returnOk = false;
        return (
          item.code +
          ";" +
          item.whitespaces +
          "never called (expected : " +
          item.expect +
          ") ✘"
        );
      } else if (item.type === "called") {
        if (
          (item.expected[0] === null && item.not[0]) ||
          (item.expected[0] !== 0 && item.not[0])
        ) {
          /*if (changedReturnOk) {
            if (returnOk !== false) returnOk = true;
          } else {
          }*/
          if (!changedReturnOk) returnOk = true;
          return "//" + item.whitespaces + item.comment + " ✔";
        } else {
          returnOk = false;
          return (
            "//" +
            item.whitespaces +
            "never called (expected : " +
            item.comment +
            ") ✘"
          );
        }
      }

      return "// never called";
    });

    return returnOk;
  }

  // register results on runtime
  /////////////////////////////////////////////////////////////////////////////

  depict.called = function(uid, expected, not) {
    var calls = depict.results[depict.cur].calls;
    if (!calls[uid].args) calls[uid].args = { expected: expected, not: not };
    calls[uid].iteration++;
  };

  depict.log = function(uid, result) {
    var calls = depict.results[depict.cur].calls;
    // clone result that could be references
    if ($io.isArray(result)) result = $extend([], result);
    if ($io.isObject(result)) result = $extend({}, result);
    calls[uid].results.push(result);
  };

  depict.check = function(uid, result, expected, check, not, has) {
    var calls = depict.results[depict.cur].calls;
    if (!calls[uid].args)
      calls[uid].args = {
        expected: expected,
        check: check,
        not: not,
        has: has,
      };
    // clone result that could be references
    if ($io.isArray(result)) result = $extend([], result);
    if ($io.isObject(result)) result = $extend({}, result);
    calls[uid].results.push(result);
  };

  // helpers functions
  /////////////////////////////////////////////////////////////////////////////

  depict.fn = {
    isEqual: function(result, expected) {
      //console.log(111, result, expected, $io.equal(result, expected));
      return $io.equal(result, expected);
    },
    isAbove: function(result, expected) {
      return result > expected;
    },
    isBelow: function(result, expected) {
      return result < expected;
    },
    isWithin: function(result, expected) {
      return result > expected[0] && result < expected[1];
    },
    is: function(result, expected) {
      expected = expected.toLowerCase();
      //if (expected === 'falsy') return $io.isDocument(result);
      return $io.is(result).toLowerCase() === expected;
    },
    has: function(result, expected) {
      //console.log(result, expected, !!(result)[expected])
      if (expected.indexOf(".") > -1)
        return !!$io.obj.getPath(result, expected);
      return !!result[expected]; //(result).hasOwnProperty(expected);
      //return (result).hasOwnProperty(expected);
    },
    hasNot: function(result, expected) {
      return !depict.fn.has(result, expected);
    },
    type: function(result, expected) {
      return (
        Object.prototype.toString.call(result).toLowerCase() ===
        expected.toLowerCase()
      );
    },
    match: function(result, expected) {
      if ($io.type(expected) !== "RegExp")
        throw new Error("match argument is not a RegExp");
      return expected.test(result);
    },
    satisfy: function(result, expected) {
      if (typeof expected !== "function")
        throw new Error("satisfy argument is not a function");
      return expected(result);
    },
  };

  depict.compile = function(fn, msg) {
    if (!fn || typeof fn != "function")
      return function() {
        throw new Error(
          "Error during depict compilation : argument is not a function"
        );
      };

    var args = $io.fn.arg(fn),
      argsStr = args.join(","),
      source = $io.fn.inner(fn),
      output,
      compiledFn;

    depict.results.push({ lines: [], calls: {}, fn: { source: source } });
    var indexR = depict.results.length - 1;
    var depictFn = depict.results[indexR].fn;
    var calls = depict.results[indexR].calls;
    output = "\ndepict.init(" + indexR + ");\n";

    // if not using depict syntax
    /*if (!/\/\/\s*(=>)/.test(source)) {
      var classicFn = args.length
        ? function(d) {
          fn(d); return {fn: {source: source}}
        }
        : function() {
          fn(); return {fn: {source: source}}
        }
      ;
      classicFn.source = source;
      return classicFn
    };*/

    output += source
      // remove true comments
      // https://regex101.com/r/jY0dA5/5
      .replace(/(\/\/[\/!][^\n]*|\/\*![\s\S]*?\*\/)/g, "")

      // scan for comments with called syntax
      // https://regex101.com/r/gC5eK9/7
      .replace(/\/\/((?: |:|=>|is)*)((?:not|never)? *called[^\n]*)/g, function(
        _,
        whitespaces,
        comment
      ) {
        depictFn.source = depictFn.source.replace(
          _,
          "²_never_called_²" + ++uuid
        );

        var notList = [];
        var expectedList = [];
        var operatorList = [];
        var whatList = [];

        // https://regex101.com/r/dI0zA1/6
        comment.replace(
          /(not|never)? *?called *(?:(once|twice|thrice|\d))?/g,
          function(_, not, iteration) {
            iteration = iteration
              ? iteration
                  .replace("once", 1)
                  .replace("twice", 2)
                  .replace("thrice", 3) * 1
              : null;
            notList.push(!!not);
            expectedList.push(iteration);
          }
        );
        calls[uuid] = {
          type: "called",
          iteration: 0,
          whitespaces: whitespaces,
          comment: comment,
          expected: expectedList,
          not: notList,
        };

        return (
          "depict.called(" +
          uuid +
          ", [" +
          expectedList +
          "], [" +
          notList +
          "]);"
        );
      })

      // https://regex101.com/r/mX1yN2/7
      .replace(
        /(\s*)([^\n]+?)(;?\s*)((\/\/(?: *(?:=>|->|:))? ?)([\s\S]*?)(\n(?!\/\/)|$)|(\/\*(?: *(?:=>|->|:))?\n?)([\s\S]*?)(\n?\*\/))/g,
        function(
          _,
          before,
          code,
          separation,
          comment,
          open,
          expect,
          close,
          open2,
          expect2,
          close2
        ) {
          var multilines;
          var stringified;

          if (open2) {
            open = open2;
            expect = expect2;
            close = close2;
            multilines = /\n/.test(expect);
          } else {
            multilines = /\n/.test(expect);
            if (multilines) {
              expect = expect.replace(new RegExp(open, "g"), "");
            }
          }

          //if (multilines) {
          try {
            var toto = new Function("return " + expect);
            var res = toto();
            //console.log(1,res,expect)
            if (typeof res === "string") {
              expect = JSON.stringify(res);
              stringified = true;
            }
            //console.log(toto())
          } catch (e) {
            //console.log(e)
            try {
              //console.log(expect)
              expect.replace(
                /^\s*("([^"]*)"|'([^']*)'|`([^`]*)`)\s*$/g,
                function(_, all, str) {
                  console.log(all);
                  console.log(str);
                  expect = str || all;
                }
              );
              expect = JSON.stringify(expect);
              stringified = true;
            } catch (e) {
              e.message = "Error during depict compilation : " + e.message;
              return function() {
                throw e;
              };
            }
          }
          //}

          depictFn.source = depictFn.source.replace(
            code + separation + comment,
            "²_never_called_²" + ++uuid
          );

          var newCode = code.replace("console.log", "depict");

          calls[uuid] = {
            results: [],
            args: null,
            code: code,
            separation: separation,
            expect: expect,
            open: open,
            close: close,
            stringified: stringified,
          };

          if (expect) {
            var hasList = [];
            var expectList = [];
            var checkList = [];
            var notList = [];

            // is and has
            /////////////////////////////////////////////////////////////////////////////
            // https://regex101.com/r/fC6yT1/8
            expect.replace(
              /(?:(?:(\bis\b)|(\bhas\b) *(\bnot\b)? *(?:\ban?\b)? *([^\s]*)?) *(not)? *(?:\ban?\b)? *(?:(\bequal|of|above|below|within\b)(?: *to *)? *([^\s]*)? *(?:\band\b)? *([^\s]*)?|((?!\bcalled\b)[^\s]*)))/g,
              function(
                _,
                is,
                has,
                hasNot,
                hasProp,
                not,
                operator,
                to,
                and,
                type
              ) {
                notList.push(!!not);
                if (operator) {
                  hasList.push(has ? '"' + hasProp + '"' : false);
                  if (operator === "equal" || operator === "of") {
                    checkList.push("isEqual");
                    expectList.push(to);
                  } else if (operator === "above") {
                    checkList.push("isAbove");
                    expectList.push(to);
                  } else if (operator === "below") {
                    checkList.push("isBelow");
                    expectList.push(to);
                  } else if (operator === "within") {
                    checkList.push("isWithin");
                    expectList.push($io.arr.stringify([to, and]));
                  }
                } else if (is) {
                  checkList.push("is");
                  expectList.push('"' + type + '"');
                } else if (has && hasNot) {
                  checkList.push("hasNot");
                  expectList.push('"' + hasProp + '"');
                } else if (has) {
                  checkList.push("has");
                  expectList.push('"' + hasProp + '"');
                }
              }
            );

            // match
            /////////////////////////////////////////////////////////////////////////////
            // https://regex101.com/r/vA1pO7/6
            expect.replace(
              /(\bnot|don't)? *match *((?:[^\n](?!\band\b))+)/g,
              function(_, not, regex) {
                notList.push(!!not);
                checkList.push("match");
                expectList.push(regex);
              }
            );

            // satisfy
            /////////////////////////////////////////////////////////////////////////////
            // https://regex101.com/r/eO6oT5/4
            expect.replace(
              /(\bnot|don't)? *satisfy *((?:[^\n](?!\band\b))+)/g,
              function(_, not, fn) {
                notList.push(!!not);
                checkList.push("satisfy");
                expectList.push(fn);
              }
            );

            // default usage is checking if the result is what is expected
            /////////////////////////////////////////////////////////////////////////////
            if (!checkList.length) {
              checkList.push("isEqual");
              expectList.push(expect);
            }
            calls[uuid].type = "check";

            return (
              before +
              "depict.check(" +
              uuid +
              ", " +
              newCode +
              ", [" +
              expectList +
              "], " +
              $io.arr.stringify(checkList) +
              ", [" +
              notList +
              "], [" +
              hasList +
              "]);\n"
            );
          } else {
            // no expect found -> log mode
            calls[uuid].type = "log";

            return before + "depict.log(" + uuid + ", " + newCode + ");";
          }

          //return _;
        }
      );
    output += "\nreturn depict.done(" + indexR + ");\n\n";
    output +=
      "//# sourceURL=dpct" + indexR + "_" + $io.str.slug(msg || "") + "\n";

    // https://regex101.com/r/rM9bA9/2
    //depictFn.source = depictFn.source.replace(/\s*done\(\s*\);?\n/, '\n');

    //console.log(argsStr);

    try {
      compiledFn = argsStr
        ? new Function(argsStr, output)
        : new Function(output);
    } catch (e) {
      e.message = "Error during depict compilation : " + e.message;
      compiledFn = function() {
        throw e;
      };
    }

    //console.log(compiledFn)

    return compiledFn;
  };

  /*
    88""Yb 88   88 88b 88
    88__dP 88   88 88Yb88
    88"Yb  Y8   8P 88 Y88
    88  Yb `YbodP' 88  Y8
  */

  function run(suite) {
    // if a test is async, pause the test running until done() is called in the test
    // or an error is caught with the temporary onerror remplacement
    // @todo : check browser compat for onerror
    var test,
      curT,
      onerrorOriginal = global.onerror;
    function onerrorWrapper(msg, url, line, char, err) {
      //console.log(msg, url, line, char, err);
      testDone(false, err);
      asyncDone();
      return true;
      //return onerrorOriginal ? onerrorOriginal.apply(this, arguments) : true;
    }

    function asyncDone() {
      global.onerror = onerrorOriginal;
      runTests(++curT);
    }

    function testDone(ok, error) {
      ok = depict.checkCalls ? depict.checkCalls(ok, curT) : ok;
      if (error) test.err = error;
      if (test.results && test.results.lines) {
        $io.arr.all(test.results.lines, function(line) {
          if (!line.ok) {
            ok = false;
          }
        });
      }
      if (ok) stats.passed++;
      else stats.failed++;
      stats.pending--;
      test.ok = ok;
      test.timer = performance.now();
    }

    function runTests(i) {
      var error = null,
        ok = false,
        l = testToRun.length;

      for (; i < l; i++) {
        stats.pending++;
        bdd.trigger("progress", i, stats);

        test = testToRun[i];

        curT = i;
        if (test.async) {
          global.onerror = onerrorWrapper;
          test.results = test.fn(function() {
            testDone(true);
            asyncDone();
          });
          return;
        }
        try {
          test.results = test.fn();
          testDone(true);
        } catch (e) {
          test.results = { fn: { source: test.fn.source } };
          testDone(false, e);
        }
      }

      bdd.trigger("report", suite);
    }

    runTests(0);
  }

  /*
    88""Yb 888888 88""Yb  dP"Yb  88""Yb 888888 888888 88""Yb .dP"Y8
    88__dP 88__   88__dP dP   Yb 88__dP   88   88__   88__dP `Ybo."
    88"Yb  88""   88"""  Yb   dP 88"Yb    88   88""   88"Yb  o.`Y8b
    88  Yb 888888 88      YbodP  88  Yb   88   888888 88  Yb 8bodP'
  */

  var reporters = {
    log: function(suite, opt, fileName) {
      var indent = 0;

      function writeSuites(su) {
        indent++;
        for (var i = 0, l = su.length; i < l; i++) {
          var title = su[i].title;
          if (indent == 1)
            //$log(' '),
            $log.bold(" ".repeat(indent) + " " + title);
          else $log(" ".repeat(indent) + " " + title);

          if (su[i].tests.length) writeTests(su[i].tests);
          if (su[i].suites.length) writeSuites(su[i].suites);
        }
        indent--;
      }

      function writeTests(te) {
        for (var i = 0, l = te.length; i < l; i++) {
          var test = te[i];
          var title = test.title;

          if (test.ok) {
            //$log['noop'].succes(' '.repeat(indent) + '  ✔ ' + title);
            $log.succes(" ".repeat(indent) + "  ✔ " + title);
          } else {
            //$log['noop'].error.bold(' '.repeat(indent) + '  ✘ ' + title);
            $log.error.bold(" ".repeat(indent) + "  ✘ " + title);
            if (test.err && test.err.message) {
              if (opt.collapse != "all")
                $log.error(" ".repeat(indent) + "    -> " + test.err.message);
              console.groupCollapsed("%c✘ " + title, "color:#dd0033");
              test.err.stack &&
                console.log(
                  typeof test.err.stack === "function"
                    ? test.err.stack()
                    : test.err.stack
                );
              console.groupEnd();
            }
          }

          //if (opt.collapse == 'all') continue;
          if (opt.collapse === true) continue;

          var beginWithCheckmark = !!opt.beginWithCheckmark;
          var removeCheckMark = !!opt.removeCheckMark;
          var html = "";

          //console.log(test.results)

          if (test.results && test.results.fn && test.results.fn.source) {
            html = test.results.fn.source;
            html = test.results.fn.source.replace(/^(.*)/gm, function(_, b) {
              if (beginWithCheckmark) {
                if (b.indexOf("✘") > -1)
                  return /*' '.repeat(indent+4) + */ "✘ " + b;
                else if (b.indexOf("✔") > -1)
                  return /*' '.repeat(indent+4) + */ "✔ " + b;
                else if (b.indexOf("▸") > -1)
                  return /*' '.repeat(indent+4) + */ "▸ " + b;
                return /*' '.repeat(indent+4) + */ "• " + b;
              } else return /*' '.repeat(indent+4) + */ b;
            });
          }
          // go to next test if it's there is no results to display
          else continue;

          var s = $log.save.code(html);

          //s.firstChild.style.marginLeft = indent+4 + 'ch'
          s.style.position = "relative";
          s.style.left = indent + 4 + "ch";

          var testComment = s.querySelectorAll(".sh_comment");
          $io.arr.all(testComment, function(val) {
            if (val.innerHTML.indexOf("✘") > -1) {
              if (removeCheckMark)
                val.innerHTML = val.innerHTML.replace("✘", "");
              val.className = "ui_log__red--light";
            } else if (val.innerHTML.indexOf("✔") > -1) {
              if (removeCheckMark)
                val.innerHTML = val.innerHTML.replace("✔", "");
              val.className = "ui_log__green--light";
            } else if (val.innerHTML.indexOf("▸") > -1) {
              if (removeCheckMark)
                val.innerHTML = val.innerHTML.replace("▸", "");
              val.className = "ui_log__magenta--light";
            }

            if (val.innerHTML.indexOf("---- expected ----") > -1) {
              //val.innerHTML = val.innerHTML.slice(2, -2)
              val.className = "";

              var sep = val.innerHTML.split("---- expected ----");

              var strList = [];
              for (var i = 0, l = sep.length; i < l; i++) {
                sep[i].replace(/"([\s\S]*)"/g, function(_, a) {
                  strList.push(a);
                });
              }

              if (!false && global.JsDiff) {
                //var diff = global.JsDiff.diffLines(strList[0], strList[1]);
                var diff = global.JsDiff.diffChars(strList[0], strList[1]);
                //var diff = global.JsDiff.diffWordsWithSpace(strList[0], strList[1]);
                //var diff = global.JsDiff.diffWords(strList[0], strList[1]);
                var newStr = "";
                diff.forEach(function(part) {
                  //console.log(part)
                  if (part.added) newStr += "<ins>" + part.value + "</ins>";
                  else if (part.removed)
                    newStr += "<del>" + part.value + "</del>";
                  else newStr += part.value;
                });
                //newStr = newStr.replace(/\n/g,'<span style="opacity:.3">↵</span>\n')
                newStr = newStr.replace(
                  /\n/g,
                  '<span class="ui_log__ch_newline">\n</span>'
                );
                //newStr = newStr.replace(/\t/g,'<span style="opacity:.1">│   </span>')
                newStr = newStr.replace(
                  /\t/g,
                  '<span class="ui_log__ch_tab">\t</span>'
                );
                //val.innerHTML = '\n' + newStr
                val.innerHTML = val.innerHTML.replace(
                  /^(\s*)\/\*(\s*)[\s\S]*?(\s*)\*\/(\s*)$/,
                  '$1<span class="ui_log__red--light">/*</span>$2' +
                    newStr +
                    '$3<span class="ui_log__red--light">*/</span>$4'
                );
              } else {
                val.innerHTML = sep.join(
                  '<span class="ui_log__red--light" _style="opacity:.3">---- expected ----</span>'
                );
                val.innerHTML = val.innerHTML.replace(
                  /^(\s*)\/\*([\s\S]*)\*\/(\s*)$/,
                  '$1<span class="ui_log__red--light">/*</span>$2<span class="ui_log__red--light">*/</span>$3'
                );
              }
            } else {
              val.innerHTML = val.innerHTML.replace(
                /^(\s*)\/\*([\s\S]*)\*\/(\s*)$/,
                '$1<span style="opacity:.3">/*</span>$2<span style="opacity:.3">*/</span>$3'
              );
            }
          });
          s.innerHTML = s.innerHTML
            .replace(
              /✔/g,
              '<span unselectable="on" class="depict__pass unselectable ui_log__unherit ui_log__green">✔</span>'
            )
            .replace(
              /✘/g,
              '<span unselectable="on" class="depict__fail unselectable ui_log__unherit ui_log__red">✘</span>'
            )
            .replace(
              /▸/g,
              '<span unselectable="on" class="depict__bull unselectable ui_log__halfhide ui_log__magenta--light">▸</span>'
            )
            .replace(
              /•/g,
              '<span unselectable="on" class="depict__bull unselectable ui_log__halfhide sh_comment">•</span>'
            );
        }
      }

      if (fileName) {
        //$log.pad('---- ' + fileName + ' ', '-');
        $log.right.html(
          '<a target="_blank" class="unstyled bold" style="border:0 none" href="./' +
            fileName +
            '">' +
            fileName +
            "<a>"
        );
      }

      writeSuites(suite);
      $log(" ");
      $log.pad("==== passed " + stats.passed + " / " + stats.tests + " ", "=");
      bdd.trigger("complete");
    },
  };

  /*
    88""Yb 8888b.  8888b.
    88__dP  8I  Yb  8I  Yb
    88""Yb  8I  dY  8I  dY
    88oodP 8888Y"  8888Y"
  */

  var cfg,
    i,
    fileName,
    testsUrl,
    busy = false,
    pendingSuite = [];
  function bdd(urls, opt) {
    if (!urls.length) return;

    if (busy) {
      pendingSuite.push(arguments);
      return;
    }
    busy = true;

    if (typeof opt == "function") opt = { oncomplete: opt };

    resetGlobals();

    cfg = $extend(
      {
        collapse: !true, //false,
        beginWithCheckmark: false,
        removeCheckMark: true,
        onready: null,
        onprogress: null,
        onreport: null,
        oncomplete: null,
      },
      opt
    );

    i = 0;
    testsUrl = urls;
    fileName = testsUrl[i];

    loadTestFile(i);
  }

  bdd = $watch(bdd);

  bdd
    .on("ready", function(suite) {
      cfg.onready && cfg.onready.apply(this, arguments);

      run(suite);
    })
    .on("progress", function(i) {
      cfg.onprogress && cfg.onprogress.apply(this, arguments);

      //console.log('progress : ' + i);
    })
    .on("report", function(suite) {
      cfg.onreport && cfg.onreport.apply(this, arguments);
      //console.log(1, suite);
      reporters[cfg.reporter || "log"](suite, cfg, fileName);
    })
    .on("complete", function() {
      cfg.oncomplete && cfg.oncomplete.apply(this, arguments);

      busy = false;
      rootSuites.length = 0;
      testToRun.length = 0;
      i++;
      if (i < testsUrl.length) {
        loadTestFile(i);
      } else if (pendingSuite.length) {
        bdd.apply(this, pendingSuite.shift());
      }
    });

  function loadTestFile(index) {
    i = index;
    fileName = testsUrl[i];

    /*$loader.script(fileName, function(err) {
      //console.log('???');
      if (err) bdd.trigger('complete');
    });*/

    var js = document.createElement("script");
    js.src = fileName;
    var first = document.getElementsByTagName("script")[0];
    first.parentNode.insertBefore(js, first);

    /*$loader([fileName], function(data) {
      if(this.err.length) {
        bdd.trigger('complete');
      };
      //console.log(arguments);
      //console.log(data);
      if (typeof data == 'string') {
        var div = document.createElement('div');
        div.id = 'visual_test_suite_' + i;
        div.innerHTML = data;
        var scripts = div.getElementsByTagName('script');
        var saved = [];
        $io.arr.all(scripts, function(script) {
          saved.push(script);
          script.parentNode.removeChild(script);
        });
        document.body.appendChild(div);
        $io.arr.all(saved, function(script) {
          var s = document.createElement('script');
          s.text = script.text;
          document.body.appendChild(s);
        });
      }
    });*/
  }

  global["describe"] = describe;
  global["it"] = it;
  global["depict"] = depict;
  global["assert"] = assert;

  global["$bdd"] = bdd;
})(this);
