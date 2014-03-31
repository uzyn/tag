module.exports = {
  activate: function(state) {
    return atom.workspaceView.command("tag:closeTag", (function(_this) {
      return function() {
        return _this.closeTag();
      };
    })(this));
  },
  closeTag: function() {
    var editor;
    editor = atom.workspace.activePaneItem;
    return console.log('closeTag');
  }
};
