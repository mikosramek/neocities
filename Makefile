sitename = allmanorofduns

publish:
	@echo "Building..."
	npm run build
	@echo "-----------------------"
	@echo "Publishing..."
	npm run publish
	@echo "Done!"
	@echo "-----------------------"
	@echo "$(sitename).neocities.org"
	neocities info $(sitename)
	