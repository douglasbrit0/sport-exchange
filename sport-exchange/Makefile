COMPOSE=docker compose -f infra/local/docker-compose.yml -f infra/local/docker-compose.override.yml


.PHONY: up down restart logs smoke health nats-setup e2e ps


up:
	$(COMPOSE) up -d --build


ps:
	$(COMPOSE) ps


logs:
	./scripts/tail_all.sh


health:
	./scripts/check_health.sh


smoke:
	./scripts/smoke_quote.sh 123


nats-setup:
	./scripts/nats_setup.sh


restart:
	$(COMPOSE) down && $(COMPOSE) up -d --build


down:
	$(COMPOSE) down -v


e2e:
	./scripts/e2e_test.sh