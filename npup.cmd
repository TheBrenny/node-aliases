@IF [%1]==[] (
    @echo You must pass a valid version tag (through to npm version)
    @exit 1
)

npm version %1 && git push && git push --tags && npm publish

@echo All done!