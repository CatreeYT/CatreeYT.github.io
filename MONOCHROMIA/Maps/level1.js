maps.push(map(
    [
        new block(0, 100, 80, 100),
        new block(144, 0, 4, 310),
        new block(224, 0, 4, 310),
        new block(80, 130, 64, 70),
        spike(80, 120),
        spike(112, 120),
        new block(144, 200, 36, 10),
        spike(148, 190),
        new block(192, 300, 36, 10),
        spike(192, 290),
    
        new block(144, 380, 84, 70),
    
        textObj(60, 20, "<-- Watch", 15),
        textObj(80, 40, "these", 15),
        
        textObj(400, 300, "Every day is the same..."),
    ],
    [
        new block(0, 100, 80, 100, 0.4, new colorObj(0, 0, 0)),
        new block(80, 130, 64, 70, 0.4, new colorObj(0, 0, 0)),
        new block(144, 100, 80, 100, 0.4, new colorObj(0, 0, 0)),
        new block(224, 0, 4, 200, 0.4, new colorObj(0, 0, 0)),
        spike(80, 120),
        spike(112, 120),
    
        new block(250, 380, 84, 70, 0.4, new colorObj(0, 0, 0)),

        textObj(60, 20, "<-- Watch", 15),
        textObj(80, 40, "these", 15),
    
        doorway(276, 332),
        textObj(330, 360, "Press Space"),
    
        textObj(400, 300, "Every day is the same..."),
    ],
    60,
    10, 70
))