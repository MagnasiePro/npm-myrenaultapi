// Import any required dependencies
import axios from 'axios';
import { AccountType } from './type';

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
  private accountType: AccountType;

  private vin: string; // Vehicle Identification Number

  /**
   * Create an instance of MyRenaultAPI.
   * @constructor
   * @param {string} email - The email address of the account.
   * @param {string} password - The password of the account.
   * @param {string} region - The region of the account.
   * @param {string} vin - The VIN of the vehicle.
   * @param {AccountType} accountType - The type of the account. Default is 'MYRENAULT'.
   */
  constructor(
    email: string,
    password: string,
    country: string,
    vin: string,
    accountType: AccountType = 'MYRENAULT',
  ) {
    this.email = email;
    this.password = password;
    this.country = country;
    this.vin = vin;

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

  public async getVehicleDetails() {
    // Define the URL
    const vehicleDetailsUrl = `${this.kamareonBaseUrl}/accounts/${this.ownerPersonId}/vehicles/${this.vin}/details?country=${this.country}`;

    // Define the headers
    const vehicleDetailsHeaders = {
      apikey: this.kamareonApiKey,
      'x-gigya-id_token': this.gigyaJWToken,
    };

    // Make the request
    const vehicleDetailsResponse = await axios.get(vehicleDetailsUrl, {
      headers: vehicleDetailsHeaders,
    });

    // Handle the response
    switch (vehicleDetailsResponse.status) {
      case 200:
        return vehicleDetailsResponse.data;
        break;
      default:
        throw new Error('Unknown error');
    }
  }

  /**
   * Login to Gigya.
   * @returns A promise that resolves when the login is done.
   * @throws An error if the login failed.
   */
  public async login() {
    try {
      // TODO: Check if the cookie is still valid
      await this.getGigyaCookie();
      await this.getGigyaJWToken();
      await this.getOwnerPersonId();
    } catch (error) {
      console.error('An error occured while logging in:', error);
    }
  }
}

// Export the main class as the default export
export default MyRenaultAPI;
