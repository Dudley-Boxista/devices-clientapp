import {t, Selector } from 'testcafe';
import { 
    ADD_DEVICE_BTN, 
    DEVICE_CAPACITY, 
    DEVICE_EDIT_BTN, 
    DEVICE_NAME, 
    DEVICE_REMOVE_BTN, 
    DEVICE_TYPE, 
    HDD_CAPACITY_INPUT, 
    SYSTEM_NAME_INPUT, 
    TYPE_MAC, 
    TYPE_SELECTOR, 
    TYPE_WINDOWS_SERVER, 
    TYPE_WINDOWS_WORKSTATION 
} from '../selectors/device-selectors';

class DevicePage {
    deviceName: Selector;

    constructor () {
        this.deviceName = Selector(DEVICE_NAME);
    }

    deviceType(name): Selector {
        return this.deviceName.withText(name).parent().child(DEVICE_TYPE);
    }

    hddCapacity(name): Selector {
        return this.deviceName.withText(name).parent().child(DEVICE_CAPACITY);
    }

    deviceHddCapacity

    editButton(id: string): Selector {
        return Selector(`[href="/devices/edit/${id}"]`);
    }

    deleteButton(id: string): Selector {
        return Selector(`[href="/devices/edit/${id}"]`).parent().child(DEVICE_REMOVE_BTN);
    }

    async clickSubmitButton() {
        await t.click(Selector(ADD_DEVICE_BTN));
    }

    async inputSystemName(name: string) {
        await t.typeText(SYSTEM_NAME_INPUT, name);
    }

    async selectType(type: string = 'WINDOWS WORKSTATION') {
        await t.click(TYPE_SELECTOR);
        switch(type) {
            case 'WINDOWS WORKSTATION':
                await t.click(TYPE_WINDOWS_WORKSTATION);
                break;
            case 'WINDOWS SEVER':
                await t.click(TYPE_WINDOWS_SERVER);
                break;
            case 'MAC':
                await t.click(TYPE_MAC);
                break;
        }
    }

    async inputHddCapacity(capacity: string) {
        await t.typeText(HDD_CAPACITY_INPUT, capacity);
    }

    async getDeviceId(index: number): Promise<string> {
        const href = await Selector(DEVICE_EDIT_BTN).nth(index).getAttribute('href') as string;
        return href.split('edit/')[1]
    }
}

export default new DevicePage();