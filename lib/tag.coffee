TagView = require './tag-view'

module.exports =
  activate: (state) ->
    atom.workspaceView.command "tag:closeTag", => @closeTag()

  closeTag: ->
    editor = atom.workspace.activePaneItem
    console.log('closeTag');
