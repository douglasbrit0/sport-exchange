package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nats-io/nats.go"
)

func main() {
	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = "nats://nats:4222"
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "7002"
	}

	// HTTP health
	r := chi.NewRouter()
	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})
	go http.ListenAndServe(":"+port, r)

	// NATS subscribe (JetStream or core)
	nc, err := nats.Connect(natsURL, nats.Name("reconciler"))
	if err != nil {
		log.Fatalf("nats connect: %v", err)
	}
	defer nc.Close()

	subj := "signals.fair_value"
	log.Printf("reconciler listening on %s", subj)
	_, err = nc.Subscribe(subj, func(m *nats.Msg) {
		log.Printf("received %s: %s", m.Subject, string(m.Data))
	})
	if err != nil {
		log.Fatalf("subscribe: %v", err)
	}

	// Keep alive
	for {
		time.Sleep(10 * time.Second)
	}
}
