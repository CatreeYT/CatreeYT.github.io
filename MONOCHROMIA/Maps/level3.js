maps.push(map(
    [
        new block(360, 250, 80, 10),
        new block(360, 350, 80, 10),
        new block(360, 450, 80, 10),

        new block(350, 200, 10, 260),
        new block(440, 200, 10, 260),

        doorway(384, 402),

        textObj(335, 200, "Day by Day"),
    ],
    [
        new block(360, 300, 80, 10, 0.4, new colorObj(0, 0, 0)),
        new block(360, 400, 80, 10, 0.4, new colorObj(0, 0, 0)),

        new block(350, 200, 10, 260, 0.4, new colorObj(0, 0, 0)),
        new block(440, 200, 10, 260, 0.4, new colorObj(0, 0, 0)),

        textObj(335, 200, "Day by Day"),
    ],
    60,
    390, 190
))