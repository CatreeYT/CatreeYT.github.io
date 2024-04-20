var canvas = document.createElement("canvas")
canvas.width = 256
canvas.height = 240
document.body.appendChild(canvas)
var ctx = canvas.getContext("2d");

function Emulator(){
    this.rom

    this.xRegister = 0
    this.yRegister = 0
    this.accumulator = 0 // Where math ops are sent
    this.stackPointer = 0 // What byte of the stack is being used
    this.programCounter = 0 // Current instruction

    this.WRAM = new Uint8Array(2048).fill(0) // Work Ram
    this.VRAM = new Uint8Array(2048).fill(0) // Video Ram
    this.SRAM = new Uint8Array(0xFF).fill(0) // Sprite Ram

    /*
    Sections of Work Ram (for reference):
        Zeropage:
            - $0000-$000F = Local Variables/Function args [16 Bytes]
            - $0010-$00FF = Global Variables, including certain pointer tables [240 Bytes]
            - $0100-$019F = Data to be copied to nametable during next vertical blank [160 Bytes]
            - $01A0-$01FF = Stack [96 Bytes]
        Normal:
            - $0200-$02FF = Data to be copied to OAM during next vertical blank [256 Bytes]
            - $0300-$03FF = Variables used by sound player, and possibly other variables [256 Bytes]
            - $0400-$07FF = Arrays and less-often-accessed global variables [1024 bytes]
    */

    this.setRom = function(rom){
        this.rom = rom;
    }
    this.runFrame = function(){
        var i = 0; 
        while(i < this.rom.byteLength){
            var instruction = this.rom[i];

            var instructionType = 0;

            var x = 0;         // X Register
            var y = 0;         // Y Register
            var a = 0;         // Accumulator

            var abs = 0;       // 2 Following (Register to read from)
            var immediate = 0; // 1 Following (Direct)
            var implied =  0;  // 0 Following (Operate on a specfic area)
            var indirect = 0;  // 0 or 1 Following (0 if no X/Y, 1 if there is)
            var relative = 0;  // 1 Following (Used for branch Instructions)
            var zeropage = 0;  // 1 Following (Offset from the Zero Page)

            var instName = "";
            switch(instruction){
                case 0x00: {
                    instName = "BRK impl"
                    implied = 1
                    break;
                }
                case 0x01: {
                    instName = "ORA x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0x05: {
                    instName = "ORA zpg"
                    zeropage = 1
                    break;
                }
                case 0x06: {
                    instName = "ASL zpg"
                    zeropage = 1
                    break;
                }
                case 0x08: {
                    instName = "PHP impl"
                    implied = 1
                    break;
                }
                case 0x09: {
                    instName = "ORA #"
                    immediate = 1
                    break;
                }
                case 0x0A: {
                    instName = "ASL a"
                    a = 1
                    break;
                }
                case 0x0C: {
                    instName = "NOP abs"
                    abs = 1
                    break;
                }
                case 0x0D: {
                    instName = "ORA abs"
                    abs = 1
                    break;
                }
                case 0x0E: {
                    instName = "ASL abs"
                    abs = 1
                    break;
                }
                case 0x10: {
                    instName = "BPL rel"
                    relative = 1
                    break;
                }
                case 0x11: {
                    instName = "ORA ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0x15: {
                    instName = "ORA zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x16: {
                    instName = "ASL zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x18: {
                    instName = "CLC impl"
                    implied = 1
                    break;
                }
                case 0x19: {
                    instName = "ORA abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0x1A: {
                    instName = "NOP impl"
                    implied = 1
                    break;
                }
                case 0x1D: {
                    instName = "ORA abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x1E: {
                    instName = "ASL abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x20: {
                    instName = "JSR abs"
                    abs = 1
                    break;
                }
                case 0x21: {
                    instName = "AND x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0x24: {
                    instName = "BIT zpg"
                    zeropage = 1
                    break;
                }
                case 0x25: {
                    instName = "AND zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x26: {
                    instName = "ROL zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x28: {
                    instName = "PLP impl"
                    implied = 1
                    break;
                }
                case 0x29: {
                    instName = "AND #"
                    immediate = 1
                    break;
                }
                case 0x2A: {
                    instName = "ROL a"
                    a = 1
                    break;
                }
                case 0x2C: {
                    instName = "BIT abs"
                    abs = 1
                    break;
                }
                case 0x2D: {
                    instName = "AND abs"
                    abs = 1
                    break;
                }
                case 0x2E: {
                    instName = "ROL abs"
                    abs = 1
                    break;
                }
                case 0x30: {
                    instName = "BMI rel"
                    rel = 1
                    break;
                }
                case 0x31: {
                    instName = "AND ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0x35: {
                    instName = "AND zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x36: {
                    instName = "ROL zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x38: {
                    instName = "SEC impl"
                    implied = 1
                    break;
                }
                case 0x39: {
                    instName = "AND abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0x3D: {
                    instName = "AND abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x3E: {
                    instName = "ROL abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x40: {
                    instName = "RTI impl"
                    implied = 1
                    break;
                }
                case 0x41: {
                    instName = "EOR x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0x45: {
                    instName = "EOR zpg"
                    zeropage = 1
                    break;
                }
                case 0x46: {
                    instName = "LSR zpg"
                    zeropage = 1
                    break;
                }
                case 0x48: {
                    instName = "PHA impl"
                    implied = 1
                    break;
                }
                case 0x49: {
                    instName = "EOR #"
                    immediate = 1
                    break;
                }
                case 0x4A: {
                    instName = "LSR a"
                    a = 1
                    break;
                }
                case 0x4C: {
                    instName = "JMP abs"
                    abs = 1
                    break;
                }
                case 0x4D: {
                    instName = "EOR abs"
                    abs = 1
                    break;
                }
                case 0x4E: {
                    instName = "LSR abs"
                    abs = 1
                    break;
                }
                case 0x50: {
                    instName = "BVC rel"
                    relative = 1
                    break;
                }
                case 0x51: {
                    instName = "EOR ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0x55: {
                    instName = "EOR zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x56: {
                    instName = "LSR zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x58: {
                    instName = "CLI impl"
                    implied = 1
                    break;
                }
                case 0x59: {
                    instName = "EOR abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0x5D: {
                    instName = "EOR abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x5E: {
                    instName = "LSR abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x60: {
                    instName = "RTS impl"
                    implied = 1
                    break;
                }
                case 0x61: {
                    instName = "ADC x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0x65: {
                    instName = "ADC zpg"
                    zeropage = 1
                    break;
                }
                case 0x66: {
                    instName = "ROR zpg"
                    zeropage = 1
                    break;
                }
                case 0x68: {
                    instName = "PLA impl"
                    implied = 1
                    break;
                }
                case 0x69: {
                    instName = "ADC #"
                    immediate = 1
                    break;
                }
                case 0x6A: {
                    instName = "ROR a"
                    a = 1
                    break;
                }
                case 0x6C: {
                    instName = "JMP ind"
                    indirect = 1
                    break;
                }
                case 0x6D: {
                    instName = "ADC abs"
                    abs = 1
                    break;
                }
                case 0x6E: {
                    instName = "ROR abs"
                    abs = 1
                    break;
                }
                case 0x70: {
                    instName = "BVS rel"
                    relative = 1
                    break;
                }
                case 0x71: {
                    instName = "ADC ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0x75: {
                    instName = "ADC zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x76: {
                    instName = "ROR zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x78: {
                    instName = "SEI impl"
                    implied = 1
                    break;
                }
                case 0x79: {
                    instName = "ADC abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0x7D: {
                    instName = "ADC abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x7E: {
                    instName = "ROR abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0x81: {
                    instName = "STA x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0x84: {
                    instName = "STY zpg"
                    zeropage = 1
                    break;
                }
                case 0x85: {
                    instName = "STA zpg"
                    zeropage = 1
                    break;
                }
                case 0x86: {
                    instName = "STX zpg"
                    zeropage = 1
                    break;
                }
                case 0x88: {
                    instName = "DEY impl"
                    implied = 1
                    break;
                }
                case 0x8A: {
                    instName = "STY zpg"
                    zeropage = 1
                    break;
                }
                case 0x8C: {
                    instName = "STY abs"
                    abs = 1
                    break;
                }
                case 0x8D: {
                    instName = "STA abs"
                    abs = 1
                    break;
                }
                case 0x8E: {
                    instName = "STX abs"
                    abs = 1
                    break;
                }
                case 0x90: {
                    instName = "BCC rel"
                    relative = 1
                    break;
                }
                case 0x91: {
                    instName = "STA ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0x94: {
                    instName = "STY zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x95: {
                    instName = "STA zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x96: {
                    instName = "STX zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0x98: {
                    instName = "TYA impl"
                    implied = 1
                    break;
                }
                case 0x99: {
                    instName = "STA abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0x9A: {
                    instName = "TXS impl"
                    implied = 1
                    break;
                }
                case 0x9D: {
                    instName = "STA abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0xA0: {
                    instName = "LDY #"
                    immediate = 1
                    break;
                }
                case 0xA1: {
                    instName = "LDA x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0xA2: {
                    instName = "LDX #"
                    immediate = 1
                    break;
                }
                case 0xA4: {
                    instName = "LDY zpg"
                    zeropage = 1
                    break;
                }
                case 0xA5: {
                    instName = "LDA zpg"
                    zeropage = 1
                    break;
                }
                case 0xA6: {
                    instName = "LDX zpg"
                    zeropage = 1
                    break;
                }
                case 0xA8: {
                    instName = "TAY impl"
                    implied = 1
                    break;
                }
                case 0xA9: {
                    instName = "LDA #"
                    immediate = 1
                    break;
                }
                case 0xAA: {
                    instName = "TAX impl"
                    implied = 1
                    break;
                }
                case 0xAC: {
                    instName = "LDY abs"
                    abs = 1
                    break;
                }
                case 0xAD: {
                    instName = "LDA abs"
                    abs = 1
                    break;
                }
                case 0xAE: {
                    instName = "LDX abs"
                    abs = 1
                    break;
                }
                case 0xB0: {
                    instName = "BCS rel"
                    relative = 1
                    break;
                }
                case 0xB1: {
                    instName = "LDA ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0xB4: {
                    instName = "LDY zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0xB5: {
                    instName = "LDA zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0xB6: {
                    instName = "LDX zpg, y"
                    zeropage = 1
                    y = 1
                    break;
                }
                case 0xB8: {
                    instName = "CLV impl"
                    implied = 1
                    break;
                }
                case 0xB9: {
                    instName = "LDA abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0xBA: {
                    instName = "TSX impl"
                    implied = 1
                    break;
                }
                case 0xBC: {
                    instName = "LDY abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0xBD: {
                    instName = "LDA abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0xBE: {
                    instName = "LDX abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0xC0: {
                    instName = "CPY #"
                    immediate = 1
                    break;
                }
                case 0xC1: {
                    instName = "CMP x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0xC4: {
                    instName = "CPY zpg"
                    zeropage = 1
                    break;
                }
                case 0xC5: {
                    instName = "CMP zpg"
                    zeropage = 1
                    break;
                }
                case 0xC6: {
                    instName = "DEC zpg"
                    zeropage = 1
                    break;
                }
                case 0xC8: {
                    instName = "INY impl"
                    implied = 1
                    break;
                }
                case 0xC9: {
                    instName = "CMP #"
                    immediate = 1
                    break;
                }
                case 0xCA: {
                    instName = "DEX impl"
                    implied = 1
                    break;
                }
                case 0xCC: {
                    instName = "CPY abs"
                    abs = 1
                    break;
                }
                case 0xCD: {
                    instName = "CMP abs"
                    abs = 1
                    break;
                }
                case 0xCE: {
                    instName = "DEC abs"
                    abs = 1
                    break;
                }
                case 0xD0: {
                    instName = "BNE rel"
                    relative = 1
                    break;
                }
                case 0xD1: {
                    instName = "CMP ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0xD5: {
                    instName = "CMP zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0xD6: {
                    instName = "DEC zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0xD8: {
                    instName = "CLD impl"
                    implied = 1
                    break;
                }
                case 0xD9: {
                    instName = "CMP abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0xDD: {
                    instName = "CMP abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0xDE: {
                    instName = "DEC abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0xE0: {
                    instName = "CPX #"
                    immediate = 1
                    break;
                }
                case 0xE1: {
                    instName = "SBC x, ind"
                    x = 1
                    indirect = 1
                    break;
                }
                case 0xE4: {
                    instName = "CPX zpg"
                    zeropage = 1
                    break;
                }
                case 0xE5: {
                    instName = "SPG zpg"
                    zeropage = 1
                    break;
                }
                case 0xE6: {
                    instName = "INC zpg"
                    zeropage = 1
                    break;
                }
                case 0xE8: {
                    instName = "INX impl"
                    implied = 1
                    break;
                }
                case 0xE9: {
                    instName = "SBC #"
                    immediate = 1
                    break;
                }
                case 0xEA: {
                    instName = "NOP impl"
                    implied = 1
                    break;
                }
                case 0xEC: {
                    instName = "CPX abs"
                    abs = 1
                    break;
                }
                case 0xED: {
                    instName = "SBC abs"
                    abs = 1
                    break;
                }
                case 0xEE: {
                    instName = "INC abs"
                    abs = 1
                    break;
                }
                case 0xF0: {
                    instName = "BEQ rel"
                    relative = 1
                    break;
                }
                case 0xF1: {
                    instName = "SBC ind, y"
                    indirect = 1
                    y = 1
                    break;
                }
                case 0xF5: {
                    instName = "SBC zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0xF6: {
                    instName = "INC zpg, x"
                    zeropage = 1
                    x = 1
                    break;
                }
                case 0xF8: {
                    instName = "SEC impl"
                    implied = 1
                    break;
                }
                case 0xF9: {
                    instName = "SBC abs, y"
                    abs = 1
                    y = 1
                    break;
                }
                case 0xFD: {
                    instName = "SBC abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                case 0xFE: {
                    instName = "INC abs, x"
                    abs = 1
                    x = 1
                    break;
                }
                default: {
                    instName = instruction.toString(16)
                }
            }
            if(abs){
                instName += " 0x" + ((this.rom[i+2]*0xFF) + this.rom[i+1]).toString(16);
                i += 2;
            } else if (immediate){
                instName += " 0x" + this.rom[i+1].toString(16);
                ++i;
            } else if (implied){
                // No Increment
            } else if (indirect){
                if(x || y){
                    instName += " 0x" + this.rom[i+1].toString(16);
                    ++i;
                }
                // Dont increase if there's no X/Y
            } else if (relative){
                instName += " 0x" + this.rom[i+1].toString(16);
                ++i;
            } else if (zeropage){
                instName += " 0x" + this.rom[i+1].toString(16);
                ++i;
            }
            ++i
            console.log(instName + " (" + instruction.toString(16) + ") " + " [" + i + "]");
        }
    
    }
    this.reset = function(){
        this.WRAM.fill(0)
        this.VRAM.fill(0)
        this.SRAM.fill(0)
    }
    this.printRom = function(){
        var i = 0;
        while(i < this.rom.byteLength){
            var instruction = this.rom[i];
            var instName = "";
            switch(instruction){
                case 0x00: {
                    instName = "BRK impl"
                    break;
                }
                case 0x01: {
                    instName = "ORA ind"
                    break;
                }
                case 0x05: {
                    instName = "ORA zpg"
                    break;
                }
                case 0x06: {
                    instName = "ASL zpg"
                    break;
                }
                case 0x08: {
                    instName = "PHP ampl"
                    break;
                }
                case 0x09: {
                    instName = "ORA #"
                    break;
                }
                case 0x0A: {
                    instName = "ASL a"
                    break;
                }
                case 0x0D: {
                    instName = "ORA abs"
                    break;
                }
                case 0x0E: {
                    instName = "ASL abs"
                    break;
                }
                case 0x10: {
                    instName = "BPL rel"
                    break;
                }
                case 0x11: {
                    instName = "ORA ind, y"
                    break;
                }
                case 0x15: {
                    instName = "ORA zpg, x"
                    break;
                }
                case 0x16: {
                    instName = "ASL zpg, x"
                    break;
                }
                case 0x18: {
                    instName = "CLC impl"
                    break;
                }
                case 0x19: {
                    instName = "ORA abs, y"
                    break;
                }
                case 0x1D: {
                    instName = "ORA abs, x"
                    break;
                }
                case 0x1E: {
                    instName = "ASL abs, x"
                    break;
                }
                case 0x20: {
                    instName = "JSR abs"
                    break;
                }
                case 0x21: {
                    instName = "AND x, ind"
                    break;
                }
                case 0x24: {
                    instName = "BIT zpg"
                    break;
                }
                case 0x25: {
                    instName = "AND zpg, x"
                    break;
                }
                case 0x26: {
                    instName = "ROL zpg, x"
                    break;
                }
                case 0x28: {
                    instName = "PLP impl"
                    break;
                }
                case 0x29: {
                    instName = "AND #"
                    break;
                }
                case 0x2A: {
                    instName = "ROL a"
                    break;
                }
                case 0x2C: {
                    instName = "BIT abs"
                    break;
                }
                case 0x2D: {
                    instName = "AND abs"
                    break;
                }
                case 0x2E: {
                    instName = "ROL abs"
                    break;
                }
                case 0x30: {
                    instName = "BMI rel"
                    break;
                }
                case 0x31: {
                    instName = "AND ind, y"
                    break;
                }
                case 0x35: {
                    instName = "AND zpg, x"
                    break;
                }
                case 0x36: {
                    instName = "ROL zpg, x"
                    break;
                }
                case 0x38: {
                    instName = "SEC impl"
                    break;
                }
                case 0x39: {
                    instName = "AND abs, y"
                    break;
                }
                case 0x3D: {
                    instName = "AND abs, x"
                    break;
                }
                case 0x3E: {
                    instName = "ROL abs, x"
                    break;
                }
                case 0x40: {
                    instName = "RTI impl"
                    break;
                }
                case 0x41: {
                    instName = "EOR x, ind"
                    break;
                }
                case 0x45: {
                    instName = "EOR zpg"
                    break;
                }
                case 0x46: {
                    instName = "LSR zpg"
                    break;
                }
                case 0x48: {
                    instName = "PHA impl"
                    break;
                }
                case 0x49: {
                    instName = "EOR #"
                    break;
                }
                case 0x4A: {
                    instName = "LSR a"
                    break;
                }
                case 0x4C: {
                    instName = "JMP abs"
                    break;
                }
                case 0x4D: {
                    instName = "EOR abs"
                    break;
                }
                case 0x4E: {
                    instName = "LSR abs"
                    break;
                }
                case 0x50: {
                    instName = "BVC rel"
                    break;
                }
                case 0x51: {
                    instName = "EOR ind, y"
                    break;
                }
                case 0x55: {
                    instName = "EOR zpg, x"
                    break;
                }
                case 0x56: {
                    instName = "LSR zpg, x"
                    break;
                }
                case 0x58: {
                    instName = "CLI impl"
                    break;
                }
                case 0x59: {
                    instName = "EOR abs, y"
                    break;
                }
                case 0x5D: {
                    instName = "EOR abs, x"
                    break;
                }
                case 0x5E: {
                    instName = "LSR abs, x"
                    break;
                }
                case 0x60: {
                    instName = "RTS impl"
                    break;
                }
                case 0x61: {
                    instName = "ADC x, ind"
                    break;
                }
                case 0x65: {
                    instName = "ADC zpg"
                    break;
                }
                case 0x66: {
                    instName = "ROR zpg"
                    break;
                }
                case 0x68: {
                    instName = "PLA impl"
                    break;
                }
                case 0x69: {
                    instName = "ADC #"
                    break;
                }
                case 0x6A: {
                    instName = "ROR a"
                    break;
                }
                case 0x6C: {
                    instName = "JMP ind"
                    break;
                }
                case 0x6D: {
                    instName = "ADC abs"
                    break;
                }
                case 0x6E: {
                    instName = "ROR abs"
                    break;
                }
                case 0x70: {
                    instName = "BVS rel"
                    break;
                }
                case 0x71: {
                    instName = "ADC"
                    break;
                }
                case 0x75: {
                    instName = "ADC zpg, x"
                    break;
                }
                case 0x76: {
                    instName = "ROR zpg, x"
                    break;
                }
                case 0x78: {
                    instName = "SEI impl"
                    break;
                }
                case 0x79: {
                    instName = "ADC abs, y"
                    break;
                }
                case 0x7D: {
                    instName = "ADC abs, x"
                    break;
                }
                case 0x7E: {
                    instName = "ROR abs, x"
                    break;
                }
                case 0x81: {
                    instName = "STA x, ind"
                    break;
                }
                case 0x84: {
                    instName = "STY zpg"
                    break;
                }
                case 0x85: {
                    instName = "STA zpg"
                    break;
                }
                case 0x86: {
                    instName = "STX zpg"
                    break;
                }
                case 0x88: {
                    instName = "DEY impl"
                    break;
                }
                case 0x8A: {
                    instName = "STY zpg"
                    break;
                }
                case 0x8C: {
                    instName = "STY abs"
                    break;
                }
                case 0x8D: {
                    instName = "STA abs"
                    break;
                }
                case 0x8E: {
                    instName = "STX abs"
                    break;
                }
                case 0x90: {
                    instName = "BCC rel"
                    break;
                }
                case 0x91: {
                    instName = "STA ind, y"
                    break;
                }
                case 0x94: {
                    instName = "STY zpg, x"
                    break;
                }
                case 0x95: {
                    instName = "STA zpg, x"
                    break;
                }
                case 0x96: {
                    instName = "STX zpg, x"
                    break;
                }
                case 0x98: {
                    instName = "TYA impl"
                    break;
                }
                case 0x99: {
                    instName = "STA abs, y"
                    break;
                }
                case 0x9A: {
                    instName = "TXS impl"
                    break;
                }
                case 0x9D: {
                    instName = "STA abs, x"
                    break;
                }
                case 0xA0: {
                    instName = "LDY #"
                    break;
                }
                case 0xA1: {
                    instName = "LDA x, ind"
                    break;
                }
                case 0xA2: {
                    instName = "LDY #"
                    break;
                }
                case 0xA4: {
                    instName = "LDY zpg"
                    break;
                }
                case 0xA5: {
                    instName = "LDA zpg"
                    break;
                }
                case 0xA6: {
                    instName = "LDX zpg"
                    break;
                }
                case 0xA8: {
                    instName = "TAY impl"
                    break;
                }
                case 0xA9: {
                    instName = "LDA #"
                    break;
                }
                case 0xAA: {
                    instName = "TAX impl"
                    break;
                }
                case 0xAC: {
                    instName = "LDY abs"
                    break;
                }
                case 0xAD: {
                    instName = "LDA abs"
                    break;
                }
                case 0xAE: {
                    instName = "LDX abs"
                    break;
                }
                case 0xB0: {
                    instName = "BCS rel"
                    break;
                }
                case 0xB1: {
                    instName = "LDA ind, y"
                    break;
                }
                case 0xB4: {
                    instName = "LDY zpg, x"
                    break;
                }
                case 0xB5: {
                    instName = "LDA zpg, x"
                    break;
                }
                case 0xB6: {
                    instName = "LDX zpg, y"
                    break;
                }
                case 0xB8: {
                    instName = "CLV impl"
                    break;
                }
                case 0xB9: {
                    instName = "LDA abs, y"
                    break;
                }
                case 0xBA: {
                    instName = "TSX impl"
                    break;
                }
                case 0xBC: {
                    instName = "LDY abs, x"
                    break;
                }
                case 0xBD: {
                    instName = "LDA abs, x"
                    break;
                }
                case 0xBE: {
                    instName = "LDX abs, x"
                    break;
                }
                case 0xC0: {
                    instName = "CPY #"
                    break;
                }
                case 0xC1: {
                    instName = "CMP x, ind"
                    break;
                }
                case 0xC4: {
                    instName = "CPY zpg"
                    break;
                }
                case 0xC5: {
                    instName = "CMP zpg"
                    break;
                }
                case 0xC6: {
                    instName = "DEC zpg"
                    break;
                }
                case 0xC8: {
                    instName = "INY impl"
                    break;
                }
                case 0xC9: {
                    instName = "CMP #"
                    break;
                }
                case 0xCA: {
                    instName = "DEX impl"
                    break;
                }
                case 0xCC: {
                    instName = "CPY abs"
                    break;
                }
                case 0xCD: {
                    instName = "CMP abs"
                    break;
                }
                case 0xCE: {
                    instName = "DEC abs"
                    break;
                }
                case 0xD0: {
                    instName = "BNE rel"
                    break;
                }
                case 0xD1: {
                    instName = "CMP ind, y"
                    break;
                }
                case 0xD5: {
                    instName = "CMP zpg, x"
                    break;
                }
                case 0xD6: {
                    instName = "DEC zpg, x"
                    break;
                }
                case 0xD8: {
                    instName = "CLD impl"
                    break;
                }
                case 0xD9: {
                    instName = "CMP abs, y"
                    break;
                }
                case 0xDD: {
                    instName = "CMP abs, x"
                    break;
                }
                case 0xDE: {
                    instName = "DEC abs, x"
                    break;
                }
                case 0xE0: {
                    instName = "CPX #"
                    break;
                }
                case 0xE1: {
                    instName = "SBC x, ind"
                    break;
                }
                case 0xE4: {
                    instName = "CPX zpg"
                    break;
                }
                case 0xE5: {
                    instName = "SPG zpg"
                    break;
                }
                case 0xE6: {
                    instName = "INC zpg"
                    break;
                }
                case 0xE8: {
                    instName = "INX impl"
                    break;
                }
                case 0xE9: {
                    instName = "SBC #"
                    break;
                }
                case 0xEA: {
                    instName = "NOP impl"
                    break;
                }
                case 0xEC: {
                    instName = "CPX abs"
                    break;
                }
                case 0xED: {
                    instName = "SBC abs"
                    break;
                }
                case 0xEE: {
                    instName = "INC abs"
                    break;
                }
                case 0xF0: {
                    instName = "BEQ rel"
                    break;
                }
                case 0xF1: {
                    instName = "SBC ind, y"
                    break;
                }
                case 0xF5: {
                    instName = "SBC zpg, x"
                    break;
                }
                case 0xF6: {
                    instName = "INC zpg, x"
                    break;
                }
                case 0xF8: {
                    instName = "SEC impl"
                    break;
                }
                case 0xF9: {
                    instName = "SBC abs, y"
                    break;
                }
                case 0xFD: {
                    instName = "SBC abs, x"
                    break;
                }
                case 0xFE: {
                    instName = "INC abs, x"
                    break;
                }
                default: {
                    instName = -1
                }
            }
            console.log(instName)
            ++i;
        }
    } // Mostly Debug
}