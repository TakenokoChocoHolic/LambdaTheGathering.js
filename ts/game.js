var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var State = (function () {
    function State() {
        player = [
            new Player(), 
            new Player()
        ];
        turn = 0;
        zombieMode = false;
    }
    return State;
})();
var Player = (function () {
    function Player() {
        slot = [];
        for(i = 0; i < 255; i++) {
            slot.push(new Slot());
        }
    }
    return Player;
})();
var Slot = (function () {
    function Slot() {
        value = new I();
        vitality = 10000;
    }
    return Slot;
})();
var Card = (function () {
    function Card(game) {
        this.game = game;
    }
    Card.prototype.value = function () {
        throw "value is not implemented";
    };
    Card.prototype.setValue = function (v) {
        throw "setValue is not implemented";
    };
    Card.prototype.app = function (card) {
        throw "app is not implemented";
    };
    return Card;
})();
var Func = (function (_super) {
    __extends(Func, _super);
    function Func() {
        _super.apply(this, arguments);

    }
    Func.prototype.value = function () {
        throw "Func does not have value";
    };
    Func.prototype.setValue = function (v) {
        throw "Func does not have value";
    };
    Func.prototype.validateNumber = function (card) {
        try  {
            card.value();
        } catch (e) {
            throw 'number is expected, but get ' + card;
        }
    };
    Func.prototype.validateSlotNumber = function (card) {
        this.validateNumber(card);
        var v = card.value();
        if(v < 0 || 255 < v) {
            throw "invalid slot number " + v;
        }
    };
    Func.prototype.proponent = function () {
        return this.game.state.player[this.game.state.turn % 2];
    };
    Func.prototype.opponent = function () {
        return this.game.state.player[this.game.state.turn % 2];
    };
    return Func;
})(Card);
var Value = (function (_super) {
    __extends(Value, _super);
    function Value(game, v) {
        _super.call(this, game);
        this.v = v;
    }
    Value.prototype.value = function () {
        return this.v;
    };
    Value.prototype.setValue = function (v) {
        this.v = v;
    };
    Value.prototype.app = function (card) {
        throw "Value can't be applied";
    };
    return Value;
})(Card);
var Succ = (function (_super) {
    __extends(Succ, _super);
    function Succ() {
        _super.apply(this, arguments);

    }
    Succ.prototype.app = function (card) {
        if(card.value() > 65535) {
            console.log("succ : too large number " + card.value);
        }
        card.setValue(Math.min(card.value() + 1, 65535));
        return card;
    };
    return Succ;
})(Func);
var Dbl = (function (_super) {
    __extends(Dbl, _super);
    function Dbl() {
        _super.apply(this, arguments);

    }
    Dbl.prototype.app = function (card) {
        if(card.value() > 65535) {
            console.log("succ : too large number " + card.value);
        }
        card.setValue(Math.min(card.value() * 2, 65535));
        return card;
    };
    return Dbl;
})(Func);
var I = (function (_super) {
    __extends(I, _super);
    function I() {
        _super.apply(this, arguments);

    }
    I.prototype.app = function (card) {
        return card;
    };
    return I;
})(Func);
var K = (function (_super) {
    __extends(K, _super);
    function K(game) {
        _super.call(this, game);
        this.x = null;
    }
    K.prototype.app = function (card) {
        if(this.x === null) {
            this.x = card;
            return this;
        }
        return this.x;
    };
    return K;
})(Func);
var S = (function (_super) {
    __extends(S, _super);
    function S(game) {
        _super.call(this, game);
        this.f = null;
        this.g = null;
    }
    S.prototype.app = function (card) {
        if(this.f === null) {
            this.f = card;
            return this;
        }
        if(this.g === null) {
            this.g = card;
            return this;
        }
        return this.f.app(card).app(this.g.app(card));
    };
    return S;
})(Func);
var Inc = (function (_super) {
    __extends(Inc, _super);
    function Inc() {
        _super.apply(this, arguments);

    }
    Inc.prototype.app = function (card) {
        this.validateSlotNumber(card);
        var i = card.value();
        var slot = this.proponent().slot[i];
        if(0 < slot.vitality && slot.vitality < 65535) {
            slot.vitality += 1;
        }
        return new I(this.game);
    };
    return Inc;
})(Func);
var Dec = (function (_super) {
    __extends(Dec, _super);
    function Dec() {
        _super.apply(this, arguments);

    }
    Dec.prototype.app = function (card) {
        this.validateSlotNumber(card);
        var i = card.value();
        var slot = this.opponent().slot[255 - i];
        if(slot.vitality > 0) {
            slot.vitality -= 1;
        }
        return new I(this.game);
    };
    return Dec;
})(Func);
var Attack = (function (_super) {
    __extends(Attack, _super);
    function Attack(game) {
        _super.call(this, game);
        this.i = null;
        this.j = null;
    }
    Attack.prototype.app = function (card) {
        if(this.i === null) {
            this.i = card;
            return this;
        }
        if(this.j === null) {
            this.j = card;
            return this;
        }
        this.validateSlotNumber(this.i);
        this.validateSlotNumber(this.j);
        this.validateNumber(card);
        var i = this.i.value();
        var j = this.j.value();
        var n = card.value();
        var s = this.proponent().slot[i];
        var t = this.opponent().slot[255 - j];
        if(s.vitality < n) {
            throw "attack : proponent's vitality is less than n";
        }
        s.vitality -= n;
        if(t.vitality > 0) {
            t.vitality -= Math.floor(n * 9 / 10);
            t.vitality = Math.max(t.vitality, 0);
        }
        return new I(this.game);
    };
    return Attack;
})(Func);
var Help = (function (_super) {
    __extends(Help, _super);
    function Help(game) {
        _super.call(this, game);
        this.i = null;
        this.j = null;
    }
    Help.prototype.app = function (card) {
        if(this.i === null) {
            this.i = card;
            return this;
        }
        if(this.j === null) {
            this.j = card;
            return this;
        }
        this.validateSlotNumber(this.i);
        this.validateSlotNumber(this.j);
        this.validateNumber(card);
        var i = this.i.value();
        var j = this.j.value();
        var n = card.value();
        var s = this.proponent().slot[i];
        var t = this.proponent().slot[j];
        if(s.vitality < n) {
            throw "help : proponent's vitality is less than n";
        }
        s.vitality -= n;
        if(t.vitality > 0) {
            t.vitality += Math.floor(n * 11 / 10);
            t.vitality = Math.min(t.vitality, 65535);
        }
        return new I(this.game);
    };
    return Help;
})(Func);
var Copy = (function (_super) {
    __extends(Copy, _super);
    function Copy() {
        _super.apply(this, arguments);

    }
    Copy.prototype.app = function (card) {
        this.validateSlotNumber(card);
        var i = card.value();
        return this.opponent().slot[i].value;
    };
    return Copy;
})(Func);
var Revive = (function (_super) {
    __extends(Revive, _super);
    function Revive() {
        _super.apply(this, arguments);

    }
    Revive.prototype.app = function (card) {
        this.validateSlotNumber(card);
        var i = card.value();
        var slot = this.proponent().slot[i];
        if(slot.vitality < 0) {
            slot.vitality = 1;
        }
        return new I(this.game);
    };
    return Revive;
})(Func);
var Zombie = (function (_super) {
    __extends(Zombie, _super);
    function Zombie(game) {
        _super.call(this, game);
        this.i = null;
    }
    Zombie.prototype.app = function (card) {
        if(this.i === null) {
            this.i = card;
            return this;
        }
        this.validateSlotNumber(this.i);
        var i = this.i.value();
        var slot = this.opponent().slot[255 - i];
        if(slot.vitality <= 0) {
            slot.vitality = -1;
            slot.value = card;
        } else {
            throw "zombie : slot is alive";
        }
        return new I(this.game);
    };
    return Zombie;
})(Func);
