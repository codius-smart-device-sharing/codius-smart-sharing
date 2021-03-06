import { deviceConstants } from '../constants';
import { IAction, Device, User } from '../models';
import { DeviceService } from '../services';
import { alertActions } from './alert.actions';
import { Dispatch } from 'redux';

// Interfaces for the models
interface IDeviceActions
{
    get: (user: User) => ((dispatch: Dispatch<any>) => void),
    add: (device: Device, devicePassword: string) => ((dispatch: Dispatch<any>) => void),
    remove: (device: Device) => ((dispatch: Dispatch<any>) => void),
    getHealth: (device: Device) => ((dispatch: Dispatch<any>) => void),
    updateDevice: (device: Device, devicePassword: string) => ((dispatch: Dispatch<any>) => void)
}

// Export the user actions
export const deviceActions: IDeviceActions =
{
    get: get,
    add: add,
    remove: remove,
    getHealth: getHealth,
    updateDevice: updateDevice
};

function get(user: User): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) => 
    {
        dispatch(<IAction> {
            type: deviceConstants.GET_DEVICES_REQUEST
        });

        try
        {
            const devices: Array<Device> = await DeviceService.get(user);

            dispatch(<IAction> {
                type: deviceConstants.GET_DEVICES_SUCCESS,
                devices: devices
            });

            dispatch(alertActions.success('Get Devices Success'));
        }
        catch (error)
        {
            // Dispatch error actions
            dispatch(<IAction> {
                type: deviceConstants.GET_DEVICES_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Error retrieving devices'));
        }
    }
}

// Function to create register device -- setup the device with the contract as well
function add(device: Device, devicePassword: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) => 
    {
        dispatch(<IAction> {
            type: deviceConstants.ADD_DEVICE_REQUEST,
            device: device
        });

        // Check type for this response
        try
        {
            // Should be a post so no real response
            const { success } = await DeviceService.setupDevice(device, devicePassword);

            // If setup failed then the device should not be added to the backend
            if (!success)
            {
                throw new Error('Could not setup the device correctly');
            }

            const devices: Array<Device> = await DeviceService.add(device);

            // Send success dispatches
            dispatch(<IAction> {
                type: deviceConstants.ADD_DEVICE_SUCCESS,
                devices: devices
            });

            // Dispatch the sucess
            dispatch(alertActions.success('Add Device Success'));
        }
        catch (error)
        {
            // Dispatch error actions
            dispatch(<IAction> {
                type: deviceConstants.ADD_DEVICE_ERROR,
                error: error.toString()
            });
            dispatch(alertActions.error('Add Device Failure'));

            // Try a get devices -- this is just to avoid all the devices leaving
            dispatch(deviceActions.get(device.owner as User));
        }
    }
}

function remove(device: Device): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: deviceConstants.REMOVE_DEVICE_REQUEST,
            device: device
        });

        try
        {
            // User the service to login
            const devices: Array<Device> = await DeviceService.remove(device);

            dispatch(<IAction> {
                type: deviceConstants.REMOVE_DEVICE_SUCCESS,
                devices: devices
            });

            dispatch(alertActions.success('Device Remove Success'));        
        }
        catch (error)
        {
            dispatch(<IAction> {
                type: deviceConstants.REMOVE_DEVICE_ERROR,
                error: error.toString()
            });

            dispatch(alertActions.error('Device Remove Error'));
        }
    }
}

function getHealth(device: Device): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        dispatch(<IAction> {
            type: deviceConstants.GET_DEVICE_HEALTH_REQUEST,
            device: device
        });

        try
        {
            const healthy: boolean = await DeviceService.healthCheck(device.contractURL);

            dispatch(<IAction> {
                type: deviceConstants.GET_DEVICE_HEALTH_SUCCESS,
                health: healthy,
                device: device
            });

            dispatch(alertActions.success('Get health success'));
        }
        catch (error)
        {
            console.error(error);

            dispatch(<IAction> {
                type: deviceConstants.GET_DEVICE_HEALTH_ERROR,
                device: device,
                error: error.toString()
            });

            dispatch(alertActions.error('Get health Error'));
        }
    }
}

function updateDevice(device: Device, devicePassword: string): (dispatch: Dispatch<any>) => void
{
    return async (dispatch: Dispatch<any>) =>
    {
        // Call the update service -- follow with a get
        dispatch(<IAction> {
            type: deviceConstants.POST_UPDATE_DEVICE_REQUEST,
            device: device
        });

        try
        {
            const newDevices: Array<Device> = await DeviceService.updateDevice(device, devicePassword);

            // Can dispatch the get devices, since this is essentially doing the same thing
            dispatch(<IAction> {
                type: deviceConstants.GET_DEVICES_SUCCESS,
                devices: newDevices
            });

            dispatch(alertActions.success('Get health success'));
        }
        catch (error)
        {
            console.error(error);

            dispatch(<IAction> {
                type: deviceConstants.POST_UPDATE_DEVICE_ERROR,
                device: device,
                error: error.toString()
            });

            dispatch(alertActions.error('Get health Error'));
        }
    }
}