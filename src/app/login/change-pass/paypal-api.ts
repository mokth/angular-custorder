declare const paypal: any;

export function PaypalButton() {
    paypal.Button.render({

        // Set your environment

        env: 'sandbox', // sandbox | production

        // Specify the style of the button

        style: {
            label: 'pay',
            size: 'small', // small | medium | large | responsive
            shape: 'rect',   // pill | rect
            color: 'gold'   // gold | blue | silver | black
        },

        // PayPal Client IDs - replace with your own
        // Create a PayPal app: https://developer.paypal.com/developer/applications/create

        client: {
            sandbox: 'AYbrkucvnPBFbJavnW--hWsrpjntGL2-rVTyQWIRqM_zdL5kQAmloRYgIvJrpXkuSreGd2itN1iVr1gX',
            production: '<insert production client id>'
        },

        // Wait for the PayPal button to be clicked

        payment: function (data, actions) {
            return actions.payment.create({
                payment: {
                    transactions: [
                        {
                            amount: { total: '0.01', currency: 'USD' }
                        }
                    ]
                }
            });
        },

        // Wait for the payment to be authorized by the customer

        onAuthorize: function (data, actions) {
            return actions.payment.execute().then(function () {
                window.alert('Payment Complete!');
            });
        }

    }, '#paypal-button-container');
}
