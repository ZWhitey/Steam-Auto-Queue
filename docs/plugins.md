# Plugins

plugins file format:

```json
[
  {
    "name": "YOUR_PLUGINS_NAME",
    "script": "YOUR_SCRIPT_FILE_NAME",
    "enable": "true or false", // true -> enable plugin, false -> disable plugin
    "data": {
      "EVERYTHING YOUR NEED TO PASS TO PLUGIN"
    }

  },
  {
    "name": "steam-awards-2021",
    "script": "autovote.js",
    "enable": true,
    "data": {
      "votes": [
        { "voteid": "61", "appid": "892970" },
        { "voteid": "62", "appid": "1358140" },
        { "voteid": "63", "appid": "570" },
        { "voteid": "64", "appid": "892970" },
        { "voteid": "65", "appid": "1551360" },
        { "voteid": "66", "appid": "1097200" },
        { "voteid": "67", "appid": "1325200" },
        { "voteid": "68", "appid": "1382330" },
        { "voteid": "69", "appid": "1091500" },
        { "voteid": "70", "appid": "1135690" }
      ]
    }
  }
]
```

# Plugin data

## autocard

Without any parameter
Since steam only give 1 card every day, I removed `remain`.

## autovote

Default parameter:
```json
"data": {
  "votes": [
    { "voteid": "61", "appid": "892970" },
    { "voteid": "62", "appid": "1358140" },
    { "voteid": "63", "appid": "570" },
    { "voteid": "64", "appid": "892970" },
    { "voteid": "65", "appid": "1551360" },
    { "voteid": "66", "appid": "1097200" },
    { "voteid": "67", "appid": "1325200" },
    { "voteid": "68", "appid": "1382330" },
    { "voteid": "69", "appid": "1091500" },
    { "voteid": "70", "appid": "1135690" }
  ]
}
```

Steam awards 2021 got 10 awards need to vote, each awards got their own `voteid`.
```
61 -> GAME OF THE YEAR
62 -> VR GAME OF THE YEAR
63 -> LABOR OF LOVE
64 -> BETTER WITH FRIENDS
65 -> OUTSTANDING VISUAL STYLE
66 -> MOST INNOVATIVE GAMEPLAY
67 -> BEST GAME YOU SUCK AT
68 -> BEST SOUNDTRACK
69 -> OUTSTANDING STORY-RICH GAME
70 -> SIT BACK AND RELAX
```

Steam awards 2022 got 11 awards need to vote, each awards got their own `voteid`.
```
72 -> GAME OF THE YEAR AWARD
73 -> VR GAME OF THE YEAR AWARD
74 -> LABOR OF LOVE AWARD
75 -> BETTER WITH FRIENDS AWARD
76 -> OUTSTANDING VISUAL STYLE AWARD
77 -> MOST INNOVATIVE GAMEPLAY AWARD
78 -> BEST GAME YOU SUCK AT AWARD
79 -> BEST SOUNDTRACK AWARD
80 -> OUTSTANDING STORY-RICH GAME AWARD
81 -> SIT BACK AND RELAX AWARD
82 -> BEST GAME ON THE GO AWARD
```
You can custom your vote by change appid to which game you want to vote.

## Steam awards 2022

Default parameter:
```json
"data": {
      "nominates": [
      { "nominatedid": "1332010", "categoryid": "72" },
      { "nominatedid": "1692250", "categoryid": "73" },
      { "nominatedid": "440", "categoryid": "74" },
      { "nominatedid": "1604030", "categoryid": "75" },
      { "nominatedid": "534380", "categoryid": "76" },
      { "nominatedid": "1817070", "categoryid": "77" },
      { "nominatedid": "1245620", "categoryid": "78" },
      { "nominatedid": "1372110", "categoryid": "79" },
      { "nominatedid": "1593500", "categoryid": "80" },
      { "nominatedid": "1702330", "categoryid": "81" },
      { "nominatedid": "1862520", "categoryid": "82"}
      ]
    }
```

Steam awards 2022 got 11 awards need to nominate, each awards got their own `nominatedid`.
```
72 -> GAME OF THE YEAR AWARD
73 -> VR GAME OF THE YEAR AWARD
74 -> LABOR OF LOVE AWARD
75 -> BETTER WITH FRIENDS AWARD
76 -> OUTSTANDING VISUAL STYLE AWARD
77 -> MOST INNOVATIVE GAMEPLAY AWARD
78 -> BEST GAME YOU SUCK AT AWARD
79 -> BEST SOUNDTRACK AWARD
80 -> OUTSTANDING STORY-RICH GAME AWARD
81 -> SIT BACK AND RELAX AWARD
82 -> BEST GAME ON THE GO AWARD
```
You can custom your nominate by change appid to which game you want to vote.