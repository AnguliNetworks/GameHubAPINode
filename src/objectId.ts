import * as process from 'process';

class ObjectId {

    private static counter: number = Math.floor(Math.random() * 65535);
    private value: String;

    constructor() {
        this.value =
            ObjectId.format(new Date().getTime(), 12) +
            ObjectId.format(process.pid) +
            ObjectId.format(ObjectId.counter) +
            ObjectId.format(Math.floor(Math.random() * 65535));

        ObjectId.counter++;

        if (ObjectId.counter >= 65535) {
            ObjectId.counter = 0;
        }
    }

    private static format(number: number, length: number = 4) {
        let hex: string = number.toString(16);

        while (hex.length < length) {
            hex = '0' + hex;
        }

        return hex;
    }

    public toString() {
        return this.getValue();
    }

    public getValue() {
        return this.value;
    }
}

export { ObjectId };
