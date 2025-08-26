

//% color="#098eff" iconWidth=35 iconHeight=30
namespace matrixLidarDistanceSensor {

    //% block="Initialize the I2C address [ADDRESS] of the laserranging sensor in [MATRIX]" blockType="command"
    //% ADDRESS.shadow="dropdown" ADDRESS.options="ADDRESS"
    //% MATRIX.shadow="dropdown" MATRIX.options="MATRIX"
    export function laserrangingSensorInit(parameter: any, block: any) {
        let addr = parameter.ADDRESS.code;
        let matrix = parameter.MATRIX.code;
        matrix = matrix === 'ObstacleAvoidance' ? "eObstacle" : "eMatrix";
        Generator.addInclude('DFRobot_matrixLidarDistanceSensor_1.h', '#include <DFRobot_matrixLidarDistanceSensor_1.h>');
        Generator.addObject('DFRobot_matrixLidarDistanceSensor_I2C', 'DFRobot_matrixLidarDistanceSensor_I2C', 'tof;');
        Generator.addSetup('tof.begin', `tof.begin();`);
        Generator.addSetup('tof.getAllDataConfig', `tof.getAllDataConfig(${addr}, ${matrix});`);
    }

    //% block="Acquire obstacle avoidance data" blockType="command"
    export function acquireObstacleData(parameter: any, block: any) {
        Generator.addInclude('DFRobot_matrixLidarDistanceSensor_1.h', '#include <DFRobot_matrixLidarDistanceSensor_1.h>');
        Generator.addObject('DFRobot_matrixLidarDistanceSensor_I2C', 'DFRobot_matrixLidarDistanceSensor_I2C', 'tof;');
        Generator.addCode(`tof.requestObstacleSensorData();`);
    }

    //% block="Customize the obstacle avoidance distance to [DISTANCE] (mm)" blockType="command"
    //% DISTANCE.shadow="range" DISTANCE.params.min=100 DISTANCE.params.max=500 DISTANCE.defl=200
    export function setObstacleDistance(parameter: any, block: any) {
        let distance = parameter.DISTANCE.code;
        Generator.addInclude('DFRobot_matrixLidarDistanceSensor_1.h', '#include <DFRobot_matrixLidarDistanceSensor_1.h>');
        Generator.addObject('DFRobot_matrixLidarDistanceSensor_I2C', 'DFRobot_matrixLidarDistanceSensor_I2C', 'tof;');
        Generator.addCode(`tof.configAvoidance(${distance});`);
    }

    //% block="Direction indication in obstacle avoidance mode" blockType="reporter"
    export function obstacleSuggestion(parameter: any, block: any) {
        Generator.addInclude('DFRobot_matrixLidarDistanceSensor_1.h', '#include <DFRobot_matrixLidarDistanceSensor_1.h>');
        Generator.addObject('DFRobot_matrixLidarDistanceSensor_I2C', 'DFRobot_matrixLidarDistanceSensor_I2C', 'tof;');
        Generator.addCode([`tof.getDir()`, Generator.ORDER_UNARY_POSTFIX]);
    }

    //% block="Distance detection in obstacle avoidance mode [SIDE] (mm)" blockType="reporter"
    //% SIDE.shadow="dropdown" SIDE.options="SIDE"
    export function getObstacleDistance(parameter: any, block: any) {
        let side = parameter.SIDE.code;
        side = side === 'Left' ? "eLeft" : side === 'Front' ? "eMiddle" : "eRight";
        Generator.addInclude('DFRobot_matrixLidarDistanceSensor_1.h', '#include <DFRobot_matrixLidarDistanceSensor_1.h>');
        Generator.addObject('DFRobot_matrixLidarDistanceSensor_I2C', 'DFRobot_matrixLidarDistanceSensor_I2C', 'tof;');
        Generator.addCode([`tof.getDistance(${side})`, Generator.ORDER_UNARY_POSTFIX]);
    }

    //% block="[ADDRESS] Measure the distance of the specified point in matrix mode x: [X] y: [Y] (mm)" blockType="reporter"
    //% ADDRESS.shadow="dropdown" ADDRESS.options="ADDRESS"
    //% X.shadow="range" X.params.min=0 X.params.max=7 X.defl=3
    //% Y.shadow="range" Y.params.min=0 Y.params.max=7 Y.defl=3
    export function matrixPointOutput(parameter: any, block: any) {
        let addr = parameter.ADDRESS.code;
        let x = parameter.X.code;
        let y = parameter.Y.code;
        Generator.addInclude('DFRobot_matrixLidarDistanceSensor_1.h', '#include <DFRobot_matrixLidarDistanceSensor_1.h>');
        Generator.addObject('DFRobot_matrixLidarDistanceSensor_I2C', 'DFRobot_matrixLidarDistanceSensor_I2C', 'tof;');
        Generator.addCode([`tof.getFixedPointData(${addr}, ${x}, ${y})`, Generator.ORDER_UNARY_POSTFIX]);
    }
}
