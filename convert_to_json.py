import json
import xmltodict
from pprint import pprint

# thanks to https://pythonadventures.wordpress.com/2014/12/29/xml-to-dict-xml-to-json/
def convert(xml_file):
    with open(xml_file, "rb") as f:    # notice the "rb" mode
        d = xmltodict.parse(f)
        rows = list(d['DATA']['ROWS'].values())[0]

        data = [{k.strip('@'): row[k] for k,v in row.items()} for row in rows]

        return json.dumps(data, indent=4)


def save(json_file, json_data):
    with open(json_file, "w") as f:
        f.write(json_data)

data = convert("data/AviationData.xml")
save('data/AviationData.json', data)

