.PHONY: install uninstall list doctor clean

# oh-my-cursor — Makefile installer
# Usage: make install (from cloned repo, targeting another project)
#   PROJECT=/path/to/your/project make install
# Or from within the oh-my-cursor repo itself:
#   make install

OMC_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
PROJECT ?= $(shell git rev-parse --show-toplevel 2>/dev/null || pwd)
TARGET_DIR := $(PROJECT)/.cursor/rules
RULES_DIR := $(OMC_DIR)rules

RULES := $(wildcard $(RULES_DIR)/*/*.mdc)

install: ## Install all rules into the project
	@echo ""
	@echo "  oh-my-cursor installer"
	@echo ""
	@echo "  Source:  $(OMC_DIR)"
	@echo "  Target:  $(PROJECT)"
	@echo ""
	@mkdir -p "$(TARGET_DIR)"
	@count=0; \
	for src in $(RULES); do \
		basename=$$(basename "$$src" .mdc); \
		dest="$(TARGET_DIR)/omc-$$basename.mdc"; \
		cp "$$src" "$$dest"; \
		echo "  + omc-$$basename.mdc"; \
		count=$$((count + 1)); \
	done; \
	echo ""; \
	echo "  Installed $$count rules"
	@mkdir -p "$(PROJECT)/.omc-cursor"
	@if [ -f "$(PROJECT)/.gitignore" ]; then \
		grep -q ".omc-cursor" "$(PROJECT)/.gitignore" || echo ".omc-cursor/" >> "$(PROJECT)/.gitignore"; \
	fi
	@echo ""
	@echo "  Open Cursor and start using role-based prompts."
	@echo ""

uninstall: ## Remove all omc rules from the project
	@echo "Removing omc rules from $(TARGET_DIR)..."
	@rm -f "$(TARGET_DIR)"/omc-*.mdc
	@echo "Done."

list: ## List available rules
	@echo ""
	@echo "  Available rules:"
	@echo ""
	@for src in $(RULES); do \
		rel=$$(echo "$$src" | sed "s|$(RULES_DIR)/||"); \
		echo "    $$rel"; \
	done
	@echo ""

doctor: ## Check installation status
	@echo ""
	@echo "  oh-my-cursor doctor"
	@echo ""
	@[ -d "$(PROJECT)/.cursor" ] \
		&& echo "  ✓ .cursor/ exists" \
		|| echo "  ✗ .cursor/ missing"
	@[ -d "$(TARGET_DIR)" ] \
		&& echo "  ✓ .cursor/rules/ exists" \
		|| echo "  ✗ .cursor/rules/ missing"
	@count=$$(ls "$(TARGET_DIR)"/omc-*.mdc 2>/dev/null | wc -l | tr -d ' '); \
		echo "  ℹ $$count omc rules installed"
	@[ -f "$(PROJECT)/.cursorrules" ] \
		&& echo "  ✓ .cursorrules exists" \
		|| echo "  ✗ .cursorrules missing"
	@echo ""

clean: ## Remove .omc-cursor state directory
	@rm -rf "$(PROJECT)/.omc-cursor"
	@echo "Cleaned .omc-cursor/ state directory."

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'
