$(function () {

    module("bootstrap-tagautocomplete")

      test("should provide no conflict", function () {
        var tagautocomplete = $.fn.tagautocomplete.noConflict()
        ok(!$.fn.tagautocomplete, 'tagautocomplete was set back to undefined (org value)')
        $.fn.tagautocomplete = tagautocomplete
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).tagautocomplete, 'alert method is defined')
      })

      test("should return element", function () {
        ok($(document.body).tagautocomplete()[0] == document.body, 'document.body returned')
      })

      test("should listen to a contenteditable div", function () {
        var $div = $('<div contenteditable="true"  />')
        $div.tagautocomplete()
        ok($._data($div[0], 'events').blur, 'has a blur event')
        ok($._data($div[0], 'events').keypress, 'has a keypress event')
        ok($._data($div[0], 'events').keyup, 'has a keyup event')
      })

      test("should create a menu", function () {
        var $div = $('<div contenteditable="true"  />')
        ok($div.tagautocomplete().data('tagautocomplete').$menu, 'has a menu')
      })

      test("should listen to the menu", function () {
        var $div = $('<div contenteditable="true"  />')
          , $menu = $div.tagautocomplete().data('tagautocomplete').$menu

        ok($._data($menu[0], 'events').mouseover, 'has a mouseover(pseudo: mouseenter)')
        ok($._data($menu[0], 'events').click, 'has a click')
      })

      test("should show menu when query entered", function () {
        var $div = $('<div contenteditable="true"  />')
            .appendTo('body')
            .tagautocomplete({
              source: ['@aa', '@ab', '@ac']
            })
          , tagautocomplete = $div.data('tagautocomplete')

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        ok(tagautocomplete.$menu.is(":visible"), 'tagautocomplete is visible')
        equals(tagautocomplete.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(tagautocomplete.$menu.find('.active').length, 1, 'one item is active')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should place menu in body and positioned absolute with left and top", function () {
        var $div = $('<div contenteditable="true"  />')
            .appendTo("#qunit-fixture") //inside qunit fixture to test that the menu will still be outside.
            .tagautocomplete({
              source: ['@aa', '@ab', '@ac']
            })
          , tagautocomplete = $div.data('tagautocomplete')

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        ok(tagautocomplete.$menu.is(":visible"), 'tagautocomplete is visible')
        ok($("body > .typeahead.dropdown-menu").length, 'inside the body')
        ok(!$("#qunit-fixture > .typeahead.dropdown-menu").length, 'not found in parent')

        equals(tagautocomplete.$menu[0].style.position, 'absolute', 'absolute position')
        ok(tagautocomplete.$menu[0].style.left, 'has left set')
        ok(tagautocomplete.$menu[0].style.top, 'has top set')
        
        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should accept data source via synchronous function", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: function () {
                return ['@aa', '@ab', '@ac']
              }
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        ok(tagautocomplete.$menu.is(":visible"), 'tagautocomplete is visible')
        equals(tagautocomplete.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(tagautocomplete.$menu.find('.active').length, 1, 'one item is active')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should accept data source via asynchronous function", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: function (query, process) {
                process(['@aa', '@ab', '@ac'])
              }
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        ok(tagautocomplete.$menu.is(":visible"), 'tagautocomplete is visible')
        equals(tagautocomplete.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(tagautocomplete.$menu.find('.active').length, 1, 'one item is active')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should hide menu when query entered", function () {
        stop()
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aa', '@ab', '@ac']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        ok(tagautocomplete.$menu.is(":visible"), 'tagautocomplete is visible')
        equals(tagautocomplete.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(tagautocomplete.$menu.find('.active').length, 1, 'one item is active')

        $div.blur()

        setTimeout(function () {
          ok(!tagautocomplete.$menu.is(":visible"), "tagautocomplete is no longer visible")
          start()
        }, 200)

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should set next item when down arrow is pressed", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aa', '@ab', '@ac']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        ok(tagautocomplete.$menu.is(":visible"), 'tagautocomplete is visible')
        equals(tagautocomplete.$menu.find('li').length, 3, 'has 3 items in menu')
        equals(tagautocomplete.$menu.find('.active').length, 1, 'one item is active')
        ok(tagautocomplete.$menu.find('li').first().hasClass('active'), "first item is active")

        // simulate entire key pressing event
        $div.trigger({
          type: 'keydown'
        , keyCode: 40
        })
        .trigger({
          type: 'keypress'
        , keyCode: 40
        })
        .trigger({
          type: 'keyup'
        , keyCode: 40
        })

        ok(tagautocomplete.$menu.find('li').first().next().hasClass('active'), "second item is active")

        $div.trigger({
          type: 'keydown'
        , keyCode: 38
        })
        .trigger({
          type: 'keypress'
        , keyCode: 38
        })
        .trigger({
          type: 'keyup'
        , keyCode: 38
        })

        ok(tagautocomplete.$menu.find('li').first().hasClass('active'), "first item is active")

        $div.remove()
        tagautocomplete.$menu.remove()
      })


      test("should set div text to selected item", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aa', '@ab', '@ac']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
          , changed = false
          , focus = false
          , blur = false

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        $div.change(function() { changed = true });
        $div.focus(function() { focus = true; blur = false });
        $div.blur(function() { blur = true; focus = false });

        $(tagautocomplete.$menu.find('li')[2]).mouseover().click()

        equals($div.text(), '@ac ', 'div text was correctly set')
        ok(!tagautocomplete.$menu.is(':visible'), 'the menu was hidden')
        ok(changed, 'a change event was fired')
        ok(focus && !blur, 'focus is still set')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should start querying when minLength is met", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aaaa', '@aaab', '@aaac'],
              minLength: 3
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')

        $div.text('@a')
        setCaretPosition($div[0], 2)
        tagautocomplete.lookup()

        equals(tagautocomplete.$menu.find('li').length, 0, 'has 0 items in menu')

        $div.text('@aa')
        setCaretPosition($div[0], 3)
        tagautocomplete.lookup()

        equals(tagautocomplete.$menu.find('li').length, 3, 'has 3 items in menu')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should match the words after the characters ' @'", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aa', '@bb', '@cc']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('s a')
        setCaretPosition($div[0], 3)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '', 'has no characters to match')

        $div.text('s @a')
        setCaretPosition($div[0], 4)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '@a', 'has characters to match')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should match the words just before the cursor position", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aa', '@bb', '@cc']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('s @b @a')
        setCaretPosition($div[0], 4)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '@b', 'compared with where the caret is')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should match when it starts with @", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aaa', '@bbb', '@ccc']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('@bb a')
        setCaretPosition($div[0], 3)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '@bb', '@bb returned')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should accept matches for letters, numbers, underscore and dashes", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aaa', '@b_-9', '@ccc']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('@b_-9 a')
        setCaretPosition($div[0], 5)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '@b_-9', '@b_-9 returned')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should be case insensitive and downcase for matching", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@aaa', '@bbb', '@ccc']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('ss @A')
        setCaretPosition($div[0], 5)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '@a', '@a returned')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("can override @ with another character", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['#aaa', '#bbb', '#ccc'],
              character: '#'
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('#bb a')
        setCaretPosition($div[0], 3)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '#bb', 'matched characters after #')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("can characters to @", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['#aaa', '#bbb', '#ccc', '@abc'],
              character: '@#'
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('#bb a')
        setCaretPosition($div[0], 3)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '#bb', 'matched characters after #')

        $div.text('#bb @a')
        setCaretPosition($div[0], 6)
        tagautocomplete.lookup()
        equals(tagautocomplete.extractor(), '@a', 'matched characters after @')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should highlight the matching characters", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@bbc', '@bbb', '@ccc']
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('s @b a')
        setCaretPosition($div[0], 4)
        tagautocomplete.lookup()
        
        ok(tagautocomplete.$menu.is(":visible"), 'tagautocomplete is visible')
        equals(tagautocomplete.$menu.find('li').length, 2, 'has 2 items in menu')
        equals(tagautocomplete.$menu.find('.active').length, 1, 'one item is active')
        equals(tagautocomplete.$menu.find('.active strong').text(), '@b', '@b is highlighted')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should replace only the one node (with mouse click)", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@bbc', '@bbb', '@ccc'],
              after: function(){
                passed_after = true
              }
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('s @b a @b')
        setCaretPosition($div[0], 4)
        tagautocomplete.lookup()
        
        $div.change(function() { changed = true });
        $div.focus(function() { focused = true; blured = false });
        $div.blur(function() { blured = true; focused = false });

        $(tagautocomplete.$menu.find('li')[1]).mouseover().click()

        equals($div.text(), 's @bbb  a @b', 'div text was correctly set')
        ok(!tagautocomplete.$menu.is(':visible'), 'the menu was hidden')
        ok(changed, 'a change event was fired')
        ok(focused && !blured, 'focus is still set')
        ok(passed_after, 'the passed after method was fired')
        equals(getCaretPosition($div[0]), 7, 'caret position correctly set')

        $div.remove()
        tagautocomplete.$menu.remove()
      })

      test("should replace only the one node (with keypress)", function () {
        var $div = $('<div contenteditable="true"  />').tagautocomplete({
              source: ['@bbcd', '@bbb', '@ccc'],
              after: function(){
                passed_after = true
              }
            }).appendTo('body')
          , tagautocomplete = $div.data('tagautocomplete')
        
        $div.text('s @b a @b')
        setCaretPosition($div[0], 4)
        tagautocomplete.lookup()
        
        // simulate entire key pressing event of ENTER
        $div.trigger({
          type: 'keydown'
        , keyCode: 13
        })
        .trigger({
          type: 'keypress'
        , keyCode: 13
        })
        .trigger({
          type: 'keyup'
        , keyCode: 13
        })

        equals($div.text(), 's @bbcd  a @b', 'div text was correctly set')
        ok(!tagautocomplete.$menu.is(':visible'), 'the menu was hidden')
        ok(passed_after, 'the passed after method was fired')
        equals(getCaretPosition($div[0]), 8, 'caret position correctly set')

        $div.remove()
        tagautocomplete.$menu.remove()
      })    

})
