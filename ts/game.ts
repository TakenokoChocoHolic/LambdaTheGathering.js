class State {
    player: Player[];
    turn: number;
    zombieMode: bool;

    constructor () {
        player = [new Player, new Player];
        turn = 0;
        zombieMode = false;
    }
}

class Player {
    slot: Slot[];

    constructor () {
        slot = [];
        for (i=0; i<255; i++) {
            slot.push(new Slot);
        }
    }
}

class Slot {
    value: Card;
    vitality: number;

    constructor () {
        value = new I;
        vitality = 10000;
    }
}

class Card {

    constructor (public game: Game) {
    }

    value(): number {
        throw "value is not implemented";
    }

    setValue(v: number): void {
        throw "setValue is not implemented";
    }

    app(card: Card): Card {
        throw "app is not implemented";
    }
}

class Func extends Card {

    value(): number {
        throw "Func does not have value";
    }

    setValue(v: number): void {
        throw "Func does not have value";
    }

    validateNumber(card: Card): void {
        try {
            card.value();
        } catch(e) {
            throw 'number is expected, but get ' + card;
        }
    }

    validateSlotNumber(card: Card): void {
        this.validateNumber(card);

        var v = card.value();
        if (v < 0 || 255 < v) {
            throw "invalid slot number " + v;
        }
    }

    proponent(): Player {
        return this.game.state.player[this.game.state.turn % 2];
    }

    opponent(): Player {
        return this.game.state.player[this.game.state.turn % 2];
    }

}

class Value extends Card {

    v: number;

    constructor (game: Game, v: number) {
        super(game);
        this.v = v;
    }

    value(): number {
        return this.v;
    }

    setValue(v: number): void {
        this.v = v;
    }

    app(card: Card): Card {
        throw "Value can't be applied";
    }

}

class Succ extends Func {

    app(card: Card): Card {

        if (card.value() > 65535) {
            console.log("succ : too large number " + card.value);
        }

        card.setValue(Math.min(card.value()+1, 65535));
        return card;
    }

}

class Dbl extends Func {

    app(card: Card): Card {

        if (card.value() > 65535) {
            console.log("succ : too large number " + card.value);
        }

        card.setValue(Math.min(card.value()*2, 65535));
        return card;
    }

}

class I extends Func {

    app(card: Card): Card {
        return card;
    }

}

class K extends Func {

    x: Card;

    constructor (game: Game) {
        super(game);
        this.x = null;
    }

    app(card: Card): Card {
        if (this.x === null) {
            this.x = card;
            return this;
        }

        return this.x;
    }

}

class S extends Func {

    f: Card;
    g: Card;

    constructor (game: Game) {
        super(game);
        this.f = null;
        this.g = null;
    }

    app(card: Card): Card {
        if (this.f === null) {
            this.f = card;
            return this;
        }

        if (this.g === null) {
            this.g = card;
            return this;
        }

        return this.f.app(card).app(this.g.app(card));
    }

}

class Inc extends Func {

    app(card: Card): Card {
        this.validateSlotNumber(card);

        var i = card.value();
        var slot = this.proponent().slot[i];
        if (0 < slot.vitality && slot.vitality < 65535) {
            slot.vitality += 1;
        }
        return new I(this.game);
    }

}

class Dec extends Func {

    app(card: Card): Card {
        this.validateSlotNumber(card);

        var i = card.value();
        var slot = this.opponent().slot[255-i];
        if (slot.vitality > 0) {
            slot.vitality -= 1;
        }
        return new I(this.game);
    }

}

class Attack extends Func {

    i: Card;
    j: Card;

    constructor (game: Game) {
        super(game);
        this.i = null;
        this.j = null;
    }

    app(card: Card): Card {

        if (this.i === null) {
            this.i = card;
            return this;
        }

        if (this.j === null) {
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
        var t = this.opponent().slot[255-j];

        if (s.vitality < n) {
            throw "attack : proponent's vitality is less than n";
        }

        s.vitality -= n;
        if (t.vitality > 0) {
            t.vitality -= Math.floor(n*9/10);
            t.vitality = Math.max(t.vitality, 0);
        }

        return new I(this.game);
    }

}

class Help extends Func {

    i: Card;
    j: Card;

    constructor (game: Game) {
        super(game);
        this.i = null;
        this.j = null;
    }


    app(card: Card): Card {

        if (this.i === null) {
            this.i = card;
            return this;
        }

        if (this.j === null) {
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

        if (s.vitality < n) {
            throw "help : proponent's vitality is less than n";
        }

        s.vitality -= n;
        if (t.vitality > 0) {
            t.vitality += Math.floor(n*11/10);
            t.vitality = Math.min(t.vitality, 65535);
        }

        return new I(this.game);
    }

}

class Copy extends Func {

    app(card: Card): Card {
        this.validateSlotNumber(card);

        var i = card.value();

        // TODO: value should be copied to return
        return this.opponent().slot[i].value;
    }

}

class Revive extends Func {

    app(card: Card): Card {
        this.validateSlotNumber(card);

        var i = card.value();
        var slot = this.proponent().slot[i];
        if (slot.vitality < 0) {
            slot.vitality = 1;
        }

        return new I(this.game);
    }

}

class Zombie extends Func {

    i: Card;

    constructor (game: Game) {
        super(game);
        this.i = null;
    }

    app(card: Card): Card {

        if (this.i === null) {
            this.i = card;
            return this;
        }

        this.validateSlotNumber(this.i);

        var i = this.i.value();
        var slot = this.opponent().slot[255-i];
        if (slot.vitality <= 0) {
            slot.vitality = -1;
            // TODO: card should be copied to assign
            slot.value = card;
        } else {
            throw "zombie : slot is alive";
        }

        return new I(this.game);
    }

}

