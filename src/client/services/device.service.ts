import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { User, Device, AccessType } from '../models';
import Config from '../config';

// Abstract since totally static class
export abstract class DeviceService
{
    // Static async method to get all the companies
    public static async get(user: User): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            params: user
        };

        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response
            const response: AxiosResponse = await axios.get(`${Config.apiUrl}/devices`, requestOptions);

            // Return the devices for this user
            return response.data.devices;
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async add(device: Device): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: device
        };

        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response
            await axios.post(`${Config.apiUrl}/devices`, requestOptions);
            return await this.get(device.owner as User);
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    // Fix this method to pass the signed in user instead -- this is not secure
    public static async remove(device: Device): Promise<any>
    {
        // Create the options for the request -- type?
        const requestOptions: any =
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(device)
        };

        // Try catch for the new Async-Await structure -- hopefully works
        try
        {
            // Await the response
            await axios.delete(`${Config.apiUrl}/devices`, requestOptions);

            // Return the updated devices for this user -- should another get request occur?
            return await this.get(device.owner as User);
        }
        catch (error)
        {
            // Log the error
            console.error(error);
        }
    }

    public static async healthCheck(contractURL: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try
        {
            const response = await axios.get(`${contractURL}/health`, requestOptions);

            // Return the health of this device
            return response.data.healthy;
        }
        catch (error)
        {
            // Log any errors -- add error handling later?
            console.error(error);
        }
    }

    public static async setupDevice(device: Device, devicePassword: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                password: devicePassword
            }
        };

        try
        {
            const response: AxiosResponse = await axios.post(`${device.contractURL}/device/setup`, requestOptions);

            return response.data;
        }
        catch (error)
        {
            // As always need better error handling
            console.error(error);
        }
    }

    public static async updateDevice(device: Device, devicePassword: string): Promise<any>
    {
        const requestOptions: any =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: device
        };

        try
        {
            // Call the setup route if the contract URL was updated
            await this.setupDevice(device, devicePassword);
            await axios.post(`${Config.apiUrl}/devices/update`, requestOptions);

            // Return the updated devices for this user -- should another get request occur?
            return await this.get(device.owner as User);
        }
        catch (error)
        {
            console.error(error);
        }
    }
}