> 🚨 I sold my Renault Zoe so I can't test more things anymore. I hope this repo will continue to live with your contributions.

# MyRenaultAPI

MyRenaultAPI is an npm package that provides an interface to interact with the Renault API.
This package allows developers to easily access and manage data from their Renault vehicles.

> **Note:** This is not an official library. It uses endpoints from the official MyRenault application.

## Requirement

* Node >= 12.0.0

## Installation

To install the package, use npm:

```bash
npm i npm-myrenaultapi
```

## Usage

Here is an example of how to use the MyRenaultAPI package:

```typescript
import MyRenaultAPI from 'myrenaultapi'

const renault = new MyRenaultAPI({
  username: 'your-email@example.com',
  password: 'your-password',
});

renault.login()
  .then(() => {
    return renault.getVehicleDetails('my-super-vin');
  })
  .then(vehicle => {
    console.log(vehicle);
  })
  .catch(error => {
    console.error(error);
  });
```

## API Methods

### `login(force?: boolean)`

Authenticates the user.

> **Note:** You don't have to login everytime, but there is already a condition to avoid login if previous one is still usable.

#### Parameters
- **`force`** *(optional, boolean)*:  
  - `true`: Forces a login, regardless of session validity.  
  - `false` (default): Skips login if the current session is still valid.

#### Returns
A `Promise` that resolves when the login process is complete.

#### Example
```typescript
await renault.login(true); // Forces a login
```

### `getVehicleDetails(vin: string)`

Get vehicle details for the given vehicle VIN.

#### Parameters
- **`vin`** *(string)*

#### Returns
A `Promise` that resolves with many informations about the vehicle.

#### Example
```typescript
renault.login()
  .then(() => {
    return renault.getVehicleDetails('my-super-vin');
  })
  .then(vehicle => {
    console.log(vehicle);
  })
  .catch(error => {
    console.error(error);
  });
```

### `getVehiclesDetails()`

Get details for all vehicles the user own.

#### Returns

A `Promise` that resolves with a list of vehicles informations.

### Example
```typescript
renault.login()
  .then(() => {
    return renault.getVehiclesDetails();
  })
  .then(vehicles => {
    console.log(vehicles);
  })
  .catch(error => {
    console.error(error);
  });
```

### `getVehicleData(vin: string, endpoint: VehicleDataEndpoint)`

Get data for a given vin vehicle and a given endpoint.

#### Parameters
- **`vin`** *(string)*
- **`endpoint`** *(VehicleDataEndpoint)*

#### Returns

A `Promise` that resolves with information for the given endpoint.

#### Example
```typescript
renault.login()
  .then(() => {
    return renault.getVehicleData('my-super-vin', VehicleDataEndpointVersion2.BatteryStatus);
  })
  .then(vehicle => {
    console.log(vehicle);
  })
  .catch(error => {
    console.error(error);
  });
```

### `getVehicleCapabilities(vin: string)`

Get capabilities of the vehicle.

#### Parameters
- **`vin`** *(string)*

#### Returns

A `Promise` that resolves with capabilities for the given VIN vehicle.

#### Example
```typescript
renault.login()
  .then(() => {
    return renault.getVehicleCapabilities('my-super-vin');
  })
  .then(vehicle => {
    console.log(vehicle);
  })
  .catch(error => {
    console.error(error);
  });
```

### `postVehicleAction(vin: string, endpoint: ActionEndpoint, data: any)`

Post an action to the given vehicle and given endpoint.

> **Note:** Data can be very different for each endpoint. Please check the [documentation](https://renault-api.readthedocs.io/en/latest/endpoints.html).

#### Parameters
- **`vin`** *(string)*
- **`endpoint`** *(ActionEndpoint)*
- **`data`** *(any)*

#### Returns

A `Promise` that resolves.

#### Example
```typescript
renault.login()
  .then(() => {
    const body = {
      data: {
        type: 'ChargingStart',
        attributes: {
          action: 'start',
      },
    };

    return renault.postVehicleAction('my-super-vin', ActionEndpointVersion1.ChargeMode, body)
  })
  .then(() => {
    console.log('Success')
  })
  .catch(error => {
    console.error(error)
  })
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

Distributed under the terms of the MIT license, MyRenaultAPI is free and open source software.

## Disclaimer

This project is not affiliated with, endorsed by, or connected to Renault. I accept no responsibility for any consequences, intended or accidental, as a as a result of interacting with Renault's API using this project.

## Credits

This project was heavily based on [Renault API](https://github.com/hacf-fr/renault-api), a Python Renault API.
