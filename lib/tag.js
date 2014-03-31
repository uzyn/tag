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
    console.log(buffer);
  }
};
