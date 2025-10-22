const { send, src } = require("../..");
const { split } = require("../../common");
const { log } = require("../../commonServer");
module.exports.execute = async (...args) => {
    let map = args.join(" ");
    if (map.includes(":")) map = split(map, ":", 1)[0];
    map = MAPS[map];
    log("map reached:", map)
    if (!map?.length) send("web", "ws", "2kki", null)
    else send("web", "ws", "2kki", map.at(-1));
    return [0, ""];
}

const MAPS = {
  "Urotsuki's Room": [],
  "Art Gallery": [
    "https://yume.wiki/images/b/b2/2kki-artgallerymap.png"
  ],
  "Atlantis": [
    "https://yume.wiki/images/9/96/Atlantiscity.png",
    "https://yume.wiki/images/f/f9/2kki-atlantismap.png"
  ],
  "Blood World": [
    "https://yume.wiki/images/c/ce/Blood_World_Map.png"
  ],
  "Apartments": [
    "https://yume.wiki/images/5/57/ApartmentsMap.png",
    "https://yume.wiki/images/e/ec/ApartmentsBasement.png"
  ],
  "Bathhouse": [],
  "Abandoned Chinatown": [],
  "Black Building": [],
  "Binary World": [
    "https://yume.wiki/images/6/60/Map0642.png",
    "https://yume.wiki/images/0/03/Map0643.png"
  ],
  "Aquatic Cafe": [
    "https://yume.wiki/images/a/a0/Map0852.png"
  ],
  "Alien Cellar": [],
  "Blob Desert": [
    "https://yume.wiki/images/3/32/Blob_desert_map.png"
  ],
  "Aquamarine Cave": [
    "https://yume.wiki/images/c/c9/Aquamarine_cave_map.png"
  ],
  "Beetle Forest": [
    "https://yume.wiki/images/c/ce/Beetle_Forest_Map.png"
  ],
  "Ancient Crypt": [
    "https://yume.wiki/images/3/3a/Map1037.png"
  ],
  "Aquatic Cube City": [
    "https://yume.wiki/images/8/89/Aquaticcubecity.png"
  ],
  "Broken Faces Area": [
    "https://yume.wiki/images/8/8b/2kki-map-brkface-big.png"
  ],
  "Bowling Zone": [
    "https://yume.wiki/images/8/86/Map0236.png"
  ],
  "Bug Maze": [
    "https://yume.wiki/images/8/85/2kki-bugmaze.png"
  ],
  "Blue Forest": [
    "https://yume.wiki/images/d/d7/Blue_Forest.png"
  ],
  "Boogie Street": [],
  "Botanical Garden": [
    "https://yume.wiki/images/6/6c/Btgardenmap_2.png"
  ],
  "Broken City": [],
  "Bridged Swamp Islands": [
    "https://yume.wiki/images/e/e4/Dark_swamp_world.png"
  ],
  "Candy World": [
    "https://yume.wiki/images/f/fc/CandyWorldMap.png"
  ],
  "Buried City": [
    "https://yume.wiki/images/b/b7/Buriedcity.png"
  ],
  "Burial Desert": [
    "https://yume.wiki/images/8/8d/Map0733.png"
  ],
  "Chaos Exhibition": [
    "https://yume.wiki/images/6/63/2kki_Map0734_120d_p8.png"
  ],
  "Cat Cemetery": [
    "https://yume.wiki/images/f/fd/CatCemetryMap.png"
  ],
  "Blue Cactus Islands": [
    "https://yume.wiki/images/8/8f/Bluecactus_map.png"
  ],
  "Chalkboard Playground": [
    "https://yume.wiki/images/d/de/MAPChalkboardPlayground.png"
  ],
  "Candy Cane Fields": [
    "https://yume.wiki/images/a/ae/CandyCane_Fields_Map.png"
  ],
  "Celestial Garden": [
    "https://yume.wiki/images/7/7a/Celestial_Garden_map.png"
  ],
  "Chocolate World": [
    "https://yume.wiki/images/d/d3/Chocolateworlds.png"
  ],
  "Christmas World": [
    "https://yume.wiki/images/3/3a/Christmasworld.png"
  ],
  "Closet Pinwheel Path": [
    "https://yume.wiki/images/b/b6/Map0317.png"
  ],
  "Cocktail Lounge": [
    "https://yume.wiki/images/f/ff/2kki-loungemap.png"
  ],
  "Circuit Board": [
    "https://yume.wiki/images/a/a7/Circuit_Board.png",
    "https://yume.wiki/images/0/0a/Circuit_Board1.png"
  ],
  "Cloudy World": [
    "https://yume.wiki/images/6/64/Cloudy_World_Map.png"
  ],
  "Character Plains": [
    "https://yume.wiki/images/a/ab/Character_Plains_map.png"
  ],
  "Cloud Tops": [
    "https://yume.wiki/images/9/9e/Cloud_Tops_updated3.png"
  ],
  "CMYK Tiles World": [
    "https://yume.wiki/images/7/7c/Map0847.png"
  ],
  "Chess World": [
    "https://yume.wiki/images/d/df/Chessworldmap.png"
  ],
  "Clay Statue World": [
    "https://yume.wiki/images/9/9a/Claystatue.png"
  ],
  "City Limits": [
    "https://yume.wiki/images/9/9c/Y2_CityLimits_Map.png"
  ],
  "Cliffside Woods": [],
  "Clover Ponds": [
    "https://yume.wiki/images/b/b6/Cloverpondsup.png",
    "https://yume.wiki/images/5/5c/Cloverpondsunder.png"
  ],
  "Cutlery World": [
    "https://yume.wiki/images/d/de/Cutlerymaparrows.png"
  ],
  "Dark Room": [
    "https://yume.wiki/images/a/a7/Darkroom-0.png"
  ],
  "Concrete World": [
    "https://yume.wiki/images/6/69/ConcreteALowMap.png",
    "https://yume.wiki/images/a/a4/ConcreteAHighMap.png",
    "https://yume.wiki/images/e/e3/ConcreteBMap.png"
  ],
  "Dark Museum": [
    "https://yume.wiki/images/a/a2/2kki-map-dm-3.png"
  ],
  "Dark Forest": [
    "https://yume.wiki/images/f/f7/2kkiDarkForest.png"
  ],
  "Construction Frame Building": [
    "https://yume.wiki/images/1/12/Map0359.png"
  ],
  "Dark Alleys": [
    "https://yume.wiki/images/1/16/Yume_2kki_-_dark_stairs_map.png"
  ],
  "Cog Maze": [
    "https://yume.wiki/images/7/7b/2kki-map-cog3.png"
  ],
  "Daily Toy Box": [],
  "Cultivated Lands": [
    "https://yume.wiki/images/2/28/Map0665.png"
  ],
  "Cyber Maze": [
    "https://yume.wiki/images/b/bd/Cyber_map.png",
    "https://yume.wiki/images/d/d1/CyberMazeExtend.png"
  ],
  "Cyber Bar": [
    "https://yume.wiki/images/8/8c/Cyber_Bar_map.png"
  ],
  "Constellation World": [
    "https://yume.wiki/images/6/64/Constellation_world.png"
  ],
  "Dark Warehouse": [
    "https://yume.wiki/images/7/7c/Map_Dark_Warehouse_119i_4.png"
  ],
  "Container Forest": [
    "https://yume.wiki/images/5/57/Container_forest_map.png"
  ],
  "Cotton Candy Haven": [
    "https://yume.wiki/images/7/7f/Candy-cotton-haven-map.png"
  ],
  "Crimson Labyrinth": [
    "https://yume.wiki/images/1/1b/CrimsonLabyrinthMap2.png"
  ],
  "Dizzy Spirals World": [
    "https://yume.wiki/images/5/55/Dizzy_Spirals_World.png"
  ],
  "Ecstasy World": [
    "https://yume.wiki/images/6/6c/2kki-eyestrainworld.png"
  ],
  "Dream Beach": [],
  "Developer Room": [],
  "Dream Mexico": [
    "https://yume.wiki/images/5/5b/Dream_Mexico_map.png"
  ],
  "Dojo": [],
  "DNA Room": [],
  "Debug Room": [],
  "Dream Bank": [],
  "Despair Road": [
    "https://yume.wiki/images/b/b0/Despair_road_map.png"
  ],
  "Doll House": [],
  "Decrepit Dwellings": [
    "https://yume.wiki/images/5/5c/DecrepitDwellingsMap.png"
  ],
  "Data Stream": [],
  "Dream Park": [
    "https://yume.wiki/images/8/84/Map_annotated.png"
  ],
  "Floating Red Tiles World": [
    "https://yume.wiki/images/4/44/Floating_Red_Tiles_World_Annotated.png"
  ],
  "Elvis Masada's Place": [
    "https://yume.wiki/images/7/7a/Map0213.png"
  ],
  "Farm World": [
    "https://yume.wiki/images/c/c5/Farm_World_map.png"
  ],
  "Exhibition": [
    "https://yume.wiki/images/4/4d/Exhibition_map_updated.png"
  ],
  "Fairy Tale Woods": [],
  "FC Basement": [
    "https://yume.wiki/images/8/81/FCBasementMap.png"
  ],
  "Floating Stones World": [
    "https://yume.wiki/images/e/ef/Floatingstonesmap.png"
  ],
  "Flesh Paths World": [
    "https://yume.wiki/images/4/47/Updated_Flesh_Paths_World_Map.png"
  ],
  "Fabric World": [
    "https://yume.wiki/images/8/85/Fabric_world_map_annotated.png"
  ],
  "Eyeball Archives": [],
  "Flooded Baths": [
    "https://yume.wiki/images/7/72/Map0488.png"
  ],
  "False Shoal": [
    "https://yume.wiki/images/9/96/False_shoal.png"
  ],
  "Escalator": [
    "https://yume.wiki/images/9/9a/Y2_Escalator_Map.png"
  ],
  "Evergreen Woods": [
    "https://yume.wiki/images/2/2e/Map0633.png",
    "https://yume.wiki/images/f/f8/Evergreen_Woods_Annotated.png"
  ],
  "Extraterrestrial Cliffside": [
    "https://yume.wiki/images/7/7c/Strange_poison_fields.png"
  ],
  "Erratic Pillar Lands": [
    "https://yume.wiki/images/6/6b/Erraticpillarsmap.png"
  ],
  "Emerald Cave": [
    "https://yume.wiki/images/f/fa/EmeraldCave.png"
  ],
  "Flooded Dungeon": [
    "https://yume.wiki/images/5/5c/Flooded_Dungeon.png"
  ],
  "Flying Fish World": [
    "https://yume.wiki/images/e/e7/Map0253.png"
  ],
  "Forest World": [
    "https://yume.wiki/images/0/03/Forest_World.png"
  ],
  "Garden World": [
    "https://yume.wiki/images/6/63/2kki_GardenWorldMap.png",
    "https://yume.wiki/images/4/45/2kki_garden_world_chainlink_path_annotated_map.png"
  ],
  "Geometry World": [
    "https://yume.wiki/images/7/77/2kki-GeometryWorldMap.png"
  ],
  "Forest Carnival": [
    "https://yume.wiki/images/8/8c/Forestcav3.png",
    "https://yume.wiki/images/c/ca/Forestcav1.png",
    "https://yume.wiki/images/4/44/Forestcav2.png"
  ],
  "Fountain World": [
    "https://yume.wiki/images/6/65/Fountain_World.png"
  ],
  "GALAXY Town": [],
  "French Street": [
    "https://yume.wiki/images/e/ef/HyoFrenchStreet.png"
  ],
  "Florist": [
    "https://yume.wiki/images/a/a4/2kki-Florist-MainAreaMap.png",
    "https://yume.wiki/images/2/2a/2kki-Florist-NeonPhantasmMap.png"
  ],
  "Galactic Park": [
    "https://yume.wiki/images/1/11/Map0742.png"
  ],
  "Graffiti City": [
    "https://yume.wiki/images/5/5a/Graffcity.png"
  ],
  "Ghost Town": [
    "https://yume.wiki/images/6/65/Ghost_Town_Map.png"
  ],
  "Frigid Meadow": [
    "https://yume.wiki/images/4/4a/Frigid_Meadow_Map.png",
    "https://yume.wiki/images/e/ed/Frigid_Meadow-Frozen_Cavern_Map.png"
  ],
  "Golden Pyramid Path": [
    "https://yume.wiki/images/e/e1/Golden_Pyramid_Path_map.png"
  ],
  "Ghostly Inn": [],
  "Floral Crossroads": [
    "https://yume.wiki/images/4/48/Map1108.png"
  ],
  "Heart World": [
    "https://yume.wiki/images/1/1a/1286842009421.png",
    "https://yume.wiki/images/1/1c/HEARTPANEL.png"
  ],
  "Highway": [
    "https://yume.wiki/images/7/75/2kki-highwaymap.png",
    "https://yume.wiki/images/9/9c/2kkiHighwayParkingLot.png"
  ],
  "Graveyard World": [
    "https://yume.wiki/images/5/57/Graveyardworld.png"
  ],
  "Head Wasteland": [],
  "Gray Road": [
    "https://yume.wiki/images/b/b6/Grayroad232.png"
  ],
  "Sprout World": [
    "https://yume.wiki/images/c/c0/2kki-grassmap.png"
  ],
  "Green Neon World": [
    "https://yume.wiki/images/1/1d/2kki-map-neon.png"
  ],
  "Haniwa Temple": [],
  "Guts World": [
    "https://yume.wiki/images/f/f7/2kki-gutsworld_main.png"
  ],
  "Graffiti Maze": [
    "https://yume.wiki/images/9/9b/Map0120.png"
  ],
  "Hand Fields": [
    "https://yume.wiki/images/5/55/Hand_Fields_map.png"
  ],
  "Haunted Forest Town": [
    "https://yume.wiki/images/6/61/HauntedForestTown.png"
  ],
  "Head World": [
    "https://yume.wiki/images/d/d9/Headworld.png"
  ],
  "High-rise Building": [],
  "Green Tea Graveyard": [],
  "Guardians' Temple": [],
  "Intestines Maze": [
    "https://yume.wiki/images/0/0a/Intestines_maze_map_updated.png"
  ],
  "Japan Town": [
    "https://yume.wiki/images/6/67/HyoJapanTownAnnotated.png"
  ],
  "Hospital": [
    "https://yume.wiki/images/1/1e/Hospital_outskirt_map.png",
    "https://yume.wiki/images/c/cd/2kki_hospital_map.png"
  ],
  "Hourglass Desert": [
    "https://yume.wiki/images/6/66/Hourglassdesertmap-annotated.png",
    "https://yume.wiki/images/b/b7/2kki-pyramid2.png"
  ],
  "Library": [
    "https://yume.wiki/images/4/4d/Librarymapwork2.png"
  ],
  "Jigsaw Puzzle World": [],
  "Laboratory": [
    "https://yume.wiki/images/7/7e/Laboratory_map_annotated.png",
    "https://yume.wiki/images/6/67/Laboratoryundergroundmap.png"
  ],
  "Industrial Towers": [],
  "Jade Sky Hamlet": [
    "https://yume.wiki/images/7/75/Map0744_(cropped).png"
  ],
  "House Over the Rainbow": [],
  "Ice Floe World": [
    "https://yume.wiki/images/5/54/Ice_floe_world_map.png",
    "https://yume.wiki/images/6/6f/Great_fish_stomach_map.png"
  ],
  "Lamp Passage": [
    "https://yume.wiki/images/f/fb/LampPassageMap.png"
  ],
  "Icy Plateau": [
    "https://yume.wiki/images/4/42/IcyPlateau_Map-2.png"
  ],
  "Infinite Library": [],
  "Indigo Pathway": [
    "https://yume.wiki/images/f/f3/IndigoPathway.png"
  ],
  "Jumbotron Hub": [
    "https://yume.wiki/images/6/6a/Jumbotronhubmap.png"
  ],
  "Marijuana Goddess World": [
    "https://yume.wiki/images/9/9b/Mjgw_map_0120.png"
  ],
  "Magnet Room": [
    "https://yume.wiki/images/5/5b/Magnet_Room.png"
  ],
  "Mini-Maze": [
    "https://yume.wiki/images/c/c7/2kki-minimaze2.png"
  ],
  "Mini-Town": [
    "https://yume.wiki/images/f/f0/MiniTownMap.png"
  ],
  "Mask Shop": [],
  "Lorn Tower": [],
  "Maiden Outlook": [],
  "Mailbox": [
    "https://yume.wiki/images/a/ac/Map0378.png"
  ],
  "Maple Shrine": [
    "https://yume.wiki/images/5/58/MappleMap.png"
  ],
  "Lotus Waters": [
    "https://yume.wiki/images/7/7d/Map0668.png"
  ],
  "Mare Tranquillitatis": [
    "https://yume.wiki/images/0/07/Mare_tranquillitatis.png"
  ],
  "Monkey Mansion": [
    "https://yume.wiki/images/d/d7/Monkey_mansion_map.png",
    "https://yume.wiki/images/e/e6/Map0854_Monkey_Mansion_Basement.png"
  ],
  "Monochromatic Abyss": [
    "https://yume.wiki/images/7/7b/Mono_abyss_map.png"
  ],
  "Misty Bridges": [],
  "Mangrove Forest": [
    "https://yume.wiki/images/e/e8/Mangrove_forest_map.png"
  ],
  "Metallic Plate World": [
    "https://yume.wiki/images/7/7a/Map1109.png"
  ],
  "Nail World": [
    "https://yume.wiki/images/4/48/Nails_World.png",
    "https://yume.wiki/images/c/cc/Rednailpassage.png"
  ],
  "Monochrome Feudal Japan": [
    "https://yume.wiki/images/0/04/Monochrome_Feudal_Japan.png"
  ],
  "Museum": [
    "https://yume.wiki/images/8/86/MuseumMap.png"
  ],
  "Mushroom World": [
    "https://yume.wiki/images/8/80/2kki-map-shroom.png",
    "https://yume.wiki/images/0/0d/White_Mushroom_Field.png"
  ],
  "Monochrome Street": [
    "https://yume.wiki/images/7/7a/2kki-map-monostreet.png"
  ],
  "Never-Ending Hallway": [],
  "Monochrome GB World": [
    "https://yume.wiki/images/7/78/Map0992New.png",
    "https://yume.wiki/images/c/cb/Map1047_GB_Tunnel.png",
    "https://yume.wiki/images/4/47/Map1425_GB_Well.png",
    "https://yume.wiki/images/4/4f/Map0432_Monochrome_GB_World.png",
    "https://yume.wiki/images/8/80/Map0435.png",
    "https://yume.wiki/images/7/7e/Ironcryptmap.png"
  ],
  "Netherworld": [
    "https://yume.wiki/images/8/86/Netherworld.png"
  ],
  "Neon Highway": [
    "https://yume.wiki/images/d/d2/Map0483.png"
  ],
  "Nostalgic House": [],
  "Neon Candle World": [
    "https://yume.wiki/images/4/40/Map0730.png"
  ],
  "Mutant Pig Farm": [
    "https://yume.wiki/images/2/2e/Map0806.png"
  ],
  "Neon Sea": [
    "https://yume.wiki/images/4/4a/Neonsea.png"
  ],
  "Monochrome Mansion": [
    "https://yume.wiki/images/8/86/Monochromemansion.png",
    "https://yume.wiki/images/4/4c/Monochromefields.png",
    "https://yume.wiki/images/5/52/Escherianpassage.png"
  ],
  "Negative Space": [
    "https://yume.wiki/images/f/f6/Negative_space_map.png"
  ],
  "Mountainous Badlands": [
    "https://yume.wiki/images/2/2f/MountainousBadlands.png"
  ],
  "Neon Caves": [
    "https://yume.wiki/images/c/c8/Neon_caves_map.png",
    "https://yume.wiki/images/8/86/Neon_caves_map_annotated.png"
  ],
  "Onyx Tile World": [
    "https://yume.wiki/images/e/e4/Onyx_tile_world_map_120.png"
  ],
  "Ocean Floor": [
    "https://yume.wiki/images/6/6d/Oceanfmap.png"
  ],
  "Othello Board": [],
  "Pencil World": [
    "https://yume.wiki/images/2/2e/Pencwormap1.png"
  ],
  "Polluted Swamp": [
    "https://yume.wiki/images/6/65/Polluted_swamp.png"
  ],
  "Overgrown Condominium": [
    "https://yume.wiki/images/9/9d/Overgrown_Condominium_map.png"
  ],
  "Paradise": [
    "https://yume.wiki/images/e/e6/Paradise_map.png"
  ],
  "Parasite Laboratory": [],
  "Ocean Subsurface": [
    "https://yume.wiki/images/f/f2/Ocean_subsurface_mapwslope.png"
  ],
  "Oriental Lake": [
    "https://yume.wiki/images/b/ba/Orientallake.png",
    "https://yume.wiki/images/6/61/Pagodapagoda.png"
  ],
  "Ocean Storehouse": [
    "https://yume.wiki/images/0/0e/Ocean_storehouse_full.png"
  ],
  "Red Streetlight World": [
    "https://yume.wiki/images/f/f2/Red_streetlight_world_annotated_updated.png",
    "https://yume.wiki/images/0/08/Eldritch_streetlight_zone_map.png"
  ],
  "Power Plant": [],
  "Red City": [],
  "Realistic Beach": [],
  "Red Brick Maze": [
    "https://yume.wiki/images/c/cb/Redbrickmaze.png"
  ],
  "Purple World": [
    "https://yume.wiki/images/1/11/2kki-map-neoonyx-a.png"
  ],
  "Rapeseed Fields": [
    "https://yume.wiki/images/4/42/2kki_Map0667_125b.png"
  ],
  "Red Lily Lake": [
    "https://yume.wiki/images/a/a8/Map0697.png"
  ],
  "Red Rock Caves": [
    "https://yume.wiki/images/0/0a/Redrock_caves1.png"
  ],
  "Red Sky Cliff": [],
  "Rainy Docks": [
    "https://yume.wiki/images/3/34/Map0846A.png"
  ],
  "Psychedelic Stone Path": [
    "https://yume.wiki/images/e/ed/Psychedelic_Stone_Path_Map.png"
  ],
  "Radiant Stones Pathway": [
    "https://yume.wiki/images/4/44/RadiantStonePathwaysMap.png"
  ],
  "Rainbow Tiles Maze": [
    "https://yume.wiki/images/9/91/Rainbow_tiles_maze_map.png"
  ],
  "Sewers": [],
  "Rough Ash World": [
    "https://yume.wiki/images/d/d9/2kki-ashmap1.png"
  ],
  "Scenic Outlook": [
    "https://yume.wiki/images/0/00/Scenicoutlook.png",
    "https://yume.wiki/images/c/c2/Fairytalepath.png"
  ],
  "School": [],
  "Saturated Eyeball Zone": [
    "https://yume.wiki/images/7/7f/SEZMap.jpg"
  ],
  "Sea of Clouds": [
    "https://yume.wiki/images/8/8d/Sea_of_Clouds_Map.png"
  ],
  "Rusted City": [
    "https://yume.wiki/images/0/0f/Rusted_city.png"
  ],
  "Seaside Village": [
    "https://yume.wiki/images/4/47/2kki_Seaside_village_map.png"
  ],
  "Sepia Clouds World": [
    "https://yume.wiki/images/b/b4/Map0593.png"
  ],
  "Scrambled Egg Zone": [],
  "Scorched Wasteland": [
    "https://yume.wiki/images/9/9a/Scorched_wasteland_map.png"
  ],
  "Sea Lily World": [
    "https://yume.wiki/images/7/73/Sealilyworld2.png"
  ],
  "Riverside Waste Facility": [
    "https://yume.wiki/images/8/87/Riverside-waste-facility-map.png"
  ],
  "Rocky Cavern": [
    "https://yume.wiki/images/4/4a/Rocky_caverns_map.png"
  ],
  "Ruined Garden": [
    "https://yume.wiki/images/e/e2/RuinedGardenMap.png"
  ],
  "Sandy Plains": [
    "https://yume.wiki/images/f/f8/Sandy_plains_map.png"
  ],
  "Shadowy Caves": [
    "https://yume.wiki/images/d/da/Shadowy_caves_map.png"
  ],
  "Scarlet Corridors": [
    "https://yume.wiki/images/c/cf/ScarletCorridorsMap.png"
  ],
  "Sky Kingdom": [
    "https://yume.wiki/images/d/d0/Map00285.png"
  ],
  "Sign World": [
    "https://yume.wiki/images/e/e6/UPDATEMapsignworld.png"
  ],
  "Spelling Room": [
    "https://yume.wiki/images/8/82/Eyeball_Room_map.png"
  ],
  "Shinto Shrine": [
    "https://yume.wiki/images/2/25/Shintoshrine_labelled.png"
  ],
  "Simple Street": [],
  "Snowy Pipe Organ": [],
  "Space": [
    "https://yume.wiki/images/2/29/SpaceMap.png"
  ],
  "Soldier Row": [],
  "Square-Square World": [
    "https://yume.wiki/images/c/c1/Map0259.png"
  ],
  "Shield Owl World": [
    "https://yume.wiki/images/9/95/Shieldowlmap.png"
  ],
  "Star Ocean": [
    "https://yume.wiki/images/1/1c/Map0204.png"
  ],
  "Shogi Board": [
    "https://yume.wiki/images/f/f9/ShogiBoardMap.png"
  ],
  "Sofa Room": [
    "https://yume.wiki/images/e/e8/Sofa_Room.png"
  ],
  "Snowy Apartments": [
    "https://yume.wiki/images/6/67/Snowyapartments_map.png"
  ],
  "Smiling Trees World": [
    "https://yume.wiki/images/a/a5/Map0636.png"
  ],
  "Spirit Capital": [
    "https://yume.wiki/images/6/6d/Spiritcapital.png",
    "https://yume.wiki/images/d/df/Spiritcapitalunderwater.png"
  ],
  "Snowy Forest": [
    "https://yume.wiki/images/2/2a/Map0892.png"
  ],
  "Silent Sewers": [
    "https://yume.wiki/images/d/d6/Map0951-0.png"
  ],
  "Static Labyrinth": [],
  "The Baddies Bar": [
    "https://yume.wiki/images/4/46/Baddiesb.png"
  ],
  "Teddy Bear Land": [
    "https://yume.wiki/images/2/25/1285983908011.png"
  ],
  "Stone Maze": [
    "https://yume.wiki/images/1/1d/2kki-stonemaze_map.png"
  ],
  "Tapir-San's Place": [],
  "Stone World": [
    "https://yume.wiki/images/b/b6/Map0037.png"
  ],
  "Teleport Maze": [
    "https://yume.wiki/images/4/4c/2kki-telemap.png"
  ],
  "Sunken City": [
    "https://yume.wiki/images/a/a1/Sunkencity.png",
    "https://yume.wiki/images/9/95/Sunkencity2.png"
  ],
  "Tatami Room": [],
  "Sugar World": [
    "https://yume.wiki/images/e/eb/Sugar_world.png",
    "https://yume.wiki/images/8/86/Sugary_depths.png"
  ],
  "Symbolon": [
    "https://yume.wiki/images/4/44/Map0146_Symbolon.png"
  ],
  "Strange Plants World": [
    "https://yume.wiki/images/6/67/Strange_plants_world_map.png"
  ],
  "Tesla Garden": [
    "https://yume.wiki/images/1/17/Tesla1Labelled.png",
    "https://yume.wiki/images/a/a6/Tesla_ladders_map.png",
    "https://yume.wiki/images/4/4b/Waterfront_guide.png"
  ],
  "Tan Desert": [
    "https://yume.wiki/images/b/b8/Tan_desert_map.png"
  ],
  "Techno Condominium": [],
  "Stone Towers": [
    "https://yume.wiki/images/1/1a/Stone_Towers_map.png"
  ],
  "Sugar Road": [
    "https://yume.wiki/images/d/df/Sugar_road_Updated_Map.png"
  ],
  "Static Noise Hell": [
    "https://yume.wiki/images/d/dd/Static_noise_hell_label.png"
  ],
  "Streetlight Garden": [
    "https://yume.wiki/images/a/ab/StreetlightGarden.png"
  ],
  "Tangerine Prairie": [
    "https://yume.wiki/images/6/60/TangerinePrairie.png"
  ],
  "Surgical Scissors World": [
    "https://yume.wiki/images/a/a4/Surgical_scissors_world_map.png"
  ],
  "The Docks": [
    "https://yume.wiki/images/c/cf/Docksmapwork.png"
  ],
  "The Hand Hub": [
    "https://yume.wiki/images/9/97/Mapofhund.png"
  ],
  "Theatre World": [
    "https://yume.wiki/images/e/e8/2kki-map-theatre.png"
  ],
  "The Deciding Street": [],
  "Nexus": [
    "https://yume.wiki/images/8/84/2kkiNexusMap.png"
  ],
  "Toy World": [
    "https://yume.wiki/images/4/44/Miniarea2.png",
    "https://yume.wiki/images/e/e0/Map0617.png"
  ],
  "Train Tracks": [
    "https://yume.wiki/images/8/89/Map0312.png"
  ],
  "The Invisible Maze": [
    "https://yume.wiki/images/1/18/TheInvisibleMaze.png"
  ],
  "Tribe Settlement": [
    "https://yume.wiki/images/e/ec/Tribalsettlementmap.png"
  ],
  "The Circus": [],
  "Trophy Room": [],
  "The Ceiling": [
    "https://yume.wiki/images/c/cb/Map0664.png"
  ],
  "The Slums": [
    "https://yume.wiki/images/2/2b/Map0745.png"
  ],
  "The Rooftops": [
    "https://yume.wiki/images/2/21/Red_road.png",
    "https://yume.wiki/images/0/00/Rooftops_map.png"
  ],
  "Visine World": [
    "https://yume.wiki/images/e/e3/1289934402668.png",
    "https://yume.wiki/images/c/c7/VisineWorldMazeMap.png"
  ],
  "Underwater Amusement Park": [
    "https://yume.wiki/images/f/fa/Underwater_Amusement_Park.png"
  ],
  "Urotsuki's Dream Apartments": [
    "https://yume.wiki/images/a/ad/Urotsuki's_dream_apartments_map.png",
    "https://yume.wiki/images/6/6f/Dream_wardrobe_map.png",
    "https://yume.wiki/images/d/db/Blackout_House_annotated_map.png"
  ],
  "Valentine Land": [
    "https://yume.wiki/images/9/96/ValentineLand.png"
  ],
  "Urban Street Area": [],
  "Underground TV Complex": [
    "https://yume.wiki/images/4/4f/Underground_TV_Complex_map.png"
  ],
  "Vase World": [
    "https://yume.wiki/images/0/0a/Vaseworld.png",
    "https://yume.wiki/images/8/83/Vaseinterior.png",
    "https://yume.wiki/images/c/c8/Vasepath.png"
  ],
  "TV Room": [],
  "Underground Laboratory": [
    "https://yume.wiki/images/7/7b/Underground_Laboratory_map.png"
  ],
  "Underground Garage": [
    "https://yume.wiki/images/5/53/Garage_map.png"
  ],
  "Undersea Temple": [
    "https://yume.wiki/images/2/23/Undersea_Temple_exterior_map.png",
    "https://yume.wiki/images/d/de/Undersea_Temple_interior_map.png"
  ],
  "Underground Passage": [
    "https://yume.wiki/images/c/c6/Map0794.png"
  ],
  "Vintage Town": [
    "https://yume.wiki/images/b/b8/Map0956_Labelled.png"
  ],
  "Underground Lake": [
    "https://yume.wiki/images/8/84/Underground_lake_map.png",
    "https://yume.wiki/images/2/28/Y2_Underground_Lake_-_Undersea_Caverns.png"
  ],
  "Distrust District": [],
  "Strawberry Fields": [
    "https://yume.wiki/images/c/ce/Strawberryfieldsmap.png"
  ],
  "Silver Mansion": [],
  "Dream Venus": [
    "https://yume.wiki/images/d/d4/HyoDreamVenus.png"
  ],
  "Dream Mars": [
    "https://yume.wiki/images/e/e9/2kki_Dream_Mars_Map.png"
  ],
  "Spaceship": [
    "https://yume.wiki/images/8/84/SpaceshipMapp.png"
  ],
  "Chainlink Lees": [
    "https://yume.wiki/images/7/76/ChainlinkLeesMap.png.png"
  ],
  "Abandoned Dreadnought": [
    "https://yume.wiki/images/4/4f/Abandoneddread2.png"
  ],
  "Verdant Promenade": [
    "https://yume.wiki/images/f/ff/Verdant_Promenade_Map.png"
  ],
  "Monochrome Wastelands": [
    "https://yume.wiki/images/0/06/MonochromaticWastelandsMap.png"
  ],
  "Grand Scientific Museum": [],
  "Snowy Village": [
    "https://yume.wiki/images/3/3f/Snowy_village_map_ANNOTATED.png"
  ],
  "Viridian Wetlands": [
    "https://yume.wiki/images/2/2a/Viridian_wetlands_map.png"
  ],
  "Clawtree Forest": [
    "https://yume.wiki/images/2/2d/ClawtreeForestMap.png"
  ],
  "Electromagnetic Terminal": [
    "https://yume.wiki/images/f/f4/Map1175.png"
  ],
  "Blood Chamber": [
    "https://yume.wiki/images/1/13/Blood_Chamber_Map.png"
  ],
  "Digital Hand Hub": [
    "https://yume.wiki/images/1/12/Digitalhubmap.png"
  ],
  "Holographic Chamber": [
    "https://yume.wiki/images/e/e8/Holographic_Chamber_interior_map.png",
    "https://yume.wiki/images/5/5d/Holographic_Chamber_exterior_map.png"
  ],
  "Ether Caverns": [
    "https://yume.wiki/images/5/50/Ether_Caverns_map.png"
  ],
  "Fluorescent City": [
    "https://yume.wiki/images/4/4b/Fluorescent_City_map.png"
  ],
  "Stellar Mausoleum": [],
  "Mottled Desert": [],
  "Ghastly Dumpsite": [
    "https://yume.wiki/images/7/72/Ghastly_Dumpsite_map.png"
  ],
  "Dreamscape Villa": [],
  "Coffee Cup World": [
    "https://yume.wiki/images/a/a8/Coffee_Cup_World_Map.png"
  ],
  "Miraculous Waters": [],
  "Robotic Institution": [],
  "Spherical Space Labyrinth": [
    "https://yume.wiki/images/4/4a/Map1241_annotated.png"
  ],
  "Lost Creek": [
    "https://yume.wiki/images/9/95/Lost_creek_map.png"
  ],
  "Nocturnal Grove": [
    "https://yume.wiki/images/6/6e/Nocturnal_grove_map.png"
  ],
  "Cloaked Pillar World": [
    "https://yume.wiki/images/0/01/Cloaked_pillar_world_map.png"
  ],
  "Viridescent Temple": [
    "https://yume.wiki/images/a/a6/Annotatedvirimap.png"
  ],
  "Floating Catacombs": [
    "https://yume.wiki/images/c/ce/FloatingCatacombsMap.png"
  ],
  "Fossil Lake": [
    "https://yume.wiki/images/2/24/Fossil_lake_map.png"
  ],
  "Subterranean Plant": [
    "https://yume.wiki/images/a/ae/Subterranean_plant_map.png"
  ],
  "Lavender Waters": [
    "https://yume.wiki/images/8/81/Lavender_Waters_Map.png"
  ],
  "Rainfall Ruins": [
    "https://yume.wiki/images/5/58/Rainfall_ruins_map.png"
  ],
  "Aurora Lake": [
    "https://yume.wiki/images/4/42/Aurora_lake_map.png"
  ],
  "Avian Statue World": [
    "https://yume.wiki/images/d/dd/Map1226.png"
  ],
  "Haunted Village": [],
  "Landolt Ring World": [],
  "Honeycomb World": [
    "https://yume.wiki/images/4/46/Honeycomb_World_Map.png"
  ],
  "Oriental Pub": [
    "https://yume.wiki/images/2/22/Orriental-pub-map.png"
  ],
  "Finger Candle World": [
    "https://yume.wiki/images/3/35/Fingerfingertootoo.png",
    "https://yume.wiki/images/8/86/Ilovemazes.png"
  ],
  "Digital Forest": [
    "https://yume.wiki/images/c/c1/DigitalForest1.png",
    "https://yume.wiki/images/5/58/DigitalForest2.png"
  ],
  "Erythrocyte Maze": [
    "https://yume.wiki/images/4/4c/Erythrocyte_maze_map.png",
    "https://yume.wiki/images/5/55/Annonatedmaper.png"
  ],
  "Herbarium": [
    "https://yume.wiki/images/7/7b/Herbariummap.png"
  ],
  "Calcarina Sea": [
    "https://yume.wiki/images/8/8e/Map1245.png"
  ],
  "Clandestine Research Laboratory": [
    "https://yume.wiki/images/5/52/Clandestine_research_laboratory_map.png"
  ],
  "Obsidian Plains": [
    "https://yume.wiki/images/f/f5/Obsidian_plains_new.png"
  ],
  "Gulliver Desert": [
    "https://yume.wiki/images/3/3d/2kki-GulliverDesertMap0121dP2.png"
  ],
  "Smiley Face DECK": [
    "https://yume.wiki/images/8/84/Map1265.png"
  ],
  "Fuchsia Suburbs": [
    "https://yume.wiki/images/c/c7/Map1263.png"
  ],
  "Octagonal Grid Hub": [
    "https://yume.wiki/images/8/82/Octagonalgridhub.png",
    "https://yume.wiki/images/f/f4/Brokenpassageoctagonalgrid.png",
    "https://yume.wiki/images/5/5b/Colorlesspier.png"
  ],
  "Tricolor Room": [],
  "Dressing Room": [
    "https://yume.wiki/images/b/b9/Dressingroom.png"
  ],
  "Downfall Garden A": [
    "https://yume.wiki/images/2/27/Downfall_Garden.png"
  ],
  "Downfall Garden B": [
    "https://yume.wiki/images/9/96/Y2_DownfallGardenB0.126_Map.png"
  ],
  "Bleeding Heads Garden": [
    "https://yume.wiki/images/d/d8/BleedingHeadsGardenMap.png"
  ],
  "Alien Valley": [],
  "Entrails": [
    "https://yume.wiki/images/8/88/Y2Stomach_Maze.png"
  ],
  "Butterfly Passage": [
    "https://yume.wiki/images/6/60/Butterflypassagemap.png"
  ],
  "Sculpture Park": [
    "https://yume.wiki/images/1/13/Sculpture_park_map.png",
    "https://yume.wiki/images/2/2e/Sculpture_park_purple.png"
  ],
  "Black Ink World": [
    "https://yume.wiki/images/c/c1/Blackinkmap.png"
  ],
  "Originator Garden": [
    "https://yume.wiki/images/0/01/OriginatorGardenMap.png"
  ],
  "Solstice Forest": [
    "https://yume.wiki/images/f/f0/SolsticeForestNew.png"
  ],
  "Famished Scribbles Area": [
    "https://yume.wiki/images/f/fe/Famished_scribbles_area_map.png"
  ],
  "Lovesick World": [
    "https://yume.wiki/images/8/89/LovesickWorldMap.png",
    "https://yume.wiki/images/2/24/LovesickWorldMazeMap.png"
  ],
  "Fluorescent Halls": [
    "https://yume.wiki/images/f/fc/Map1307.png"
  ],
  "Bismuth World": [
    "https://yume.wiki/images/3/33/Bismuth_world_map_bwf5.png"
  ],
  "Forgotten Megalopolis": [
    "https://yume.wiki/images/6/68/Forgottenmegapolismap.png"
  ],
  "Dreary Drains": [
    "https://yume.wiki/images/1/1c/Dreary_drains_annotated.png",
    "https://yume.wiki/images/8/8c/AbyssalWoodsMap.png"
  ],
  "Fantasy Isle": [
    "https://yume.wiki/images/3/34/Fantasyisle-outside.png",
    "https://yume.wiki/images/5/5a/Fantasyisle-inside-map.png"
  ],
  "Laundromat": [
    "https://yume.wiki/images/b/bf/LaundromatMap.png"
  ],
  "Oil Drum World": [
    "https://yume.wiki/images/c/c1/OilDrumWorldMap.png"
  ],
  "Stained Glass Cosmo": [
    "https://yume.wiki/images/f/fe/Stained_Glass_Cosmo_Map.png"
  ],
  "Bright Forest": [
    "https://yume.wiki/images/b/bc/Map1348.png",
    "https://yume.wiki/images/1/15/Map1350_rainbowruins_updated.png"
  ],
  "Cosmic Cube World": [
    "https://yume.wiki/images/9/9b/Cosmicubeworldssad.png"
  ],
  "Forest Interlude": [
    "https://yume.wiki/images/b/b9/Map1316.png"
  ],
  "Phosphorus World": [
    "https://yume.wiki/images/4/47/Map1260.png"
  ],
  "Tarnished Ship": [
    "https://yume.wiki/images/0/04/TarnishedShip_Map.png"
  ],
  "Portrait Purgatory": [
    "https://yume.wiki/images/f/f5/Portrait_purgatory_map_february_2_2023.png"
  ],
  "Green Tower": [
    "https://yume.wiki/images/4/47/GreenTowersMap.png"
  ],
  "Pop Revoir": [
    "https://yume.wiki/images/7/77/Poprevoirmap.png"
  ],
  "Cube of Sweets": [
    "https://yume.wiki/images/5/5d/Cubeofsweets.png"
  ],
  "Mole Mine": [
    "https://yume.wiki/images/f/fd/MoleMineMap.png"
  ],
  "Graffiti Sector": [
    "https://yume.wiki/images/b/b1/Grafitti_Sector_map.png"
  ],
  "Cinder Statue Heaven": [
    "https://yume.wiki/images/4/4a/Cinderstatueheavenmap.png"
  ],
  "Stalker Alley": [
    "https://yume.wiki/images/3/30/Stalkeralleymap.png",
    "https://yume.wiki/images/b/bd/Brailledungeonmap.png"
  ],
  "Maple Forest": [
    "https://yume.wiki/images/3/3e/Maple_Forest.png",
    "https://yume.wiki/images/b/b1/BambooForest_Map.png",
    "https://yume.wiki/images/7/76/GoldenChinatown_map.png"
  ],
  "Opal Ruins A": [
    "https://yume.wiki/images/0/07/Map1291.png",
    "https://yume.wiki/images/8/83/Map1294.png"
  ],
  "Opal Ruins B": [
    "https://yume.wiki/images/5/5e/Map1291B.png"
  ],
  "Azure Depths": [
    "https://yume.wiki/images/f/f7/Azuredepthsmap.png"
  ],
  "Star Hub": [
    "https://yume.wiki/images/8/84/Starhubmap.png"
  ],
  "Colorless Valley": [
    "https://yume.wiki/images/2/2a/Colorless_Valley_first_area_map.png",
    "https://yume.wiki/images/8/83/Colorless_Valley_maze_area_map.png"
  ],
  "Halloween Zone": [],
  "Ancient Hydrangea City": [
    "https://yume.wiki/images/4/48/Ancient_Hydrangea_City_map.png",
    "https://yume.wiki/images/1/19/Ancient_Hydrangea_City_Crimson_Dungeon_map.png"
  ],
  "Shop Ruins": [
    "https://yume.wiki/images/c/cb/ShopRuinsMap.png"
  ],
  "Shell Lake": [
    "https://yume.wiki/images/b/b8/Shell_Lake_map.png"
  ],
  "T-Folk World": [
    "https://yume.wiki/images/5/53/T_folk_world_map_annotated.png"
  ],
  "Flower Scent World": [
    "https://yume.wiki/images/4/4e/FlowerScentWorld.png"
  ],
  "Ocular Spacecraft": [],
  "Isometry World": [
    "https://yume.wiki/images/e/e4/Map0970.png"
  ],
  "Pudding World": [
    "https://yume.wiki/images/6/68/Pudding_world_map.png"
  ],
  "Orange Badlands": [
    "https://yume.wiki/images/4/41/Orange_badlands_map.png"
  ],
  "Blood Cell Sea": [
    "https://yume.wiki/images/5/5b/Blood_Cell_Sea_-_Annotated_map.png"
  ],
  "Paint Blot World": [
    "https://yume.wiki/images/5/5a/2kkiPaintBlotWorld.png"
  ],
  "Enigmatic World": [
    "https://yume.wiki/images/f/f5/EnigmaticWorldMap.png"
  ],
  "Rock World": [
    "https://yume.wiki/images/e/e8/RockWorld.png"
  ],
  "Petal Hotel": [],
  "Chocolate Tower": [],
  "Visceral Cavern": [
    "https://yume.wiki/images/e/eb/Labelled_visceral_caverns_map.png"
  ],
  "Innocent Dream": [],
  "Ice Cream Dream": [
    "https://yume.wiki/images/2/22/Ice_Cream_Dream_map.png"
  ],
  "Rotten Sea": [
    "https://yume.wiki/images/2/26/JIVV_Rotten_Sea_Map_1.png",
    "https://yume.wiki/images/5/51/JIVV_Rotten_Sea_Map_2.png"
  ],
  "Tartaric Abyss": [
    "https://yume.wiki/images/4/4b/Tartaric_Abyss_Map.png"
  ],
  "The Second Nexus": [
    "https://yume.wiki/images/4/4a/Second_nexus_map.png"
  ],
  "Color Cubes World": [
    "https://yume.wiki/images/b/b0/Color_blocks_annotated.png"
  ],
  "Starfield Garden": [
    "https://yume.wiki/images/8/83/Starfieldgardenmap.png"
  ],
  "Frozen Woods": [
    "https://yume.wiki/images/f/f2/FrozenWoodsMain.png",
    "https://yume.wiki/images/7/73/FrozenWoodsSub.png",
    "https://yume.wiki/images/8/83/FrozenWoodsMaze.png"
  ],
  "Forgotten Town": [
    "https://yume.wiki/images/7/74/ForgottenTownMap.png"
  ],
  "Snack Gallery": [
    "https://yume.wiki/images/7/7f/Snackgallery.png"
  ],
  "Vending Machine Factory": [],
  "Red Monastery": [
    "https://yume.wiki/images/f/f8/RedMonasteryMap.png"
  ],
  "Fused Faces World": [
    "https://yume.wiki/images/e/e7/Fused_faces_world.png"
  ],
  "Sparkling Dimension A": [],
  "Sparkling Dimension B": [],
  "Crazed Faces Maze": [
    "https://yume.wiki/images/4/40/Crazed_faces_maze_annotated.png"
  ],
  "Blue House Road": [
    "https://yume.wiki/images/e/ed/Blue_house_road_1.20_map.png"
  ],
  "Mystery Library": [
    "https://yume.wiki/images/e/ed/MysteryLibraryMap.png"
  ],
  "Lingering Sewers": [
    "https://yume.wiki/images/c/cd/Lingeringsewersmap.png"
  ],
  "Totem Hotel": [
    "https://yume.wiki/images/5/58/Map1381_Totem_Hotel.png"
  ],
  "Playing Card Dungeon": [
    "https://yume.wiki/images/0/08/Y2_PlayingCardDungeon_Map.png"
  ],
  "Libra Palace": [
    "https://yume.wiki/images/d/dc/Libra_palace_map.png"
  ],
  "Omurice Labyrinth": [
    "https://yume.wiki/images/b/bb/Omurice_labyrinth_map0119h.png"
  ],
  "Moonview Lane": [],
  "Rotten Fish Lake": [
    "https://yume.wiki/images/d/d3/Rotten_fish_lake_map.png"
  ],
  "Integer World": [
    "https://yume.wiki/images/2/22/2kkiIntegerWorldMap.png"
  ],
  "Maroon Gravehouse": [
    "https://yume.wiki/images/5/56/Maroon_gravehouse_map.png"
  ],
  "Tomb of Velleities": [
    "https://yume.wiki/images/c/ca/TombOfVelleitiesMap.png"
  ],
  "Window Room": [],
  "Wilderness": [
    "https://yume.wiki/images/f/fd/2kki-wilderness2.png"
  ],
  "White Fern World": [
    "https://yume.wiki/images/a/a9/Map0309.png",
    "https://yume.wiki/images/5/51/Map0302.png"
  ],
  "Warehouse": [
    "https://yume.wiki/images/2/2e/Map0316.png",
    "https://yume.wiki/images/2/22/Warehouseinterior.png"
  ],
  "Word World": [
    "https://yume.wiki/images/f/f7/Word_World_Map.png"
  ],
  "Whipped Cream World": [
    "https://yume.wiki/images/c/c9/Whippedcreamupdate.png",
    "https://yume.wiki/images/a/a5/Whipcream2.png",
    "https://yume.wiki/images/1/13/Monkeymansionnap.png"
  ],
  "Wastewater Treatment Plant": [
    "https://yume.wiki/images/1/19/Wastewatertreatmentplant.png"
  ],
  "Wooden Polycube Ruins": [
    "https://yume.wiki/images/8/81/Wooden_polycube_ruins_map.png",
    "https://yume.wiki/images/5/57/Wooden_Polycube_Ruins_route_map.png"
  ],
  "Water Reclamation Facility": [],
  "White Scarlet Exhibition": [],
  "Water Lantern World": [],
  "Winter Valley": [
    "https://yume.wiki/images/1/1a/Winter_Valley_Map.png"
  ],
  "Wintry Cliffs": [
    "https://yume.wiki/images/5/57/Wintry_cliffs_map_bwf5.png"
  ],
  "Wine Cellar": [
    "https://yume.wiki/images/a/a2/Wine_Cellar.png",
    "https://yume.wiki/images/7/70/Wine_Cellar_B.png"
  ],
  "Sanctuary": [
    "https://yume.wiki/images/7/79/MapSanctuary.png"
  ],
  "Gentle Sea": [
    "https://yume.wiki/images/7/71/MapGentleSea.png"
  ],
  "Colorless Roads": [],
  "Donut Hole World": [
    "https://yume.wiki/images/a/a1/Donutholemap.png"
  ],
  "Birthday Tower": [],
  "Dice World": [],
  "Abyss of Farewells": [],
  "City of Liars": [
    "https://yume.wiki/images/6/60/Y2_City_of_Liars.png",
    "https://yume.wiki/images/e/e3/Y2_City_of_Liars_-_Hallway_Maze_&_Footprint_Path.png"
  ],
  "Black Sphere World": [
    "https://yume.wiki/images/2/26/Black_sphere_world_map.png"
  ],
  "Unending River": [],
  "Amorphous Maroon Space": [
    "https://yume.wiki/images/d/d0/Amorphous_maroon_space_a_map.png",
    "https://yume.wiki/images/d/d6/Amorphous_maroon_space_b_map.png"
  ],
  "Zodiac Fortress": [
    "https://yume.wiki/images/a/a0/ZodiacFortress.png"
  ],
  "Bioluminescent Cavern": [
    "https://yume.wiki/images/c/ca/Bioluminescent_Cavern_Map.png"
  ],
  "Mansion": [
    "https://yume.wiki/images/e/e4/Annotated_mansion_map.png"
  ],
  "Complex": [
    "https://yume.wiki/images/6/65/Complexmap.png"
  ],
  "Cosmic World": [
    "https://yume.wiki/images/1/18/Cosmic_world_map_bahton.png"
  ],
  "Mirror Room": [],
  "Chaotic Buildings": [
    "https://yume.wiki/images/f/f3/Map00536.png"
  ],
  "Forest Pier": [
    "https://yume.wiki/images/c/c8/Forestpier_mapwork.png"
  ],
  "Abandoned Factory": [
    "https://yume.wiki/images/7/74/Abandoned_factory.png"
  ],
  "Arc de Pillar World": [
    "https://yume.wiki/images/3/32/Map00571.png"
  ],
  "Abandoned Apartments": [
    "https://yume.wiki/images/c/c9/Abandoned_apartments.png"
  ],
  "Square Ruins": [
    "https://yume.wiki/images/c/c8/Squareruinsmapblank.png",
    "https://yume.wiki/images/2/2b/Square_ruins_map.png"
  ],
  "Old Train Station B": [
    "https://yume.wiki/images/b/bc/Old_strain_stationbA.png"
  ],
  "Overgrown City": [
    "https://yume.wiki/images/6/69/OVERGROWN_CITY_annotated.png"
  ],
  "Overgrown Gate": [
    "https://yume.wiki/images/0/08/Map0564.png"
  ],
  "Red Black World": [
    "https://yume.wiki/images/a/a9/2kkiRedBlackWorldMap.png"
  ],
  "Rose Church": [],
  "Neon City": [
    "https://yume.wiki/images/1/1c/Neon_city.png"
  ],
  "Old Train Station": [
    "https://yume.wiki/images/e/e6/Old_train_station2A.png"
  ],
  "Radiant Ruins": [
    "https://yume.wiki/images/e/e5/Rr1.png"
  ],
  "Pillars World": [],
  "Rainbow Silhouette World": [
    "https://yume.wiki/images/f/f1/Rainbow_silhouette.png"
  ],
  "Planetarium": [],
  "Bottom Garden": [
    "https://yume.wiki/images/c/cd/Bottomgarden.png"
  ],
  "Hidden Shoal": [
    "https://yume.wiki/images/4/45/Hsmap.png"
  ],
  "Industrial Maze": [
    "https://yume.wiki/images/e/e1/Industrial_mazeA.png"
  ],
  "Transmission Tower World": [
    "https://yume.wiki/images/4/40/Ttwmap.png"
  ],
  "Town Maze": [
    "https://yume.wiki/images/b/be/Town_Maze_Annotated.png"
  ],
  "Deserted Pier": [
    "https://yume.wiki/images/8/8f/Deserted_pier.png"
  ],
  "Deserted Town": [
    "https://yume.wiki/images/d/d8/Deserted_town_map.png"
  ],
  "Depths": [
    "https://yume.wiki/images/c/cf/Depths-map.png"
  ],
  "Tulip Lamp World": [
    "https://yume.wiki/images/f/ff/Tuliplamp.png"
  ],
  "Wind Tunnel": [
    "https://yume.wiki/images/5/54/Wind_tunnel.png",
    "https://yume.wiki/images/6/6c/Wind_tunnel2.png"
  ],
  "Victorian Drains": [
    "https://yume.wiki/images/7/7c/VICTORIAN_DRAINS_annotated.png"
  ],
  "Smiley Signs World": [
    "https://yume.wiki/images/f/f4/Smileysignsmap.png"
  ],
  "Ahogeko's House": [],
  "3D Structures Path": [
    "https://yume.wiki/images/3/3c/3D_Structures_Path_map.png"
  ],
  "The Gutter": [
    "https://yume.wiki/images/c/c2/The_gutter_map.png"
  ],
  "Shallows of Deceit": [
    "https://yume.wiki/images/7/7d/Y2_Shallows_of_Deceit_Map.png"
  ],
  "Hot Air Balloon World": [
    "https://yume.wiki/images/5/5a/Hotairballoonmap.png"
  ],
  "Hidden Garage": [],
  "Trophy Animal Land": [
    "https://yume.wiki/images/9/9c/Trophy_animal_land_map.png"
  ],
  "Robotic Slaves Tunnel": [],
  "NES Glitch Tunnel": [
    "https://yume.wiki/images/9/95/NES_Glitch_Tunnel_map.png"
  ],
  "Guardians' Realm": [],
  "Sacred Crypt": [],
  "Handheld Game Pond": [
    "https://yume.wiki/images/8/8a/Map_HHGP.png"
  ],
  "Obentou World": [
    "https://yume.wiki/images/7/76/ObentouMap.png"
  ],
  "Astral World": [
    "https://yume.wiki/images/7/7a/Astralworldmap.png"
  ],
  "Blue Lavender Shoal": [
    "https://yume.wiki/images/a/a3/Blue_lavender_shoal_map.png"
  ],
  "Corrupted Love World": [],
  "Unknown Child's Room": [],
  "Crystal Star Tower": [
    "https://yume.wiki/images/d/d7/Crystal_Star_Tower_map.png"
  ],
  "Inu-san's Psyche": [],
  "Mountaintop Ruins": [],
  "Whispery Sewers": [],
  "Eyeball Cherry Fields": [
    "https://yume.wiki/images/b/b1/HyoEyeballCherry.png"
  ],
  "Tricolor Passage": [
    "https://yume.wiki/images/e/ed/Tricolor_passage_map.png"
  ],
  "Mask Folks Hideout": [
    "https://yume.wiki/images/9/9d/Map1543.png"
  ],
  "Entomophobia Realm": [
    "https://yume.wiki/images/c/cd/Entomophobia_realm_map.png"
  ],
  "Pastel Sky Park": [],
  "Acerola World": [],
  "Wooden Block World": [
    "https://yume.wiki/images/9/91/Wooden_Block_World_Map.png"
  ],
  "Everblue City": [
    "https://yume.wiki/images/6/6d/Everblue_city_map.png"
  ],
  "Pancake World": [
    "https://yume.wiki/images/9/9f/Map_of_Pancake_World_annotated.png"
  ],
  "Cactus Desert": [
    "https://yume.wiki/images/3/30/Map1546_Cactus_Desert.png"
  ],
  "Windswept Fields": [
    "https://yume.wiki/images/4/44/WindsweptFieldsMap.png"
  ],
  "Checkered Postal Path": [
    "https://yume.wiki/images/a/a0/CheckeredPostalPathMap.png"
  ],
  "Silhouette Complex": [
    "https://yume.wiki/images/4/43/Marine_PavilionMap.png"
  ],
  "Lotus Park": [
    "https://yume.wiki/images/e/e9/Lotus_park_map_labelled.png"
  ],
  "Execution Ground": [
    "https://yume.wiki/images/5/56/Map1548_Execution_Ground.png"
  ],
  "Cipher Keyboard": [
    "https://yume.wiki/images/a/a2/Matoran_Keyboard.png"
  ],
  "Atelier": [
    "https://yume.wiki/images/6/64/Map1550_Atelier.png"
  ],
  "Rainy Town": [],
  "Dessert Fields": [
    "https://yume.wiki/images/e/e0/Dessert_fields_map.png",
    "https://yume.wiki/images/e/e7/Dessert_fields_map_2.png"
  ],
  "Fish World": [
    "https://yume.wiki/images/c/c6/FishWorldMap.png"
  ],
  "Hollows": [
    "https://yume.wiki/images/3/39/HollowsMap.png"
  ],
  "Subterranean Research Center": [],
  "Duality Wilds": [
    "https://yume.wiki/images/b/b9/Duality_Fields.png",
    "https://yume.wiki/images/a/ad/Map1654_Rainbow_Crypt.png"
  ],
  "Vermilion Bamboo Forest": [
    "https://yume.wiki/images/0/0d/VermilionBambooForestMap.png"
  ],
  "Lapine Forest": [],
  "Rusty Urban Complex": [
    "https://yume.wiki/images/4/41/Rusty_urban_complex_map.png"
  ],
  "Dream Pool": [
    "https://yume.wiki/images/6/6c/Dream_pool_map.png"
  ],
  "Foliage Estate": [
    "https://yume.wiki/images/5/55/Foliage_Estate_map.png"
  ],
  "Wind Turbine Plateau": [],
  "Azure Garden": [
    "https://yume.wiki/images/b/bb/Final.png"
  ],
  "Magical Passage": [],
  "Dark Nexus": [
    "https://yume.wiki/images/b/b5/DarkNexus.png"
  ],
  "Spore Forest": [
    "https://yume.wiki/images/3/3a/Sporeforestmap.png"
  ],
  "Spear Tribe World": [
    "https://yume.wiki/images/2/27/SpearTribeWorldMap.png"
  ],
  "Garden of Treachery": [],
  "Chicken World": [
    "https://yume.wiki/images/3/31/ChickenWorldMap.png"
  ],
  "Crystal Lake": [
    "https://yume.wiki/images/a/a4/CrystalLakeMap.png"
  ],
  "Dream Easter Island": [
    "https://yume.wiki/images/d/da/Map1700_Dream_Easter_Island.png"
  ],
  "Toxic Chemical World": [
    "https://yume.wiki/images/a/a7/ToxicChemicalWorldMap.png"
  ],
  "Floating Beer Isle": [
    "https://yume.wiki/images/6/6a/FloatingBeerIslandMap.png"
  ],
  "Funeral Prison": [
    "https://yume.wiki/images/0/0b/Map1699_Funeral_Prison.png"
  ],
  "Egyptian Rave Dungeon": [
    "https://yume.wiki/images/d/dd/Egyptian_rave_dungeon_map.png"
  ],
  "Cherry Blossom Park": [
    "https://yume.wiki/images/b/bc/CherryBlossomParkMap.png"
  ],
  "Tomato World": [
    "https://yume.wiki/images/7/76/Tomatomap.png"
  ],
  "Golden Mechanical Tower": [],
  "Evil Cube Zone": [],
  "River Complex": [
    "https://yume.wiki/images/1/1a/Buddha_face_labyrinth_map.png",
    "https://yume.wiki/images/8/8a/Y2_RiverComplex_Map.png"
  ],
  "Wounded Turtle World": [
    "https://yume.wiki/images/2/25/WoundedTurtleWorldMap.png"
  ],
  "Grand Beach": [
    "https://yume.wiki/images/2/22/Grand_beach_map.png"
  ],
  "Spike Alley": [
    "https://yume.wiki/images/c/c9/Spike_alley_map.png"
  ],
  "Floating Brain World": [
    "https://yume.wiki/images/1/14/Y2_Floating_Brain_World.png"
  ],
  "Voxel Island": [
    "https://yume.wiki/images/b/bd/Voxelnightmap.png",
    "https://yume.wiki/images/6/62/Voxeldaymap.png"
  ],
  "Lemon World": [
    "https://yume.wiki/images/0/01/Map1700_Lemon_World.png"
  ],
  "Stuffed Dullahan World": [],
  "Obstacle Course": [],
  "Shape World": [
    "https://yume.wiki/images/3/3b/Shapeworldmap.png"
  ],
  "Forest Cavern": [
    "https://yume.wiki/images/7/72/ForestCavernMap.png"
  ],
  "Nazca Valley": [
    "https://yume.wiki/images/d/d2/Nazca_Valley_map.png",
    "https://yume.wiki/images/4/4c/NazcaValley=FriedEggZoneMap.png",
    "https://yume.wiki/images/5/5d/NazcaValley=EggplantDomainMap.png",
    "https://yume.wiki/images/a/a1/NazcaValley=AmbulanceParkingFacilityMap.png",
    "https://yume.wiki/images/1/1f/NazcaValley=PsychedelicDungeonMap.png",
    "https://yume.wiki/images/3/35/NazcaValley=PandaCheckersAreaMap.png",
    "https://yume.wiki/images/0/06/NazcaValley=SquidZoneMap.png"
  ],
  "Travel Hotel": [],
  "Restored Sky Kingdom": [
    "https://yume.wiki/images/2/2e/RestoredSkyKingdomMap.png"
  ],
  "Love Lodge": [
    "https://yume.wiki/images/d/dc/Lovelodge_Map.png"
  ],
  "Litter Heaven": [
    "https://yume.wiki/images/6/68/Litter_Heaven_map.png"
  ],
  "Refrigerator Tower": [
    "https://yume.wiki/images/d/dd/RefrigeratorTowerMap.png"
  ],
  "Elemental Caves": [
    "https://yume.wiki/images/5/5e/ElementalCavesMap.png"
  ],
  "Honeybee Laboratory": [
    "https://yume.wiki/images/d/d3/Honeybee_laboratory_map.png"
  ],
  "Sunset Sky Slums": [
    "https://yume.wiki/images/8/8a/Map1726_Sunset_Sky_Slums.png"
  ],
  "Deep Blue Graveyard": [
    "https://yume.wiki/images/b/bd/Map1725_Deep_Blue_Graveyard.png"
  ],
  "Sushi World": [
    "https://yume.wiki/images/8/80/Sushi_World_map.png"
  ],
  "Energy Complex": [
    "https://yume.wiki/images/0/0f/EnergyComplexMap.png"
  ],
  "Snow White Field": [
    "https://yume.wiki/images/f/f7/SnowWhiteField_map.png"
  ],
  "Sky Cactus Zone": [
    "https://yume.wiki/images/1/16/Sky_Cactus_Zone_map.png"
  ],
  "Statue Forest": [
    "https://yume.wiki/images/9/91/Statueforestv1.png"
  ],
  "Pastel Chalk World": [
    "https://yume.wiki/images/a/ac/Pastel_chalk_world_map.png"
  ],
  "Dreadful Docks": [
    "https://yume.wiki/images/3/30/DreadfulDocksNeonMap.png",
    "https://yume.wiki/images/8/8f/DreadfulDocksMap.png"
  ],
  "Submerged Communications Area": [
    "https://yume.wiki/images/7/7f/Submerged_communications_area_map.png"
  ],
  "Private Rooms": [],
  "Cherryblossom Fields": [
    "https://yume.wiki/images/7/7d/CherryblossomFields_map.png"
  ],
  "Blooming Blue Lagoon": [
    "https://yume.wiki/images/a/ac/Blooming_Blue_Lagoon_Map.png"
  ],
  "Spiders' Nest": [],
  "Rainbow Towers": [],
  "Decrepit Village": [
    "https://yume.wiki/images/b/ba/2kkiDecrepitVillageMap-FirstArea.png",
    "https://yume.wiki/images/f/f5/2kkiDecrepitVillageMap-MainArea.png"
  ],
  "Opal Archives": [],
  "Twisted Thickets": [
    "https://yume.wiki/images/8/81/Twisted_thickets_annotated.png"
  ],
  "Ancient Aeropolis": [
    "https://yume.wiki/images/4/48/AncientAeropolisMap.png"
  ],
  "Luminous Lake": [
    "https://yume.wiki/images/9/96/LuminousLakeMap.png"
  ],
  "Desolate Hospital": [
    "https://yume.wiki/images/7/7b/DesolateHospital.png"
  ],
  "Memory Garden": [
    "https://yume.wiki/images/c/c4/MemoryGardenMap.png"
  ],
  "Dragon Statue World": [
    "https://yume.wiki/images/6/60/DragonStatueWorldMap.png"
  ],
  "Rusted Factory": [
    "https://yume.wiki/images/1/1e/RustedFactoryMap.png"
  ],
  "Monolith Jungle": [
    "https://yume.wiki/images/c/c0/MonolithJungleMap.png"
  ],
  "Aureate Clockworks": [
    "https://yume.wiki/images/c/c2/AureateClockworksMap.png"
  ],
  "Sketch Plains": [
    "https://yume.wiki/images/3/39/SketchPlainsMap.png"
  ],
  "Entropy Dungeon": [
    "https://yume.wiki/images/6/69/EntropyDungeonMap.png"
  ],
  "Lost Shoal": [
    "https://yume.wiki/images/4/43/Lost_shoal_map.png"
  ],
  "Toxic Sea": [
    "https://yume.wiki/images/2/21/Toxic_Sea.png"
  ],
  "Monochrome School": [
    "https://yume.wiki/images/6/61/MonoSchoolExtMap.png",
    "https://yume.wiki/images/0/07/MonoSchool_IntMap.png"
  ],
  "Twilight Park": [
    "https://yume.wiki/images/d/d8/Twilight_park.png"
  ],
  "Deluxe Mask Shop": [],
  "Poseidon Plaza": [
    "https://yume.wiki/images/3/3e/Poseidon_Plaza_map_january_12_2024.png"
  ],
  "Cyan Relic World": [
    "https://yume.wiki/images/2/2b/Cyan_Relic_World_Map.png",
    "https://yume.wiki/images/4/43/Grey_Relic_World2.png"
  ],
  "Dark Cheese Hell": [
    "https://yume.wiki/images/e/ee/Dark_cheese_hell_map.png"
  ],
  "Digital Alley": [
    "https://yume.wiki/images/f/f8/DigitalAlleyMap.png"
  ],
  "Industrial Hotel": [
    "https://yume.wiki/images/5/5a/Industrial_hotel_map.png"
  ],
  "Rainbow Pottery Zone": [
    "https://yume.wiki/images/9/98/Dogu_world_map.png",
    "https://yume.wiki/images/2/25/Rainbow_pottery_world_map.png"
  ],
  "Serpentine Pyramid": [
    "https://yume.wiki/images/3/39/Serpentine_pyramid_map.png"
  ],
  "Fossil Mines": [
    "https://yume.wiki/images/e/ed/Fossil_mines_map.png"
  ],
  "Forest of Reflections": [
    "https://yume.wiki/images/1/1e/Forestofreflections_map_annotated_updated.png"
  ],
  "Snowy Suburbs": [
    "https://yume.wiki/images/f/f9/SnowySuburbsMap.png"
  ],
  "Serum Laboratory": [
    "https://yume.wiki/images/4/4e/SerumLaboratoryMap.png"
  ],
  "Cyber Prison": [
    "https://yume.wiki/images/f/f0/Cyberprisonmap.png"
  ],
  "Sound Saws World": [
    "https://yume.wiki/images/2/24/SoundSawsWorldMap_(MAP1614).png"
  ],
  "Cipher Fog World": [
    "https://yume.wiki/images/1/12/CipherFogWorld.png"
  ],
  "Spiked Fence Garden": [
    "https://yume.wiki/images/d/de/SpikedFenceGardenMap.png"
  ],
  "Haniwa Ruins": [
    "https://yume.wiki/images/b/bc/Haniwaruins120b.png"
  ],
  "Sixth Terminal": [
    "https://yume.wiki/images/b/b5/SixthTerminalMap.png"
  ],
  "Sherbet Snowfield": [
    "https://yume.wiki/images/2/27/SherbetSnowfieldMap_(MAP1616).png"
  ],
  "Butter Rain World": [
    "https://yume.wiki/images/d/da/ButterRainWorldMap_(MAP1615).png"
  ],
  "Nightmare Inn": [
    "https://yume.wiki/images/5/59/Nightmare_inn_map.png"
  ],
  "Carnivorous Pit": [
    "https://yume.wiki/images/5/59/Carnivorous_Pit_map.png"
  ],
  "Shadow Lady Estate": [
    "https://yume.wiki/images/c/c4/ShadowLadyEstateMapMain.png",
    "https://yume.wiki/images/f/fe/ShadowLadyEstateMapMaze.png"
  ],
  "Home Within Nowhere": [],
  "Pure White Lands": [],
  "Windswept Scarlet Sands": [
    "https://yume.wiki/images/1/15/WSSMap.png"
  ],
  "Lamplit Stones": [
    "https://yume.wiki/images/1/1d/LamplitStonesMap.png"
  ],
  "Adabana Gardens": [
    "https://yume.wiki/images/1/18/AdabanaGardensMap.png"
  ],
  "Field of Cosmos": [
    "https://yume.wiki/images/9/9c/FieldofCosmosMap.png"
  ],
  "Sierpinski Maze": [
    "https://yume.wiki/images/9/97/SierpinskiMazeMap.png"
  ],
  "Glitched Butterfly Sector": [
    "https://yume.wiki/images/1/17/2kki-WLP-Map.png",
    "https://yume.wiki/images/9/91/GlitchedButterflySectorMap.png"
  ],
  "Bubble World": [],
  "Reflecting Electron Zone": [],
  "Virtual City": [
    "https://yume.wiki/images/f/f7/VirtualCity_map.png"
  ],
  "Rainy Apartments": [],
  "Day and Night Towers": [
    "https://yume.wiki/images/2/2b/2kki-DNTbig.png"
  ],
  "Heian Era Village": [
    "https://yume.wiki/images/a/a3/Mosenite_village.png"
  ],
  "Forlorn Beach House": [
    "https://yume.wiki/images/0/0d/BeachHouseMap.png"
  ],
  "Mossy Stone Area": [
    "https://yume.wiki/images/c/c2/Mossy_stone_area_map.png"
  ],
  "Desolate Park": [
    "https://yume.wiki/images/c/c2/Desolate_park_map.png"
  ],
  "Red Strings Maze": [
    "https://yume.wiki/images/3/3e/RedStringMaze_Map.png"
  ],
  "Drowsy Forest": [
    "https://yume.wiki/images/2/28/Map1921.png",
    "https://yume.wiki/images/c/c4/Y2_Drowsy_Forest_Annotated.png"
  ],
  "Funky Dusky Hall": [
    "https://yume.wiki/images/8/8e/Funky_dusky_hall_map.png"
  ],
  "Budding Life World": [
    "https://yume.wiki/images/d/d3/Budding_life_world_map.png"
  ],
  "Silkworm Forest": [],
  "Pop Tiles Maze": [
    "https://yume.wiki/images/9/91/Pop_tiles_maze_map.png"
  ],
  "Dusty Pinwheel Path": [
    "https://yume.wiki/images/7/73/Dusty_pinwheel_path_map.png"
  ],
  "Drenched Passageways": [
    "https://yume.wiki/images/8/8e/Drenched_passageways_map.png"
  ],
  "Table Scrap Expanse": [
    "https://yume.wiki/images/0/07/Table_scrap_expanse_map.png"
  ],
  "Dark Bunker": [],
  "Restored Vantablack World": [
    "https://yume.wiki/images/3/3e/Restordvantablackmap.png"
  ],
  "Ninja Town": [
    "https://yume.wiki/images/4/4f/NinjaTown.png"
  ],
  "Green Pattern World": [
    "https://yume.wiki/images/f/fd/GreenPatternWorldMap2.png",
    "https://yume.wiki/images/7/76/GreenPatternWorldUndergroundMap.png"
  ],
  "Ornamental Plains": [
    "https://yume.wiki/images/5/54/Ornamental_plains_map.png"
  ],
  "Serene Docks": [
    "https://yume.wiki/images/6/68/MAPSereneDocks.png"
  ],
  "Drains Theater": [
    "https://yume.wiki/images/4/4a/Drains_theater_map.png"
  ],
  "Underwater Forest": [
    "https://yume.wiki/images/3/3a/Underwater_forest_map.png"
  ],
  "Stony Buildings": [
    "https://yume.wiki/images/a/a1/Stony_buildings_map.png"
  ],
  "Valentine Mail": [
    "https://yume.wiki/images/9/91/Valentine_mail_map.png"
  ],
  "Chimney Pillars": [
    "https://yume.wiki/images/0/0b/Chimney_pillars_map.png"
  ],
  "Hat World": [
    "https://yume.wiki/images/b/b4/HatWorldMap.png"
  ],
  "Alazan Domain": [
    "https://yume.wiki/images/f/fe/Map01982.png"
  ],
  "Planter Passage": [
    "https://yume.wiki/images/c/cb/PlanterPassageMap.png"
  ],
  "Blue Eyes World": [
    "https://yume.wiki/images/a/a3/Blue_eyes_world_annotated.png"
  ],
  "Gray Memory": [
    "https://yume.wiki/images/5/5f/Y2_GrayMemory_Map.png"
  ],
  "Lonely Home": [
    "https://yume.wiki/images/4/4e/МapLonelyHome.png"
  ],
  "Sea of Trees": [
    "https://yume.wiki/images/7/78/Sea_of_Trees_Map2.png"
  ],
  "Restored Character World": [
    "https://yume.wiki/images/7/7f/AnnotatedResCharacterWorld.png"
  ],
  "Frozen Disco": [],
  "Greenhouse": [
    "https://yume.wiki/images/1/1d/GreenhouseMap.png"
  ],
  "Celestial Night": [
    "https://yume.wiki/images/2/20/Celestial_night_map.png"
  ],
  "Strawberry Milk Sea": [
    "https://yume.wiki/images/4/4d/StrawberryMilkSeaMap.png"
  ],
  "Realm of Gluttony": [
    "https://yume.wiki/images/1/11/Realmofgluttonyannotated.png"
  ],
  "Blackjack Manor": [
    "https://yume.wiki/images/f/f6/Y2_Blackjack_Manor.png"
  ],
  "Cigarette World": [
    "https://yume.wiki/images/5/5b/CigaretteWorldMap.png"
  ],
  "Scrapyard": [
    "https://yume.wiki/images/7/72/ScrapyardMap.png"
  ],
  "Pink Honeycomb": [],
  "Corridor of Eyes": [
    "https://yume.wiki/images/5/50/CorridorOfEyesMap.png"
  ],
  "Rice Dumpling Plateau": [
    "https://yume.wiki/images/d/dc/RiceDumplingPlateauMap.png"
  ],
  "Hatred Palace": [
    "https://yume.wiki/images/e/e8/HatredPalaceMap.png"
  ],
  "Sunset School": [
    "https://yume.wiki/images/8/8f/SunsetSchoolMap.png"
  ],
  "Junk From Anywhere": [
    "https://yume.wiki/images/d/d9/Junk_From_Anywhere_map.png"
  ],
  "Wooden Cubes Playground": [
    "https://yume.wiki/images/3/33/Wooden_cubes_playground_annotated.png"
  ],
  "Soy Sauce World": [
    "https://yume.wiki/images/a/a0/SoySauce.jpg"
  ],
  "Pumpkin City": [],
  "Deserted Center": [],
  "Four Seasons Forest": [
    "https://yume.wiki/images/9/9c/FourSeasonsForestMap.png"
  ],
  "Honeybee Residence": [],
  "Bread World": [
    "https://yume.wiki/images/4/41/Breadworldmap.png"
  ],
  "Oriental Dojo": [
    "https://yume.wiki/images/e/e7/OrientalDojoMap.png"
  ],
  "Digital Heart Space": [
    "https://yume.wiki/images/5/52/Y2_Digital_Heart_Space.png"
  ],
  "Faces Zone": [],
  "Astronomical Gallery": [
    "https://yume.wiki/images/7/7c/Astronomicalgallery-map.png"
  ],
  "Butterfly Garden": [
    "https://yume.wiki/images/0/07/ButterflyGardenMap.png"
  ],
  "Sakura Forest": [
    "https://yume.wiki/images/f/f1/Sakura_Forest_Map.jpg"
  ],
  "Blood Red House": [
    "https://yume.wiki/images/8/84/BloodRedHouseMap.png",
    "https://yume.wiki/images/c/cd/BRH_GlitchWorld.png"
  ],
  "Forest of Strange Faces": [
    "https://yume.wiki/images/e/e7/Map1984.png"
  ],
  "Glitched Purgatory": [],
  "Illusive Forest": [
    "https://yume.wiki/images/9/95/Illusive_forest_annotated.png"
  ],
  "Microbiome World": [
    "https://yume.wiki/images/7/7e/MicrobiomeWorldMap.png"
  ],
  "Parking Zone": [
    "https://yume.wiki/images/e/e3/ParkingZoneMap.png"
  ],
  "Rainbow Road": [
    "https://yume.wiki/images/c/c5/Rainbowroadmap.png"
  ],
  "Reverie Book Piles": [
    "https://yume.wiki/images/9/91/Reverie_book_piles_annotated.png"
  ],
  "Snowman World": [
    "https://yume.wiki/images/e/ea/Snowmanworldmap.png"
  ],
  "Torii Trail": [
    "https://yume.wiki/images/4/42/Torii_trail_annotated.png"
  ],
  "Blue Screen Void": [
    "https://yume.wiki/images/0/01/Bluescreen_void_annotated.png"
  ],
  "Blueberry Farm": [
    "https://yume.wiki/images/7/7b/Map2074.png"
  ],
  "Mini-Nexus": [
    "https://yume.wiki/images/5/5c/Mininexusmap.png"
  ],
  "Sunflower Fields": [
    "https://yume.wiki/images/d/d5/Sunflowerfields_map.png"
  ],
  "Sunset Hill": [],
  "Animated Hub": [
    "https://yume.wiki/images/a/a5/Y2_Animated_Hub.png"
  ],
  "Rainbow Hell": [],
  "Ice Cream Islands": [
    "https://yume.wiki/images/3/36/Icecreamislands_mapp.png"
  ],
  "Blue Restaurant": [],
  "Horror Maze": [
    "https://yume.wiki/images/9/9f/Horrormazemap.png"
  ],
  "RGB Passage B": [
    "https://yume.wiki/images/4/40/RGBPASSAGEMAP.png"
  ],
  "The Pansy Path": [
    "https://yume.wiki/images/e/ed/Y2_ThePansyPath0.126_Map.png"
  ],
  "Blizzard Plains": [
    "https://yume.wiki/images/8/84/Blizzard_plains_map.png"
  ],
  "Experimentation Building": [],
  "Giant Desktop": [],
  "Test Facility": [
    "https://yume.wiki/images/3/39/TestFacilityMazeMap.png"
  ],
  "Mackerel Desert": [
    "https://yume.wiki/images/1/19/Map1623_Tuna_Desert.png"
  ],
  "Holiday Hell": [
    "https://yume.wiki/images/b/b6/HolidayHellMap.png"
  ],
  "Flooded Buildings": [
    "https://yume.wiki/images/1/19/FloodedBuildingsMap.png",
    "https://yume.wiki/images/1/1f/GrateAreaMap.png"
  ],
  "Platformer World": [],
  "Server Hub": [],
  "Crying Mural World": [
    "https://yume.wiki/images/5/5e/Map2080.png"
  ],
  "Pale Corridors": [
    "https://yume.wiki/images/2/2a/Pale_Corridors_map.png"
  ],
  "Rice Field": [
    "https://yume.wiki/images/8/80/Rice_field_annotated.png"
  ],
  "Submerged Signs World": [
    "https://yume.wiki/images/6/67/Submerged_Signs_World_map.png"
  ],
  "Knife World": [
    "https://yume.wiki/images/0/00/Knifeworldmap.png"
  ],
  "Checkerboard Clubhouse": [
    "https://yume.wiki/images/7/71/Y2_Checkerboard_Clubhouse.png"
  ],
  "Domino Constructions": [
    "https://yume.wiki/images/e/ee/DominoConstructionsMap.png"
  ],
  "Roadside Forest": [
    "https://yume.wiki/images/5/5a/RoadsideForestMap.png",
    "https://yume.wiki/images/b/b3/Mannequin_Sub-area.png"
  ],
  "Chromatic Limbo": [
    "https://yume.wiki/images/5/58/ChromaticLimboMap.png",
    "https://yume.wiki/images/0/05/ChromaticLimboPath.png"
  ],
  "Secret Society": [],
  "Abandoned Grounds": [
    "https://yume.wiki/images/9/95/Abandoned_grounds_map.png"
  ],
  "Tribulation Complex": [
    "https://yume.wiki/images/a/a3/TribulationComplexMap.png",
    "https://yume.wiki/images/5/5e/DarkDungeonMap.png"
  ],
  "Bacteria World": [
    "https://yume.wiki/images/1/18/Bacteria_world_annotated.png"
  ],
  "Color Capital": [
    "https://yume.wiki/images/1/1f/Color_Capital_Interior_map.png",
    "https://yume.wiki/images/6/6d/Color_Capital_map.png"
  ],
  "Glitch Hell": [
    "https://yume.wiki/images/3/33/GlitchHellMap.png"
  ],
  "Ice Block World": [
    "https://yume.wiki/images/d/dd/IceBlockWorldMap.png"
  ],
  "Video Game Graveyard": [
    "https://yume.wiki/images/4/4d/VideoGameGraveyardMap.png"
  ],
  "Ocular Locker Room": [
    "https://yume.wiki/images/8/80/Ocular_locker_room_map.png"
  ],
  "Witch Heaven": [
    "https://yume.wiki/images/2/27/WitchHeavenMap.png"
  ],
  "Pink Life World": [
    "https://yume.wiki/images/4/4c/PinkLifeWorldMap.png"
  ],
  "Warzone": [
    "https://yume.wiki/images/2/2a/WarzoneMap.png"
  ],
  "Deep Red Wilds": [
    "https://yume.wiki/images/c/c3/DeepRedWildsMap.png"
  ],
  "Nightfall Park": [
    "https://yume.wiki/images/1/12/Y2_Nightfall_Park.png"
  ],
  "Haunted Head World": [
    "https://yume.wiki/images/f/fd/Y2_Haunted_Head_World.png"
  ],
  "Monochrome Ranch": [],
  "Sushi Belt World": [
    "https://yume.wiki/images/f/f3/Y2_Sushi_Belt_World.png"
  ],
  "Underground Burial Site": [
    "https://yume.wiki/images/0/02/UndergroundBurialSiteCave.png",
    "https://yume.wiki/images/d/dc/UndergroundBurialSitePsycadelic.png",
    "https://yume.wiki/images/6/6e/UndergroundBurialSiteVisceral.png",
    "https://yume.wiki/images/f/f1/UndergroundBurialSiteWater.png"
  ],
  "Vibrant Mushroom World": [
    "https://yume.wiki/images/a/a9/VibrantMushroomWorldMap.png"
  ],
  "Blue Sanctuary": [
    "https://yume.wiki/images/4/43/BlueSanctuaryMap.png"
  ],
  "Labyrinth of Dread": [
    "https://yume.wiki/images/e/e3/Labyrinth_of_Dread_Map_v0122_p1.png"
  ],
  "Party Playground": [
    "https://yume.wiki/images/1/12/PartyPlaygroundMap.png"
  ],
  "Candlelit Factory": [],
  "Floating Tiled Islands": [
    "https://yume.wiki/images/9/90/Floating_Tiled_Islands_Map_v0122a.png"
  ],
  "Bishop Cathedral": [],
  "Coral Shoal": [
    "https://yume.wiki/images/b/b2/Coral_Shoal_Map.png"
  ],
  "Gemstone Cave": [
    "https://yume.wiki/images/3/3c/Y2_Gemstone_Cave.png"
  ],
  "Spacey Retreat": [
    "https://yume.wiki/images/2/28/(Map)_Spacey_Retreat.png"
  ],
  "Violet Galaxy": [
    "https://yume.wiki/images/d/d7/VioletGalaxyMap.png"
  ],
  "Frozen Glade": [
    "https://yume.wiki/images/4/4c/Frozen_Glade_Map.png"
  ],
  "Glowing Stars World": [
    "https://yume.wiki/images/9/97/Glowing_Stars_World_Map.png"
  ],
  "Board Game Islands": [
    "https://yume.wiki/images/9/91/2kki_Board_Game_Islands_Map.png"
  ],
  "Domino Maze": [
    "https://yume.wiki/images/4/4b/Dominomaze.png",
    "https://yume.wiki/images/d/de/Y2_DominoMaze_Map.png"
  ],
  "Flowerpot Outlands": [
    "https://yume.wiki/images/8/8d/Planter_outlands_annotated_map.png"
  ],
  "Port City": [],
  "Potato Starch World": [
    "https://yume.wiki/images/0/0c/Potato_Starch_World_map.png"
  ],
  "Vomiting Mouths World": [
    "https://yume.wiki/images/7/76/Vomiting_Mouths_World_map.png"
  ],
  "Cherry Willow Path": [
    "https://yume.wiki/images/2/2c/Cherry_willow_path_annotated.png"
  ],
  "Frozen Smile World": [
    "https://yume.wiki/images/d/d0/Frozen_smile_world_annotated.png"
  ],
  "Moonlit Street": [
    "https://yume.wiki/images/8/87/Moonlit_Street_map.png"
  ],
  "Autumn Sky": [
    "https://yume.wiki/images/6/63/AutumnSkyMap.png"
  ],
  "Eyeberry Orchard": [],
  "Chaotic Scribble World": [
    "https://yume.wiki/images/f/fb/Chaotic_Scribble_World_map.png"
  ],
  "Lit Tile Path": [
    "https://yume.wiki/images/8/87/Littilepath.png"
  ],
  "Obstacle Course 2": [],
  "Shunned Street": [],
  "Animal Heaven": [
    "https://yume.wiki/images/3/3b/Y2_Animal_Heaven.png"
  ],
  "Pastel Pools": [],
  "Neon Suburbs": [
    "https://yume.wiki/images/6/6b/Map1577.png"
  ],
  "Vaporwave Mall": [
    "https://yume.wiki/images/9/9c/Map1845_-_jsh.png"
  ],
  "Pierside Residence": [],
  "Reef Maze": [],
  "Marble Ruins": [
    "https://yume.wiki/images/0/0b/Marbleruins-annotated.png"
  ],
  "Tunnel Town": [],
  "Fish Person Shoal": [
    "https://yume.wiki/images/0/07/ShoalCavernsMap.png",
    "https://yume.wiki/images/4/42/FishPersonShoalMap.png",
    "https://yume.wiki/images/8/8c/UndergroundShoalMap.png"
  ],
  "Flamelit Wasteland": [
    "https://yume.wiki/images/8/81/HellCavernsMap.png",
    "https://yume.wiki/images/1/19/Hell_map_2kki.png"
  ],
  "Pillar Ark": [
    "https://yume.wiki/images/a/a9/2kkiPillarArk.png"
  ],
  "Void": [
    "https://yume.wiki/images/9/9d/Voidmap.png",
    "https://yume.wiki/images/2/2a/TheVoiδmap.png"
  ],
  "Topdown Dungeon": [
    "https://yume.wiki/images/5/52/Topdown_Dungeon_World_Fullres.png"
  ],
  "Apple Prison": [],
  "Nefarious Chessboard": [
    "https://yume.wiki/images/b/b9/Nefarious_chessboard_annotated_map.png"
  ],
  "Blood Red Beach": [],
  "Blue Streetlight World": [
    "https://yume.wiki/images/d/dd/BlueStreetlightWorldMap.png"
  ],
  "Retro Cartridge Game": [
    "https://yume.wiki/images/3/38/Retrocartgamemaplabeled.png"
  ],
  "TVLand": [
    "https://yume.wiki/images/a/a0/TVLand_map.png"
  ],
  "Blue Palm Road": [
    "https://yume.wiki/images/a/a2/Map2333.png"
  ],
  "Salsa Desert": [
    "https://yume.wiki/images/f/fc/Y2_Salsa_Desert.png"
  ],
  "Checkered Towers": [
    "https://yume.wiki/images/e/e8/Checkered_Towers_map.png"
  ],
  "Foggy Remnants": [
    "https://yume.wiki/images/6/62/Foggy_Remnants_map.png"
  ],
  "Thrift Shop": [
    "https://yume.wiki/images/3/3d/ThriftShopMap.png"
  ],
  "Expanded Corridors": [
    "https://yume.wiki/images/9/91/Expanded_Corridors_map.png"
  ],
  "Marshmallow Shallows": [
    "https://yume.wiki/images/5/56/UcYhdsO.png",
    "https://yume.wiki/images/8/8c/Y2eZNsS.png"
  ],
  "Red Sewers": [],
  "Lost Forest": [
    "https://yume.wiki/images/8/80/Lost_forest_map.png"
  ],
  "3D Underworld": [
    "https://yume.wiki/images/9/97/2kki3DUnderworld.png"
  ],
  "Kaleidoscope World": [
    "https://yume.wiki/images/4/47/Kaleidoscope_world_map.png"
  ],
  "Oblique Hell": [
    "https://yume.wiki/images/9/99/Obliquehellmap.png",
    "https://yume.wiki/images/9/96/Oblique_hell_map_annotated2.png"
  ],
  "FC Caverns A": [],
  "FC Caverns B": [],
  "FC Caverns C": [],
  "Streetlight Docks": [
    "https://yume.wiki/images/4/45/Streetlight_Docks_map.png",
    "https://yume.wiki/images/8/8b/Anglers_depths_map.png"
  ],
  "Glowing Tree Path": [],
  "Realm of Dice": [
    "https://yume.wiki/images/e/ef/Realm_of_dice_map.png"
  ],
  "Worksite": [
    "https://yume.wiki/images/6/69/Y2_Worksite.png"
  ],
  "Lavender Park": [
    "https://yume.wiki/images/b/bf/Y2_Lavender_Park.png"
  ],
  "Somber Establishment": [
    "https://yume.wiki/images/f/f0/2kkiSomberEstablishment.png",
    "https://yume.wiki/images/c/ce/2kkiSomberEstablishmentAnnotated.png"
  ],
  "Parking Garage": [
    "https://yume.wiki/images/4/4b/Parking2.png"
  ],
  "Basement of Oddities": [
    "https://yume.wiki/images/e/e9/Bom_by_miau.png"
  ],
  "Toxicology Research Facility": [
    "https://yume.wiki/images/5/51/Y2_Pufferfish_Extraction_Funland.png"
  ],
  "Bleeding Mushroom Garden": [
    "https://yume.wiki/images/e/e4/BleedingMushroomGarden_Map.png",
    "https://yume.wiki/images/e/ee/Map2237.png"
  ],
  "Pin Cushion Vineyard": [
    "https://yume.wiki/images/5/54/Map2283_2.png"
  ],
  "Primary Estate": [
    "https://yume.wiki/images/3/35/PrimaryEstate.png"
  ],
  "Sandstone Brick Maze": [
    "https://yume.wiki/images/b/b6/Sandstone_Brick_Maze_map.png"
  ],
  "Amoeba Woods": [
    "https://yume.wiki/images/b/b9/Map2391_Amoeba_Woods.jpg",
    "https://yume.wiki/images/4/46/Y2_Amoeba_Woods_-_Blue_Hallway.png"
  ],
  "Magenta Village": [
    "https://yume.wiki/images/5/52/Map2393_Magenta_Village.png",
    "https://yume.wiki/images/4/48/Magenta_Village_Maze_Area_map.png"
  ],
  "Sandy Cavern": [
    "https://yume.wiki/images/7/78/Map2394_Sandy_Cavern.png"
  ],
  "White Black World": [
    "https://yume.wiki/images/b/b2/White_Black_World_map.png"
  ],
  "Teru Teru Bozu Pond": [
    "https://yume.wiki/images/9/91/Teru_Teru_Bozu_Pond_map.png"
  ],
  "Birch Forest": [
    "https://yume.wiki/images/0/0b/BirchForest_annotated.png"
  ],
  "Bodacious Rotation Station": [
    "https://yume.wiki/images/2/20/Bodacious_Rotation_Station_map.png"
  ],
  "Glacier Maze": [
    "https://yume.wiki/images/0/06/Map2471_Glacier_Maze.png"
  ],
  "Lamp Puddle World": [
    "https://yume.wiki/images/f/f2/LPW_Map.png"
  ],
  "Under-Around": [
    "https://yume.wiki/images/c/c9/Y2_Under-Around.png"
  ],
  "Thumbtack World": [
    "https://yume.wiki/images/9/95/Y2_Thumbtack_World.png",
    "https://yume.wiki/images/4/4f/Epilogue.png"
  ],
  "False Guardians' Trials": [],
  "Deep Cold Path": [],
  "Beyond": [],
  "Colorful Sphere World": [
    "https://yume.wiki/images/4/4b/Colorful_Sphere_World_map.png"
  ],
  "Colorless Rose Garden": [
    "https://yume.wiki/images/4/46/CRGMap2.png"
  ],
  "Floating Window World": [
    "https://yume.wiki/images/4/4f/Floating_Window_World_map.png"
  ],
  "Gentle Meadows": [
    "https://yume.wiki/images/1/18/Gentle_Meadows_First_Area_map.png",
    "https://yume.wiki/images/d/de/Gentle_Meadows_Second_Area_map.png"
  ],
  "Low Tide Sands": [
    "https://yume.wiki/images/d/d7/Low_Tide_Sands_map.png"
  ],
  "Crystal Waters": [
    "https://yume.wiki/images/5/5c/Crystal_Waters_map.png"
  ],
  "Underground Base": [],
  "Abyssal Garden": [
    "https://yume.wiki/images/7/7f/Abyssal_Garden_map.png"
  ],
  "Collision World": [
    "https://yume.wiki/images/d/d6/Collision_World_map.png"
  ],
  "Silent Forest": [
    "https://yume.wiki/images/2/2e/Silentforest00annotated.png"
  ],
  "Slime Village": [
    "https://yume.wiki/images/e/e1/Slime_Village_map.png"
  ],
  "Haunted Laboratory": [
    "https://yume.wiki/images/8/8c/Haunted_Laboratory_map.png"
  ],
  "River Road A": [
    "https://yume.wiki/images/2/2c/River_Road.png"
  ],
  "River Road B": [
    "https://yume.wiki/images/2/2c/River_Road.png"
  ],
  "Mirrored Pathways": [
    "https://yume.wiki/images/b/b2/Mirrored_Pathways_map.png"
  ],
  "Ticking Blackout Zone": [
    "https://yume.wiki/images/7/78/Y2_Ticking_Blackout_Zone.png"
  ],
  "Mountain Range": [
    "https://yume.wiki/images/e/e7/Y2_Mountain_Range.png"
  ],
  "Abandoned Campsite": [
    "https://yume.wiki/images/6/68/Abandoned_Campsite_map.png"
  ],
  "Pointing Labyrinth": [
    "https://yume.wiki/images/e/e2/Pointing_Labyrinth_map0122.png"
  ],
  "Blue Shape Zone": [
    "https://yume.wiki/images/3/3b/Blue_Shape_Zone_map.png"
  ],
  "Chain World": [
    "https://yume.wiki/images/3/33/Chain_World_map.png"
  ],
  "Slate Doorway": [
    "https://yume.wiki/images/5/5f/Slate_Doorway_map.png"
  ],
  "Heart Pattern Pathway": [
    "https://yume.wiki/images/e/ef/Heart_Pattern_Pathway_map.png"
  ],
  "Copper Tube Desert": [
    "https://yume.wiki/images/7/72/Copper_Tube_Desert_map.png"
  ],
  "Dark Red Wasteland": [],
  "Foggy Red Street": [
    "https://yume.wiki/images/4/4c/Foggy_Red_Street_map.png"
  ],
  "Pastel Grassland": [
    "https://yume.wiki/images/8/8b/Pastel_Grassland_map.png"
  ],
  "Sepia Factory": [],
  "Twisted Forest": [
    "https://yume.wiki/images/9/9d/Twisted_Forest_map.png"
  ],
  "Blue Rock Depths": [
    "https://yume.wiki/images/2/26/Blue_Rock_Depths_map.png"
  ],
  "Flowery Ponds": [
    "https://yume.wiki/images/2/2b/Flowery_Ponds_map.png"
  ],
  "Salmon-shaded Settlement": [
    "https://yume.wiki/images/3/34/Salmon-shaded_Settlement_map.png"
  ],
  "Scale Model Exhibit": [
    "https://yume.wiki/images/7/73/2kkiScaleModelExhibit.png"
  ],
  "Subtractive Color City": [
    "https://yume.wiki/images/a/ac/Subtractive_Color_City_First_Area.png",
    "https://yume.wiki/images/2/2e/Subtractive_Color_City_City_Area.png"
  ],
  "Hall of Memories": [
    "https://yume.wiki/images/2/23/Y2_Hall_of_Memories_-_Chase_Sequences.png"
  ],
  "Haribote Landscape": [],
  "Ethnic World": [
    "https://yume.wiki/images/e/e4/Ethnic_World_map.png"
  ],
  "Fox Temple": [],
  "Stone Hand Flatland": [
    "https://yume.wiki/images/c/cb/Stone_Hand_Flatland_map.png"
  ],
  "Himalayan Salt Shoal": [
    "https://yume.wiki/images/f/f7/2kkiHimalayanSaltShoal.png",
    "https://yume.wiki/images/4/4e/2kkiHimalayanSaltShoalSubarea.png"
  ],
  "Swamp of Remembrance": [
    "https://yume.wiki/images/b/b5/Swamp_of_Remembrance_First_Area_map.png",
    "https://yume.wiki/images/2/25/Swamp_of_Remembrance_Deeper_Marsh_map.png"
  ],
  "Construction Sign World": [
    "https://yume.wiki/images/6/66/Construction_Sign_World_map.png"
  ],
  "Lavender Office": [
    "https://yume.wiki/images/6/64/Lavender_Office_map.png"
  ],
  "Butcher Hollow": [
    "https://yume.wiki/images/2/24/Y2_Butcher_Hollow.png"
  ],
  "Dream Route": [
    "https://yume.wiki/images/8/89/DreamRoutePresentParkMap.png",
    "https://yume.wiki/images/1/1c/Deltashedgemaze.png",
    "https://yume.wiki/images/e/e9/Amethyst_Caves_Past_Map.png"
  ],
  "Mourning Void": [
    "https://yume.wiki/images/3/32/Mourning_Void_map0122.png"
  ],
  "Serpent Ruins A": [
    "https://yume.wiki/images/d/de/Serpent_Ruins_A_map0122.png"
  ],
  "Tranquil Park": [
    "https://yume.wiki/images/8/81/Tranquil_Park_map0122.png"
  ],
  "Emotions Maze": [
    "https://yume.wiki/images/b/b4/EmotionsMazeMap.png"
  ],
  "Pale Plateau": [
    "https://yume.wiki/images/9/95/Y2_Pale_Plateau.png"
  ],
  "Serpent Ruins B": [
    "https://yume.wiki/images/c/c4/SerpentRuinsPart1Map.png",
    "https://yume.wiki/images/6/69/SerpentRuinsPart2Map.png"
  ],
  "Space Tunnel": [],
  "Zeta District": [
    "https://yume.wiki/images/c/cb/Zeta_district_new.png"
  ],
  "Crow Forest": [
    "https://yume.wiki/images/e/e9/Y2_Crow_Forest.png"
  ],
  "Peaceful Shoal": [
    "https://yume.wiki/images/a/a8/Y2_Peaceful_Shoal.png"
  ],
  "Soy Basket Void": [
    "https://yume.wiki/images/5/5d/Soy_Basket_Void_Map_v0122a.png"
  ],
  "Blossoming Wonderland": [
    "https://yume.wiki/images/4/41/Blossoming_Wonderland_map.png"
  ],
  "Candy Shoal": [
    "https://yume.wiki/images/2/2d/Map_of_Candy_Shoal.png"
  ],
  "Festive Archipelago": [
    "https://yume.wiki/images/a/a6/Festive_Archipelago_map.png"
  ],
  "Muffin Spice World": [
    "https://yume.wiki/images/a/ae/Muffin_Spice_World_map.png"
  ],
  "Clubhouse Yard": [
    "https://yume.wiki/images/9/99/Clubhouse_Yard_map.png"
  ],
  "Empty Abode": [
    "https://yume.wiki/images/1/1a/Empty_Abode_map.png"
  ],
  "Jade Block Mounds": [
    "https://yume.wiki/images/4/48/Jade_Block_Mounds_map.png"
  ],
  "Stingray Skies": [
    "https://yume.wiki/images/9/9e/Stingray_Skies_map.png"
  ],
  "Toy Desert": [
    "https://yume.wiki/images/f/fb/Toy_Desert_map.png"
  ],
  "Wacky Worms": [
    "https://yume.wiki/images/0/0a/Wacky_Worms_map.png"
  ],
  "Autumn Park": [
    "https://yume.wiki/images/a/ab/Autumn_Park_Map_v0122a_p3.png"
  ],
  "Gumball World": [
    "https://yume.wiki/images/2/2c/Y2_Gumball_World.png"
  ],
  "Playbox Passage": [
    "https://yume.wiki/images/d/dd/Playbox_Passage_map.png"
  ],
  "Bloodied Mural World": [
    "https://yume.wiki/images/7/7b/Y2_Bloodied_Mural_World.png",
    "https://yume.wiki/images/c/ce/Y2_Bloodied_Mural_World-Corrupted.png"
  ],
  "Candle Block World": [
    "https://yume.wiki/images/c/cf/Y2_Candle_Block_World_-_Corrupted.png",
    "https://yume.wiki/images/e/e8/Y2_Candle_Block_World.png"
  ],
  "Check-Disk Nexus": [],
  "Indigo Pyramid Heaven": [
    "https://yume.wiki/images/e/e6/Y2_Indigo_Pyramid_Heaven.png"
  ],
  "Ink Forest": [
    "https://yume.wiki/images/8/8d/Y2_Ink_Forest.png"
  ],
  "Neon Circle Walkway": [
    "https://yume.wiki/images/8/82/Y2_Neon_Circle_Walkway.png"
  ],
  "Numeral Hallways": [
    "https://yume.wiki/images/a/a0/Y2_Numeral_Hallways.png",
    "https://yume.wiki/images/7/71/Y2_Numeral_Hallways-Corrupted.png"
  ],
  "Spiral Sign Abyss": [
    "https://yume.wiki/images/8/87/Y2_Spiral_Sign_Abyss.png",
    "https://yume.wiki/images/7/70/Y2_Spiral_Sign_Abyss_-_Corrupted_Version.png"
  ],
  "Vibrant Lamppost World": [
    "https://yume.wiki/images/7/7a/Y2_Vibrant_Lamppost_World.png"
  ],
  "X-Maze": [
    "https://yume.wiki/images/9/9c/Xmazelayout.png"
  ],
  "Sunrise Road": [
    "https://yume.wiki/images/8/85/Y2_Sunrise_Road.png",
    "https://yume.wiki/images/7/7c/Y2_Sunrise_Road-Apple_Home.png"
  ],
  "Cerulean School": [
    "https://yume.wiki/images/3/3a/Y2_Cerulean_School.png"
  ],
  "Morning Suburbs": [
    "https://yume.wiki/images/1/1b/2kkiMorningSuburbs.png"
  ],
  "Summer Sky Coast": [
    "https://yume.wiki/images/b/bd/Y2_Summer_Sky_Coast.png"
  ],
  "Urban Heights": [
    "https://yume.wiki/images/e/e1/Y2_Urban_Heights.png"
  ],
  "Cookie Isle": [
    "https://yume.wiki/images/d/dd/Y2_Cookie_Isle.png"
  ],
  "Humanism": [
    "https://yume.wiki/images/e/e9/Y2_Humanity_World-Pink_Haven.png",
    "https://yume.wiki/images/b/b6/Y2_Humanity_World.png"
  ],
  "Rainy Woods Path": [
    "https://yume.wiki/images/2/24/Y2_Rainy_Woods_Path.png"
  ],
  "Bloodsoaked Pathways": [
    "https://yume.wiki/images/9/91/Bloodsoaked_Pathways_map.png"
  ],
  "Sakura Ruins": [
    "https://yume.wiki/images/1/1e/Sakura_Ruins_map.png"
  ],
  "Miso Soup Dungeon": [
    "https://yume.wiki/images/f/f9/Miso_Soup_Dungeon_Map_v122c_p1.png",
    "https://yume.wiki/images/d/d5/Whale_Heaven_Map_v122c_p1.png"
  ],
  "Heart Maze": [
    "https://yume.wiki/images/c/c9/Heart_Maze_Map.png"
  ],
  "Meadow of Faces": [
    "https://yume.wiki/images/6/6c/Y2_Meadow_of_Faces.png"
  ],
  "Exclamation Zone": [
    "https://yume.wiki/images/3/3b/Exclamation_Zone_map.png"
  ],
  "Mixed Beach": [
    "https://yume.wiki/images/2/26/Y2_Mixed_Beach-Mixed_Path.png",
    "https://yume.wiki/images/8/82/Y2_Mixed_Beach-Beach_Area.png"
  ],
  "Doodle World": [
    "https://yume.wiki/images/5/52/Y2_Doodle_World-First_Area.png",
    "https://yume.wiki/images/8/8e/Y2_Doodle_World-Second_Area.png"
  ],
  "Shrike Void": [
    "https://yume.wiki/images/a/a5/Shrike_Void_map.png"
  ],
  "Rainbow Snow Plateau": [
    "https://yume.wiki/images/8/86/Rainbow_Snow_Plateau_Map.png"
  ],
  "Brutal Sewing Landscape": [
    "https://yume.wiki/images/7/75/Brutal_Sewing_Landscape.png"
  ],
  "Graveyard of Repentance": [
    "https://yume.wiki/images/2/26/GraveyardOfRepentanceMap2.png",
    "https://yume.wiki/images/f/f8/Prologue.png"
  ],
  "Haniwa Hollow": [
    "https://yume.wiki/images/a/ac/Y2_Haniwa_Hollow.png"
  ],
  "Cheesecake Mountain": [
    "https://yume.wiki/images/9/92/Cheesecake-Mountain-Map-v0123a-p3.png",
    "https://yume.wiki/images/a/a3/Y2_Parrot_Empire.png"
  ],
  "Skyline Highway": [],
  "Vinegar Vicinity": [],
  "Moth Gallery": [
    "https://yume.wiki/images/7/72/Moth_Gallery_map.png"
  ],
  "Breezy Golfing District": [
    "https://yume.wiki/images/c/c0/Y2_Breezy_Golfing_District.png"
  ],
  "Crossing Archipelago": [
    "https://yume.wiki/images/0/0a/Crossing_Archipelago_map.png"
  ],
  "Lively Tower": [],
  "Capricorn Palace": [
    "https://yume.wiki/images/e/ea/Capricornpalace-map.png"
  ],
  "Sour Void": [
    "https://yume.wiki/images/f/f8/Sour_Void_map.png"
  ],
  "Cruel Bloody Hallways": [
    "https://yume.wiki/images/0/0d/Cruel_Bloody_Hallways_map.png"
  ],
  "Ghostly Woods": [],
  "Glacial Geyser Grounds": [
    "https://yume.wiki/images/c/c7/Glacial_Geyser_Grounds_map.png",
    "https://yume.wiki/images/b/be/GlacialGeyserGroundsSubmergedMap.png"
  ],
  "Grilled Octopus World": [],
  "Ice Thorn Cave": [
    "https://yume.wiki/images/7/7b/Ice_Thorn_Cave_map.png"
  ],
  "Ruby Forest": [],
  "Sea Slug House": [],
  "Axolotl Abode": [
    "https://yume.wiki/images/8/83/Y2_Axolotl_Abode.png",
    "https://yume.wiki/images/3/37/Y2_Axolotl_Abode_Rainy_Version.png"
  ],
  "Confection Estate": [
    "https://yume.wiki/images/c/c4/ConfectionEstateMap.png"
  ],
  "Fish Oil Swamp": [
    "https://yume.wiki/images/5/50/2kkiFishOilSwamp.png"
  ],
  "Clock World": [
    "https://yume.wiki/images/b/bb/Clock_World_map.png"
  ],
  "Amethyst Ocean": [
    "https://yume.wiki/images/4/4e/Y2_Amethyst_Ocean.png"
  ],
  "Conifer World": [
    "https://yume.wiki/images/9/91/Conifer_World_map.png"
  ],
  "Dusty Grey Town": [
    "https://yume.wiki/images/f/fd/Dusty_Grey_Town_Exterior_map.png",
    "https://yume.wiki/images/e/ec/Y2_Dusty_Grey_Town-Interior.png"
  ],
  "Miasma": [
    "https://yume.wiki/images/4/40/Miasmamap.png"
  ],
  "Teal District": [
    "https://yume.wiki/images/4/4c/Teal_District_map.png"
  ],
  "Balloon Park": [
    "https://yume.wiki/images/9/90/Y2_Balloon_Park.png"
  ],
  "Burial Depths": [
    "https://yume.wiki/images/a/ae/Y2_Burial_Depths.png"
  ],
  "Legacy Nexus": [
    "https://yume.wiki/images/2/25/2kkiLegacyNexus.png"
  ],
  "Motel Breeze": [
    "https://yume.wiki/images/e/ec/Y2_Motel_Breeze.png"
  ],
  "Sands of Self": [
    "https://yume.wiki/images/f/f8/2kkiSandsOfSelf.png",
    "https://yume.wiki/images/f/f3/Y2_Sands_of_Self-Underwater_Section.png"
  ],
  "Burgundy Flats": [
    "https://yume.wiki/images/c/c0/BurgundyFlatsMap.png"
  ],
  "Pale Brick Basement": [
    "https://yume.wiki/images/b/b1/Map2692.png"
  ],
  "Blue Apartments": [
    "https://yume.wiki/images/9/96/Y2_Blue_Apartments.png"
  ],
  "Underground Subway": [
    "https://yume.wiki/images/3/31/Y2_Underground_Subway.png"
  ],
  "Critter Village": [
    "https://yume.wiki/images/d/d1/CritterVillageTileFactoryMap.png",
    "https://yume.wiki/images/5/58/CritterVillageMap.png"
  ],
  "Chaser Academy": [],
  "Dice Swamp": [
    "https://yume.wiki/images/4/44/Y2_Dice_Swamp.png"
  ],
  "Rose Manor": [
    "https://yume.wiki/images/a/a1/Rose_Manor_map.png"
  ],
  "Valentine Meadow": [
    "https://yume.wiki/images/b/b3/Valentine_meadow_map.png"
  ],
  "Metallic Pathway": [],
  "Rifle Wasteland": [
    "https://yume.wiki/images/b/b0/2kkiRifleWasteland.png"
  ],
  "Sweet Medical Utopia": [
    "https://yume.wiki/images/1/18/Sweet_Medical_Utopia_map.png"
  ],
  "Vantablack Isles": [
    "https://yume.wiki/images/e/e7/Vantablack_Isles_map.png"
  ],
  "Lemonade Edifice": [
    "https://yume.wiki/images/b/bb/2kkiLemonadeEdifice.png"
  ],
  "Lemonade Pool": [
    "https://yume.wiki/images/3/3c/2kkiLemonadePoolMap.png"
  ],
  "Pulsating Yellow Passage": [
    "https://yume.wiki/images/3/31/2kki_Map2764_125a_p1.png"
  ],
  "Radiant Rainbow Reef": [
    "https://yume.wiki/images/5/50/2kkiRadiantRainbowReef.png"
  ],
  "Alrescha Sea": [
    "https://yume.wiki/images/9/97/AlreschaSeaMap.png"
  ],
  "Scrap Metal Passage": [],
  "Dim Graveyard": [
    "https://yume.wiki/images/5/5a/Dim_Graveyard_map.png"
  ],
  "Orange Forest": [
    "https://yume.wiki/images/c/c7/OrangeForestMap.png"
  ],
  "Claustrophobia": [],
  "Flicker Trail": [],
  "House of Vases": [
    "https://yume.wiki/images/1/15/House_of_Vases_Map.png"
  ],
  "Moonlit Pharmacy": [
    "https://yume.wiki/images/5/52/Moonlit_Pharmacy.png"
  ],
  "Seaside Highway": [
    "https://yume.wiki/images/8/8d/Seaside_Highway_Map.png"
  ],
  "Violet Checkered Lounge": [
    "https://yume.wiki/images/e/e6/Violet_Checkered_Lounge_map.png"
  ],
  "Faded Blocks Void": [],
  "Pen Passage": [],
  "Pleasure Street": [],
  "Nerium Lab": [],
  "Azure Overdose Zone": [
    "https://yume.wiki/images/c/c2/AzureODZone.png"
  ],
  "Unfamiliar City": [
    "https://yume.wiki/images/e/e1/Y2_Unfamiliar_City_0.128.png"
  ],
  "Binding Site": [
    "https://yume.wiki/images/4/45/Y2_Binding_Site.png"
  ],
  "Grayscale Bookshelves": [
    "https://yume.wiki/images/c/c7/Y2_Grayscale_Bookshelves.png"
  ],
  "Vivid Blue Flatlands": [
    "https://yume.wiki/images/b/bb/Y2_Vivid_Blue_Flatlands.png"
  ],
  "Art Exposition": [
    "https://yume.wiki/images/d/d9/Y2_Art_Exposition.png"
  ],
  "Lonely Mint Cemetery": [
    "https://yume.wiki/images/3/33/Lonely_Mint_Cemetery_map.png"
  ],
  "Watching Waters": [
    "https://yume.wiki/images/b/b2/Watching_Waters_map.png"
  ],
  "Fake Apartments": [],
  "Weary Potted Plant World": [
    "https://yume.wiki/images/e/ed/Weary_Potted_Plant_World_Map.png"
  ],
  "White Pillar Docks": [
    "https://yume.wiki/images/5/5c/Y2_WhitePillarDocks_Map.png"
  ],
  "Bikini Beach": [
    "https://yume.wiki/images/4/43/Bikinibeachmap.png"
  ],
  "Seaside Circuit": [
    "https://yume.wiki/images/b/b0/Y2_Seaside_Circuit.png"
  ],
  "Pollution District": [
    "https://yume.wiki/images/c/c7/PollutionDistrictMap.png"
  ],
  "Festive Hotel": [],
  "Epsilon District": [
    "https://yume.wiki/images/9/9d/Y2_Epsilon_District-Main_Area.png",
    "https://yume.wiki/images/b/be/Y2_Epsilon_District-Gray_Sewers.png"
  ],
  "File Viewer": [],
  "Blissful Clinic": [],
  "Maniacal Faces Zone": [],
  "Silver Rune Hall": [],
  "Stargazing Puddles": [
    "https://yume.wiki/images/7/7a/Stargazing_Puddles_map.png"
  ],
  "Kitsune Residence": [
    "https://yume.wiki/images/b/b1/Kitsune_Residence_map.png"
  ],
  "Candyfloss Sea": [],
  "Cuckoo Skyline Express": [],
  "Crow's Nest": [
    "https://yume.wiki/images/c/c0/Y2_Crow's_Nest.png"
  ],
  "Bloom 99": [
    "https://yume.wiki/images/0/09/Y2_Bloom_99.png"
  ],
  "Stereo Station": [],
  "Auburn Villa": [
    "https://yume.wiki/images/f/fd/Y2_Auburn_Villa.png"
  ],
  "Bone Zone": [
    "https://yume.wiki/images/e/ea/Y2_Bone_Zone.png"
  ],
  "Dream Precinct": [
    "https://yume.wiki/images/c/cb/Y2_Dream_Precinct.png"
  ],
  "Ethereal Garden": [
    "https://yume.wiki/images/f/fe/Y2_EtherealGarden_Map.png"
  ],
  "Pinwheel Countryside": [
    "https://yume.wiki/images/d/d3/PinwheelCountry1Map.png",
    "https://yume.wiki/images/5/5c/PinwheelCountry2Map.png"
  ],
  "Pitch Black Plateau": [
    "https://yume.wiki/images/0/0d/Y2_Pitch_Black_Plateau-Main_Area.png",
    "https://yume.wiki/images/5/59/Y2_Pitch_Black_Plateau-The_Emptiness.png"
  ],
  "Rose Factory": [
    "https://yume.wiki/images/8/81/RoseFactoryMap.png"
  ],
  "Sapphire Hand Town": [
    "https://yume.wiki/images/c/c8/SapphireHandTownMap.png"
  ],
  "Somber Waterfront": [
    "https://yume.wiki/images/b/b0/2kki_Map2766_125a_p1.png"
  ],
  "Sunken Spore Sea": [
    "https://yume.wiki/images/f/fa/SunkenSporeSeaMap.png"
  ],
  "Violent Fruit District": [
    "https://yume.wiki/images/8/85/Y2_Violent_Fruit_District.png"
  ],
  "Wetlands of Tranquility": [
    "https://yume.wiki/images/d/dc/Y2_Wetlands_of_Tranquility.png"
  ],
  "Acoustic Lounge": [
    "https://yume.wiki/images/d/d8/NoiseMazeMap.png",
    "https://yume.wiki/images/e/e9/Decayedacousticloungemap.png",
    "https://yume.wiki/images/0/03/Map2467-4.png",
    "https://yume.wiki/images/7/7a/AcousticLounge_MapSimplified.png"
  ],
  "Ancient Stone Plates": [
    "https://yume.wiki/images/7/77/AncientStonePlatesMap_MAP3134.png"
  ],
  "Archery Cavalry World": [
    "https://yume.wiki/images/e/e6/Map2897.png"
  ],
  "Autumn Pastel Plains": [
    "https://yume.wiki/images/2/22/Map2588.png"
  ],
  "Bilge Puddle World": [
    "https://yume.wiki/images/1/17/Map2636.png"
  ],
  "Blinking Docks": [
    "https://yume.wiki/images/3/3f/Map2637.png"
  ],
  "Blue Black Maze": [
    "https://yume.wiki/images/0/04/Y2_Blue_Black_Maze.png",
    "https://yume.wiki/images/1/10/Y2_Blue_Black_Maze_Annoated.png"
  ],
  "Bottomless Woods": [
    "https://yume.wiki/images/a/a0/Y2_Bottomless_Woods.png"
  ],
  "Broken Shoal": [
    "https://yume.wiki/images/b/b2/BrokenShoalMap.png"
  ],
  "Candlestick World": [
    "https://yume.wiki/images/5/59/Map3137.png"
  ],
  "Cocoa Trap Streets": [],
  "Collaged Charcoal World": [
    "https://yume.wiki/images/b/b8/Y2_Collaged_Charcoal_World.png"
  ],
  "Corrupted Data Purgatory": [
    "https://yume.wiki/images/1/19/Corrupteddatapurgatorymap.png"
  ],
  "Crushed Shoal": [
    "https://yume.wiki/images/3/33/Y2_Crushed_Shoal.png"
  ],
  "Dal Segno Labyrinth": [
    "https://yume.wiki/images/7/7c/Map2466-3.png"
  ],
  "Downpour": [
    "https://yume.wiki/images/9/94/DownpourMap.png"
  ],
  "Earth Brick World": [
    "https://yume.wiki/images/2/27/Earth_Brick_World.png"
  ],
  "Encrypted Labyrinth": [
    "https://yume.wiki/images/d/db/EncryptedLabyrinth.png",
    "https://yume.wiki/images/5/51/EncryptedLabyrinth_Annotated.png"
  ],
  "Fall Shoal": [
    "https://yume.wiki/images/3/33/FallShoalMap.png"
  ],
  "Faraway Forest": [
    "https://yume.wiki/images/9/9d/Farawayforestmap.png"
  ],
  "Faraway Lands": [
    "https://yume.wiki/images/3/34/Farawaylandsmap.png"
  ],
  "Found Forest": [
    "https://yume.wiki/images/6/60/2kkiFoundForestUnannotated.png"
  ],
  "Foundation Passage": [
    "https://yume.wiki/images/e/ef/Y2_Foundation_Passage.png"
  ],
  "Fragmented Station": [],
  "Glimmer Cliffs": [
    "https://yume.wiki/images/f/f0/Glimmercliffsmap.png"
  ],
  "Glittering Desert": [
    "https://yume.wiki/images/0/09/Map2581.png"
  ],
  "Irregular Mosaic World": [
    "https://yume.wiki/images/4/49/Map2971.png"
  ],
  "Kaprekar Number Zone": [
    "https://yume.wiki/images/2/2c/Y2_Kaprekar_Number_Zone.png"
  ],
  "Limbus Plains": [
    "https://yume.wiki/images/5/59/Y2_Limbus_Plains.png"
  ],
  "Lost Crypt": [
    "https://yume.wiki/images/6/62/Lostcryptmap.png"
  ],
  "Moon and Castles": [
    "https://yume.wiki/images/d/d7/Y2_Moon_and_Castles.png"
  ],
  "Moonlight Lantern Forest": [
    "https://yume.wiki/images/f/fc/Map2459.png"
  ],
  "Ornament World": [
    "https://yume.wiki/images/6/66/OrnamentWorldMap.png"
  ],
  "Paraffin Embedding Ruins": [
    "https://yume.wiki/images/5/51/Paraffin_Embedding_Ruins_map.png"
  ],
  "Parallel Graveyard": [
    "https://yume.wiki/images/3/38/Map2662-1.png"
  ],
  "Pulsating Cubes": [
    "https://yume.wiki/images/d/de/Pulsatingcubesmap.png"
  ],
  "RGB Spectral Passage": [
    "https://yume.wiki/images/7/73/RGB_Spectral_Passage.png"
  ],
  "Rainy Sundial": [],
  "Red Marbling World": [
    "https://yume.wiki/images/b/bd/Redmarblingworld2.png"
  ],
  "Retro Dungeon": [
    "https://yume.wiki/images/6/65/Y2_Retro_Dungeon.png"
  ],
  "Ripples Maze": [
    "https://yume.wiki/images/b/b2/Ripplesmazemap.png"
  ],
  "Rubber Duck Islands": [
    "https://yume.wiki/images/6/62/JIVV_RubberDuckIslands_Map.png"
  ],
  "Runic Ruins": [
    "https://yume.wiki/images/1/11/Map2457-2.png",
    "https://yume.wiki/images/7/78/Map2458.png"
  ],
  "Sealed Rainbow Pillars": [
    "https://yume.wiki/images/5/51/Map2668.png"
  ],
  "Serene Garden": [
    "https://yume.wiki/images/5/59/Y2_Serene_Garden.png"
  ],
  "Sheltered Drains": [
    "https://yume.wiki/images/1/1c/Y2_Sheltered_Drains.png"
  ],
  "Snow Black": [
    "https://yume.wiki/images/1/18/Y2_Snow_Black.png"
  ],
  "Snowfall Pier": [
    "https://yume.wiki/images/d/d3/Snowfallpiermap.png"
  ],
  "Spectral Hub": [],
  "Stagnant Bottom": [
    "https://yume.wiki/images/d/d1/Map2881.png"
  ],
  "Stained Pathway": [
    "https://yume.wiki/images/0/06/Y2_Stained_Pathway.png"
  ],
  "Steam Engine": [],
  "Sunken Paradise": [
    "https://yume.wiki/images/d/dc/Map2341.png"
  ],
  "Sweets Chaos": [
    "https://yume.wiki/images/1/17/SweetsChaosMap.png",
    "https://yume.wiki/images/0/0a/SweetsChaosColorsMazeMap.png"
  ],
  "Techno Rave Ruins": [
    "https://yume.wiki/images/e/e5/Technoraveruinsmap.png"
  ],
  "Upside-down Forest World": [
    "https://yume.wiki/images/7/73/Y2_Upside-down_Forest_World.png"
  ],
  "Wheat Field": [],
  "Windowed Plains": [
    "https://yume.wiki/images/1/1e/WindowedPlainsMap.png"
  ],
  "Winter Petal Nebula": [],
  "Withering Plains": [
    "https://yume.wiki/images/c/c2/Map2664.png"
  ],
  "Scribble Notepad": [
    "https://yume.wiki/images/3/3e/Map2771.png"
  ],
  "Birch Tree Docks": [
    "https://yume.wiki/images/7/75/Map2343.png"
  ],
  "Sunset Savannah": [],
  "Beige Handful World": [
    "https://yume.wiki/images/0/05/Y2_Beige_Handful_World.png"
  ],
  "Shattered Stars World": [
    "https://yume.wiki/images/1/13/Y2_ShatteredStarsWorld_Map.png"
  ],
  "Technicolor Towers": [
    "https://yume.wiki/images/6/60/2kkiTechnicolorTowers.png"
  ],
  "Crimson Chair Area": [
    "https://yume.wiki/images/8/8d/Y2_Crimson_Chair_Area.png"
  ],
  "Crossing Forest": [
    "https://yume.wiki/images/4/49/Crossing_Forest_map.png",
    "https://yume.wiki/images/7/73/Crossing_Forest_Thickets_map.png"
  ],
  "Interconnected Wire World": [
    "https://yume.wiki/images/f/f9/Y2_Interconnected_Wire_World.png"
  ],
  "Grayscale Mountain Ring": [],
  "Spear Hell Maze": [],
  "Goldfish Pond": [
    "https://yume.wiki/images/0/0e/Goldfish_Pond.png"
  ],
  "Scattered Sky Fields": [
    "https://yume.wiki/images/6/6c/Scattered_Sky_Fields.png"
  ],
  "Turquoise Cityscape": [],
  "Monochrome DECK Area": [
    "https://yume.wiki/images/e/e1/Y2_Monochrome_DECK_Area.png"
  ],
  "Misty Streets": [],
  "Brutalist Complex": [
    "https://yume.wiki/images/a/a4/Y2_Brutalist_Complex.png"
  ],
  "Cookie Haven": [
    "https://yume.wiki/images/7/78/Y2_Cookie_Haven.png"
  ],
  "Infinite Pools": [
    "https://yume.wiki/images/1/18/PGray_InfinitePools_Map.png",
    "https://yume.wiki/images/a/af/PGray_InfinitePools_MapAnnotated.png"
  ],
  "Rune Dunes": [
    "https://yume.wiki/images/7/7d/Y2_Rune_Dunes.png"
  ],
  "Knit Plains": [
    "https://yume.wiki/images/f/f4/Y2_Knit_Plains.png"
  ],
  "Pattern Cubes World": [
    "https://yume.wiki/images/a/a0/Y2_Pattern_Cubes_World.png"
  ],
  "Megalith Grove": [
    "https://yume.wiki/images/a/a5/Y2_Megalith_Grove.png"
  ],
  "English Thundershower": [
    "https://yume.wiki/images/2/2d/Y2_English_Thundershower.png"
  ],
  "Suspended Steamworks": [
    "https://yume.wiki/images/1/16/Y2_Suspended_Steamworks.png"
  ],
  "Overlapping Moons": [],
  "Dense Forest Path": [],
  "Monochrome Tile Corridor": [],
  "Vacant Rooms": [
    "https://yume.wiki/images/c/ca/Y2_Vacant_Rooms.png"
  ],
  "Derelict Bricks": [
    "https://yume.wiki/images/5/56/2kkiDerelictBricksMap.png"
  ],
  "Bracken Plains": [
    "https://yume.wiki/images/e/e7/Y2_Bracken_Plains.png"
  ],
  "Grape Mall": [
    "https://yume.wiki/images/a/a0/Y2_Grape_Mall.png"
  ],
  "Rural Farmland": [
    "https://yume.wiki/images/e/ec/Y2_Rural_Farmland.png"
  ],
  "Gachapon Plains": [
    "https://yume.wiki/images/c/c8/Y2_Gachapon_Plains.png"
  ],
  "Loquat Orchard": [
    "https://yume.wiki/images/b/b7/LoquatOrchardMap.png"
  ],
  "Crescent Tile World": [
    "https://yume.wiki/images/2/22/2kkiCrescentTileWorldMainAreaAnnotated.png",
    "https://yume.wiki/images/0/07/ResentmentMap.png"
  ],
  "Cement World": [
    "https://yume.wiki/images/3/34/Y2_Cement_World.png"
  ],
  "Underground Runological Warehouse": [
    "https://yume.wiki/images/b/bb/Y2_Underground_Runological_Warehouse.png"
  ],
  "ASCII Symbol Zone": [
    "https://yume.wiki/images/0/09/Y2_ASCII_Symbol_Zone.png"
  ],
  "Musical Note Maze": [
    "https://yume.wiki/images/6/6f/Y2_Musical_Note_Maze.png"
  ],
  "Cotton Candy Shoal": [
    "https://yume.wiki/images/d/d8/Y2_Cotton_Candy_Shoal.png"
  ],
  "Alto": [],
  "Tunneltrack": [],
  "Somber Office": [
    "https://yume.wiki/images/2/20/Somber_Office_map.png"
  ],
  "Hydrangea Waters": [
    "https://yume.wiki/images/0/00/HydrangeaWatersMap.png"
  ],
  "Waterlogged Flats": [
    "https://yume.wiki/images/b/b0/Y2_Waterlogged_Flats.png"
  ],
  "Disfigured Expanse": [
    "https://yume.wiki/images/d/d4/Y2_Disfigured_Expanse.png"
  ],
  "Shaded Hallways": [],
  "Polygon Mazescape": [
    "https://yume.wiki/images/c/cd/Y2_Polygon_Mazescape.png"
  ],
  "Night World": [
    "https://yume.wiki/images/2/2b/Night_World_map.png"
  ],
  "Dream Tropics": [
    "https://yume.wiki/images/e/ea/Y2_Dream_Tropics_-_annoated.png",
    "https://yume.wiki/images/0/0b/DreamTropicsDungeonMap.png"
  ],
  "Journey's Road": [
    "https://yume.wiki/images/d/d7/Journey's_Road_map.png"
  ],
  "Psychedelic Letter World": [
    "https://yume.wiki/images/1/1d/Ye_Psychedelic_Letter_World.png"
  ],
  "Abstract Corrosions": [
    "https://yume.wiki/images/0/01/AbstractCorrosions.png"
  ],
  "Abandoned Joes": [
    "https://yume.wiki/images/9/9c/2kkiAbandonedJoesMap.png"
  ],
  "Black Dust Desert": [
    "https://yume.wiki/images/f/f5/2kkiBlackDustDesertMap.png"
  ],
  "City of Revival": [
    "https://yume.wiki/images/f/fa/City_Of_Revival_map.png",
    "https://yume.wiki/images/c/c3/City_of_Revival_tower.png"
  ],
  "Wishing Stones": [
    "https://yume.wiki/images/0/00/2kkiWishingStonesMap.png"
  ],
  "Floating Park": [
    "https://yume.wiki/images/a/ac/Map2752.png",
    "https://yume.wiki/images/d/db/Map2752annotated.png"
  ],
  "Sweet Pink Docks": [
    "https://yume.wiki/images/f/f5/Y2_Sweet_Pink_Docks.png"
  ],
  "Gallery of Me": [
    "https://yume.wiki/images/c/c0/GalleryOfMe_Full.png"
  ],
  "Still Life": [],
  "Illuminated Building": [
    "https://yume.wiki/images/5/56/Y2_Checkered_Towers_-_Illuminated_Building.png"
  ],
  "Wooded Lakeside A": [
    "https://yume.wiki/images/6/69/Map1882_Wooded_Lakeside_A.png"
  ],
  "Wooded Lakeside B": [
    "https://yume.wiki/images/b/b9/Map1882_Wooded_Lakeside_B.png"
  ],
  "Drift Passage": [
    "https://yume.wiki/images/8/8e/Y2_Drift_Passage.png"
  ],
  "Heartfelt Eclipse Sea": [
    "https://yume.wiki/images/2/26/2kkiHeartfeltEclipseSeaMap.png"
  ],
  "Azure Arm Land": [
    "https://yume.wiki/images/b/b4/Y2_Azure_Arm_Land.png"
  ],
  "Barcode Plains": [
    "https://yume.wiki/images/c/c6/Y2_Barcode_Plains.png"
  ],
  "Tarnished Chocolate World": [
    "https://yume.wiki/images/a/a7/Y2_Tarnished_Chocolate_World.png"
  ],
  "VIBRANT SMILE WORLD": [
    "https://yume.wiki/images/b/bf/Y2_VIBRANT_SMILE_WORLD.png"
  ],
  "Wan Lotus Docks": [],
  "Ox Horn Plaza": [
    "https://yume.wiki/images/a/a0/Y2_Ox_Horn_Plaza.png"
  ],
  "Demoscene Tapestry Club": [
    "https://yume.wiki/images/4/4b/Y2_Demoscene_Tapestry_Club.png"
  ],
  "Asphalt Monolith": [],
  "Emerald Crystal Cavern": [
    "https://yume.wiki/images/c/c6/Y2_Emerald_Crystal_Cavern.png"
  ],
  "Psychedelic Graffiti World": [
    "https://yume.wiki/images/0/0c/Y2_Psychedelic_Graffiti_World.png"
  ],
  "Doomsday": [],
  "Garden Festival": [
    "https://yume.wiki/images/f/f1/2kki_Map3421_125b.png"
  ],
  "Darkwoven Void": [
    "https://yume.wiki/images/1/13/Y2_Dark_Abyss.png"
  ],
  "Nightfall Complex": [
    "https://yume.wiki/images/d/dd/2kkiNightfallComplexMap.png"
  ],
  "Powdered Sugar Wasteland": [
    "https://yume.wiki/images/d/d7/Y2_Sugar_Cube_Fields.png"
  ],
  "Verdigris Garden": [
    "https://yume.wiki/images/1/13/2kkiVerdigrisGardenMap.png"
  ],
  "Wrinkled Fields": [],
  "Quarter Flats": [
    "https://yume.wiki/images/d/df/2kkiQuarterFlatsMain.png"
  ],
  "Fliperama Hall": [
    "https://yume.wiki/images/3/37/Fliperama_Hall_map.png"
  ],
  "Ballerina Forest": [
    "https://yume.wiki/images/2/21/Y2_BallerinaForest_Map.png",
    "https://yume.wiki/images/1/1b/Y2_BallerinaForest-AbyssalLake_Map.png"
  ],
  "Colorless Carnival": [
    "https://yume.wiki/images/5/57/Y2_Colorless_Carnival_Map.png",
    "https://yume.wiki/images/2/2b/Y2_ColorlessCarnival_Tent_Map.png"
  ],
  "Moss World": [
    "https://yume.wiki/images/8/83/Y2_MossWorld_Map.png"
  ],
  "Vibrant Funhouse": [],
  "Museum of Curiosities": [
    "https://yume.wiki/images/0/04/Y2_MuseumOfCuriosities_Map.png",
    "https://yume.wiki/images/5/56/Y2_MuseumOfCuriosities_Exterior_Map.png"
  ],
  "Faerie Hollow": [
    "https://yume.wiki/images/1/12/Y2_FaerieHollow_Map.png"
  ],
  "Fallen Star Craters": [],
  "Moth Meadow": [
    "https://yume.wiki/images/9/97/Y2_Moth_Meadow_Map.png"
  ],
  "Sauna Corridors": [],
  "Murky Cesspit": [
    "https://yume.wiki/images/6/62/2kki_Map3455_125b.png"
  ],
  "Reclaimed Town": [
    "https://yume.wiki/images/9/90/2kki_Map3456_125b.png",
    "https://yume.wiki/images/3/38/2kki_Map3457_125b.png"
  ],
  "Rustic Forest Park": [
    "https://yume.wiki/images/0/06/2kki_Map3458_125b.png"
  ],
  "Urban Underworld": [
    "https://yume.wiki/images/9/90/2kki_Map3451_125b.png"
  ],
  "Lezaxzasea Docks": [
    "https://yume.wiki/images/c/ce/LezaxzaseaDocksMap.png"
  ],
  "Monaxia": [
    "https://yume.wiki/images/6/63/MonaxiaMap.png"
  ],
  "Tiled Canvas": [
    "https://yume.wiki/images/4/40/TiledCanvasMap.png"
  ],
  "Ironashi Coast": [
    "https://yume.wiki/images/3/33/Ironashi_Coast_Map.png"
  ],
  "Vitamin World": [
    "https://yume.wiki/images/8/82/2kkiVitaminWorld.png"
  ],
  "Rice Paddy": [
    "https://yume.wiki/images/b/b6/RicePaddyMap.png"
  ],
  "Tanuki Settlement": [
    "https://yume.wiki/images/d/d0/2kkiTanukiSettlementMap.png"
  ],
  "Zen Islands": [
    "https://yume.wiki/images/a/a1/ZenIslandsMap.png"
  ],
  "Paint Splatter Park": [
    "https://yume.wiki/images/a/a8/2kkiPaintSplatterParkMap.png"
  ],
  "Angel Palace": [
    "https://yume.wiki/images/f/f8/2kkiAngelPalaceMap.png"
  ],
  "Potato World": [
    "https://yume.wiki/images/a/a8/2kkiPotatoWorldMap.png"
  ],
  "Fire World": [
    "https://yume.wiki/images/c/ca/2kkiFireWorldMap.png"
  ],
  "Artist's Block": [
    "https://yume.wiki/images/f/fe/2kkiArtistsBlockMap.png"
  ],
  "Cancer Palace": [
    "https://yume.wiki/images/5/5c/2kkiCancerPalaceMap.png"
  ],
  "Eye Cluster Labyrinth": [
    "https://yume.wiki/images/2/2f/2kkiEyeClusterLabyrinthMap.png"
  ],
  "Playhouse": [
    "https://yume.wiki/images/f/f1/2kkiPlayhouseMap.png"
  ],
  "Beachside Infirmary": [
    "https://yume.wiki/images/e/ee/2kkiBeachsideInfirmaryMap.png"
  ],
  "Carnage Carnival": [
    "https://yume.wiki/images/c/c7/2kkiCarnageCarnivalMap.png"
  ],
  "Paper Jungle": [
    "https://yume.wiki/images/1/1b/2kkiPaperJungleMap.png"
  ],
  "Paper Ruins": [
    "https://yume.wiki/images/5/5d/2kkiPaperRuinsMap.png"
  ],
  "Pastel Dream Sea": [
    "https://yume.wiki/images/5/51/2kkiPastelDreamSeaMap.png",
    "https://yume.wiki/images/d/d1/Sargat_layer_map.png",
    "https://yume.wiki/images/5/5f/2kkiSunkenShipMansionMap.png"
  ],
  "Shrouded Arcadia": [
    "https://yume.wiki/images/3/32/2kkiShroudedArcadiaMapAnnotated.png"
  ],
  "Tanuki Tail Portrait": [
    "https://yume.wiki/images/7/73/2kkiTanukiTailPortraitMap.png"
  ],
  "Citrus Springs": [
    "https://yume.wiki/images/7/74/2kkiCitrusSpringsMap.png"
  ],
  "Hop Springs": [
    "https://yume.wiki/images/f/f0/2kkiHopSpringsMap.png"
  ],
  "README.txt": [
    "https://yume.wiki/images/f/f7/Y2_README.txt.png"
  ],
  "Rendered Dreamscape": [
    "https://yume.wiki/images/1/1e/Y2_Rendered_Dreamscape.png"
  ],
  "Burger Joint": [
    "https://yume.wiki/images/2/2f/2kkiBurgerJointMap.png"
  ],
  "Jigsaw Junction": [
    "https://yume.wiki/images/6/6e/2kkiJigsawJunctionMap.png"
  ],
  "Communal Workspace": [
    "https://yume.wiki/images/9/9e/2kkiCommunalWorkspaceMap.png"
  ],
  "Animism": [
    "https://yume.wiki/images/f/f2/2kkiAnimismMap.png"
  ],
  "Usugurai Residence": [
    "https://yume.wiki/images/7/71/2kkiUsuguraiResidenceMap.png"
  ],
  "Blood Rose Canal": [
    "https://yume.wiki/images/e/e8/BloodRoseCanalmapX.png"
  ],
  "Candlelight Void": [
    "https://yume.wiki/images/2/2a/2kkiCandlelightVoid.png"
  ],
  "Jumbo Room": [
    "https://yume.wiki/images/a/ad/2kkiJumboRoom.png"
  ],
  "Mouse Den": [
    "https://yume.wiki/images/8/81/2kkiMouseDen.png"
  ],
  "The Desktop": [
    "https://yume.wiki/images/0/08/2kkiTheDesktop.png"
  ],
  "Endless Apartments": [],
  "Memory Town": [],
  "The Magic Nexus": [
    "https://yume.wiki/images/4/42/Y2_Verdant_Nexus.png"
  ],
  "Cloud Haven": [
    "https://yume.wiki/images/4/4a/Y2_Cloud_Haven.png"
  ],
  "Oil Puddle World A": [
    "https://yume.wiki/images/1/13/OilPuddleMap.png",
    "https://yume.wiki/images/c/cb/OilPuddleWorld-InvisibleMazeMap.png"
  ],
  "Oil Puddle World B": [
    "https://yume.wiki/images/6/6b/OilPuddleWorldBMap.png"
  ],
  "Heart Shallow": [],
  "Cluster of Flowers": [
    "https://yume.wiki/images/3/3f/Y2_Cluster_of_Flowers.png"
  ],
  "Industrial Bathhouse": [],
  "Pipeways": [
    "https://yume.wiki/images/a/a6/Y2_Pipeways.png"
  ],
  "Abandoned Underpass": [
    "https://yume.wiki/images/e/ee/Y2_Abandoned_Underpass.png"
  ],
  "Bismuthal Murals": [
    "https://yume.wiki/images/4/42/Y2_Bismuthal_Murals.png"
  ],
  "Farewell Residence": [
    "https://yume.wiki/images/2/2f/Y2_Farewell_Residence.png"
  ],
  "Golden Sunset Estate": [
    "https://yume.wiki/images/e/e6/Map_of_Chill_Field.png"
  ],
  "Holographic Reef": [
    "https://yume.wiki/images/5/54/Y2_Holographic_Reef.png"
  ],
  "Lamplit Complex": [
    "https://yume.wiki/images/c/c5/Y2_Lamplit_Complex.png"
  ],
  "Midnight Manor": [],
  "Paleontology Dunes": [
    "https://yume.wiki/images/b/be/Archeology_Dunes_map.png"
  ],
  "RGB Passage A": [
    "https://yume.wiki/images/4/40/RGBPASSAGEMAP.png"
  ],
  "Stellar Cemetery": [
    "https://yume.wiki/images/3/35/Y2_Stellar_Cemetry.png"
  ],
  "Subpixel Pathway": [
    "https://yume.wiki/images/c/cd/Map3412.png"
  ],
  "Twisted Cone World": [
    "https://yume.wiki/images/f/fd/Y2_Twisted_Cone_World.png"
  ],
  "Water's Edge": [
    "https://yume.wiki/images/5/5a/Y2_Water's_Edge_-_Upper_Area.png",
    "https://yume.wiki/images/3/30/Y2_Water's_Edge_-_Lower_Area.png"
  ],
  "Whispering Palace": [
    "https://yume.wiki/images/6/62/Y2_Whispering_Palace.png"
  ],
  "Copper Cube Plains": [
    "https://yume.wiki/images/a/ac/Map0583.png"
  ],
  "Equine Swamp": [
    "https://yume.wiki/images/e/e6/2kkiEquineSwampMap.png"
  ],
  "Sepia Cloud Gardens": [
    "https://yume.wiki/images/f/f8/Y2_Sepia_Cloud_Gardens.png"
  ],
  "Sushi Roll Swamp": [
    "https://yume.wiki/images/5/56/2kki_Map0640_126b_p3.png"
  ],
  "Yellow Geometries": [
    "https://yume.wiki/images/4/49/YellowGeometriesMap.png"
  ],
  "Fruit Carpet Plaza": [],
  "Dessertropolis": [
    "https://yume.wiki/images/5/50/Cake_District_map.png"
  ],
  "Back Flesh World": [],
  "Hall of Flesh": [],
  "Story Theatre": [],
  "Jazz Station": [
    "https://yume.wiki/images/e/ea/Map_of_Jazz_Station.png",
    "https://yume.wiki/images/6/6e/Jazz_Station_Peace_subarea_map.png"
  ],
  "Kingdom of Trees": [],
  "Visage World": [],
  "Archived Aqueduct": [
    "https://yume.wiki/images/6/68/Y2_ArchivedAqueduct_Map.png"
  ],
  "Blue Aura Maze": [
    "https://yume.wiki/images/1/11/Y2_BlueAuraMaze_Map.png"
  ],
  "Snowdrop Garden": [
    "https://yume.wiki/images/c/cd/Y2_SnowdropGarden_Map.png"
  ],
  "Strawberry Outskirts": [
    "https://yume.wiki/images/4/47/Y2_StrawberryOutskirts_Map.png"
  ],
  "Windy Factory": [
    "https://yume.wiki/images/f/f8/Y2_WindyFactory_Map.png",
    "https://yume.wiki/images/1/1a/Y2_WindyFactory-Rooftop_Map.png"
  ],
  "Blossom Boardwalk": [],
  "Green Tile Room": [],
  "Organic Chemistry World": [
    "https://yume.wiki/images/2/2d/Y2_OrganicChemistryWorld_Map.png"
  ],
  "Cheese World": [],
  "Flesh World": [
    "https://yume.wiki/images/5/5c/2kkiFleshWorldMap.png"
  ],
  "Footwear Field": [],
  "Hellish Village": [],
  "Keychain Collection": [
    "https://yume.wiki/images/b/b9/2kkiKeychainCollectionMap.png"
  ],
  "Lovestruck Realm": [
    "https://yume.wiki/images/9/92/LoveStruckRealmMap.png"
  ],
  "Tea Ruins": [],
  "Underneath": [],
  "Worm Labyrinth": [
    "https://yume.wiki/images/a/ae/Y2_WormLabyrinth_Map.png"
  ],
  "ASCII Prairie": [
    "https://yume.wiki/images/5/54/ASCIIPrairie.png"
  ],
  "Bleeding Tree Disco": [],
  "Dreary Harbor": [
    "https://yume.wiki/images/7/7d/Y2_DrearyHarbor_Map.png"
  ],
  "Nightmare Express": [],
  "Pocket Garden": [],
  "Alien Wasteland": [
    "https://yume.wiki/images/0/05/Y2_AlienWasteland_Map.png"
  ],
  "Bleeding Sorrows": [],
  "Legacy of Ruin": [],
  "Pastel Mall": [],
  "TST MAP": [],
  "Blue Yellow Maze": [
    "https://yume.wiki/images/5/5c/Y2_BlueYellowMaze_Map.png"
  ],
  "Crazy Pink House": [],
  "Nowhere Woods": [],
  "Scribbled Worksite": [],
  "White Lily Laboratory": [],
  "Dining Table": [
    "https://yume.wiki/images/c/c5/Dining_Table_map.png"
  ],
  "Forgotten Study": [],
  "Frenetique": [
    "https://yume.wiki/images/e/e8/Y2_Frenetique_Map.png"
  ],
  "Photographic Field": [
    "https://yume.wiki/images/1/16/Photographic_Field_map.png"
  ],
  "Sunset Mesa": [
    "https://yume.wiki/images/b/b5/Sunset_Mesa_map.png"
  ],
  "Sunset Saloon": [],
  "Lotus Lakeside": [
    "https://yume.wiki/images/d/db/Y2_LotusLakeside_Map.png"
  ],
  "Neon Playground": [
    "https://yume.wiki/images/b/b8/Y2_NeonPlayground_Map.png"
  ],
  "Nobody's Park": [
    "https://yume.wiki/images/9/96/Y2_NobodysPark_Map.png"
  ],
  "Gallery of Naught": [],
  "Graffiti Garage": [],
  "Hiragana Board": [
    "https://yume.wiki/images/6/6f/Hiragana_Board_map.png"
  ],
  "Sink Catalog": [],
  "Sorrow and Comfort Monuments": [
    "https://yume.wiki/images/4/40/Y2_SorrowAndComfortMonuments_Map.png"
  ],
  "Waiting Field": [
    "https://yume.wiki/images/a/a4/Waiting_Field_map.png"
  ],
  "Beige Hallway of Wa": [
    "https://yume.wiki/images/4/44/Beige_Hallway_of_Wa_map.png"
  ],
  "Star Carpet World": [
    "https://yume.wiki/images/2/27/Star_Carpet_World_map.png"
  ],
  "Tele-pole Plains": [
    "https://yume.wiki/images/0/03/Tele-pole_Plains_map.png"
  ],
  "Castle Shoal": [
    "https://yume.wiki/images/2/2f/Castle_Shoal_map.png"
  ],
  "Floral Nexus": [
    "https://yume.wiki/images/5/5f/Floral_Nexus_map.png"
  ],
  "Sunlit Mural Meadow": [],
  "GB Anomaly": [
    "https://yume.wiki/images/4/47/Y2_GBAnomaly_Map.png"
  ],
  "Alien World": [
    "https://yume.wiki/images/a/af/AlienWorldMapANNOTATED.png",
    "https://yume.wiki/images/e/e5/AlienWorld_FMANNOTATED.png"
  ],
  "The Skin": [
    "https://yume.wiki/images/1/15/Y2_TheSkin_Map.png"
  ],
  "Spiked Sands": [
    "https://yume.wiki/images/2/25/Y2_SpikedSands_Map.png"
  ],
  "Radiant Waters": [
    "https://yume.wiki/images/b/be/MAP2486_Radiant_Waters_Annotated.png"
  ],
  "Rainfall Forest": [
    "https://yume.wiki/images/0/0a/Y2_RainfallForest_Map.png"
  ],
  "Rockbound Beach": [
    "https://yume.wiki/images/8/8f/2983rockboundbeachMAP.png",
    "https://yume.wiki/images/e/ef/2984RBSub-area-MAP.png"
  ],
  "Stone Age": [
    "https://yume.wiki/images/2/2e/Map2986StoneAge.png"
  ],
  "Spiked Storm": [
    "https://yume.wiki/images/9/90/Y2_SpikedStorm_Map.png"
  ],
  "Calico Forest": [
    "https://yume.wiki/images/5/5c/Y2_CalicoForest_Map.png"
  ],
  "Crowbar Abyss": [
    "https://yume.wiki/images/f/f2/Y2_CrowbarAbyss_Map.png"
  ],
  "Graffiti Waterfront": [
    "https://yume.wiki/images/6/6f/Y2_GraffitiWaterfront_Map.png"
  ],
  "Geode Valley": [
    "https://yume.wiki/images/5/52/Y2_GeodeValley_Map.png"
  ],
  "Crimson Park": [
    "https://yume.wiki/images/0/0a/2490crimsonpark.png"
  ],
  "Lush Cells": [],
  "Glitched Digits": [],
  "Moonlit Pier": [
    "https://yume.wiki/images/e/ef/MoonlitPier.png"
  ],
  "Metallurgic Workshop": [],
  "Lethal Dunes": [
    "https://yume.wiki/images/5/55/LethalDunes.png",
    "https://yume.wiki/images/8/8a/LethalDunesMaze.png"
  ],
  "Rural Starflower Field": [
    "https://yume.wiki/images/0/0f/Rural_Starflower_Field_Map.png"
  ],
  "Elysium Pools": [],
  "Puffy Wilderness": [],
  "Homesickness": [
    "https://yume.wiki/images/9/9f/Y2_Homesickness_Map.png"
  ],
  "Runtime Package Islands": [
    "https://yume.wiki/images/d/d0/Rtp_islands_map.png"
  ],
  "Irregular Apartments": [],
  "Potted Plant World": [
    "https://yume.wiki/images/2/28/Y2_PottedPlantWorld_Map.png",
    "https://yume.wiki/images/8/8f/Y2_PottedPlantWorld-Void_Map.png",
    "https://yume.wiki/images/c/ca/Y2_PottedPlantWorld-Town_Map.png"
  ],
  "Sanguine Stare": [],
  "Neon Spacewalk": [
    "https://yume.wiki/images/5/5c/NeonSpacewalkAnnotatedMap.png"
  ],
  "Strange Shrine Road": [],
  "Ghost Beach": [],
  "Live Idol World": [
    "https://yume.wiki/images/f/fb/Y2_live_idol_world_map1.png",
    "https://yume.wiki/images/0/01/Y2_live_idol_world_map2.png"
  ],
  "Desolate Snowscape": [],
  "Ancient Blue Battlefield": [
    "https://yume.wiki/images/3/3f/AncientBlueBattlefield.png"
  ],
  "Boolean Plains": [],
  "Cat Countryside": [
    "https://yume.wiki/images/d/d7/CatCountryside.png"
  ],
  "Crimson District": [],
  "Luminescent Bridge": [
    "https://yume.wiki/images/1/17/Y2_LuminescentBridge_Map.png"
  ],
  "Neon Wire Club": [
    "https://yume.wiki/images/4/4a/NeonWireClub.png"
  ],
  "Plastered Hands World": [],
  "Spotlight Basement": [
    "https://yume.wiki/images/5/5d/SpotlightBasement.png"
  ],
  "Firefly Lake": [
    "https://yume.wiki/images/b/bf/Y2_FireflyLake_Map.png"
  ],
  "Olympus Ruins": [
    "https://yume.wiki/images/d/dc/Y2_OlympusRuinsMaze_Map.png",
    "https://yume.wiki/images/2/24/Y2_OlympusRuins_Map.png"
  ],
  "The Clocktower": [
    "https://yume.wiki/images/8/87/Y2_TheClocktower_Map.png"
  ],
  "Forgotten Station": [],
  "New Japan Town": [
    "https://yume.wiki/images/3/36/New_Japan_Town_map.png"
  ],
  "Respite": [
    "https://yume.wiki/images/8/8c/Respite_map.png"
  ],
  "Weeping Lake": [
    "https://yume.wiki/images/6/63/WeepingLakeMap.png"
  ],
  "Blockade Ruins": [
    "https://yume.wiki/images/3/3e/Y2_BlockadeRuins_Map.png"
  ],
  "Duck Depths": [],
  "Nauseousness": [
    "https://yume.wiki/images/4/4c/Y2_Nauseousness_Map.png"
  ],
  "Otherworldly Bar": [],
  "Neon Slums": [
    "https://yume.wiki/images/3/38/Neon_Slums_map.png"
  ],
  "Indeterminate Atrium": [],
  "Penguin Game": [],
  "CGA Murals": [
    "https://yume.wiki/images/1/1f/GCAMurals.png"
  ],
  "Glowfruit Garden": [
    "https://yume.wiki/images/e/e8/GlowfruitGarden.png"
  ],
  "Kelp Forest": [
    "https://yume.wiki/images/f/fa/Kelp_Forest_Map_v0127i_p12.png"
  ],
  "Mondrian World": [],
  "Shallow Pathways": [
    "https://yume.wiki/images/4/46/ShallowPathways.png"
  ],
  "Doodle Path": [],
  "Game Console": [
    "https://yume.wiki/images/e/e9/PSC_Map_Label.png"
  ],
  "Legs from the Ashes": [],
  "Flooded Hotel": [],
  "Industrial Shoal": [],
  "Popsicle Park": [
    "https://yume.wiki/images/f/fa/Y2_PopsiclePark_Map.png"
  ],
  "Radioactive Garden": [
    "https://yume.wiki/images/d/dd/Y2_RadioactiveGarden_Map.png"
  ],
  "Vintage Circuit": [],
  "Azalea Passage": [
    "https://yume.wiki/images/6/60/Azalea_PassageMap.PNG"
  ],
  "Mint Town": [],
  "Crosswalk to Nowhere": [
    "https://yume.wiki/images/d/d7/Crosswalk_to_Nowhere_Map.png"
  ],
  "Glowing Hives": [
    "https://yume.wiki/images/e/ef/Glowing_Hives_map.png"
  ],
  "Roadkill Forest": [],
  "Somniphobia": [],
  "Blood Chalice Desolation": [
    "https://yume.wiki/images/7/72/Blood_Chalice_Desolation.png"
  ],
  "Fast Food Hell": [
    "https://yume.wiki/images/d/dc/Fast_Food_Hell_Maze.png"
  ],
  "Grease Desert": [
    "https://yume.wiki/images/7/7d/Grease_Desert.png"
  ],
  "Calligraphy World": [],
  "Dull Hub": [],
  "Glacier Island": [],
  "Hemlock Lab": [],
  "Kitsune Carnival": [],
  "Lake of Bones": [],
  "Recursive Warehouse": [],
  "Rice Bowl World": [],
  "Spiral Lizard World": [],
  "Stone Plinth Garden": [],
  "Turtle Stew World": [],
  "Overwork Office": [],
  "Skyview Elevator": [],
  "Black Murals": [],
  "Buried Trees Shoal": [],
  "Charcoal Ruins": [],
  "Flooded Docks": [],
  "Ladder World": [],
  "Quartzite Corridors": [],
  "Regretful Seas": [],
  "Rhombus": [],
  "Seafloor Dungeon": [],
  "Vibrant Shapes Passage": [],
  "Abject Chaos": [
    "https://yume.wiki/images/6/6d/Abject_Chaos_map.png"
  ],
  "Amplitude": [],
  "Frozen Stratosphere": [
    "https://yume.wiki/images/f/fa/Frozen_Stratosphere_map.png"
  ],
  "Location Motif 1": [],
  "Navy Sewers": [],
  "Sacred Stairways": [
    "https://yume.wiki/images/a/a1/Sacred_Stairways_map.png"
  ],
  "Bloodied Geometry Abyss": [],
  "Faint Memory": [],
  "Glitched Aquarium": [],
  "Stasis Spire": [],
  "Canned Fish World": [],
  "Nocturne": [],
  "Picture Book": []
}