# Vault environment overview 

## Vault frontend:

- git clone https://github.com/LedgerHQ/ledger-vault-front
- npm install
- create .env file with API_BASE_URL=http://localhost:5000 ( url of the gate )
- npm start || npm run starte2e

## Vault backend:
### miscellaneous
- install elasticsearch and run it
- install redis and run it
- install mysql and run it

### ledger-wallet-daemon
- git clone https://github.com/LedgerHQ/ledger-wallet-daemon
- sbt "daemon/run -http.port=:8889 -admin.port=:3335"
### hsm-driver
- git clone https://github.com/LedgerHQ/ledger-vault-hsm-driver
- sbt run
### gate
- git clone https://github.com/LedgerHQ/ledger-vault-api
- python3 -m venv venv
- source venv/bin/activate
- pip install -r requirements.txt
- ./run_debug [compartementId] [workspace_name] ( ex: ./run_debug 1 vault1)

### HSM Simulator
- we use a HSM simulator instead of a real HSM hardware, It's a java server hosted on beta server. The partition of an organization is stored in file `user_1`, `counters_1` for the compartmentId 1
We got one simu per person.

### Starting with a fresh new organization
- Make sure the compartmentId 1 is not used on HSM simu
- make sure `vault1` doesn't exist on HSM-driver
- CREATE database vault1
- ./run_debug 1 vault1
In another term tab on the gate ( with the venv sourced )
- export VAULT_DB_SCHEMA=vault1
- export VAULT_WORKSPACE=vault1
- export VAULT_COMPARTMENT_ID=1
- ./run_update.sh init

it will create the SQL schema and create the init data AND it will register the gate to the HSM-driver, it will also create the wallet pool on the daemon for this organization. If you restart the gate or the HSM-driver, you need to re-register so run
./run_update init_register

## Running tests:
### frontend:
- npm run test

#### e2e tests
- Go to gate/test/integration
- python2.7 -m virtualenv venv_integration
- source venv_integration/bin/activate
- pip install -r requirements
- FLASK_RUN_PORT=5001 FLASK_APP=deviceapi.py flask run
-  npm run starte2e to set NODE_ENV to e2e, so the front instanciate the VaultDeviceHTTP instead of VaultDeviceApp ( http calls instead of APDU calls)
- on the frontend, `cypress open`

Please note software device are not isomorphic with hardware device yet ( it's a bug on the software impl ), meaning if you onboard with software, you won't be able to log in with a real hardware device after

The device api expose a route `POST /switch-device` with `{ device_number: 1}` as data to tell it which device it should use ( `device_number: 1 | 2 | 3 | 4.....| 15`)

### Gate
#### Integration tests
- Go to gate/test/integration
- python2.7 -m virtualenv venv_integration
- source venv_integration/bin/activate
- pip install -r requirements
- python test_onboarding --quorum 2
- python ...other scripts


## Troubleshootings

### invalid ecpy version
If you get an error during the pip install of the gate venv_integration saying ( ecpy 0.9 expect python3, you must use the .whl provided by Franck )
### Invalid challenge
 error invalid challenge, it could mean a lot of things, including a bad secp256k1 lib version
install it on the gate side ( both in normal env, and venv_integration ) with

`SECP_BUNDLED_EXPERIMENTAL=1 pip install --no-cache-dir --no-binary secp256k1 secp256k1`

## Onboarding process:

The onboarding process is quite complex.
The first step consist in generating a wrapping key. 3 devices are used to generate some kind of key that will encrypt the partitions of the organization. ( You can use 3 times the same device to save time ).
The HSM open a secure ECDA channel with the devices. Internally, we call 2 methods on the device. The first is openSession with the ephemeral_pub_key and ephemeral_certificate. After the openSession we do a generateKeyCompoonent.

If the backend returns an error when we try to get the channel, it usually means that the compartmentId is already used.
If the device does not respond ( u2f_timeout ) it means the certificate on the device and on the HSM don't match.

The second step is registering the administrators. An challenge is signed by every devices. If we get an error to get the challenge, it means the HSM-driver has already a partition for this organization. The HSM-driver identifies the
partition with the workspace name. To register the an admin, we perform a u2f_register on the device. Be aware that the params  you send to u2f_register ( name, workspace, domain, role) must be exactly the same you send to u2f_authenticate, otherwise
it will not match and you won't be able to login.

The next step consist in choosing the administration scheme. Device is not involved in this step.

The next step is to sign in with all the administrators. You get a challenge, and sign it with all the devices. The method on the device is u2f_authenticate. If you an incorrect data, it means you didn't use the same arguments that you used during the u2f-register

Finally, you get to generate the master seed. Technically it is the exact same process of generating the wrapping key. Opening a secure channel, calliing openSession et generateKeyComponent. Only `scriptHash` param in `openSession` and `isWrappingKey` in `generateKeyComponent` differ. ( you can use 3 times the same devices to make it faster )

Once the onboarding is done you can finally login to the vault with one device. Internally, it does a u2f login between the device and the front. The HSM is not involved. The gate store the keyHandle of each devices during the onboarding and generates a challenge 
and verify the signature. The process of the login is:
- getting the pub_key of the device
- ask a challenge to the gate for this pubkey
- u2f_authenticate on the device
- post the signature


## Using the front without devices:

Thanks to the device soft API, you can use the vault without any hardware devices. Run the deviceapi as explained above. Every time you need to switch device, just call the route POST /switch-device

## Tips on the front:

- all the APDU calls are made in VaultDeviceApp ( VaultDeviceHTTP for software ).
    - the transport layer responds with the status at the end of a response ( 9000 for a success ), so you need to get rid of it before sending it to HSM ( otherwise you could get bytes_overflow issue on the HSM driver)
- restlay is used to handle the data flow ( except on onboarding/login )

### u2f_register
`u2f_register` method on device is a bit tricky. We are limited by u2f transport. The response cannot be too long, and the response expected by the HSM is too long for it, because it must contain a certificate. Firstly, we split the data to send to the device in small chunks. But we have to do a little trick on the response also. 
- make an APDU to get the device certificate
- make the u2f_register
- insert inside the u2f_register response the certificate
```
        const device = await await createDevice();
        const { pubKey } = await device.getPublicKey(U2F_PATH, false);
        const confidentiality = await device.getPublicKey(CONFIDENTIALITY_PATH);
        const validation = await device.getPublicKey(VALIDATION_PATH);
        const attestation = await device.getAttestationCertificate();

        const { u2f_register, keyHandle } = await device.register(
          Buffer.from(this.props.challenge, "base64"),
          APPID_VAULT_ADMINISTRATOR,
          organization.name,
          organization.workspace,
          organization.domain_name,
          "Administrator"
        );
        const attestationOffset = 67 + u2f_register.readInt8(66);

        const u2f_register_attestation = Buffer.concat([
          u2f_register.slice(0, attestationOffset),
          Buffer.from([attestation.length]),
          attestation,
          u2f_register.slice(attestationOffset)
        ]);

        const validation_attestation = Buffer.concat([
          attestation,
          validation.signature
        ]);
        const confidentiality_attestation = Buffer.concat([
          attestation,
          confidentiality.signature
        ]);

        const data = {
          u2f_register: u2f_register_attestation.toString("hex"),
          pub_key: pubKey,
          key_handle: keyHandle.toString("hex"),
          validation: {
            public_key: validation.pubKey,
            attestation: validation_attestation.toString("hex")
          },
          confidentiality: {
            public_key: confidentiality.pubKey,
            attestation: confidentiality_attestation.toString("hex")
          },
          first_name: this.props.data.first_name,
          last_name: this.props.data.last_name,
          email: this.props.data.email,
          picture: this.props.data.picture
        };
```
### account and operation creation
When an user wants to create an account or an operation. A session has to be opened with hsm. this 
happens in the component DeviceAuthenticate. 
When the entity is created it goes to pending where it waits for approvals. The conponent reponsible for this is EntityApprove.
