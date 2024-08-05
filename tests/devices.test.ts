import { uid } from "uid";
import { DEVICES_URL } from "./const/urls";
import { makeApiCall } from "./helpers/api-call";
import { Device } from "./models/device";
import devicePage from "./pages/device-page";

fixture('Devices Test')
    .page

test('Test 1', async t => {
    const devicesResponse = await makeApiCall(t, DEVICES_URL);

    const devices = devicesResponse.body as Array<Device>;
    for (let i = 0; i < devices.length; i++) {
        await t.expect(devicePage.deviceName.withText(devices[i].system_name).visible).ok();
        await t.expect(devicePage.deviceType(devices[i].system_name).visible).ok();
        await t.expect(devicePage.deviceType(devices[i].system_name).textContent).eql(devices[i].type);
        await t.expect(devicePage.hddCapacity(devices[i].system_name).textContent).contains(`${devices[i].hdd_capacity}`);
        await t.expect(devicePage.hddCapacity(devices[i].system_name).visible).ok();
        await t.expect(devicePage.editButton(devices[i].id).visible).ok()
        await t.expect(devicePage.deleteButton(devices[i].id).visible).ok()        
    }
});

test('Test 2', async t => {
    const systemName = `System Name ${uid()}`;
    const deviceType = 'MAC';
    const hddCapacity = '25';

    await devicePage.clickSubmitButton();
    await devicePage.inputSystemName(systemName);
    await devicePage.selectType(deviceType);
    await devicePage.inputHddCapacity(hddCapacity);
    await devicePage.clickSubmitButton();

    await t.expect(devicePage.deviceName.withText(systemName).visible).ok();
    await t.expect(devicePage.deviceType(systemName).textContent).eql(deviceType);
    await t.expect(devicePage.deviceType(systemName).visible).ok();
    await t.expect(devicePage.hddCapacity(systemName).textContent).contains(hddCapacity);
    await t.expect(devicePage.hddCapacity(systemName).visible).ok();
});


test('Test 3', async t => {
    const id = await devicePage.getDeviceId(0);
    const systemName = await devicePage.deviceName.nth(0).textContent;
    const deviceType = await devicePage.deviceType(systemName).textContent;
    const hddCapacity = await devicePage.hddCapacity(systemName).textContent;

    const putBody = { 
        system_name: 'Renamed Device', 
        type: deviceType,
        hdd_capacity: hddCapacity,
    };

    await makeApiCall(t, `${DEVICES_URL}/${id}`, 'put', putBody);

    await t.eval(() => location.reload());
    await t.expect(devicePage.deviceName.withText(putBody.system_name).visible).ok();
});

test('Test 4', async t => {
    await t.expect(devicePage.deviceName.visible).ok();
    const lastElement = await devicePage.deviceName.count - 1;
    const id = await devicePage.getDeviceId(lastElement);
    const systemName = await devicePage.deviceName.nth(lastElement).textContent;

    await makeApiCall(t, `${DEVICES_URL}/${id}`, 'delete');

    await t.eval(() => location.reload());

    await t.expect(devicePage.deviceName.withText(systemName).exists).notOk();
});