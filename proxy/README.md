I'm using go purely because it's easy to write a simple proxy server and
compile to windows from my mac.

I use port 6118 as sc2 uses 6119.

Build using something like `env GOOS=windows GOARCH=386 go build -o sc2_proxy.exe main.go`.
