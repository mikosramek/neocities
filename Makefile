
publish:
	@echo "Building..."
	npm run build
	@echo "-----------------------"
	@echo "Publishing..."
	npm run publish
	@echo "Done!"
	@echo "-----------------------"
	@echo "allmanorofduns.neocities.org"
	neocities info allmanorofduns
	