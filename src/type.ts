/**
 * Enum representing different brand API endpoints.
 */
export type Account = 'MYRENAULT' | 'MYDACIA' | 'MYALPINE';
// TODO: Check if MYDADIA and MYALPINE are correct names (I don't have any account to test)
// Not sure if Nissan and Mitsubishi are supported

export type VehicleDataEndpoint =
  | VehicleDataEndpointVersion1
  | VehicleDataEndpointVersion2;

export type ActionEndpoint = ActionEndpointVersion1 | ActionEndpointVersion2;

/**
 * Enum representing different vehicle data endpoints for version 1.
 */
export enum VehicleDataEndpointVersion1 {
  ChargeHistory = 'charge-history',
  ChargeMode = 'charge-mode',
  Charges = 'charges',
  ChargingSettings = 'charging-settings',
  HvacStatus = 'hvac-status',
  HvacSettings = 'hvac-settings',
  Location = 'location',
  LockStatus = 'lock-status',
}

/**
 * Enum representing different vehicle data endpoints for version 2.
 */
export enum VehicleDataEndpointVersion2 {
  BatteryStatus = 'battery-status',
  Cockpit = 'cockpit',
}

/**
 * Enum representing different vehicle action endpoints for version 1.
 */
export enum ActionEndpointVersion1 {
  ChargeMode = 'charge-mode', // TODO: Check if this is correct
  ChargingStart = 'charging-start',
  HvacStart = 'hvac-start',
}

/**
 * Enum representing different vehicle action endpoints for version 2.
 */
export enum ActionEndpointVersion2 {
  ChargeSchedule = 'charge-schedule', // TODO: Check if this is correct
  HvacSchedule = 'hvac-schedule', // TODO: Check if this is correct
}

/**
 * Enum representing different vehicle action endpoints version.
 */
export type VehicleDataEndpointVersion = 'v1' | 'v2';

/**
 * Type representing the data that are needed to perform an action on a vehicle.
 */
export type VehicleActionData = {
  data:
    | {
        type: 'ChargingStart';
        attributes: {
          action: 'start' | 'stop';
        };
      }
    | {
        type: 'HvacStart';
        attributes: {
          action: 'start' | 'cancel';
          targetTemperature?: number;
        };
      }
    | {
        type: 'pause-resume';
        attributes: {
          action: 'resume';
        };
      };
};

/**
 * Type of the response when performing a details request of a vehicle.
 * This is the type of the `data` property of the response.
 */
export type VehicleDetails = {
  vin: string;
  registrationDate: string;
  firstRegistrationDate: string;
  engineType: string;
  engineRatio: string;
  modelSCR: string;
  deliveryCountry: {
    code: string;
    label: string;
  };
  family: {
    code: string;
    label: string;
    group: string;
  };
  tcu: {
    code: string;
    label: string;
    group: string;
  };
  navigationAssistanceLevel: {
    code: string;
    label: string;
    group: string;
  };
  battery: {
    code: string;
    label: string;
    group: string;
  };
  radioType: {
    code: string;
    label: string;
    group: string;
  };
  registrationCountry: {
    code: string;
  };
  brand: {
    label: string;
  };
  model: {
    code: string;
    label: string;
    group: string;
  };
  gearbox: {
    code: string;
    label: string;
    group: string;
  };
  version: {
    code: string;
  };
  energy: {
    code: string;
    label: string;
    group: string;
  };
  bodyType: {
    code: string;
    label: string;
    group: string;
  };
  steeringSide: {
    code: string;
    label: string;
    group: string;
  };
  registrationNumber: string;
  vcd: string;
  assets: {
    assetType: string;
    viewpoint: string;
    renditions: {
      resolutionType: string;
      url: string;
    }[];
  }[];
  yearsOfMaintenance: number;
  deliveryDate: string;
  retrievedFromDhs: boolean;
  radioCode: string;
};

/**
 * Type of the response when performing a details request of a list of vehicles.
 * This is the type of the `data` property of the response.
 */
export type VehicleDetailsExtended = {
  vin: string;
  registrationDate: string;
  firstRegistrationDate: string;
  engineType: string;
  engineRatio: string;
  modelSCR: string;
  deliveryCountry: {
    code: string;
    label: string;
  };
  family: {
    code: string;
    label: string;
    group: string;
  };
  tcu: {
    code: string;
    label: string;
    group: string;
  };
  navigationAssistanceLevel: {
    code: string;
    label: string;
    group: string;
  };
  battery: {
    code: string;
    label: string;
    group: string;
  };
  radioType: {
    code: string;
    label: string;
    group: string;
  };
  registrationCountry: {
    code: string;
  };
  brand: {
    label: string;
  };
  model: {
    code: string;
    label: string;
    group: string;
  };
  gearbox: {
    code: string;
    label: string;
    group: string;
  };
  version: {
    code: string;
  };
  energy: {
    code: string;
    label: string;
    group: string;
  };
  bodyType: {
    code: string;
    label: string;
    group: string;
  };
  steeringSide: {
    code: string;
    label: string;
    group: string;
  };
  registrationNumber: string;
  vcd: string;
  assets: {
    assetType: string;
    viewpoint: string;
    renditions: {
      resolutionType: string;
      url: string;
    }[];
  }[];
  yearsOfMaintenance: number;
  deliveryDate: string;
  retrievedFromDhs: boolean;
  radioCode: string;
};
