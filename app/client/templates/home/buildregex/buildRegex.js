/**
 * Created by lukegessler on 4/2/16.
 */

Template.buildRegex.events({
  'click #searchbutton': function(e) {
    e.preventDefault();
    // extract built text--ignore options at index 2
    var term = $("#expression span").text().split('/')[1];

    var domainName = window.location.href.split('/')[2];
    var formattedUrl = Router.url('searchResults', {term: expression.toString().split('/')[1]});
    formattedUrl = formattedUrl.split('/');
    formattedUrl[2] = domainName;
    formattedUrl = formattedUrl.join('/');

    window.open(formattedUrl);
  }
});

Template.buildRegex.rendered = () => {
  var VerEx = require('verbal-expressions');
  function buildExpression() {
    var t = $('input[name="modifiers[]"]:checked').map(function () {
      return $(this).val()
    });
    if (expression = new VerEx, $conditions_container.find(".row").each(function () {
        var t = $(this),
          e = t.find(".match-options").val(),
          n = t.find(".match-param").val();
        $.inArray(e, options_without_params) > -1 ? expression[e]() : (n = "range" == e ? n.replace(/\[|\]|\s/g, "").replace(/,/g, "-").split("-") : [n], expression[e].apply(expression, n))
      }), 0 === $conditions_container.children().length) return expression = null, !1;
    for (var e = 0; t.length > e; e++) expression.addModifier(t[e]);
    $("#expression").find("span").text(expression)
  }

  +function (t) {
    "use strict";
    var e = function (n, i) {
      this.$element = t(n), this.options = t.extend({}, e.DEFAULTS, i)
    };
    e.DEFAULTS = {
      loadingText: "loading..."
    }, e.prototype.setState = function (t) {
      var e = "disabled",
        n = this.$element,
        i = n.is("input") ? "val" : "html",
        o = n.data();
      t += "Text", o.resetText || n.data("resetText", n[i]()), n[i](o[t] || this.options[t]), setTimeout(function () {
        "loadingText" == t ? n.addClass(e).attr(e, e) : n.removeClass(e).removeAttr(e)
      }, 0)
    }, e.prototype.toggle = function () {
      var t = this.$element.closest('[data-toggle="buttons"]');
      if (t.length) {
        var e = this.$element.find("input").prop("checked", !this.$element.hasClass("active"));
        "radio" === e.prop("type") && t.find(".active").removeClass("active")
      }
      this.$element.toggleClass("active")
    };
    var n = t.fn.button;
    t.fn.button = function (n) {
      return this.each(function () {
        var i = t(this),
          o = i.data("button"),
          r = "object" == typeof n && n;
        o || i.data("bs.button", o = new e(this, r)), "toggle" == n ? o.toggle() : n && o.setState(n)
      })
    }, t.fn.button.Constructor = e, t.fn.button.noConflict = function () {
      return t.fn.button = n, this
    }, t(document).on("click.bs.button.data-api", "[data-toggle^=button]", function (e) {
      var n = t(e.target);
      n.hasClass("btn") || (n = n.closest(".btn")), n.button("toggle"), e.preventDefault()
    })
  }(window.jQuery), !function (t) {
    "use strict";

    function e(t, e) {
      t.hasClass("pull-center") && t.css("margin-right", t.outerWidth() / -2), t.hasClass("pull-middle") && t.css("margin-top", t.outerHeight() / -2 - e.outerHeight() / 2)
    }

    function n() {
      t(o).each(function () {
        i(t(this)).removeClass("open")
      })
    }

    function i(e) {
      var n, i = e.attr("data-target");
      return i || (i = e.attr("href"), i = i && /#/.test(i) && i.replace(/.*(?=#[^\s]*$)/, "")), n = i && t(i), n && n.length || (n = e.parent()), n
    }

    var o = "[data-toggle=dropdown]",
      r = function (e) {
        var n = t(e).on("click.dropdown.data-api", this.toggle);
        t("html").on("click.dropdown.data-api", function () {
          n.parent().removeClass("open")
        })
      };
    r.prototype = {
      constructor: r,
      toggle: function () {
        var o, r, a = t(this);
        if (!a.is(".disabled, :disabled")) return o = i(a), r = o.hasClass("open"), n(), r || (o.toggleClass("open"), e(o.find(".dropdown-menu"), a)), a.focus(), !1
      },
      change: function () {
        var e, n, i, r = "";
        if (e = t(this).closest(".dropdown-menu"), n = e.parent().find("[data-label-placement]"), n && n.length || (n = e.parent().find(o)), n && n.length && n.data("placeholder") !== !1) {
          void 0 == n.data("placeholder") && n.data("placeholder", t.trim(n.text())), r = t.data(n[0], "placeholder"), i = e.find("li > input:checked"), i.length && (r = [], i.each(function () {
            var e = t(this).parent().find("label").eq(0),
              n = e.find(".data-label");
            if (n.length) {
              var i = t("<p></p>");
              i.append(n.clone()), e = i.html()
            } else e = e.html();
            e && r.push(t.trim(e))
          }), r = 4 > r.length ? r.join(", ") : r.length + " selected");
          var a = n.find(".caret");
          n.html(r || "&nbsp;"), a.length && n.append(" ") && a.appendTo(n)
        }
      },
      keydown: function (e) {
        var n, r, a, s, d;
        if (/(38|40|27)/.test(e.keyCode) && (n = t(this), e.preventDefault(), e.stopPropagation(), !n.is(".disabled, :disabled"))) {
          if (a = i(n), s = a.hasClass("open"), !s || s && 27 == e.keyCode) return 27 == e.which && a.find(o).focus(), n.click();
          r = t("[role=menu] li:not(.divider):visible a, li:not(.divider):visible > input:not(disabled) ~ label", a), r.length && (d = r.index(r.filter(":focus")), 38 == e.keyCode && d > 0 && d--, 40 == e.keyCode && r.length - 1 > d && d++, ~d || (d = 0), r.eq(d).focus())
        }
      }
    };
    var a = t.fn.dropdown;
    t.fn.dropdown = function (e) {
      return this.each(function () {
        var n = t(this),
          i = n.data("dropdown");
        i || n.data("dropdown", i = new r(this)), "string" == typeof e && i[e].call(n)
      })
    }, t.fn.dropdown.Constructor = r, t.fn.dropdown.noConflict = function () {
      return t.fn.dropdown = a, this
    }, t(document).on("click.dropdown.data-api", n).on("click.dropdown.data-api", ".dropdown form", function (t) {
      t.stopPropagation()
    }).on("click.dropdown-menu", function (t) {
      t.stopPropagation()
    }).on("click.dropdown-menu", '.dropdown-menu > li > input[type="checkbox"] ~ label, .dropdown-menu > li > input[type="checkbox"], .dropdown-menu.noclose > li', function (t) {
      t.stopPropagation()
    }).on("change.dropdown-menu", '.dropdown-menu > li > input[type="checkbox"], .dropdown-menu > li > input[type="radio"]', r.prototype.change).on("click.dropdown.data-api", o, r.prototype.toggle).on("keydown.dropdown.data-api", o + ", [role=menu]", r.prototype.keydown)
  }(window.jQuery), +function (t) {
    "use strict";

    function e() {
      var t = document.createElement("bootstrap"),
        e = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend"
        };
      for (var n in e)
        if (void 0 !== t.style[n]) return {
          end: e[n]
        }
    }

    t.fn.emulateTransitionEnd = function (e) {
      var n = !1,
        i = this;
      t(this).one(t.support.transition.end, function () {
        n = !0
      });
      var o = function () {
        n || t(i).trigger(t.support.transition.end)
      };
      return setTimeout(o, e), this
    }, t(function () {
      t.support.transition = e()
    })
  }(window.jQuery),
    function (t) {
      t.fn.dragsort = function (e) {
        if ("destroy" == e) return t(this.selector).trigger("dragsort-uninit"), void 0;
        var n = t.extend({}, t.fn.dragsort.defaults, e),
          i = [],
          o = null,
          r = null;
        return this.each(function (e, a) {
          t(a).is("table") && 1 == t(a).children().size() && t(a).children().is("tbody") && (a = t(a).children().get(0));
          var s = {
            draggedItem: null,
            placeHolderItem: null,
            pos: null,
            offset: null,
            offsetLimit: null,
            scroll: null,
            container: a,
            init: function () {
              var i = 0 == t(this.container).children().size() ? "li" : t(this.container).children(":first").get(0).tagName.toLowerCase();
              "" == n.itemSelector && (n.itemSelector = i), "" == n.dragSelector && (n.dragSelector = i), "" == n.placeHolderTemplate && (n.placeHolderTemplate = "<" + i + ">&nbsp;</" + i + ">"), t(this.container).attr("data-listidx", e).mousedown(this.grabItem).bind("dragsort-uninit", this.uninit), this.styleDragHandlers(!0)
            },
            uninit: function () {
              var e = i[t(this).attr("data-listidx")];
              t(e.container).unbind("mousedown", e.grabItem).unbind("dragsort-uninit"), e.styleDragHandlers(!1)
            },
            getItems: function () {
              return t(this.container).children(n.itemSelector)
            },
            styleDragHandlers: function (e) {
              this.getItems().map(function () {
                return t(this).is(n.dragSelector) ? this : t(this).find(n.dragSelector).get()
              }).css("cursor", e ? "pointer" : "")
            },
            grabItem: function (e) {
              if (!(1 != e.which || t(e.target).is(n.dragSelectorExclude) || t(e.target).closest(n.dragSelectorExclude).size() > 0 || 0 == t(e.target).closest(n.itemSelector).size())) {
                e.preventDefault();
                for (var o = e.target; !t(o).is(n.dragSelector);) {
                  if (o == this) return;
                  o = o.parentNode
                }
                t(o).attr("data-cursor", t(o).css("cursor")), t(o).css("cursor", "move");
                var r = i[t(this).attr("data-listidx")],
                  a = this,
                  s = function () {
                    r.dragStart.call(a, e), t(r.container).unbind("mousemove", s)
                  };
                t(r.container).mousemove(s).mouseup(function () {
                  t(r.container).unbind("mousemove", s), t(o).css("cursor", t(o).attr("data-cursor"))
                })
              }
            },
            dragStart: function (e) {
              null != o && null != o.draggedItem && o.dropItem(), o = i[t(this).attr("data-listidx")], o.draggedItem = t(e.target).closest(n.itemSelector), o.draggedItem.attr("data-origpos", t(this).attr("data-listidx") + "-" + o.getItems().index(o.draggedItem));
              var r = parseInt(o.draggedItem.css("marginTop")),
                a = parseInt(o.draggedItem.css("marginLeft"));
              if (o.offset = o.draggedItem.offset(), o.offset.top = e.pageY - o.offset.top + (isNaN(r) ? 0 : r) - 1, o.offset.left = e.pageX - o.offset.left + (isNaN(a) ? 0 : a) - 1, !n.dragBetween) {
                var s = 0 == t(o.container).outerHeight() ? Math.max(1, Math.round(.5 + o.getItems().size() * o.draggedItem.outerWidth() / t(o.container).outerWidth())) * o.draggedItem.outerHeight() : t(o.container).outerHeight();
                o.offsetLimit = t(o.container).offset(), o.offsetLimit.right = o.offsetLimit.left + t(o.container).outerWidth() - o.draggedItem.outerWidth(), o.offsetLimit.bottom = o.offsetLimit.top + s - o.draggedItem.outerHeight()
              }
              var d = o.draggedItem.height(),
                l = o.draggedItem.width();
              if ("tr" == n.itemSelector ? (o.draggedItem.children().each(function () {
                  t(this).width(t(this).width())
                }), o.placeHolderItem = o.draggedItem.clone().attr("data-placeholder", !0), o.draggedItem.after(o.placeHolderItem), o.placeHolderItem.children().each(function () {
                  t(this).css({
                    borderWidth: 0,
                    width: t(this).width() + 1,
                    height: t(this).height() + 1
                  }).html("&nbsp;")
                })) : (o.draggedItem.after(n.placeHolderTemplate), o.placeHolderItem = o.draggedItem.next().css({
                  height: d,
                  width: l
                }).attr("data-placeholder", !0)), "td" == n.itemSelector) {
                var c = o.draggedItem.closest("table").get(0);
                t("<table id='" + c.id + "' style='border-width: 0px;' class='dragSortItem " + c.className + "'><tr></tr></table>").appendTo("body").children().append(o.draggedItem)
              }
              var h = o.draggedItem.attr("style");
              o.draggedItem.attr("data-origstyle", h ? h : ""), o.draggedItem.css({
                position: "absolute",
                opacity: .8,
                "z-index": 999,
                height: d,
                width: l
              }), o.scroll = {
                moveX: 0,
                moveY: 0,
                maxX: t(document).width() - t(window).width(),
                maxY: t(document).height() - t(window).height()
              }, o.scroll.scrollY = window.setInterval(function () {
                if (n.scrollContainer != window) return t(n.scrollContainer).scrollTop(t(n.scrollContainer).scrollTop() + o.scroll.moveY), void 0;
                var e = t(n.scrollContainer).scrollTop();
                (o.scroll.moveY > 0 && o.scroll.maxY > e || 0 > o.scroll.moveY && e > 0) && (t(n.scrollContainer).scrollTop(e + o.scroll.moveY), o.draggedItem.css("top", o.draggedItem.offset().top + o.scroll.moveY + 1))
              }, 10), o.scroll.scrollX = window.setInterval(function () {
                if (n.scrollContainer != window) return t(n.scrollContainer).scrollLeft(t(n.scrollContainer).scrollLeft() + o.scroll.moveX), void 0;
                var e = t(n.scrollContainer).scrollLeft();
                (o.scroll.moveX > 0 && o.scroll.maxX > e || 0 > o.scroll.moveX && e > 0) && (t(n.scrollContainer).scrollLeft(e + o.scroll.moveX), o.draggedItem.css("left", o.draggedItem.offset().left + o.scroll.moveX + 1))
              }, 10), t(i).each(function (t, e) {
                e.createDropTargets(), e.buildPositionTable()
              }), o.setPos(e.pageX, e.pageY), t(document).bind("mousemove", o.swapItems), t(document).bind("mouseup", o.dropItem), n.scrollContainer != window && t(window).bind("DOMMouseScroll mousewheel", o.wheel)
            },
            setPos: function (e, i) {
              var r = i - this.offset.top,
                a = e - this.offset.left;
              if (n.dragBetween || (r = Math.min(this.offsetLimit.bottom, Math.max(r, this.offsetLimit.top)), a = Math.min(this.offsetLimit.right, Math.max(a, this.offsetLimit.left))), this.draggedItem.parents().each(function () {
                  if ("static" != t(this).css("position") && (!t.browser.mozilla || "table" != t(this).css("display"))) {
                    var e = t(this).offset();
                    return r -= e.top, a -= e.left, !1
                  }
                }), n.scrollContainer == window) i -= t(window).scrollTop(), e -= t(window).scrollLeft(), i = Math.max(0, i - t(window).height() + 5) + Math.min(0, i - 5), e = Math.max(0, e - t(window).width() + 5) + Math.min(0, e - 5);
              else {
                var s = t(n.scrollContainer),
                  d = s.offset();
                i = Math.max(0, i - s.height() - d.top) + Math.min(0, i - d.top), e = Math.max(0, e - s.width() - d.left) + Math.min(0, e - d.left)
              }
              o.scroll.moveX = 0 == e ? 0 : e * n.scrollSpeed / Math.abs(e), o.scroll.moveY = 0 == i ? 0 : i * n.scrollSpeed / Math.abs(i), this.draggedItem.css({
                top: r,
                left: a
              })
            },
            wheel: function (e) {
              if ((t.browser.safari || t.browser.mozilla) && o && n.scrollContainer != window) {
                var i = t(n.scrollContainer),
                  r = i.offset();
                if (e.pageX > r.left && e.pageX < r.left + i.width() && e.pageY > r.top && e.pageY < r.top + i.height()) {
                  var a = e.detail ? 5 * e.detail : e.wheelDelta / -2;
                  i.scrollTop(i.scrollTop() + a), e.preventDefault()
                }
              }
            },
            buildPositionTable: function () {
              var e = [];
              this.getItems().not([o.draggedItem[0], o.placeHolderItem[0]]).each(function (n) {
                var i = t(this).offset();
                i.right = i.left + t(this).outerWidth(), i.bottom = i.top + t(this).outerHeight(), i.elm = this, e[n] = i
              }), this.pos = e
            },
            dropItem: function () {
              if (null != o.draggedItem) {
                var e = o.draggedItem.attr("data-origstyle");
                return o.draggedItem.attr("style", e), "" == e && o.draggedItem.removeAttr("style"), o.draggedItem.removeAttr("data-origstyle"), o.styleDragHandlers(!0), o.placeHolderItem.before(o.draggedItem), o.placeHolderItem.remove(), t("[data-droptarget], .dragSortItem").remove(), window.clearInterval(o.scroll.scrollY), window.clearInterval(o.scroll.scrollX), o.draggedItem.attr("data-origpos") != t(i).index(o) + "-" + o.getItems().index(o.draggedItem) && n.dragEnd.apply(o.draggedItem), o.draggedItem.removeAttr("data-origpos"), o.draggedItem = null, t(document).unbind("mousemove", o.swapItems), t(document).unbind("mouseup", o.dropItem), n.scrollContainer != window && t(window).unbind("DOMMouseScroll mousewheel", o.wheel), !1
              }
            },
            swapItems: function (e) {
              if (null == o.draggedItem) return !1;
              o.setPos(e.pageX, e.pageY);
              for (var a = o.findPos(e.pageX, e.pageY), s = o, d = 0; -1 == a && n.dragBetween && i.length > d; d++) a = i[d].findPos(e.pageX, e.pageY), s = i[d];
              if (-1 == a) return !1;
              var l = function () {
                  return t(s.container).children().not(s.draggedItem)
                },
                c = l().not(n.itemSelector).each(function () {
                  this.idx = l().index(this)
                });
              return null == r || r.top > o.draggedItem.offset().top || r.left > o.draggedItem.offset().left ? t(s.pos[a].elm).before(o.placeHolderItem) : t(s.pos[a].elm).after(o.placeHolderItem), c.each(function () {
                var e = l().eq(this.idx).get(0);
                this != e && l().index(this) < this.idx ? t(this).insertAfter(e) : this != e && t(this).insertBefore(e)
              }), t(i).each(function (t, e) {
                e.createDropTargets(), e.buildPositionTable()
              }), r = o.draggedItem.offset(), !1
            },
            findPos: function (t, e) {
              for (var n = 0; this.pos.length > n; n++)
                if (t > this.pos[n].left && this.pos[n].right > t && e > this.pos[n].top && this.pos[n].bottom > e) return n;
              return -1
            },
            createDropTargets: function () {
              n.dragBetween && t(i).each(function () {
                var e = t(this.container).find("[data-placeholder]"),
                  i = t(this.container).find("[data-droptarget]");
                e.size() > 0 && i.size() > 0 ? i.remove() : 0 == e.size() && 0 == i.size() && ("td" == n.itemSelector ? t(n.placeHolderTemplate).attr("data-droptarget", !0).appendTo(this.container) : t(this.container).append(o.placeHolderItem.removeAttr("data-placeholder").clone().attr("data-droptarget", !0)), o.placeHolderItem.attr("data-placeholder", !0))
              })
            }
          };
          s.init(), i.push(s)
        }), this
      }, t.fn.dragsort.defaults = {
        itemSelector: "",
        dragSelector: "",
        dragSelectorExclude: "input, textarea",
        dragEnd: function () {
        },
        dragBetween: !1,
        placeHolderTemplate: "",
        scrollContainer: window,
        scrollSpeed: 5
      }
    }(jQuery),
    function () {
      function t() {
        var e = Object.create(RegExp.prototype);
        return e = RegExp.apply(e, arguments) || e, t.injectClassMethods(e), e
      }

      function e() {
        return new t
      }

      var n = this;
      t.injectClassMethods = function (e) {
        for (var n in t.prototype) t.prototype.hasOwnProperty(n) && (e[n] = t.prototype[n]);
        return e
      }, t.prototype = {
        _prefixes: "",
        _source: "",
        _suffixes: "",
        _modifiers: "",
        sanitize: function (t) {
          return t.source ? t.source : t.replace(/[^\w]/g, function (t) {
            return "\\" + t
          })
        },
        add: function (t) {
          return this._source += t || "", this.compile(this._prefixes + this._source + this._suffixes, this._modifiers), this
        },
        startOfLine: function (t) {
          return t = 0 != t, this._prefixes = t ? "^" : "", this.add(""), this
        },
        endOfLine: function (t) {
          return t = 0 != t, this._suffixes = t ? "$" : "", this.add(""), this
        },
        then: function (t) {
          return t = this.sanitize(t), this.add("(?:" + t + ")"), this
        },
        find: function (t) {
          return this.then(t)
        },
        maybe: function (t) {
          return t = this.sanitize(t), this.add("(?:" + t + ")?"), this
        },
        anything: function () {
          return this.add("(?:.*)"), this
        },
        anythingBut: function (t) {
          return t = this.sanitize(t), this.add("(?:[^" + t + "]*)"), this
        },
        something: function () {
          return this.add("(?:.+)"), this
        },
        somethingBut: function (t) {
          return t = this.sanitize(t), this.add("(?:[^" + t + "]+)"), this
        },
        replace: function (t, e) {
          return t = "" + t, t.replace(this, e)
        },
        lineBreak: function () {
          return this.add("(?:(?:\\n)|(?:\\r\\n))"), this
        },
        br: function () {
          return this.lineBreak()
        },
        tab: function () {
          return this.add("\\t"), this
        },
        word: function () {
          return this.add("\\w+"), this
        },
        anyOf: function (t) {
          return t = this.sanitize(t), this.add("[" + t + "]"), this
        },
        //any: function (t) {
        //  return this.anyOf(t)
        //},
        range: function () {
          var t = "[";
          console.log(arguments);
          for (var e = 0; arguments.length > e; e += 2) {
            var n = e + 1;
            if (o >= arguments.length) break;
            var i = this.sanitize(arguments[e]),
              o = this.sanitize(arguments[n]);
            t += i + "-" + o
          }
          return t += "]", this.add(t), this
        },
        addModifier: function (t) {
          return -1 == this._modifiers.indexOf(t) && (this._modifiers += t), this.add(""), this
        },
        removeModifier: function (t) {
          return this._modifiers = this._modifiers.replace(t, ""), this.add(""), this
        },
        withAnyCase: function (t) {
          return 0 != t ? this.addModifier("i") : this.removeModifier("i"), this.add(""), this
        },
        stopAtFirst: function (t) {
          return 0 != t ? this.removeModifier("g") : this.addModifier("g"), this.add(""), this
        },
        searchOneLine: function (t) {
          return 0 != t ? this.removeModifier("m") : this.addModifier("m"), this.add(""), this
        },
        multiple: function (t) {
          switch (t = t.source ? t.source : this.sanitize(t), t.substr(-1)) {
            case "*":
            case "+":
              break;
            default:
              t += "+"
          }
          return this.add(t), this
        },
        or: function (t) {
          return this._prefixes += "(?:", this._suffixes = ")" + this._suffixes, this.add(")|(?:"), t && this.then(t), this
        },
        beginCapture: function () {
          return this._suffixes += ")", this.add("(", !1), this
        },
        endCapture: function () {
          return this._suffixes = this._suffixes.substring(0, this._suffixes.length - 1), this.add(")", !0), this
        }
      }, "undefined" != typeof module && module.exports ? module.exports = e : "function" == typeof define && define.amd ? define(t) : n.VerEx = e
    }.call();
  var $conditions_container = $("#conditions"),
    row_html = $("#row-template").html(),
    tester, options_without_params = ["anything", "endOfLine", "lineBreak", "something", "startOfLine", "tab", "word"],
    match_options = {
      add: "Add",
      //any: "Any",
      anyOf: "Any Character",
      anything: "Anything",
      anythingBut: "Anything But",
      endOfLine: "End of Line",
      find: "Find",
      lineBreak: "Line Break",
      maybe: "Maybe",
      or: "Or",
      range: "Range",
      something: "Something",
      somethingBut: "Something But",
      startOfLine: "Start of Line",
      tab: "Tab",
      then: "Then",
      word: "Word"
    };

  $("#new-condition").on("click", function () {
    $("<div />", {
      "class": "row"
    }).html(row_html).find("select").chain(function () {
      var t = $(this);
      $.each(match_options, function (e, n) {
        $("<option />", {
          value: e
        }).text(n).appendTo(t)
      })
    }).on("change", function () {
      var t = $(this),
        e = $(this).parents(".row").find("input");
      $.inArray(t.val(), options_without_params) > -1 ? e.attr("disabled", "disabled") : e.removeAttr("disabled");
      var n = "range" == t.val() ? "ex: a-z, A-Z, 0-9" : "Match";
      e.attr("placeholder", n), $(document).trigger("update-expression")
    }).end().find(".match-param").on("keyup", function () {
      $(document).trigger("update-expression")
    }).end().find(".remove-match-option").on("click", function () {
      $(this).parent(".row").remove(), $(document).trigger("update-expression")
    }).end().appendTo($conditions_container)
  }).one("click", function () {
    $(document).trigger("first-row-created")
  }), $(document).on({
    "first-row-created": function () {
      $conditions_container.dragsort({
        dragSelector: ".move-match-option",
        dragSelectorExclude: "select, input",
        dragEnd: function () {
          $(document).trigger("update-expression")
        }
      })
    },
    "update-expression": function () {
      buildExpression()
    }
  }), $('input[name="modifiers[]"]').on("change", function () {
    $(document).trigger("update-expression")
  }), $.fn.chain = function (t) {
    return t.apply(this), this
  };

}
