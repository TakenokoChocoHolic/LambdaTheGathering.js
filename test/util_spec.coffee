assert = require "assert"

describe 'util', ->
  util = require "../util"
  describe '#shuffle()', ->
    it 'should leave all elements', ->
      array = util.shuffle([0...100]).sort (x, y) -> x - y
      for index in [0...100]
        assert.equal(index, array[index])
  describe '#clone()', ->
    it 'should clone an array', ->
      assert.equal(5, util.clone([0..10]).indexOf(5))
    it 'should clone an object', ->
      obj = new Object()
      obj.name = "abc"
      obj.value = 2
      assert.equal("abc", util.clone(obj).name)
      assert.equal(2, util.clone(obj).value)
