_ = require 'underscore'
require './util'

class Constants
  @INITIAL_CARD_COUNT: 3
  @INITIAL_GOLD: 20
  @DRAW_FREQUENCY: 10
  @MOVE_SPEED: 1

class Point
  constructor: (@x, @y) ->

  distance: (other) ->
    Math.abs(other.x - @x) + Math.abs(other.y - @y)

  equals: (other) ->
    other.x == @x and other.y == @y

class Army
  constructor: (@startTime, @fromBuilding, @toBuilding, @power) ->
    @location = @fromBuilding.location

  # indexはPlayer.armiesにおける自分のindex
  reach: (game, me, index) ->
    owner = @toBuilding.getOwner
    if me == owner
      @toBuilding.power += @power
    else if @toBuilding.power > @power
      @toBuilding.power -= @power
    else
      index = owner.buildings.indexOf(@toBuilding)
      owner.buildings.splice(index, 1)
      @toBuilding.power = @power - @toBuilding.power
      me.builings.push(@toBuilding)
    index = me.armies.indexOf(this)
    me.armies.splice(index, 1)

  # indexはPlayer.armiesにおける自分のindex
  advance: (game, me, index) ->
    all = @fromBuilding.location.distance(@toBuilding.location)
    now = @fromBuilding.location.distance(@location)
    dx = @toBuilding.location.x - @fromBuilding.location.x
    dy = @toBuilding.location.y - @fromBuilding.location.y
    @location.x += ~~((now + Constants.MOVE_SPEED) * dx / all) -
      ~~(now * dx / all)
    @location.y += ~~((now + Constants.MOVE_SPEED) * dy / all) -
      ~~(now * dy / all)

    if @toBuilding.location.equals(@location)
      reach game, me, index
      return

    for enemy in game.players
      if enemy != me
        for iArmy in [0...enemy.armies.length]
          army = enemy.armies[iArmy]
          if @location.equals(army.location)
            if @power <= army.power
              if @power == army.power
                enemy.armies.splice(iArmy, 1)
              else
                army.power -= @power
              me.armies.splice(index, 1)
              return
            else
              @power -= army.power
              enemy.armies.splice(iArmy, 1)

class Building
  constructor: (@location, @template, @power) ->

  advance: ->
    @power += @template.armyProductivity

  isOwned: (player) ->
    for building in player.buildings
      if building == player
        return true
    return false

  getOwner: (game) ->
    for player in game.players
      for building in player.buildings
        if building == player
          return player
    throw new Error('Not found owner.')

class Field
  constructor: (@width, @height) ->
    @field = []
    for y in [0...@height]
      for x in [0...@width]
        @setObject(new Point(x, y), null)

  setObject: (location, obj) ->
    # NOTE override field
    @field[@getIndex(location)] = obj

  getObject: (location) ->
    @field[@getIndex(location)]
  
  getIndex: (location) ->
    location.y * @height + location.x

class Mine

class Player
  constructor: (@deck) ->
    _.shuffle(@deck)
    @hand      = []
    @trash     = []
    @buildings = []
    @armies    = []
    @gold = Constants.INITIAL_GOLD
    @draw_count = 0

  base: ->
    @buildings[0]

  drawCard: ->
    @hand.push(@deck.shift())

  drawCards: (num) ->
    for i in [0...num]
      @drawCard()

  discardCard: (name) ->
    index = _.find @hand, (card) -> card.name == name
    if index != undefined
      @trash.push @hand[index]
      @hand.splice index, 1
    else
      # TODO: print the error
      console.log "not found: " + name
    index != undefined

  advance: (game) ->
    @draw_count += 1
    if @draw_count == Constants.DRAW_FREQUENCY
      @drawCard()
      @draw_count = 0

    for building in @buildings
      building.advance(game)
      @gold += building.template.mineProductivity

    for army in @armies
      army.advance(game, this)

class Card
  constructor: (@name, @cost) ->

  execute: (player, location, game) ->

class BuildingCard extends Card
  constructor: (@name, @cost, @template) ->
    super @name, @cost
    
  execute: (player, location, game) ->
    game.constructBuilding(player, location,
      new Building(location, allBuildings[@template.name], 0))

class BuildingTemplate
  constructor: (@name, @sightRange,
    @territoryRange, @mineProductivity, @armyProductivity) ->

buildings = [
    new BuildingTemplate('base',    10, 10, 10, 10)
  , new BuildingTemplate('tower',   10,  1,  1,  1)
  , new BuildingTemplate('church',   1, 10,  1,  1)
  , new BuildingTemplate('barracks', 1,  1, 10,  1)
  , new BuildingTemplate('pit',      1,  1,  1, 10)
  ]

allBuildings = {}
for building in buildings
  allBuildings[building.name] = building

cards = [
    new BuildingCard('tower',    10, allBuildings['tower'])
  , new BuildingCard('church',   10, allBuildings['church'])
  , new BuildingCard('barracks', 10, allBuildings['barracks'])
  , new BuildingCard('pit',      10, allBuildings['pit'])
  ]

allCards = {}
for card in cards
  allCards[card.name] = card

exports.Constants = Constants
exports.Army = Army
exports.Point = Point
exports.Player = Player
exports.Field = Field
exports.Card = Card
exports.Building= Building
exports.BuildingTemplate = BuildingTemplate
exports.BuildingCard = BuildingCard
exports.AllBuildings = AllBuildings = allBuildings
exports.HomeTemplate = HomeTemplate = allBuildings['base']
exports.AllCards = allCards
