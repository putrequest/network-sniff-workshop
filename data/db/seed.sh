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

wait_for_postgres() {
	echof info "Waiting for PostgreSQL to start"
	while ! nc -z localhost 5432; do
		sleep 0.1
	done
	echof info "PostgreSQL ready!"

	echof info "Waiting for backend to start"
	while ! nc -z backend 8080; do
		sleep 0.1
	done
	echof info "Backend ready!"
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

check_db() {
	echof info "Checking if credentials are correct"
	if psql -U $POSTGRES_USER -d $POSTGRES_DB -c '\q' &>/dev/null ; then
		echof info "Credentials are correct"
	else
		echof error "Credentials are incorrect"
		echof error "Exiting..."
		exit 1
	fi
}

seed_data() {
	echof info "Seeding data for language: $LANGUAGE"
	if [ "$LANGUAGE" = "en" ]; then
		echof info "Seeding English data"
		psql -U $POSTGRES_USER -d $POSTGRES_DB -c "COPY users FROM '/data/en/users.csv' DELIMITER ',' CSV HEADER;"
		psql -U $POSTGRES_USER -d $POSTGRES_DB -c "COPY profiles FROM '/data/en/profiles.csv' DELIMITER ',' CSV HEADER;"
		echof ok "Successful!"
	elif [ "$LANGUAGE" = "pl" ]; then
		echof info "Seeding Polish data"
		psql -U $POSTGRES_USER -d $POSTGRES_DB -c "COPY users FROM '/data/pl/users.csv' DELIMITER ',' CSV HEADER;"
		psql -U $POSTGRES_USER -d $POSTGRES_DB -c "COPY profiles FROM '/data/pl/profiles.csv' DELIMITER ',' CSV HEADER;"
		echof ok "Successful!"
	fi
}

main() {
	echof header "Starting..."
	wait_for_postgres
	set_language
	check_db
	seed_data
}

main "$*"
