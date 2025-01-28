/**
 * Enum representing different brand API endpoints.
 */
export type Account = 'MYRENAULT' | 'MYDACIA' | 'MYALPINE';
// TODO: Check if MYDACIA and MYALPINE are correct names (I don't have any account to test)
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
  ChargeSchedule = 'charge-schedule',
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
        type: 'ChargeMode';
        attributes: {
          action: 'schedule_mode' | 'always' | 'always_schedule';
        };
      };
};

/**
 * Type of the response when performing a details request of a list of vehicles.
 * This is the type of the `data` property of the response.
 */
type OwnershipStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'; // TODO: Check if this is correct

export interface ConnectedDriver {
  role: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface InstallSoftware {
  id: string;
  userStatus: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface Country {
  code: string;
  label?: string;
  group?: string;
}

export interface AssetRendition {
  resolutionType: string;
  url: string;
}

export interface Asset {
  assetType: string;
  viewpoint: string;
  renditions: AssetRendition[];
}

export interface VehicleDetails {
  vin: string;
  registrationDate: string;
  firstRegistrationDate: string;
  engineType: string;
  engineRatio: string;
  modelSCR: string;
  deliveryCountry: Country;
  family: Country;
  tcu: Country;
  navigationAssistanceLevel: Country;
  battery: Country;
  radioType: Country;
  registrationCountry: Country;
  brand: Country;
  model: Country;
  gearbox: Country;
  version: Country;
  energy: Country;
  bodyType: Country;
  steeringSide: Country;
  registrationNumber: string;
  vcd: string;
  assets: Asset[];
  yearsOfMaintenance: number;
  connectivityTechnology: string;
  easyConnectStore: boolean;
  electrical: boolean;
  rlinkStore: boolean;
  deliveryDate: string;
  retrievedFromDhs: boolean;
  engineEnergyType: string;
  radioCode: string;
}

export interface OwnershipInfo {
  brand: string;
  vin: string;
  status: OwnershipStatus;
  linkType: string;
  garageBrand: string;
  startDate: string;
  createdDate: string;
  lastModifiedDate: string;
  ownershipStartDate: string;
  ownershipEndDate: string;
  cancellationReason: Record<string, never>; // Modify as needed
  connectedDriver: ConnectedDriver;
  installSoftware: InstallSoftware;
  vehicleDetails: VehicleDetails;
}
