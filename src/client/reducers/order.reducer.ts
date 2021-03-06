import { orderConstants } from '../constants';
import { OrderPageState, IAction, AccessType, DeviceCategory } from '../models';

const initState: OrderPageState = {
    device: {
        name: '',
        code: '',
        contractURL: '',
        accessType: AccessType.PRIVATE,
        deviceCategory: DeviceCategory.COMPUTE
    },
    actions: [],
    priceInfo: {
        price: 0.00,
        baseCurrency: 'USD'
    },
    assetScale: 1,
    infoFields: [],
    canOrder: false,
    ordering: false,
    ordered: false,
    supportedMethods: []
};

export function order(state: OrderPageState = initState, action: IAction): OrderPageState
{
    // Go through possible states for authentication
    switch (action.type)
    {
        case orderConstants.GET_ACTIONS_REQUEST:
            return <OrderPageState> {
                ...state,
                ordered: false,
                ordering: false,
                canOrder: false
            };
        case orderConstants.GET_ACTIONS_SUCCESS:
            return <OrderPageState> {
                ...state,
                actions: action.actions
            };
        case orderConstants.GET_ACTIONS_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        case orderConstants.GET_INFO_SUCCESS:
            return <OrderPageState> {
                ...state,
                infoFields: action.info
            };
        case orderConstants.GET_INFO_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        case orderConstants.GET_PRICE_SUCCESS:
            return <OrderPageState> {
                ...state,
                priceInfo: action.priceInfo,
                assetScale: action.assetScale
            };
        case orderConstants.GET_PRICE_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        case orderConstants.GET_SUPPORTEDMETHODS_SUCCESS:
            return <OrderPageState> {
                ...state,
                supportedMethods: action.supportedMethods
            };
        case orderConstants.GET_SUPPORTEDMETHODS_ERROR:
            return <OrderPageState> {
                ...state,
                supportedMethods: []
            };
        case orderConstants.GET_CAN_ORDER_SUCCESS:
            return <OrderPageState> {
                ...state,
                canOrder: action.canOrder
            };
        case orderConstants.GET_CAN_ORDER_ERROR:
            return <OrderPageState> {
                ...state,
                canOrder: false
            };
        case orderConstants.PAY_INVOICE_REQUEST:
            return <OrderPageState> {
                ...state,
                ordering: true,
                ordered: false
            }
        case orderConstants.PAY_INVOICE_SUCCESS:
            return <OrderPageState> {
                ...state,
                receipt: action.receipt,
                ordered: true,
                ordering: false
            };
        default:
            return state;
    }
}