# sc2-auto-scene-switcher

This is a StreamLabs OBS app which polls the StarCraft II Client API to
determine what the current streamer is doing in StarCraft (In game? In a
replay? Out of game?) and transitions to the desired scene.


## How to use

Add the app in StreamLabs OBS and run the program to proxy requests. You can
download the proxy program [here][2]. It will run in your system tray with this
icon: ![logo][logo].

You'll probably get some security warning about untrusted code for the proxy.
If you know how I can solve that for people let me know!


## Why do we need this weird proxy thing?

Streamlabs OBS apps are served as HTML/JS on a different origin than the
StarCraft II Client API, so we're forced to respect [CORS][1]. I'm unsure
of any way of getting around this other than having a program proxy requests
to the StarCraft II Client API and adding the header
`Access-Control-Allow-Origin="*"` to the response.


[1]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[2]: https://github.com/tso/sc2-auto-scene-switcher/releases/tag/v0.0.9
[logo]: https://raw.githubusercontent.com/getlantern/systray/master/example/icon/icon.png
