# Open Brewery CLI — run without typing bun
# Usage: make brew [breweries list|search|random|get|meta] [args...]
# Examples:
#   make brew
#   make brew list --per-page 10
#   make brew search sierra
#   make brew random --size 3
#   make brew get 10-barrel-brewing-san-diego

BREW_CLI_DIR := packages/openbrewery-cli
BREW_BIN := $(BREW_CLI_DIR)/dist/openbrewery-cli
BREW_JS := $(BREW_CLI_DIR)/dist/index.js

# Prefer standalone binary (no Bun at runtime); fallback to bun run
ifneq ($(wildcard $(BREW_BIN)),)
  BREW_RUN := $(BREW_BIN)
else
  BREW_RUN := bun run packages/openbrewery-cli/src/index.ts
endif

# make brew [args...] → list 5 by default; otherwise forward args to "breweries"
.PHONY: brew
brew:
	@$(BREW_RUN) breweries $(or $(filter-out brew,$(MAKECMDGOALS)),list --per-page 5)

# Dummy targets so "make brew search sierra" doesn't try to build targets "search" and "sierra"
%:
	@:

# Build standalone binary (run once; then "make brew" needs no Bun at runtime)
.PHONY: build-brew
build-brew:
	cd $(BREW_CLI_DIR) && bun run compile

# Install binary to ~/.local/bin so you can run "openbrewery-cli" from anywhere
.PHONY: install-brew
install-brew: build-brew
	@mkdir -p ~/.local/bin
	cp $(BREW_BIN) ~/.local/bin/openbrewery-cli
	chmod +x ~/.local/bin/openbrewery-cli
	@echo "Installed. Run: openbrewery-cli breweries list"
