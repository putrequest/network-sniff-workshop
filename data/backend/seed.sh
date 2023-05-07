#!/bin/sh

echof() {
	local colorReset="\033[0m"
	local prefix="$1"
	local message="$2"

	case "$prefix" in
		header) msgpfx="[\e[1;95mSeeder\e[m]" color="";;
		act) msgpfx="[\e[1;97m=\e[m]" color="\033[0;34m";;
		info) msgpfx="[\e[1;92m*\e[m]" color="";;
		ok) msgpfx="[\e[1;93m+\e[m]" color="\033[0;32m";;
		error) msgpfx="[\e[1;91m!\e[m]" color="\033[0;31m";;
		*) msgpfx="" color="";;
	esac

	echo -e "$msgpfx$color $message $colorReset"
}

set_language() {
	echof info "Determining the language"
	if [ "$LANGUAGE" = "en" ]; then
		echof info "Language is English"
	elif [ "$LANGUAGE" = "pl" ]; then
		echof info "Language is Polish"
	else
		echof error "Language is not supported: $LANGUAGE"
		echof error "Supported languages: en, pl"
		echof error "Please set LANGUAGE environment variable"
		echof error "Exiting..."
		exit 1
	fi
}

seed_data() {
	echof info "Seeding data for language: $LANGUAGE"
	if [ "$LANGUAGE" = "en" ]; then
		echof info "Seeding English data"
		if cp -r /data/en/* /var/uploads; then
			echof ok "Successful!"
		else
			echof error "Seeding English data failed"
		fi
	elif [ "$LANGUAGE" = "pl" ]; then
		echof info "Seeding Polish data"
		if cp -r /data/pl/* /var/uploads; then
			echof ok "Successful!"
		else
			echof error "Seeding Polish data failed"
		fi
	fi
}

main() {
	echof header "Starting..."
	set_language
	seed_data
}

main "$*"
