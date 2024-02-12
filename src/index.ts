// Import any required dependencies
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  Account,
  ActionEndpoint,
  ActionEndpointVersion2,
  OwnershipInfo,
  VehicleDataEndpoint,
  VehicleDataEndpointVersion,
  VehicleDataEndpointVersion1,
  VehicleDataEndpointVersion2,
  VehicleDetails,
} from './type';

/**
 * Represents an API for Renault services.
 */
class MyRenaultAPI {
  // Define everything we need to make requests
  private email: string;
  private password: string;

  // Define the Gigya API
  private gigyaBaseUrl: string;
  private gigyaApiKey: string;
  private gigyaCookie?: string;
  private expirationTime: number; // Everybody is using 900 here, so will I.
  private lastLoginTime?: number; // Because we tried to don't make too many requests to Gigya.

  // Define the Kamareon API
  private country: string;
  private kamareonBaseUrl: string;
  private kamareonApiKey: string;
  private gigyaJWToken?: string;
  private gigyaPersonId?: string;
  private ownerPersonId?: string; // Seems that it can be equal to gigyaPersonId in some cases, not in my case.
  private accountType: Account;

  /**
   * Create an instance of MyRenaultAPI.
   * @constructor
   * @param {string} email - The email address of the account.
   * @param {string} password - The password of the account.
   * @param {string} region - The region of the account.
  //  * @param {string} vin - The VIN of the vehicle.
   * @param {AccountType} accountType - The type of the account. Default is 'MYRENAULT'.
   */
  constructor(
    email: string,
    password: string,
    country: string,
    // vin: string,
    accountType: Account = 'MYRENAULT',
  ) {
    this.email = email;
    this.password = password;
    this.country = country;
    // this.vin = vin;

    // Define the Gigya API
    this.gigyaBaseUrl = 'https://accounts.eu1.gigya.com';
    this.gigyaApiKey =
      '3_4LKbCcMMcvjDm3X89LU4z4mNKYKdl_W0oD9w-Jvih21WqgJKtFZAnb9YdUgWT9_a';
    this.expirationTime = 900;

    // Define the Kamareon API
    this.kamareonBaseUrl =
      'https://api-wired-prod-1-euw1.wrd-aws.com/commerce/v1';
    this.kamareonApiKey = 'YjkKtHmGfaceeuExUDKGxrLZGGvtVS0J';
    this.accountType = accountType;
  }

  private async getGigyaCookie() {
    // Define the URL
    const gigyaCookieUrl = `${this.gigyaBaseUrl}/accounts.login?apiKey=${this.gigyaApiKey}&include=data&loginID=${this.email}&password=${this.password}`;

    // Make the request
    const gigyaCookieResponse = await axios.get(gigyaCookieUrl);

    // Handle the response
    switch (gigyaCookieResponse.data.statusCode) {
      case 403:
        throw new Error('Invalid email or password');
      case 200:
        if (gigyaCookieResponse.data.isActive === false)
          throw new Error('Account is not active');
        this.gigyaCookie = gigyaCookieResponse.data.sessionInfo.cookieValue;
        this.gigyaPersonId = gigyaCookieResponse.data.data.personId;
        break;
      default:
        throw new Error('Unknown error');
    }
  }

  private async getGigyaJWToken() {
    // Define the URL
    const gigyaJWTokenUrl = `${this.gigyaBaseUrl}/accounts.getJWT?apiKey=${this.gigyaApiKey}&oauth_token=${this.gigyaCookie}&login_token=${this.gigyaCookie}&fields=data.personId,data.gigyaDataCenter&expiration=${this.expirationTime}`;

    // Make the request
    const gigyaJWTokenResponse = await axios.get(gigyaJWTokenUrl);

    // Handle the response
    switch (gigyaJWTokenResponse.data.statusCode) {
      case 200:
        this.gigyaJWToken = gigyaJWTokenResponse.data.id_token;
        this.lastLoginTime = Date.now();
        break;
      default:
        throw new Error('Unknown error');
    }
  }

  private async getOwnerPersonId() {
    // Define the URL
    const ownerPersonIdUrl = `${this.kamareonBaseUrl}/persons/${this.gigyaPersonId}?country=${this.country}`;

    // Define the headers
    const ownerPersonIdHeaders = {
      apikey: this.kamareonApiKey,
      'x-gigya-id_token': this.gigyaJWToken,
    };

    // Make the request
    const ownerPersonIdResponse = await axios.get(ownerPersonIdUrl, {
      headers: ownerPersonIdHeaders,
    });

    // Handle the response
    switch (ownerPersonIdResponse.status) {
      case 200:
        this.ownerPersonId = ownerPersonIdResponse.data.accounts.find(
          (account: { accountType: string; accountStatus: string }) =>
            account.accountType === this.accountType &&
            account.accountStatus === 'ACTIVE',
        ).accountId;
        break;
      default:
        throw new Error('Unknown error');
    }
  }

  /**
   * Login to Gigya.
   * @param {boolean} force - Whether to force the login or not.
   * @returns A promise that resolves when the login is done.
   * @throws An error if the login failed.
   */
  public async login(force?: boolean) {
    if (!force && this.lastLoginTime) {
      const timeSinceLastLogin = Date.now() - this.lastLoginTime;
      if (timeSinceLastLogin < this.expirationTime * 1000) {
        return;
      }
    }
    await this.getGigyaCookie();
    await this.getGigyaJWToken();
    await this.getOwnerPersonId();
    this.lastLoginTime = Date.now();
  }

  /**
   * Get the details of the vehicle.
   * @param {string} vin - The VIN of the vehicle.
   * @returns A promise that resolves when the request is done.
   * @throws An error if the request failed.
   */
  public async getVehicleDetails(
    vin: string,
  ): Promise<VehicleDetails | undefined> {
    // Define the URL
    const vehicleDetailsUrl = `${this.kamareonBaseUrl}/accounts/${this.ownerPersonId}/vehicles/${vin}/details?country=${this.country}`;

    // Define the headers
    const vehicleDetailsHeaders = {
      apikey: this.kamareonApiKey,
      'x-gigya-id_token': this.gigyaJWToken,
    };

    try {
      // Make the request
      const vehicleDetailsResponse: AxiosResponse = await axios.get(
        vehicleDetailsUrl,
        {
          headers: vehicleDetailsHeaders,
        },
      );

      // Check for success status codes
      if (
        vehicleDetailsResponse.status >= 200 &&
        vehicleDetailsResponse.status < 300
      ) {
        return vehicleDetailsResponse.data as VehicleDetails;
      }
    } catch (error: any) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 400:
        case 401:
          throw new Error('Unauthorized');
        case 429:
          throw new Error('Too many requests');
        case 500:
          throw new Error('Internal server error'); // It can be "Too many requests", renault api is very limited and unstable
        default:
          throw new Error('Unknown error');
      }
    }
  }

  public async getVehiclesDetails(): Promise<OwnershipInfo[] | undefined> {
    // Define the URL
    const vehiclesDetailsUrl = `${this.kamareonBaseUrl}/accounts/${this.ownerPersonId}/vehicles?country=${this.country}`;

    // Define the headers
    const vehiclesDetailsHeaders = {
      apikey: this.kamareonApiKey,
      'x-gigya-id_token': this.gigyaJWToken,
    };

    try {
      // Make the request
      const vehiclesDetailsResponse: AxiosResponse = await axios.get(
        vehiclesDetailsUrl,
        {
          headers: vehiclesDetailsHeaders,
        },
      );

      // Check for success status codes
      if (
        vehiclesDetailsResponse.status >= 200 &&
        vehiclesDetailsResponse.status < 300
      ) {
        return vehiclesDetailsResponse.data.vehicleLinks as OwnershipInfo[];
      }
    } catch (error: any) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 400:
        case 401:
          throw new Error('Unauthorized');
        case 429:
          throw new Error('Too many requests');
        case 500:
          throw new Error('Internal server error'); // It can be "Too many requests", renault api is very limited and unstable
        default:
          throw new Error('Unknown error');
      }
    }
  }

  /**
   * Get the vehicle data.
   * @param {string} vin - The VIN of the vehicle.
   * @param {VehicleDataEndpoint} endpoint - The endpoint to get the data from.
   * @returns A promise that resolves when the request is done.
   * @throws An error if the request failed.
   */
  public async getVehicleData(vin: string, endpoint: VehicleDataEndpoint) {
    // Define the version of the endpoint
    const versionEndpoint: VehicleDataEndpointVersion = Object.values(
      VehicleDataEndpointVersion2,
    ).includes(endpoint as any)
      ? 'v2'
      : 'v1';

    // Define the URL
    const vehicleDataUrl = `${this.kamareonBaseUrl}/accounts/${this.ownerPersonId}/kamereon/kca/car-adapter/${versionEndpoint}/cars/${vin}/${endpoint}?country=${this.country}`;

    // Define the headers
    const vehicleDataHeaders = {
      apikey: this.kamareonApiKey,
      'x-gigya-id_token': this.gigyaJWToken,
    };

    try {
      // Make the request
      const vehicleDataResponse = await axios.get(vehicleDataUrl, {
        headers: vehicleDataHeaders,
      });

      return vehicleDataResponse.data;
    } catch (error: any) {
      // Handle the response
      switch (error.response.status) {
        case 501:
          throw new Error('Not implemented');
        case 401:
          throw new Error('Unauthorized');
        case 429:
          throw new Error('Too many requests');
        case 500:
          throw new Error('Internal server error'); // It can be "Too many requests", renault api is very limited and unstable
        default:
          throw new Error('Unknown error');
      }
    }
  }

  /**
   * Get the vehicle capabilities.
   * @param {string} vin - The VIN of the vehicle.
   * @returns A promise that resolves when the request is done.
   * @throws An error if the request failed.
   */
  public async getVehicleCapabilities(vin: string) {
    // Define an array of endpoints based on the VehicleDataEndpoint enum
    const endpoints: VehicleDataEndpoint[] = [
      ...(Object.values(VehicleDataEndpointVersion1) as VehicleDataEndpoint[]),
      ...(Object.values(VehicleDataEndpointVersion2) as VehicleDataEndpoint[]),
    ];

    // Check if the login is still valid
    await this.getVehicleDetails(vin);

    // Check every endpoint and return the ones that are implemented
    const implementedEndpoints = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          await this.getVehicleData(vin, endpoint);
          return endpoint;
        } catch (error) {
          return null;
        }
      }),
    );
    return implementedEndpoints.filter((endpoint) => endpoint !== null);
  }

  /**
   * Post an action to the vehicle.
   * @param {string} vin - The VIN of the vehicle.
   * @param {ActionEndpoint} endpoint - The endpoint to post the action to.
   * @param {VehicleActionData} data - The data to post.
   */
  public async postVehicleAction(
    vin: string,
    endpoint: ActionEndpoint,
    data: any,
  ) {
    // Define the version of the endpoint
    const versionEndpoint: VehicleDataEndpointVersion =
      endpoint in ActionEndpointVersion2 ? 'v2' : 'v1';

    // Define the URL
    const vehicleActionUrl = `${this.kamareonBaseUrl}/accounts/${this.ownerPersonId}/kamereon/kca/car-adapter/${versionEndpoint}/cars/${vin}/actions/${endpoint}?country=${this.country}`;

    // Define the headers
    const vehicleActionHeaders = {
      apikey: this.kamareonApiKey,
      'x-gigya-id_token': this.gigyaJWToken,
      'Content-Type': 'application/vnd.api+json',
    };

    try {
      // Make the request
      const vehicleActionResponse = await axios.post(vehicleActionUrl, data, {
        headers: vehicleActionHeaders,
      });

      return vehicleActionResponse.data;
    } catch (error: any) {
      // Handle the response
      switch (error.reponse.status) {
        case 401:
          throw new Error('Unauthorized');
        case 429:
          throw new Error('Too many requests');
        default:
          throw new Error('Unknown error');
      }
    }
  }
}

// Export the main class as the default export
export default MyRenaultAPI;
