# Use the gh CLI token (if logged in) so /repositories shows real GitHub stats locally.
GITHUB_TOKEN ?= $(shell gh auth token 2>/dev/null)
export GITHUB_TOKEN

.DEFAULT_GOAL := help
.PHONY: help install dev build preview post project clean

help: ## Show available targets
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk -F ':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	npm ci
	@touch node_modules

install: node_modules ## Install dependencies

dev: node_modules ## Run the dev server with drafts at http://localhost:4321
	npm run dev

build: node_modules ## Type-check and build the site into dist/
	npm run build

preview: build ## Serve the production build locally
	npm run preview

post: ## Create a draft post: make post title="My post title"
	@test -n "$$title" || { echo 'usage: make post title="My post title"'; exit 1; }
	@node scripts/new.mjs post "$$title"

project: ## Create a draft project write-up: make project title="Project name"
	@test -n "$$title" || { echo 'usage: make project title="Project name"'; exit 1; }
	@node scripts/new.mjs project "$$title"

clean: ## Remove build output and caches
	rm -rf dist .astro
