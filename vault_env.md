# Vault environment overview 

## Vault frontend:

- `git clone git@github.com:LedgerHQ/ledger-vault-front.git`
- `npm install`
- create .env file with `API_BASE_URL=http://localhost:5000` (url of the gate )
- `npm start || npm run starte2e`

## Vault backend:

### Preparation
- install elasticsearch and run it
- install redis and run it
- install mysql and run it
  - Follow [these instructions](https://trac.macports.org/wiki/howto/MySQL) if using MacPorts
  - Make sure the option `skip-networking` is not set in your cnf files otherwise your port will be `0` instead of `3306`
  - Using an empty password for `root` will be simpler, and since it's just for your local tests, it should be okay
- have sbt and java 8 + jdk 1.8 installed
- have python 2.7 and 3.7 installed
- install automake, pkg-config, libtool, libffi, and gmp
- When installing `gmp` make sure its libs are in `/usr/local/lib/`. If they are not, you can perform a manual installation [as described here](https://stackoverflow.com/a/29448476)

### ledger-wallet-daemon
- `git clone git@github.com:LedgerHQ/ledger-wallet-daemon.git`
- `cp daemon/src/main/resources/application.conf.sample daemon/src/main/resources/application.conf`
- `sbt "daemon/run -http.port=:8889 -admin.port=:3335"`
- If you get an error about missing objects, make sure you have the right version of java installed (java 8)
- Expect to see `TraceId= [INFO] DaemonCacheModule$ : Synchronization finished, elapsed time: 41 milliseconds`

### hsm-driver
- `git clone git@github.com:LedgerHQ/ledger-vault-hsm-driver.git`
- `cp src/main/resources/application.conf.dev src/main/resources/application.conf`
- `mkdir certificate && cp src/main/resources/clientHsm.pfx certificate/`
- You need to create users and databases on your mysql instance
```bash
$ mysql -u root -p
mysql> GRANT ALL PRIVILEGES ON *.* TO 'vault'@'localhost' IDENTIFIED BY 'vault';
mysql> exit;
$ mysql -u vault -p
mysql> CREATE DATABASE hsm_driver;
mysql> SHOW VARIABLES WHERE variable_name = 'port'; # make sure it's 3306
```
- `sbt run`
- Expect to see `[INFO] Server$ : Startup complete, server ready.`
- If `Error in custom provider, java.sql.SQLTransientConnectionException: users_db - Connection is not available, request timed out after 1003ms` then either mysql is not running, or vault user does not exist, or hsm_driver db does not exist, or the port is wrong.

### gate
- `git clone git@github.com:LedgerHQ/ledger-vault-api.git`
- `python3 -m venv venv`
- `source venv/bin/activate`
- Install `autoconf`
- `SECP_BUNDLED_EXPERIMENTAL=1 pip install --no-cache-dir --no-binary secp256k1 secp256k1`
- `pip install -r requirements.txt`
- Create a new db `ledger1` for user `root` and make sure user `root` has an empty password (see configuration/vault_conf.yaml:DEVELOPMENT_WITH_DB)
- Create a new db `vault1` for user `vault` and make sure user `vault` has password `vault` (see env.dev:VAULT_DB_*)
- ./run_debug.sh [compartementId] [workspace_name] ( ex: ./run_debug.sh 1 vault1)
- Expect to see `* Debugger is active!`

### HSM Simulator
- we use a HSM simulator instead of a real HSM hardware, It's a java server hosted on beta server. The partition of an organization is stored in file `user_1`, `counters_1` for the compartmentId 1
We got one simu per person.

You first need a ssh tunel access to beta. For example in `~/.ssh/config`:
```
Host hsm-flo
 ServerAliveInterval 300
 ServerAliveCountMax 2
 HostName beta.vault.ledger.fr
 User florent
 LocalForward 11111 127.0.0.1:11111
```
`ssh hsm-flo`

There is a tmux session on beta. In order to launch the simu and create user you can do:
```
sudo su franck
tmux attach -d
```
You will see a tab `hsm-flo`, If you stop the process and  run `ls`, you will see a lot of `counters_*` and `user_*` files. It represent the partitions. If you want to start from scratch you can delete all this files. Then launch `./run.sh`.
Then you go the tab `hsm-cli` ( `Ctrl-b 3` ). 
Then launch `python 000_createUser.py --adminurl http://localhost:11112/processAdmin`. Launch it as many times as you need users. 

`hsm-flo` runs on port `11111`, and we opened a ssh tunel on `11111 -> 127.0.0.1:11111` so in your hsm-driver configuration, you need to set `127.0.0.1:11111` as your hsm endpoint. Remember that your ssh connexion must remain active. As a result when you run `ssh hsm-flo`, **don't close the tab on the terminal**.
`11112` is the admin port. It is used by tests file, especially to create new user on the HSM ( `000_createUser.py` )

### Starting with a fresh new organization
- Make sure the compartmentId 1 is not used on HSM simu
- make sure `vault1` doesn't exist on HSM-driver. If it exists, you can `rm -rf hsm_state.db`, it removes all the partitions
- `CREATE database vault1;`
- `./run_debug 1 vault1`
In another term tab on the gate ( with the venv sourced )
- `export VAULT_DB_SCHEMA=vault1`
- `export VAULT_WORKSPACE=vault1`
- `export VAULT_COMPARTMENT_ID=1`
- `./run_update.sh init`

it will create the SQL schema and create the init data AND it will register the gate to the HSM-driver, it will also create the wallet pools on the daemon for this organization. If you restart the gate or the HSM-driver, you need to re-register so run
`./run_update.sh init_register`

## Running tests:
### frontend:
- npm run test

#### e2e tests
- Go to gate/test/integration
- python2.7 -m virtualenv venv_integration
- source venv_integration/bin/activate
- pip install -r requirements.txt
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
- pip install -r requirements.txt
- python test_onboarding --quorum 2
- python ...other scripts


## Troubleshootings

### invalid ecpy version
If you get an error during the pip install of the gate venv_integration saying ( ecpy 0.9 expect python3, you must use the .whl provided by Franck )
### Invalid challenge
 error invalid challenge, it could mean a lot of things, including a bad secp256k1 lib version.
This is the proper way to install it it on the gate ( both in normal env, and venv_integration ) with

`SECP_BUNDLED_EXPERIMENTAL=1 pip install --no-cache-dir --no-binary secp256k1 secp256k1`

## Onboarding process:

The onboarding process is quite complex.
The first step let you generate a wrapping key. 3 devices are used to generate some kind of key that will encrypt the partitions of the organization. ( You can use 3 times the same device to save time ).
The HSM open a secure ECDA channel with the devices. Internally, we call 2 methods on the device. The first is `openSession` with the `ephemeral_pub_key` and `ephemeral_certificate`. After the `openSession` we do a `generateKeyComponent`.

If the backend returns an error when we try to get the channel, it usually means that the compartmentId is already used.
If the device does not respond ( u2f_timeout ) it means the certificate on the device and on the HSM don't match.

In the second step you register the administrators. One challenge is signed by every devices. If we get an error to get the challenge, it probably means the HSM-driver has already a partition for this organization, so it refuses to add aministrator on a non-blank partition. The HSM-driver identifies the partition with the workspace name. To register an admin, we perform a `u2f_register` on the device. Be aware that the params  you send to u2f_register ( name, workspace, domain, role) must be exactly the same you send to `u2f_authenticate`, otherwise it will not match and you won't be able to login.

The next let you the administration scheme. Device is not involved in this step. If you set a `quorum` of 2 out of 3 administrators registered, it means account will have to approved by 2 admins in order to be created.

The next step is to sign in with all the administrators. You get a challenge, and sign it with all the devices. The method on the device is u2f_authenticate. If you an incorrect data, it means you didn't use the same arguments that you used during the u2f-register. Note you need to sign-in with all admins ( technically only n of m admin ) because you are about to generate the master seed. Before every sensitive operations on the vault, we need to open a *compound session*.

Finally, you get to generate the master seed. Technically it is the exact same process of generating the wrapping key. Opening a secure channel, calling `openSession` et `generateKeyComponent`. Only `scriptHash` param in `openSession` and `isWrappingKey` in `generateKeyComponent` differ. ( you can use 3 times the same devices to make it faster ). Again, if the device does not responds, it's probably an issue with certificate ( between devices and HSM ).

Once the onboarding is done, you can finally login to the vault with one device. Internally, it does a u2f login between the device and the front. The HSM is not involved. The gate stored the keyHandle of each devices during the onboarding and generates a challenge and verify the signature. The process of the login is:
- getting the pub_key of the device
- ask a challenge to the gate for this pubkey
- u2f_authenticate on the device
- post the signature


## Using the front without devices:

Thanks to the device soft API, you can use the vault without any hardware devices. Run the deviceapi as explained above. Every time you need to switch device, just call the route `POST /switch-device` with a `device_number` value. Run webpack with `npm run starte2e` instead of `npm start`. 

## Tips on the front:

- all the APDU calls are made in **VaultDeviceAPP** ( VaultDeviceHTTP for software ).
    - the transport layer responds with the status at the end of a response ( 9000 for a success ), so you need to get rid of it before sending it to HSM ( otherwise you could get bytes_overflow issue on the HSM driver)
- restlay is used to handle the data flow ( except on onboarding/login )
- material-ui is used for UI components
- i18next for the translation. The yml files are locates in `locales` folder.

### before pushing
- `npm run lint`
- `npm run flow`
- `npm run test`

### u2f_register
`u2f_register` method on device is a bit tricky. We are limited by u2f transport. The payload and the response cannot be too long, and the response expected by the HSM is quite long, because it must contain a certificate. Firstly, we split the data to send to the device in small chunks. But we have to do a little trick on the response also:
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
When an user wants to create an account or an operation, a session has to be opened with hsm. this 
happens in the component `DeviceAuthenticate`. 
When the entity is created it goes to pending where it waits for approvals. The conponent reponsible for this is `EntityApprove`.
