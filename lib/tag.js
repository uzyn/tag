module.exports = {
  activate: function(state) {
    return atom.workspaceView.command("tag:closeTag", (function(_this) {
      return function() {
        return _this.closeTag();
      };
    })(this));
  },
  closeTag: function() {
    var editor = atom.workspace.activePaneItem;
    var cursorPos = editor.getCursor().getBufferPosition();
    var buffer = editor.getTextInBufferRange([[0, 0], cursorPos]);

    var getClosingTag = function (str) {
      var tokens = str.split('<');
      if (tokens.length == 0) {
        return '';
      }
      tokens.reverse();

      var getTag = function (token) {
        return token.substring(0, token.search('>'));
      }

      var skip = null;
      for (var i in tokens) {
        var token = tokens[i];
        var tag = getTag(token);
        if (tag !== undefined) {
          if (tag.substring(0, 1) != '/') {
            if (skip == null) {
              return '</' + tag + '>';
            } else if (skip == tag) {
              skip = null;
            }
          } else {
            skip = tag.substring(1);
          }
        }
      }
      return '';
    }

    editor.insertText(getClosingTag(buffer));
  }
};
