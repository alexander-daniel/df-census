# df census
an electron app for viewing information about your dwarves

## usage
- get `dfhack`
- copy `dwarf-census.lua` into your `df/hack/scripts/` directory
- when you fire up dfhack and have a fortress open, run the script in dfhack `dwarf-census`
- this will create a JSON dump of your dwarves information
- fire up the electron app and point it at the JSON dump file, and it'll watch for changes
- each time you run `dwarf-census` ind `dfhack` it'll update when you refresh the electron app

## TODO
- add websockets to viewer app so that changes are automatically propagated.
- better design
- use `dfhack` API for file access in lua script
- create build scripts for electron app and create releases
