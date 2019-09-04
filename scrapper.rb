

require "json"
file = File.open(File.join(File.dirname(__FILE__), 'file.csv'), "r")
data_to_replace = file.read
file.close
split = data_to_replace.split("\n")
file = File.open(File.join(File.dirname(__FILE__), 'public/scripts/data.geojson'), "r")
geojson = file.read
file.close

geo_json= JSON.parse(geojson)
counter = 0
geo_json["features"].each do |obj|
  obj["properties"]["Adopted_Being_Restored_by"] = split[counter+1]
  counter = counter+1
end

File.open(File.join(File.dirname(__FILE__), 'public/scripts/data.geojson'), 'w') { |file| file.write(geo_json.to_json) }
