# sc2-auto-scene-switcher
StreamLabs OBS SC2 Auto Scene Switcher

Reason we need proxy: Since the streamlabs plugin is served as js/html we need
to have cross origin requests allowed (specifically
`Access-Control-Allow-Origin="*"`) for our starcraft 2 client api.
Unfortunately I have no control over the starcraft 2 client api, so instead
I've written a proxy which is very simple and adds that header for our client.

TODO:
- Make this less forceful (e.g. only transition to out of game scene if we were _just_ in a game)
