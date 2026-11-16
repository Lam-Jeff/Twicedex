/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2419140845")

  // update collection data
  unmarshal({
    "name": "confirmed_hashes"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2419140845")

  // update collection data
  unmarshal({
    "name": "confirmed_hashed"
  }, collection)

  return app.save(collection)
})
