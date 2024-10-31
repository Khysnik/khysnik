// TODO : https://twitter.com/marijnjh/status/730858284022894593?lang=en

/*
// from JSON Editor
if(type === "number") return 0.0;
if(type === "boolean") return false;
if(type === "integer") return 0;
if(type === "string") return "";
if(type === "object") return {};
if(type === "array") return [];
*/

!(function(global) {
  // todo: check extract reorder() from block
  //'use strict';

  var uid = 0,
    instances = [],
    _formEl = document.createElement("form"),
    _tabTitleEl = document.createElement("legend"),
    _tabEl = document.createElement("div"),
    _divEl = document.createElement("div"),
    labelEl = document.createElement("label"),
    inputEl = document.createElement("input"),
    textareaEl = document.createElement("textarea"),
    selectEl = document.createElement("select"),
    optionEl = document.createElement("option"),
    buttonEl = document.createElement("button");

  buttonEl.setAttribute("type", "button");
  textareaEl.setAttribute("rows", 4);

  _tabEl.className = "ui_form__tab";
  _formEl.className = "ui_form";

  function getClassList(str, cb) {
    if (str) {
      var classNameArray = str.split(/\s+/);
      for (var i = 0, l = classNameArray.length; i < l; i++)
        cb(classNameArray[i]);
    }
  }

  function Field(cfg) {
    $extend(this, cfg);
  }

  var tabId = 0;
  function build(instance, schema, key, fieldPath, data) {
    var formEl = instance.el;

    var out = document.createDocumentFragment();
    if (!schema) return { fragment: out };

    if (schema.type === "object") {
      var tabTitle = _tabTitleEl.cloneNode(true);
      var tab = _tabEl.cloneNode(true);
      tab.className = "ui_form__tab ui_form__object";
      tab.id = "ui_form__tab_" + instance.id + "_" + tabId++;

      var field;
      instance.fields[fieldPath + "{}"] = field = new Field({
        type: "object",
        path: fieldPath,
        fields: {},
        div: tab,
      });

      if (schema.title || key) {
        tabTitle.textContent = schema.title || key;
        tab.appendChild(tabTitle);
      }
      var div = _divEl.cloneNode(true);
      getClassList(schema.className, function(className) {
        div.classList.add(className);
        tab.classList.add(
          "ui_form__object--" + className.replace(/ui_form[-_]*/, "")
        );
      });
      if (schema.description) {
        var desc = document.createElement("div");
        desc.className = "ui_form__description";
        desc.innerHTML = schema.description;
        tab.appendChild(desc);
      }
      $io.obj.each(schema.properties, function(val, prop) {
        var propField = build(
          instance,
          val,
          prop,
          fieldPath ? fieldPath + "." + prop : prop,
          data && data.hasOwnProperty(prop) ? data[prop] : null
        );
        field.fields[prop] = propField;
        div.appendChild(propField.fragment);
      });
      tab.appendChild(div);
      if (schema.help) {
        var help = document.createElement("div");
        help.className = "ui_form__help";
        help.innerHTML = schema.help;
        tab.appendChild(help);
      }

      $io.obj.all(schema.plugin, function(cfg, key) {
        if (_form.plugin[key]) {
          _form.plugin[key].call(schema, field, schema.plugin[key], cfg);
        }
      });
      out.appendChild(field.div);
    } else if (schema.type === "array") {
      var tabTitle = _tabTitleEl.cloneNode(true);
      var tab = _tabEl.cloneNode(true);

      var divItemsEl = tab;
      //var divItemsEl = _divEl.cloneNode()
      //divItemsEl.className = 'ui_form__array__items'

      tab.className = "ui_form__tab ui_form__array";
      tab.id = "ui_form__tab_" + instance.id + "_" + tabId++;

      var field;
      instance.fields[fieldPath + "[]"] = field = new Field({
        type: "array",
        path: fieldPath,
        div: tab,
        addItem: addItem,
        reorder: reorder,
        setValue: function(data, cb) {
          /*while (divItemsEl.firstChild) {
            divItemsEl.removeChild(divItemsEl.firstChild)
          }*/
          $io.arr.all(
            document.querySelectorAll("#" + tab.id + " .ui_form__array__item"),
            function(item) {
              item.remove();
            }
          );
          arrIndex = 0;
          arrLen = data.length;
          var fields = [];
          for (; arrIndex < arrLen; ) {
            var curField = addItem(data[arrIndex]);
            fields.push(curField);
            cb(data[arrIndex - 1], curField);
          }
          return fields;
        },
      });

      getClassList(schema.className, function(className) {
        tab.classList.add(className);
      });

      tabTitle.innerHTML = (schema.title || key) + "&nbsp;";
      var btnAdd = buttonEl.cloneNode(true);
      btnAdd.className = "ui_form__array_btn ui_form__btn_add";
      btnAdd.innerHTML = _form.default.add;
      btnAdd.onclick = function() {
        addItem();
      };
      tabTitle.appendChild(btnAdd);

      var hiddenInput = inputEl.cloneNode();
      //hiddenInput.type = 'hidden'
      hiddenInput.name = fieldPath;
      hiddenInput.value = fieldPath;
      hiddenInput.setAttribute("data-is-array", true);

      tabTitle.appendChild(hiddenInput);
      tab.appendChild(tabTitle);
      //tab.appendChild(divItemsEl)

      function reorder() {
        //var inputs = formEl.querySelectorAll('#' + tab.id + ' [name]:not([data-is-array])')
        var inputs = formEl.querySelectorAll("[name]");
        var incrementations = [];
        var lastDeepness = 0;
        var lastParent;

        //var savedField = {}

        for (var i = 0, l = inputs.length; i < l; i++) {
          var input = inputs[i];
          var deep = -1;
          var parent = null;
          var target = input.parentNode;
          //console.log(target,  target === divItemsEl)
          while (target && target.nodeType == 1) {
            //  && target !== divItemsEl
            if (target.classList.contains("ui_form__array__item")) {
              if (!parent) parent = target;
              deep++;
            }
            /*if (target === divItemsEl) {
              parent = target
              break
            }*/
            target = target.parentNode;
          }

          if (deep > -1) {
            // input is in array, keep track of incrementations
            if (incrementations[deep] === undefined) incrementations[deep] = -1;

            if (lastParent !== parent) {
              if (lastDeepness < deep) incrementations[deep] = 0;
              else incrementations[deep]++;
            }

            var oldName = input.name;

            var replaceCnt = 0;
            // https://regex101.com/r/mS0bJ3/2
            var newName = oldName.replace(/(\.?)(\d+)(?![^.\s])/g, function(
              _,
              dot,
              n
            ) {
              return dot + incrementations[replaceCnt++];
            });

            //field.path = newName
            input.name = newName;
            //console.log('old', oldName, 'new', newName)
            input.id = "ui_form__" + newName;
            //input.value = newName
            //savedField[oldName] = instance.fields[oldName]
            //delete instance.fields[oldName]
            //instance.fields[newName] = savedField[oldName]
            //instance.fields[newName].path = newName

            lastParent = parent;
            lastDeepness = deep;
          } else {
            // input is not in array, reset incrementations
            incrementations.length = 0;
          }
        }
        //savedField = null
      }

      function updateUpDown(noreorder) {
        var items = [];
        for (var i = 0, l = divItemsEl.children.length; i < l; i++) {
          if (divItemsEl.children[i].classList.contains("ui_form__array__item"))
            items.push(divItemsEl.children[i]);
        }
        if (noreorder) {
          var arrIndex, arrLen;
        }
        arrIndex = 0;
        arrLen = items.length;
        for (; arrIndex < arrLen; arrIndex++) {
          // instead of the :scope selector (too slow or not supported)
          var tempID =
            "ui_form_temp" + arrIndex + (Math.random() + "").slice(2);
          items[arrIndex].id = tempID;
          divItemsEl.querySelector(
            "#" + tempID + " > .ui_form__array__btns > .ui_form__btn_up"
          ).disabled =
            arrIndex === 0;
          divItemsEl.querySelector(
            "#" + tempID + " > .ui_form__array__btns > .ui_form__btn_down"
          ).disabled =
            arrIndex === arrLen - 1;
          items[arrIndex].id = "";
        }
        reorder();
      }

      function createBtn(item, type, fn) {
        var btn = buttonEl.cloneNode();
        btn.className = "ui_form__array_btn ui_form__btn_" + type;
        btn.innerHTML = _form.default[type];
        btn.onclick = fn;
        item.appendChild(btn);
      }

      function addItem(val) {
        var item = document.createElement("div");
        item.className = "ui_toolbar ui_form__array__item";

        var itemField = build(
          instance,
          schema.items,
          "",
          fieldPath + "." + arrIndex++,
          val
        );
        item.appendChild(itemField.fragment);

        var btns = document.createElement("div");
        btns.className = "ui_form__array__btns";
        createBtn(btns, "remove", function() {
          item.remove();
          updateUpDown();
        });
        createBtn(btns, "up", function() {
          divItemsEl.insertBefore(item, item.previousSibling);
          updateUpDown();
        });
        createBtn(btns, "down", function() {
          divItemsEl.insertBefore(item, item.nextSibling.nextSibling);
          updateUpDown();
        });

        item.appendChild(btns);
        divItemsEl.appendChild(item);
        updateUpDown(true);

        return itemField;
      }

      if (!data) data = [];
      var arrIndex = 0,
        arrLen = data.length;
      for (; arrIndex < arrLen; ) addItem(data[arrIndex]);

      $io.obj.all(schema.plugin, function(cfg, key) {
        if (_form.plugin[key]) {
          _form.plugin[key].call(schema, field, schema.plugin[key], cfg);
        }
      });
      out.appendChild(field.div);
    } else if (
      schema.type === "string" ||
      schema.type === "boolean" ||
      schema.type === "number" ||
      schema.type === "integer"
    ) {
      var div = _divEl.cloneNode();
      var label = labelEl.cloneNode();
      var input;

      div.className = "ui_form__field";
      getClassList(schema.className, function(className) {
        div.classList.add(className);
      });

      if (_form.format[schema.format]) {
        input = _form.format[schema.format].call(schema);
      } else if (schema.enum) {
        input = selectEl.cloneNode();
        $io.arr.all(schema.enum, function(val) {
          if (Array.isArray(val)) {
            input.options[input.options.length] = new Option(val[0], val[1]);
            //console.log(val, data)
            //if (data && data === val[1]) input.options[input.options.length].selected = true
          } else input.options[input.options.length] = new Option(val, val);
        });
      } else if (schema.format === "textarea") {
        input = textareaEl.cloneNode();
      } else {
        input = inputEl.cloneNode();
        if (schema.type === "string") input.type = "text";
        if (schema.type === "number" || schema.type === "integer")
          input.type = "number";
      }

      if (schema.type === "boolean") {
        input.type = "checkbox";
        if (typeof data === "boolean") input.checked = data;
        else if (schema.default) input.checked = schema.default;
        var checkboxLabel = document.createElement("span");
      } else {
        //console.log(key, data)
        if (data !== null && data !== undefined) input.value = data;
        else if (schema.default) input.value = schema.default;
      }

      //console.log(fieldPath, $io.type(data))

      if (schema.placeholder) input.placeholder = schema.placeholder;
      if (schema.ignore !== true) input.name = fieldPath;
      //var pathId = fieldPath.replace(/\./, '_')
      input.id = "ui_form__" + fieldPath;
      label.setAttribute("for", "ui_form__" + fieldPath);
      //label.innerHTML = '<span>' + (schema.title || key) + '</span>';
      label.innerHTML = schema.title || key;

      if (
        instance.cfg.disabled === true ||
        schema.disabled === true ||
        (schema.createOnly === true && instance.cfg.create === false)
      )
        input.disabled = true;
      if (schema.pattern) input.setAttribute("pattern", schema.pattern);

      if (schema.attributes) {
        $io.obj.all(schema.attributes, function(val, key) {
          if (key === "required") schema.required === true;
          if (typeof val === "function") {
            input[key] = val;
          } else input.setAttribute(key, val);
        });
      }

      if (schema.required === true) {
        label.innerHTML =
          label.innerHTML +
          ' <span title="required" class="ui_form__required">*</span>';
        input.required = true;
      }

      if (schema.description) {
        var desc = document.createElement("div");
        desc.className = "ui_form__description";
        desc.innerHTML = schema.description;
      }

      var field;
      instance.fields[fieldPath] = field = new Field({
        type: schema.type,
        path: fieldPath,
        div: div,
        input: input,
        actionZone: input,
        label: label,

        getValue: function() {
          return this.input.value;
        },
        setValue: function(arg) {
          this.input.value = arg;
        },
        setFocus: function() {
          this.input.focus();
        },
        onFocus: function(fn) {
          this.input.onfocus = fn;
        },
        onBlur: function(fn) {
          this.input.onblur = fn;
        },
        onModif: function(fn) {
          this.input.oninput = this.input.onkeyup = this.input.onchange = fn;
        },
      });

      if (
        _form.type[schema.type] &&
        typeof _form.type[schema.type] === "function"
      ) {
        replaceInput(field, "type", schema.type);
      }

      schema.plugin = schema.plugin || [];
      if (schema.format && _form.plugin[schema.format])
        schema.plugin[schema.format] = true;
      //if (schema.plugin) {
      $io.obj.all(schema.plugin, function(cfg, key) {
        if (_form.plugin[key]) {
          replaceInput(field, "plugin", key);
        }
      });
      //}

      if (schema.type === "boolean") {
        //div.appendChild(labelEl.cloneNode())
        field.div.appendChild(field.actionZone);
        field.div.appendChild(field.label);
        if (desc) field.div.appendChild(desc);
      } else {
        field.div.appendChild(field.label);
        if (desc) field.div.appendChild(desc);
        field.div.appendChild(field.actionZone);
      }

      if (schema.hidden) field.div.classList.add("hide");

      out.appendChild(field.div);
    } else {
      throw new Error("$form: unknown schema type : " + schema.type);
    }

    function replaceInput(field, replacer, name) {
      //field = _form[replacer][name].call(schema, field, schema[replacer][name], instance.cfg)
      field = _form[replacer][name].call(
        schema,
        field,
        $extend({}, schema[replacer][name])
      );
      return field;
    }

    // unique usage property
    Object.defineProperty(field, "fragment", {
      get: function() {
        delete field.fragment;
        return out;
      },
      configurable: true,
    });

    return field;
  }

  var simpleTypes = "string number boolean null".split(" ");
  function generateSchema(val, schema) {
    var schema = {};
    var type = typeof val;
    if (simpleTypes.indexOf(type) > -1) schema.type = type;
    else if (Array.isArray(val))
      (schema.type = "array"), (schema.items = generateSchema(val[0]));
    else if ($io.isObject(val))
      (schema.type = "object"),
        (schema.properties = {}),
        $io.obj.all(val, function(val, key) {
          schema.properties[key] = generateSchema(val);
        });
    return schema;
  }

  // translate classic JSON Schema required field in each properties
  function setEasySchema(schema) {
    if (schema.properties) {
      $io.obj.all(schema.properties, function(item, key) {
        if (item.type === "object") item = setEasySchema(item);
        if (!!schema.required && schema.required.indexOf(key) > -1) {
          item.required = true;
        }
      });
    }
    return schema;
  }

  function _form(form, opt) {
    if (form.nodeName == "FORM") return _form.data(form);
    else return _form.build(form, opt);
  }

  _form.instances = {};

  _form.build = function(data, opt) {
    // console.log(data)
    // debugger

    tabId = 0;
    var cfg = $extend({}, opt);
    var _id = uid++;

    var formEl = _formEl.cloneNode(); //$watch(_formEl.cloneNode());
    var formId = "ui_form_" + _id;
    formEl.id = formId;
    formEl.setAttribute("data-form-id", _id);

    if (!data.schema) {
      data.schema = generateSchema(data);
      data.data = data;
    }

    if (!data.schema.type) {
      data.schema = { type: "object", properties: $extend({}, data.schema) };
    } else {
      data.schema = $extend({}, data.schema);
    }

    data.schema = setEasySchema(data.schema);

    var instance = (_form.instances[_id] = {
      id: _id,
      el: formEl,
      cfg: cfg,
      schema: data.schema,
      data: data.data,
      fields: {},
      destroy: function() {
        this.el.remove();
        delete _form.instances[_id];
      },
    });

    //console.log(123123, data)

    var out;
    if (data.data) {
      //console.log(1, data)
      //debugger
      //console.log(2, $extend({}, data.data))
      out = build(instance, data.schema, "", "", $extend({}, data.data))
        .fragment;
    } else {
      out = build(instance, data.schema, "", "").fragment;
    }

    /*$io.obj.all(instance.fields, function (item, key) {
      console.log(key)
    })*/

    // add dummy submit button for listenning submit with "enter" on inputs
    var submit = document.createElement("button");
    submit.type = "submit";
    submit.style.display = "none";
    out.appendChild(submit);

    formEl.appendChild(out);

    return instance;
  };

  _form.onvalidate = function(msg, el) {
    console.log(msg, el);
  };

  function checkIfbuildedForm(form) {
    var id = form.getAttribute("data-form-id");
    if (id && _form.instances[id]) {
      //console.log('from instances', _form.instances[id])
      var fields = _form.instances[id].fields;
      for (var key in fields) {
        if (fields.hasOwnProperty(key) && fields[key].save) {
          fields[key].save();
        }
      }
    }
  }

  _form.validate = function(form) {
    checkIfbuildedForm(form);

    var res = true;
    var els =
      form.tagName === "FORM" ? form.elements : form.length ? form : [form];

    $io.arr.each(els, function(el, i) {
      if (!el.validity.valid) {
        res = false;
        _form.onvalidate(el.validationMessage, el);
        if (i === 0) {
          el.select();
          el.focus();
        }
        //return
        //console.log(el.validationMessage);
      }
    });

    return res;
  };

  _form.data = function(form) {
    checkIfbuildedForm(form);

    var out = {},
      arr,
      j;

    $io.arr.all(form.elements, function(el) {
      if (el.name === "" || el.disabled) return;

      if (el.type === "checkbox") $io.obj.path(out, el.name, !!el.checked);
      else if (el.type === "number") {
        //console.log(parseInt(el.value), el.value*1)
        $io.obj.path(out, el.name, parseInt(el.value));
      } else if (el.type === "select-multiple") {
        arr = [];
        for (j = el.options.length - 1; j >= 0; j = j - 1) {
          if (el.options[j].selected) arr.push(el.options[j].value);
        }
        $io.obj.path(out, el.name, arr);
      } else if (el.getAttribute("data-is-array")) {
        $io.obj.path(out, el.name, []);
      } else {
        //console.log(el.name, el.value)
        $io.obj.path(out, el.name, el.value);
      }
    });

    return out;
  };

  _form.update = function(form, data) {
    console.warn("WARNING - TODO $form.update() with array");
    if (data) {
      $io.obj.all(data, function(val, key) {
        if (form[key]) form[key].value = val;
      });
    } else {
      $io.arr.all(form.elements, function(el) {
        el.value = "";
      });
    }
  };

  _form.disable = function(form) {
    $io.arr.all(form.elements, function(el) {
      if (el.disabled) el.wasDisbled = true;
      el.disabled = true;
    });
  };

  _form.enable = function(form) {
    $io.arr.all(form.elements, function(el) {
      if (!el.wasDisbled) el.disabled = false;
    });
  };

  _form.plugin = {};
  _form.format = {};
  _form.type = {};

  _form.default = {
    add: "+",
    remove: "-",
    up: "up",
    down: "down",
  };

  global.$form = _form;
})(this);

/*var slice = Array.prototype.slice
// create an observer instance
var observer = new MutationObserver(function(mutations) {
  for (var i = 0, l = mutations.length; i < l; i++) {
    var mutation = mutations[i]
    if (mutation && mutation.removedNodes && mutation.removedNodes.length) {
      var removedNodes = slice.call(mutation.removedNodes, 0)
      if (removedNodes.indexOf(formEl) > -1) {
        //console.log(formEl.id + ' removed')
        delete listeners[formEl.id]
        observer.disconnect()
      }
    }
  }
})

// should listen if node is inserted
// http://www.backalleycoder.com/2012/04/25/i-want-a-damnodeinserted/
setTimeout(function() {
  if (formEl.parentNode) {
    observer.observe(formEl.parentNode, { childList: true })
  }
}, 100)*/
