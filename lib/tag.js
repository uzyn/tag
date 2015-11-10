module.exports = {

  config: {
    'autocompleteCloseTags': {
      title: 'Autocomplete close tags',
      description: 'When typing "</" a closing tag matching the current open tag is added.',
      type: 'boolean',
      default: true
    },
    'selfClosing':{
      title: 'Self closing tags',
      description: 'These tags are ignored by the plugin.',
      type: 'string',
      default: 'area, base, br, col, embed, hr, img, input, keygen, link, menuitem, meta, param, source, track, wbr'
    },
    'affectedGrammars':{
      title: 'Affected gramars',
      description: 'A comma seperated list of strings the plugin will look for in the grammar name.',
      type: 'string',
      default: 'HTML, XML, Handlebars, JSX'
    }
  },

  activate: function(state) {
    var _this = this;

    atom.workspace.observeTextEditors(function(editor) {
      editor.getBuffer().onDidChange(function(e) {
        _this.bufferChanged(e);
      });
    });

    return atom.commands.add("atom-workspace", "tag:close-tag", (function(_this) {
      return function() {
        return _this.closeTag();
      };
    })(this));
  },

  closeTag: function() {
    var editor = atom.workspace.getActiveTextEditor();
    if (editor === undefined) {
      return;
    }

    var cursorPos = editor.getLastCursor().getBufferPosition();
    var buffer = editor.getTextInBufferRange([[0, 0], cursorPos]);
    editor.insertText(this.getClosingTag(buffer));
  },

  bufferChanged: function(e) {
    var editor = atom.workspace.getActiveTextEditor();

    if (editor === undefined || !atom.config.get('tag.autocompleteCloseTags') || e.newText !== '/') {
      return;
    }

    var grammar = editor.getGrammar().name;
    var affected = new RegExp('(?:'+ atom.config.get('tag.affectedGrammars').split(/\s*,\s*/).join('|') +')')

    if ( grammar.length == 0 || (!affected.test(grammar)) ) {
      return;
    }

    var cursorPos = editor.getLastCursor().getBufferPosition();
    var translatedPos = cursorPos.translate([0, -2]);
    var lastTwo = editor.getTextInBufferRange([translatedPos, cursorPos]);

    if (lastTwo !== '</') {
      return;
    }

    var buffer = editor.getTextInBufferRange([[0, 0], translatedPos]);
    var closingTag = this.getClosingTag(buffer);
    if (closingTag.length > 0) {
      // Temporary workaround for a funny cursor bug
      setTimeout(function() {
        editor.insertText(closingTag.substring(2));
      }, 1);
    }
    return;
  },

  getClosingTag: function (str) {
    var _this = this;
    var tokens = str.split('<');

    if (tokens.length == 0) {
      return '';
    }
    tokens.reverse();

    var getTag = function (token) {
      var tag = token.substring(0, token.search('>')).trim();

      if (tag.substr(tag.length - 1) == '/') {
        return tag;
      } else if (tag.indexOf(' ') < 0) {
        return tag;
      } else {
        return tag.substring(0, token.search(' '));
      }
    }

    var isVoidElement = function(tag) {
      tag = tag.trim();
      var firstChar = tag.substr(0, 1);
      var lastChar = tag.substr(tag.length - 1);
      if (['?', '%'].indexOf(firstChar) >= 0) {
        return true;
      }
      if (['/'].indexOf(lastChar) >= 0) {
        return true;
      }

      tag = tag.toLowerCase();
      if (atom.config.get('tag.selfClosing').split(/\s*,\s*/).indexOf(tag) >= 0) {
        return true;
      }

      return false;
    }

    var skip = [];
    for (var i in tokens) {
      var token = tokens[i];
      var tag = getTag(token);
      if (tag !== undefined && tag.length > 0 && !isVoidElement(tag)) {
        if (tag.substring(0, 1) != '/') {
          if (skip.length === 0) {
            return '</' + tag + '>';
          } else if (skip[skip.length - 1] == tag) {
            skip.pop();
          }
        } else {
          skip.push(tag.substring(1));
        }
      }
    }
    return '';
  }
};
