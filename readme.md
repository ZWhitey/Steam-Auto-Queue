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

# Advence Usage (for fully automatic)

1. Rename `config_template.json` to `config.json`
2. Edit `account`, `password` and `shared_secret` in `config.json`
3. Run script `node index.js`

# What is shared_secret

`shared_secret` is for generate steam 2FA code, if you don't want to generate 2FA code automatically just put empty string in `shared_secret`.

This [link](https://www.reddit.com/r/SteamBot/comments/3xb1ft/finding_shared_secret_identity_secret_required/) will help your find your `shared_secret`.

# Todo

1. Support multiple account