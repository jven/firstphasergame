var config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: '#eee',
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0.6
      },
      debug: true,
      debugBodyColor: 0x00ff00
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var holdSpecs = [
  [20, 550, 10, 10],
  [60, 550, 10, 10],
  [20, 500, 10, 10],
  [60, 500, 10, 10],
  [40, 450, 10, 10],
  [80, 450, 10, 10],
  [60, 400, 10, 10],
  [100, 400, 10, 10],
  [80, 350, 10, 10],
  [120, 350, 10, 10],
  [100, 300, 10, 10],
  [140, 300, 10, 10],
  [120, 250, 10, 10],
  [160, 250, 10, 10]
];
var leftHand = [28, 500];
var rightHand = [48, 500];
var leftFoot = [20, 550];
var rightFoot = [40, 550];
// 0 = nothing, 1 = LH, 2 = RH, 3 = LF, 4 = RF
var beingDragged = 0;

function preload() {}

function create () {
  var group = this.matter.world.nextGroup(true /* isNonColliding */);
  var noCollisionFilter = {
    group: group
  };

  this.matter.world.setBounds(0, 0, 400, 600);

  for (var i = 0; i < holdSpecs.length; i++) {
    var holdSpec = holdSpecs[i];
    var hold = this.add.rectangle(
        holdSpec[0],
        holdSpec[1],
        holdSpec[2],
        holdSpec[3],
        0x0000ff);
    this.matter.add.gameObject(hold, {
      isStatic: true,
      collisionFilter: noCollisionFilter
    });
  }

  makeClimber(this, 100, 100, noCollisionFilter);

  this.matter.add.mouseSpring();
}

function update() {
}

function makeClimber(scene, x, y, collisionFilter) {
  var matter = scene.matter;
  var options = {
    collisionFilter: collisionFilter
  };

  // Create game objects.
  var leftHand = scene.add.rectangle(x - 15, y, 10, 10, options);
  var leftOuterArm = scene.add.rectangle(x, y, 20, 10, options);
  var leftInnerArm = scene.add.rectangle(x + 20, y, 20, 10, options);
  var torso = scene.add.rectangle(x + 40, y + 15, 20, 40, options);
  var rightInnerArm = scene.add.rectangle(x + 60, y, 20, 10, options);
  var rightOuterArm = scene.add.rectangle(x + 80, y, 20, 10, options);
  var rightHand = scene.add.rectangle(x + 95, y, 10, 10, options);
  var leftInnerLeg = scene.add.rectangle(x + 33, y + 45, 10, 20, options);
  var leftOuterLeg = scene.add.rectangle(x + 33, y + 65, 10, 20, options);
  var leftFoot = scene.add.rectangle(x + 33, y + 80, 10, 10, options);
  var rightInnerLeg = scene.add.rectangle(x + 47, y + 45, 10, 20, options);
  var rightOuterLeg = scene.add.rectangle(x + 47, y + 65, 10, 20, options);
  var rightFoot = scene.add.rectangle(x + 47, y + 80, 10, 10, options);
  var gameObjects = [
    leftHand,
    leftOuterArm,
    leftInnerArm,
    torso,
    rightInnerArm,
    rightOuterArm,
    rightHand,
    leftInnerLeg,
    leftOuterLeg,
    leftFoot,
    rightInnerLeg,
    rightOuterLeg,
    rightFoot
  ];

  // Create bodies.
  for (var i = 0; i < gameObjects.length; i++) {
    matter.add.gameObject(gameObjects[i], {
      collisionFilter: collisionFilter
    });
  }

  // Create constraints.
  var stiffness = 0.3;
  // var constraintPairs = [
  //   [leftHand, leftOuterArm],
  //   [leftOuterArm, leftInnerArm],
  //   [leftInnerArm, torso],
  //   [torso, rightInnerArm],
  //   [rightInnerArm, rightOuterArm],
  //   [rightOuterArm, rightHand],
  //   [torso, leftInnerLeg],
  //   [leftInnerLeg, leftOuterLeg],
  //   [leftOuterLeg, leftFoot],
  //   [torso, rightInnerLeg],
  //   [rightInnerLeg, rightOuterLeg],
  //   [rightOuterLeg, rightFoot]
  // ];
  // for (var i = 0; i < constraintPairs.length; i++) {
  //   var constraintPair = constraintPairs[i];
  //   matter.add.constraint(
  //       constraintPair[0],
  //       constraintPair[1],
  //       Phaser.Math.Distance.Between(
  //           constraintPair[0].x,
  //           constraintPair[0].y,
  //           constraintPair[1].x,
  //           constraintPair[1].y),
  //       stiffness);
  // }
  matter.add.constraint(
      leftHand, leftOuterArm, 0, stiffness, {
        pointA: { x: 5, y: 0 },
        pointB: { x: -10, y: 0 }
      });
  matter.add.constraint(
      leftOuterArm, leftInnerArm, 0, stiffness, {
        pointA: { x: 10, y: 0 },
        pointB: { x: -10, y: 0 }
      });
  matter.add.constraint(
      leftInnerArm, torso, 0, stiffness, {
        pointA: { x: 10, y: 0 },
        pointB: { x: -10, y: -15 }
      });
  matter.add.constraint(
      torso, rightInnerArm, 0, stiffness, {
        pointA: { x: 10, y: -15 },
        pointB: { x: -10, y: 0 }
      });
  matter.add.constraint(
      rightInnerArm, rightOuterArm, 0, stiffness, {
        pointA: { x: 10, y: 0 },
        pointB: { x: -10, y: 0 }
      });
  matter.add.constraint(
      rightOuterArm, rightHand, 0, stiffness, {
        pointA: { x: 10, y: 0 },
        pointB: { x: -5, y: 0 }
      });
  matter.add.constraint(
      torso, leftInnerLeg, 0, stiffness, {
        pointA: { x: -7, y: 20 },
        pointB: { x: 0, y: -10 }
      });
  matter.add.constraint(
      leftInnerLeg, leftOuterLeg, 0, stiffness, {
        pointA: { x: 0, y: 10 },
        pointB: { x: 0, y: -10 }
      });
  matter.add.constraint(
      leftOuterLeg, leftFoot, 0, stiffness, {
        pointA: { x: 0, y: 10 },
        pointB: { x: 0, y: -5 }
      });
  matter.add.constraint(
      torso, rightInnerLeg, 0, stiffness, {
        pointA: { x: 7, y: 20 },
        pointB: { x: 0, y: -10 }
      });
  matter.add.constraint(
      rightInnerLeg, rightOuterLeg, 0, stiffness, {
        pointA: { x: 0, y: 10 },
        pointB: { x: 0, y: -10 }
      });
  matter.add.constraint(
      rightOuterLeg, rightFoot, 0, stiffness, {
        pointA: { x: 0, y: 10 },
        pointB: { x: 0, y: -5 }
      });

  // Initial attachments.
  var leftHandHold = 10;
  var rightHandHold = 9;
  var leftFootHold = 4;
  var rightFootHold = 7;
  matter.add.worldConstraint(
      leftHand, 0, stiffness, {
        pointA: { x: holdSpecs[leftHandHold][0], y: holdSpecs[leftHandHold][1] },
        pointB: { x: 0, y: 0 }
      });
  matter.add.worldConstraint(
      rightHand, 0, stiffness, {
        pointA: { x: holdSpecs[rightHandHold][0], y: holdSpecs[rightHandHold][1] },
        pointB: { x: 0, y: 0 }
      });
  matter.add.worldConstraint(
      leftFoot, 0, stiffness, {
        pointA: { x: holdSpecs[leftFootHold][0], y: holdSpecs[leftFootHold][1] },
        pointB: { x: 0, y: 0 }
      });
  matter.add.worldConstraint(
      rightFoot, 0, stiffness, {
        pointA: { x: holdSpecs[rightFootHold][0], y: holdSpecs[rightFootHold][1] },
        pointB: { x: 0, y: 0 }
      });
}