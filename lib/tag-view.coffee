{View} = require 'atom'

module.exports =
class TagView extends View
  @content: ->
    @div class: 'tag overlay from-top', =>
      @div "The Tag package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "tag:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "TagView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
