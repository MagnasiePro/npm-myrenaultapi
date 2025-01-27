import MyRenaultAPI, {
  ActionEndpointVersion1,
  VehicleDataEndpointVersion1,
} from '../src/index';

const RenaultAPI = new MyRenaultAPI(
  'your-email@magnasie.com',
  'secret-password',
  'FR',
  'MYRENAULT',
);

async function getVehicleDetailsExample() {
  try {
    await RenaultAPI.login();
    console.log(await RenaultAPI.getVehiclesDetails());
  } catch (e) {
    console.error(e);
  }
}

async function getVehicleDetails() {
  try {
    await RenaultAPI.login();
    console.log(await RenaultAPI.getVehicleDetails('vin-of-my-super-car'));
  } catch (e) {
    console.error(e);
  }
}

async function getVehicleData() {
  try {
    await RenaultAPI.login();
    console.log(
      await RenaultAPI.getVehicleData(
        'vin-of-my-super-car',
        VehicleDataEndpointVersion1.ChargeHistory,
      ),
    );
  } catch (e) {
    console.error(e);
  }
}

async function postVehicleActionHvac(value: boolean) {
  try {
    await RenaultAPI.login();
    const body = {
      data: {
        type: 'HvacStart',
        attributes: {
          action: value ? 'start' : 'stop', // Seems like the stop action return no error but does not stop the hvac
        },
      },
    };
    console.log(
      await RenaultAPI.postVehicleAction(
        'vin-of-my-super-car',
        ActionEndpointVersion1.HvacStart,
        body,
      ),
    );
  } catch (e) {
    console.error(e);
  }
}
