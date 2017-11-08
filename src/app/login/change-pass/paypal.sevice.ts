export class PaypalService {
    constructor() { }

    // You can bind do paypal's button with type definitions in the following way:
    public Button: {
        render: ({ payment, onAuthorize }: {
            payment?: (data: any, actions: any) => void,
            onAuthorize?: (data: any, actions: any) => void
        }, divId: string) => void
    } = (window as any).paypal.Button;
}