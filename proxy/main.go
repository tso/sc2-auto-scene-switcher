package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(fmt.Sprintf("http://localhost:6119%s", r.URL))
	if err != nil {
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, string(body))
}

func main() {
	http.HandleFunc("/ui", handler)
	http.HandleFunc("/game", handler)
	log.Fatal(http.ListenAndServe(":6118", nil))
}
