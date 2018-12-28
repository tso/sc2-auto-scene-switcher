# Sc2 Client Proxy

This program is a system tray application which proxies requests from
`localhost:6118/ui` to `localhost:6119/ui` and `localhost:6118/game` to
`localhost:6119/game`. The only modification to the response it makes is
to add `Access-Control-Allow-Origin="*"` as a header.
