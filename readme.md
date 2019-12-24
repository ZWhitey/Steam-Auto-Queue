# Steam Auto Queue

This script can help you finish Steam Discovery Queue (Winter sales 2019) automatically.

# Installation

1. Install [Node.js](https://nodejs.org)
2. Clone this repos
3. Install dependencies via `npm install`

# Basic Usage

1. Run script `node index.js`
2. Follow instructions enter your account, password and 2FA code
3. Wait a second
4. You have got your cards

# Advenced Usage (for fully automatic and multiple accounts)

1. Rename `config_template.json` to `config.json`
2. Edit `account`, `password` and `shared_secret` in `config.json`
3. Run script `node index.js`
4. Wait a minute
5. You have got your cards

# What is shared_secret

`shared_secret` is for generate steam 2FA code, if you don't want to generate 2FA code automatically just set `shared_secret` value to `""`.

*If `shared_secret` set to `""`, you need to enter 2FA code manually.*

This [link](https://www.reddit.com/r/SteamBot/comments/3xb1ft/finding_shared_secret_identity_secret_required/) will help you find your `shared_secret`.

# Config

Put all your accounts info into `config.json`

Config file format:

```json
[
    {
        "account": "YOUR_ACCOUNT_1",
        "password": "YOUR_PASSWORD_1",
        "shared_secret": "YOUR_Shared_Secret_1"
    },
    {
        "account": "YOUR_ACCOUNT_2",
        "password": "YOUR_PASSWORD_2",
        "shared_secret": "YOUR_Shared_Secret_2"
    },
    {
        "account": "YOUR_ACCOUNT_3",
        "password": "YOUR_PASSWORD_3",
        "shared_secret": "YOUR_Shared_Secret_3"
    },
    ...
]
```

# Todo

~~1. Support multiple account~~
