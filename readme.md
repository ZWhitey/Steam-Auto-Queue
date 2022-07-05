# Steam Auto Queue

[![ESLint](https://github.com/ZWhitey/Steam-Auto-Queue/actions/workflows/eslint.yml/badge.svg?branch=master)](https://github.com/ZWhitey/Steam-Auto-Queue/actions/workflows/eslint.yml)

This script can help you finish Steam events automatically.

# What's new in v2

* Plugins support

   I used to create a new scripts to every new event, until I found steam reuse event every year, you only need to change some parameter to finish new event, so I decide to rewrite my scripts to plugins and use config file to give parameter.

# Plugins & Support Event
1. autocard
    * discovery queue in summer / winter sales
2. autovote
    * vote steam awards
3. steam racing 2022
    * get `2022 Steam Racing Fest Cup` badge
4. clorthax quest
    * get `Clorthax's Paradox Party` Badge
    * get Steam 3000 `Profile Modifier` , `Profile Background`, `Mini Profile Background`, `Avatar Profile Frame`, `Animated Avatar` and `Stickers`

# Tested Event 
1. autocard 
    * Winter sales 2019
    * Summer sales 2020
    * Winter sales 2020
    * Summer sales 2021
    * Winter sales 2021
    * Summer sales 2022

2. autovote
    * Steam awards 2021

3. steam racing 2022

4. clorthax quest (summer sales 2022 event)

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

# Custom plugins
   check out [here](https://github.com/ZWhitey/Steam-Auto-Queue/blob/master/docs/plugins.md)

# Todo

1. Rewrite other scripts I have created to plugin. 
    1. [steam-auto-spring-cleaning](https://github.com/ZWhitey/steam-auto-spring-cleaning)

