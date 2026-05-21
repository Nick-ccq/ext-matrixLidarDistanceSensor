//% color="#098eff" iconWidth=35 iconHeight=30
namespace matrixLidarDistanceSensor {
    function ensureInclude() {
        Generator.addImport('import time');
        Generator.addImport('from pinpong.board import Board');
        Generator.addImport('from DFRobot_matrixLidar import *');
    }

    function getTofObjectName(addr: string) {
        switch (addr) {
            case '0x33':
                return 'tof1';
            case '0x32':
                return 'tof2';
            case '0x31':
                return 'tof3';
            case '0x30':
                return 'tof4';
            default:
                return 'tof1';
        }
    }

    function ensureTof(addr: string) {
        let obj = getTofObjectName(addr);
        ensureInclude();
        Generator.addCode( `${obj} = DFRobot_matrixLidar_i2c(${addr})`);
        Generator.addCode( `while ${obj}.begin() != 0:\n    time.sleep(1)`);
        return obj;
    }

    function ensureMatrixTof(addr: string) {
        let obj = ensureTof(addr);
        Generator.addCode(`while ${obj}.set_Ranging_Mode(8) != 0:\n    time.sleep(1)`);
        return obj;
    }

    function ensureObstacleTof(addr: string) {
        let obj = ensureTof(addr);
        Generator.addCode(`while ${obj}.set_obstacle_mode() != 0:\n    time.sleep(1)`);
        return obj;
    }

    //% block="Initialize laser ranging sensor I2C [ADDRESS] mode [MATRIX]" blockType="command"
    //% ADDRESS.shadow="dropdown" ADDRESS.options="ADDRESS"
    //% MATRIX.shadow="dropdown" MATRIX.options="MATRIX"
    export function laserrangingSensorInit(parameter: any, block: any) {
        let addr = parameter.ADDRESS.code;
        let matrix = parameter.MATRIX.code;
        if (matrix === 'ObstacleAvoidance') {
            ensureObstacleTof(addr);
        } else {
            ensureMatrixTof(addr);
        }
    }
    //% block="[ADDRESS] Customize obstacle avoidance distance [DISTANCE] (mm)" blockType="command"
    //% ADDRESS.shadow="dropdown" ADDRESS.options="ADDRESS"
    //% DISTANCE.shadow="range" DISTANCE.params.min=100 DISTANCE.params.max=500 DISTANCE.defl=200
    export function setObstacleDistance(parameter: any, block: any) {
        let addr = parameter.ADDRESS.code;
        let distance = parameter.DISTANCE.code;
        let obj = ensureObstacleTof(addr);
        Generator.addCode(`${obj}.config_avoidance(${distance})`);
    }
    //% block="[ADDRESS] Obstacle avoidance direction hint" blockType="reporter"
    //% ADDRESS.shadow="dropdown" ADDRESS.options="ADDRESS"
    export function obstacleSuggestion(parameter: any, block: any) {
        let addr = parameter.ADDRESS.code;
        let obj = getTofObjectName(addr);
        Generator.addCode([`${obj}.get_dir()`, Generator.ORDER_UNARY_POSTFIX]);
    }

    //% block="[ADDRESS] Obstacle avoidance distance [SIDE] (mm)" blockType="reporter"
    //% ADDRESS.shadow="dropdown" ADDRESS.options="ADDRESS"
    //% SIDE.shadow="dropdown" SIDE.options="SIDE"
    export function getObstacleDistance(parameter: any, block: any) {
        let addr = parameter.ADDRESS.code;
        let side = parameter.SIDE.code;
        side = side === 'Left' ? "ELEFT" : side === 'Front' ? "EMIDDLE" : "ERIGHT";
        let obj = getTofObjectName(addr);
        Generator.addCode([`${obj}.get_distance(${side})`, Generator.ORDER_UNARY_POSTFIX]);
    }
    //% block="---" blockType="tag"
    export function tag1() {}

    //% block="[ADDRESS] Matrix point distance x: [X] y: [Y] (mm)" blockType="reporter"
    //% ADDRESS.shadow="dropdown" ADDRESS.options="ADDRESS"
    //% X.shadow="range" X.params.min=0 X.params.max=7 X.defl=3
    //% Y.shadow="range" Y.params.min=0 Y.params.max=7 Y.defl=3
    export function matrixPointOutput(parameter: any, block: any) {
        let addr = parameter.ADDRESS.code;
        let x = parameter.X.code;
        let y = parameter.Y.code;
        let obj = getTofObjectName(addr);
        Generator.addCode([`${obj}.get_fixed_point_data(${x}, ${y})`, Generator.ORDER_UNARY_POSTFIX]);
    }
}
