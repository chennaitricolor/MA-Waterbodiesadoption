curl https://docs.google.com/spreadsheets/u/1/d/10rRJPnQuimgHn7nnfTrde2XN2C676zZdMghVNhdDNzY/export\?format\=csv > file.csv
awk -F "\"*,\"*" '{print $6}' file.csv  > file.tmp && mv file.tmp file.csv

ruby scrapper.rb
aws s3 cp ./ s3://www.adoptwaterbodies.com/ --recursive


