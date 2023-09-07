# OrdConnect

OrdConnect is a JavaScript library for interacting with wallet management and Bitcoin transactions.

## Installation

You can install OrdConnect via npm or yarn:

```bash
npm install ordconnect
# or
yarn add ordconnect
```
# Usage

##Get Wallet Manager
import { WalletManager } from 'ord-connect';


## Sending Bitcoin (BTC)
send(amount: number, address: string, session: {
        cardinalAddress: string,
        id: string,
        ordinalAddress: string,
        wallet: string,
    } | null);

## Signing PSBTs
signPsbt(params: {
  psbtBase64: string,
  inputsToSign: [{
    address: string,
    signingIndexes: number[], // int array of indexes to sign
  }],
  broadcast: boolean,
}
);

## Bitcoin Kit Functions
All the Bitcoin-related functions available in the btckit library are also accessible through this library. Please refer to the btckit documentation for detailed information on these functions.

## License
This project is licensed under the MIT License.

##Contributing
Contributions are welcome!

## Issues
If you encounter any issues or have suggestions for improvement, please open an issue on the GitHub repository.

## Credits
OrdConnect is developed and maintained by Your Name.

## Acknowledgments
Special thanks to the developers of the btckit library for their contributions and support.