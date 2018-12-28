package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/getlantern/systray"
	"github.com/tso/sc2-auto-scene-switcher/proxy/icon"
)

func handler(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(fmt.Sprintf("http://localhost:6119%s", r.URL))
	if err != nil {
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, string(body))
}

func startHttpServer() *http.Server {
	srv := &http.Server{Addr: ":6118"}
	http.HandleFunc("/ui", handler)
	http.HandleFunc("/game", handler)

	go func() {
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe(): %s", err)
		}
	}()

	return srv
}

func main() {
	srv := startHttpServer()
	onExit := func() {
		if err := srv.Shutdown(nil); err != nil {
			panic(err)
		}
	}

	systray.Run(onReady, onExit)
}

func onReady() {
	systray.SetIcon(icon.Data)
	systray.SetTitle("Sc2 Client Proxy")
	systray.SetTooltip("Sc2 Client Proxy")

	mQuitOrig := systray.AddMenuItem("Quit", "Quit")
	go func() {
		<-mQuitOrig.ClickedCh
		systray.Quit()
	}()
}
