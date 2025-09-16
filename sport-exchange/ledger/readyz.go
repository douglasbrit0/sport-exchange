package main

import (
	"database/sql"
	"net/http"

	_ "github.com/lib/pq"
)

func readyzHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(); err != nil {
			w.WriteHeader(503)
			w.Write([]byte("unready"))
			return
		}
		w.WriteHeader(200)
		w.Write([]byte("ok"))
	}
}
